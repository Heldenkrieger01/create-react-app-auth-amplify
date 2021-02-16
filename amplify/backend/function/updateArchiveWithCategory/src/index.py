import boto3
import os
import json

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    print(event)
    try:
        body = json.loads(event['body'])
        user = body['user']
        filename = body['filename']
        predictionResult = body['predictionList']
        
        detected_category = 'NOT_DEFINED'
        
        categories = ['Human', 'Landscape', 'Car', 'Animal']
    
        for label in predictionResult['labels']:
            name = label['name']
            if name in categories:
                detected_category = name
                break

        print(detected_category)
        
        expression = 'SET uploads.#key.category = :c'
        
        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression=expression,
            ExpressionAttributeNames={
                "#key": filename
            },
            ExpressionAttributeValues={
                ":c": detected_category
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
        'body': json.dumps({
            'category': detected_category
            })
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