import boto3
import os
import json

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    try:
        body = json.loads(event['body'])
        user = body['user']
        filename = body['filename']
        globalStats = 'globalStats'
        
        keys = [user, globalStats]
        
        for key in keys:
            item = table.get_item(Key={'user': key})
            if ('Item' in item):
                print(str(key) + 'exists in table')
            else:
                table.put_item(
                    Item={
                        'user': key,
                        'uploads': {},
                        'stats':{
                            'Overview':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0,
                            },
                            'Animal':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0
                            },
                            'Human':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0
                            },
                            'Car':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0
                            },
                            'Landscape':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0
                            },
                            'NOT_DEFINED':{
                                'uploadCount': 0,
                                'correctCount': 0,
                                'wrongCount': 0
                            }
                        }
                    }
                )
                print(str(key) + ' created in table')

        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression='SET uploads.#key = :i ADD stats.Overview.uploadCount :inc',
            ExpressionAttributeNames={
                "#key": filename  
            },
            ExpressionAttributeValues={
                ':i': {
                    "category": "",
                    "feedback": ""
                },
                ":inc": 1
            },
        )
        
        table.update_item(
            Key={
                'user': globalStats
            },
            UpdateExpression='ADD stats.Overview.uploadCount :inc',
            ExpressionAttributeValues={
                ":inc": 1
            },
        )
        
        return {
        'statusCode': 200,
        'headers': {
            'Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': 'success'
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
        },
        'body': 'something happened'
    }