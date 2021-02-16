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
        globalStats = 'globalStats'
        categories = ['Human', 'Landscape', 'Car', 'Animal']
    
        for label in predictionResult['labels']:
            name = label['name']
            if name in categories:
                detected_category = name
                break

        print(detected_category)
        
        #user
        expression = 'SET uploads.#key.category = :c ADD stats.#category.uploadCount :inc'
        table.update_item(
            Key={
                'user': user
            },
            UpdateExpression=expression,
            ExpressionAttributeNames={
                "#key": filename,
                "#category": detected_category
            },
            ExpressionAttributeValues={
                ":c": detected_category,
                ':inc': 1
            },
        )
        
        #global
        expression_global = 'ADD stats.#category.uploadCount :inc'
        table.update_item(
            Key={
                'user': globalStats
            },
            UpdateExpression=expression_global,
            ExpressionAttributeNames={
                "#category": detected_category
            },
            ExpressionAttributeValues={
                ':inc': 1
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