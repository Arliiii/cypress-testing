# Backend API Endpoints - Quick Test Guide

## Server Info
- **Base URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`

## Test These URLs in Your Browser or Postman

### 1. Root Endpoint (GET)
```
http://localhost:5000/
```
**Expected Response**: Server info with all endpoint paths

### 2. API Info (GET)
```
http://localhost:5000/api
```
**Expected Response**: API version and available endpoints

### 3. Health Check (GET)
```
http://localhost:5000/api/health
```
**Expected Response**: 
```json
{
  "status": "OK",
  "timestamp": "2025-11-03T...",
  "uptime": 123.456
}
```

## Authentication Endpoints

### Register User (POST)
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login (POST)
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Response**: Returns JWT token - save this for other requests!

### Get Current User (GET)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Project Endpoints (Requires Auth Token)

### Create Project (POST)
```
POST http://localhost:5000/api/projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "My Test Project",
  "description": "Testing the API"
}
```

### Get All Projects (GET)
```
GET http://localhost:5000/api/projects
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Project (GET)
```
GET http://localhost:5000/api/projects/PROJECT_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

### Delete Project (DELETE)
```
DELETE http://localhost:5000/api/projects/PROJECT_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

## Dataset Endpoints (Requires Auth Token)

### Upload Dataset (POST)
```
POST http://localhost:5000/api/datasets/upload
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- file: [your Excel/CSV file]
- projectId: PROJECT_ID
```

### Get All Datasets (GET)
```
GET http://localhost:5000/api/datasets
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Dataset Variables (GET)
```
GET http://localhost:5000/api/datasets/DATASET_ID/variables
Authorization: Bearer YOUR_JWT_TOKEN
```

## Analysis Endpoints (Requires Auth Token)

### Create Analysis (POST)
```
POST http://localhost:5000/api/analysis
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "projectId": "PROJECT_ID",
  "datasetId": "DATASET_ID",
  "analysisType": "descriptive",
  "selectedVariables": [
    {
      "variableName": "age",
      "variableType": "Scale"
    }
  ],
  "settings": {
    "decimalSeparator": "dot",
    "decimalPlaces": 3
  }
}
```

### Get All Analyses (GET)
```
GET http://localhost:5000/api/analysis
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Analysis (GET)
```
GET http://localhost:5000/api/analysis/ANALYSIS_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

## Report Endpoints (Requires Auth Token)

### Create Report (POST)
```
POST http://localhost:5000/api/reports
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "analysisId": "ANALYSIS_ID"
}
```

### Get All Reports (GET)
```
GET http://localhost:5000/api/reports
Authorization: Bearer YOUR_JWT_TOKEN
```

## User/Credits Endpoints (Requires Auth Token)

### Get Credits (GET)
```
GET http://localhost:5000/api/users/credits
Authorization: Bearer YOUR_JWT_TOKEN
```

### Add Credits (POST)
```
POST http://localhost:5000/api/users/credits/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 10
}
```

### Get Credit History (GET)
```
GET http://localhost:5000/api/users/credits/history
Authorization: Bearer YOUR_JWT_TOKEN
```

## Common Issues

### "Route not found"
- Check the URL is exactly correct
- Make sure server is running: `npm run dev`
- Try the health endpoint first: `http://localhost:5000/api/health`

### "Not authorized"
- Make sure you're sending the token in Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN_HERE`
- Get token from login response

### "Insufficient credits"
- Check your credits: `GET /api/users/credits`
- Add credits: `POST /api/users/credits/add`

## Quick Test Steps

1. **Start server**: `npm run dev` in backend folder
2. **Test health**: Open `http://localhost:5000/api/health` in browser
3. **Register user**: Use Postman/curl to POST to `/api/auth/register`
4. **Login**: POST to `/api/auth/login` and save the token
5. **Test protected route**: GET `/api/projects` with Authorization header

## Using curl (Windows Command Prompt)

### Test Health
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
```

Save the token from the response and use it in subsequent requests!
