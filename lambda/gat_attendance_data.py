import boto3
import json
from boto3.dynamodb.conditions import Attr
from datetime import date

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Attendance")

def lambda_handler(event, context):
    print("EVENT:", json.dumps(event))

    try:
        params = event.get("queryStringParameters") or {}
        employee_id = params.get("employeeId")

        if not employee_id:
            return response(400, {"error": "employeeId missing"})

       
        db_response = table.scan(
            FilterExpression=Attr("employeeId").eq(employee_id)
        )

        items = db_response.get("Items", [])

        today = date.today().isoformat()

        present_today = any(
            item.get("timestamp", "").startswith(today)
            for item in items
        )

        last_attendance = max(
            [item.get("timestamp") for item in items],
            default=None
        )

        return response(200, {
            "total": len(items),
            "presentToday": 1 if present_today else 0,
            "lastAttendance": last_attendance,
            "records": items[-5:]
        })

    except Exception as e:
        print("FATAL ERROR:", str(e))
        return response(500, {"error": str(e)})

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps(body)
    }
