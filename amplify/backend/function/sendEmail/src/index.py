import boto3
import os

ses = boto3.client('ses', region_name=os.getenv('REGION'))
cog = boto3.client('cognito-idp')
user_pool_id = os.getenv('AUTH_COGNITOCF0C6096_USERPOOLID')
dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    
    cognitoUsers = cog.list_users(
        UserPoolId=user_pool_id,
        AttributesToGet=[
            'sub',
            'email'
        ]
    )
    
    globalStatsItem = table.get_item(Key={'user': 'globalStats'})
    globalUploadCount = globalStatsItem['Item']['stats']['uploadCount']
    globalCorrectCount = globalStatsItem['Item']['stats']['correctCount']
    globalWrongCount = globalStatsItem['Item']['stats']['wrongCount']
    
    for user in cognitoUsers['Users']:
        receiver_address= user['Attributes'][1]['Value']
        userSub = user['Attributes'][0]['Value']
        uploadCount = correctCount = wrongCount = 0
        try:
            userItem = table.get_item(Key={'user': userSub})
            uploadCount = userItem['Item']['stats']['uploadCount']
            correctCount = userItem['Item']['stats']['correctCount']
            wrongCount = userItem['Item']['stats']['wrongCount']
        except:
            print('User not found in DB')
        data = "uploaded: " + str(uploadCount) + " correct: " + str(correctCount) + " wrong:" + str(wrongCount) + "\r\n" + "globalUploads: " + str(globalUploadCount) + ", globalCorrectCount: " + str(globalCorrectCount) + ", globalWrongCount: " + str(globalWrongCount)
        try:
            ses.send_email(
                Destination={
                    'ToAddresses': [receiver_address],
                },
                Message={
                    'Body': {
                        'Text': {
                            'Charset': 'utf-8',
                            'Data': data,
                        },
                    },
                    'Subject': {
                        'Charset': 'utf-8',
                        'Data': 'Your Daily Upload Statistics',
                    },
                },
                Source='cplabgroupf@gmail.com'
            )
        except Exception as e: 
            print('Following address not verified: ' + str(receiver_address))
            print(e)
    return
  }