import boto3
import os
import json

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    print(event)
    body = json.loads(event['body'])
    user = body['user']
    filename = body['filename']
    category = body['category']
    feedback = body['feedback'].lower() in ['true','1']

    item = table.get_item(Key={'user': user})
    if ('Item' in item):
        print(item['Item'])
    else:
        table.put_item(
            Item={
                'user': user,
                'uploads':[],
                'stats':{
                    'uploadCount': 0,
                    'correctCount': 0,
                    'wrongCount': 0               
                }
            }
        )
        print('User created in table')

    result = table.update_item(
        Key={
            'user': user
        },
        UpdateExpression='SET uploads = list_append(if_not_exists(uploads, :empty_list), :i)',
        ExpressionAttributeValues={
            ':i': [{
                "filename": filename,
                "category": category,
                "feedback": feedback
            }],
            ":empty_list": {"L":[]}
        },
        ReturnValues='ALL_NEW'
    )
    print('Updated item:')
    print(result)
    return {
        'statusCode': 200,
        'headers': {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }