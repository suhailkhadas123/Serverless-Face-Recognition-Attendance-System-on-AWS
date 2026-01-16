import boto3
import base64
import uuid
import json
import datetime

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')
dynamodb = boto3.resource('dynamodb')

BUCKET_NAME = "attendance-images-7712"
COLLECTION_ID = "employee-faces"
attendance_table = dynamodb.Table('Attendance')

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))

    try:
        body = event.get("body")

        if event.get("isBase64Encoded"):
            image_bytes = base64.b64decode(body)
        else:
            image_bytes = body.encode()

        filename = f"captures/{uuid.uuid4()}.jpg"

        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=filename,
            Body=image_bytes,
            ContentType="image/jpeg"
        )

        response = rekognition.search_faces_by_image(
            CollectionId=COLLECTION_ID,
            Image={'S3Object': {'Bucket': BUCKET_NAME, 'Name': filename}},
            FaceMatchThreshold=90
        )

        if not response['FaceMatches']:
            return cors_response("Face not recognized")

        face = response['FaceMatches'][0]
        employee_id = face['Face']['ExternalImageId']

        attendance_table.put_item(
            Item={
                'employeeId': employee_id,
                'timestamp': datetime.datetime.utcnow().isoformat(),
                'status': 'Present'
            }
        )

        return cors_response(f"Attendance marked for {employee_id}")

    except Exception as e:
        print("ERROR:", str(e))
        return cors_response(str(e), 500)

def cors_response(message, status=200):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "POST,OPTIONS"
        },
        "body": message
    }
