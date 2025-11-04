# StatFlow API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 10,
    "createdAt": "2024-11-03T10:00:00.000Z"
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "credits": 8
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

---

## Project Endpoints

### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Research Project",
  "description": "Analysis of survey data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "name": "My Research Project",
    "description": "Analysis of survey data",
    "user": "60d5ec49f1b2c72b8c8e4f1a",
    "creditsUsed": 0,
    "status": "active",
    "isStarred": false,
    "createdAt": "2024-11-03T10:00:00.000Z"
  }
}
```

### Get All Projects
```http
GET /api/projects?status=active&sort=-createdAt
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "My Research Project",
      "creditsUsed": 6,
      "status": "active",
      "createdAt": "2024-11-03T10:00:00.000Z",
      "datasetId": {
        "name": "Survey Data",
        "fileName": "survey.xlsx"
      }
    }
  ]
}
```

### Get Single Project
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

### Toggle Star on Project
```http
PATCH /api/projects/:id/star
Authorization: Bearer <token>
```

---

## Dataset Endpoints

### Upload Dataset
```http
POST /api/datasets/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <your_excel_or_csv_file>
- projectId: "60d5ec49f1b2c72b8c8e4f1b"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "name": "survey_data",
    "user": "60d5ec49f1b2c72b8c8e4f1a",
    "project": "60d5ec49f1b2c72b8c8e4f1b",
    "fileName": "survey.xlsx",
    "fileSize": 52480,
    "filePath": "/uploads/file-1635932400000-123456789.xlsx",
    "variables": [
      {
        "name": "age",
        "label": "age",
        "type": "Scale",
        "values": [25, 30, 35, 28, 45]
      },
      {
        "name": "gender",
        "label": "gender",
        "type": "Nominal",
        "values": ["Male", "Female", "Male", "Female", "Male"]
      }
    ],
    "rowCount": 100,
    "columnCount": 5,
    "createdAt": "2024-11-03T10:00:00.000Z"
  }
}
```

### Get All Datasets
```http
GET /api/datasets
Authorization: Bearer <token>
```

### Get Single Dataset
```http
GET /api/datasets/:id
Authorization: Bearer <token>
```

### Get Dataset Variables
```http
GET /api/datasets/:id/variables
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "d2",
      "label": "d2",
      "type": "Scale"
    },
    {
      "name": "d5",
      "label": "d5",
      "type": "Scale"
    },
    {
      "name": "Group",
      "label": "Group",
      "type": "Nominal"
    }
  ]
}
```

### Delete Dataset
```http
DELETE /api/datasets/:id
Authorization: Bearer <token>
```

---

## Analysis Endpoints

### Create Analysis
```http
POST /api/analysis
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "60d5ec49f1b2c72b8c8e4f1b",
  "datasetId": "60d5ec49f1b2c72b8c8e4f1c",
  "analysisType": "descriptive",
  "selectedVariables": [
    {
      "variableName": "d2",
      "variableType": "Scale"
    },
    {
      "variableName": "d5",
      "variableType": "Scale"
    }
  ],
  "splitVariable": {
    "variableName": "d1",
    "variableType": "Nominal"
  },
  "settings": {
    "decimalSeparator": "dot",
    "decimalPlaces": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "project": "60d5ec49f1b2c72b8c8e4f1b",
    "user": "60d5ec49f1b2c72b8c8e4f1a",
    "dataset": "60d5ec49f1b2c72b8c8e4f1c",
    "analysisType": "descriptive",
    "analysisName": "Descriptive Statistics",
    "selectedVariables": [...],
    "splitVariable": {...},
    "settings": {
      "decimalSeparator": "dot",
      "decimalPlaces": 3
    },
    "results": {
      "analysisType": "Descriptive Statistics",
      "groups": [
        {
          "groupName": "d1 = 1",
          "variables": [
            {
              "name": "d2",
              "statistics": {
                "n": 25,
                "mean": 31.261,
                "median": 29.24,
                "std": 9.428,
                "min": 21.05,
                "max": 53.02,
                "q1": 23.77,
                "q3": 35.02
              }
            }
          ]
        }
      ],
      "interpretation": "The value of median for d2 has been obtained as 29.24 over 25 observations..."
    },
    "creditsUsed": 2,
    "status": "completed",
    "isStarred": false,
    "createdAt": "2024-11-03T10:00:00.000Z"
  }
}
```

### Get All Analyses
```http
GET /api/analysis?projectId=60d5ec49f1b2c72b8c8e4f1b&status=completed
Authorization: Bearer <token>
```

### Get Single Analysis
```http
GET /api/analysis/:id
Authorization: Bearer <token>
```

### Delete Analysis
```http
DELETE /api/analysis/:id
Authorization: Bearer <token>
```

### Toggle Star on Analysis
```http
PATCH /api/analysis/:id/star
Authorization: Bearer <token>
```

---

## Report Endpoints

### Create Report
```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "analysisId": "60d5ec49f1b2c72b8c8e4f1d"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1e",
    "analysis": "60d5ec49f1b2c72b8c8e4f1d",
    "project": "60d5ec49f1b2c72b8c8e4f1b",
    "user": "60d5ec49f1b2c72b8c8e4f1a",
    "reportNumber": "#5250",
    "title": "My Research Project - Descriptive Statistics",
    "content": {...},
    "format": "json",
    "isStarred": false,
    "creditsUsed": 2,
    "createdAt": "2024-11-03T10:00:00.000Z"
  }
}
```

### Get All Reports
```http
GET /api/reports?projectId=60d5ec49f1b2c72b8c8e4f1b&starred=true
Authorization: Bearer <token>
```

### Get Single Report
```http
GET /api/reports/:id
Authorization: Bearer <token>
```

### Delete Report
```http
DELETE /api/reports/:id
Authorization: Bearer <token>
```

### Toggle Star on Report
```http
PATCH /api/reports/:id/star
Authorization: Bearer <token>
```

### Export Report
```http
GET /api/reports/:id/export?format=json
Authorization: Bearer <token>
```

---

## User/Credits Endpoints

### Get Credits
```http
GET /api/users/credits
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "credits": 8
}
```

### Add Credits
```http
POST /api/users/credits/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "10 credits added successfully",
  "credits": 18
}
```

### Get Credit History
```http
GET /api/users/credits/history
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "totalCreditsUsed": 12,
  "currentCredits": 8,
  "history": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1d",
      "analysisName": "Descriptive Statistics",
      "creditsUsed": 2,
      "createdAt": "2024-11-03T10:00:00.000Z",
      "project": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "name": "My Research Project"
      }
    }
  ]
}
```

---

## Analysis Types

### Descriptive Statistics
- **Credit Cost**: 2 credits
- **Description**: Analyze distribution patterns and central tendencies
- **Output**: Mean, median, std, min, max, Q1, Q3, skewness, kurtosis

### Single Group Analysis
- **Credit Cost**: 3 credits
- **Description**: Analyze a single group with normality tests
- **Output**: Descriptive stats + normality test results

### Multiple Group Analysis
- **Credit Cost**: 4 credits
- **Description**: Compare multiple groups (ANOVA, Kruskal-Wallis)
- **Output**: Group comparisons and statistical significance

### Dependent Data Analysis
- **Credit Cost**: 4 credits
- **Description**: Analyze paired/related measurements
- **Output**: Paired comparison results

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient credits",
  "required": 2,
  "available": 0
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Notes

1. All timestamps are in ISO 8601 format
2. File uploads are limited to 10MB
3. Supported file formats: CSV, Excel (.xls, .xlsx)
4. JWT tokens expire after 7 days (configurable)
5. Default user credits: 10 (configurable)
