import boto3
import os

dynamodb = boto3.resource('dynamodb', region_name=os.getenv('REGION'))
table = dynamodb.Table(os.getenv('STORAGE_STATISTICS_NAME'))

def handler(event, context):
    user = event[0]
    filename = event[1]
    category = event[2]
    feedback = event[3].lower() in ['true','1']

    if (table.get_item(Key={'user': user} == None)):
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
        UpdateExpression='SET uploads = list_append(uploads, :i)',
        ExpressionAttributeValues={
            ':i': [filename, category, feedback],
        },
        ReturnValues='ALL_NEW'
    )
    print('Updated item:')
    print(result)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }