import boto3
import os
import json
import decimal

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    print(event)
    try:
        body = json.loads(event['body'])
        users = body['users']
        print(users)

        categories = ['Animal', 'Human', 'Car', 'Landscape', 'NOT_DEFINED']
        
        responseBody = dict()
        for user in users:
            print(user)
            userItem = table.get_item(Key={'user': user})
            print(userItem)
            responseBody[user] = dict()
            responseBody[user]['uploadCount'] = userItem['Item']['stats']['uploadCount']
            responseBody[user]['correctCount'] = userItem['Item']['stats']['correctCount']
            responseBody[user]['wrongCount'] = userItem['Item']['stats']['wrongCount']
            for category in categories:
                responseBody[user][category] = dict()
                responseBody[user][category]['uploadCount'] = userItem['Item']['stats'][category]['uploadCount']
                responseBody[user][category]['correctCount'] = userItem['Item']['stats'][category]['correctCount']
                responseBody[user][category]['wrongCount'] = userItem['Item']['stats'][category]['wrongCount']
            
        print(responseBody)

        return {
        'statusCode': 200,
        'headers': {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(responseBody, cls = DecimalEncoder)
    }
    except Exception as e:
        print(e)
        return {
        "statusCode": 500,
        "headers": {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }
    
    
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)