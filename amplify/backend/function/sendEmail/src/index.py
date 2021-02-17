import boto3
import os
import json

ses = boto3.client('ses', region_name=os.getenv('REGION'))
cog = boto3.client('cognito-idp')
user_pool_id = os.getenv('AUTH_COGNITOCF0C6096_USERPOOLID')
dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))
lambda_client = boto3.client('lambda')

def handler(event, context):
    
    cognitoUsers = cog.list_users(
        UserPoolId=user_pool_id,
        AttributesToGet=[
            'sub',
            'email'
        ]
    )


    payload_body = '{\"users\":['
    for user in cognitoUsers['Users']:
        userSub = user['Attributes'][0]['Value']
        payload_body += '\"' + str(userSub) + '\",'
    
    payload_body += '\"' + 'globalStats\"]}'
    
    payload = {
        #"body":"{\"users\":[\"d9e66051-0b08-42e1-bcf4-af0d0e9f8b2e\",\"globalStats\"]}"
        "body" : payload_body
    }
    invoke_response = lambda_client.invoke(FunctionName=os.getenv('FUNCTION_NEWGETSTATISTICS_NAME'), InvocationType='RequestResponse', Payload=json.dumps(payload))

    invoke_payload = invoke_response['Payload'].read().decode('utf-8')
    d = json.loads(invoke_payload)
    
    userStatistics = json.loads(d['body'])

    categories = ['Overview', 'Animal', 'Human', 'Car', 'Landscape', 'NOT_DEFINED']
    
    responseBody = dict()
    for user in cognitoUsers['Users']:
        userSub = user['Attributes'][0]['Value']
        responseBody[userSub] = dict()
        for category in categories:
            responseBody[userSub][category] = dict()
            responseBody[userSub][category]['uploadCount'] = userStatistics[userSub][category]['uploadCount']
            responseBody[userSub][category]['correctCount'] = userStatistics[userSub][category]['correctCount']
            responseBody[userSub][category]['wrongCount'] = userStatistics[userSub][category]['wrongCount']
            
        receiver_address= user['Attributes'][1]['Value']
        message = """<html>
            <head></head>
            <body>
            <h1>Your daily upload statistics</h1>
        """
        for category in categories:
            uploadCount = responseBody[userSub][category]['uploadCount']
            correctCount = responseBody[userSub][category]['correctCount']
            wrongCount = responseBody[userSub][category]['wrongCount']
            globalUploadCount = userStatistics['globalStats'][category]['uploadCount']
            globalCorrectCount = userStatistics['globalStats'][category]['correctCount']
            globalWrongCount = userStatistics['globalStats'][category]['wrongCount']
            message += f"""
                <h3>{category}</h3>
                <table style="width:60%; text-align: center; border: 1px solid black">
                    <tr>
                        <th></th>
                        <th>Images uploaded</th>
                        <th>Prediction correct</th>
                        <th>Prediction wrong</th>
                    </tr>
                    <tr>
                        <th>Personal Stats</th>
                        <td>{uploadCount}</td>
                        <td>{correctCount}</td>
                        <td>{wrongCount}</td>
                    </tr>
                    <tr>
                        <th>Global Stats</th>
                        <td>{globalUploadCount}</td>
                        <td>{globalCorrectCount}</td>
                        <td>{globalWrongCount}</td>
                    </tr>
                </table>
                    """ 
        message += """
                </body>
            </html>
        """
        try:
            ses.send_email(
                Destination={
                    'ToAddresses': [receiver_address],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': 'utf-8',
                            'Data': message,
                        },
                    },
                    'Subject': {
                        'Charset': 'utf-8',
                        'Data': 'Your daily upload statistics',
                    },
                },
                Source='cplabgroupf@gmail.com'
            )
        except Exception as e: 
            print('Following address not verified: ' + str(receiver_address))
            #print(e)
        
    return