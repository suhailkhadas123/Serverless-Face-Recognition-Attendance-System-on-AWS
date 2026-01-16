  
                                                            📸 Serverless Face Recognition Attendance System on AWS

A serverless, real-time attendance management system that uses AWS Rekognition for facial recognition, AWS Lambda for backend processing, and DynamoDB for storing attendance records. The system allows users to securely log in using Amazon Cognito, capture their image via a web dashboard, and automatically mark attendance.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🚀 Project Overview

This project demonstrates how to build a scalable, secure, and cost-efficient attendance system using AWS serverless services.
Attendance is marked by capturing a live image, verifying the user’s face against a registered face collection, and storing the timestamp in a database.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🏗️ System Architecture

Workflow:
1. User logs in using Amazon Cognito
2. Frontend captures image using webcam
3. Image is uploaded via API Gateway
4. AWS Lambda:
    Stores image in Amazon S3
    Calls Amazon Rekognition to identify the face
    Matches face with employee ID
    Stores attendance record in DynamoDB
5. Dashboard fetches attendance data via API
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🧰 AWS Services Used

Service	                       Purpose
Amazon S3	                   Store captured images
AWS Rekognition	               Face detection & matching
AWS Lambda	                   Serverless backend logic
Amazon API Gateway	           REST APIs
Amazon DynamoDB	               Attendance records storage
Amazon Cognito	               User authentication
Amazon CloudWatch	           Logs & monitoring
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
💻 Frontend Features

1. Secure login using Cognito Hosted UI
2. Live webcam capture
3. Real-time attendance marking
4. Dashboard displaying:
    1.Total attendance
    2.Today / Weekly attendance
    3.Last attendance time
    4.Attendance history
5. Hosted as a static website on Amazon S3
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🔐 Security Features

1. Cognito-based authentication
2. IAM roles with least-privilege access
3. CORS-enabled API Gateway
4. Serverless architecture (no EC2 exposure)-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🗃️ Database Design (DynamoDB)
Attendance Table
Attribute	                    Type
employeeId	                    String (Partition Key)
timestamp	                    String (Sort Key)
status	                        String
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🧪 Lambda Function Logic

1. Receive image from frontend
2. Upload image to S3
3. Call Rekognition SearchFacesByImage
4. Extract employeeId from ExternalImageId
5. Save attendance record in DynamoDB
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📊 Analytics Supported

1. Daily attendance count
2. Weekly attendance summary
3. Monthly attendance summary
4.Last attendance timestamp
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
💰 Cost Estimation
Users	                         Estimated Monthly Cost
50 users	                     ~$11.82
500 users	                     ~$20–25
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📦 Deployment Steps 

1. Create S3 bucket for frontend hosting
2. Set up Cognito User Pool & App Client
3. Create Rekognition face collection
4. Upload employee face images
5. Create DynamoDB tables
6. Deploy Lambda functions
7. Configure API Gateway
8. Enable CloudWatch logs
9. Connect frontend to backend APIs
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📂 Project Structure

face-recognition-attendance/
│
├── frontend/
│   ├── home.html
│   ├── dashboard.html
│   ├── styles.css
│   └── config.js
│
├── lambda/
│   ├── uploadAttendance.py
│   └── getAttendanceData.py
│
├── screenshots/
├── README.md
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
🎯 Use Cases

1.Employee attendance system
2.Classroom attendance
3.Secure access logging
4.Enterprise identity verification
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
📌 Future Enhancements

1. Face liveness detection
2. Admin dashboard
3. CSV export of attendance
4. Notifications via SNS
5. Role-based access (Admin/User)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
👨‍💻 Author

Suhail Khadas | Akash M M | Anas Ansari|
AWS | Cloud | Serverless | Face Recognition
🔗 GitHub: https://github.com/suhailkhadas123

