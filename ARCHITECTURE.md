# StatFlow Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                      │
│                      http://localhost:5173                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │ JWT Token Auth
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Express.js)                          │
│                      http://localhost:5000                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MIDDLEWARE LAYER                          │   │
│  │  • CORS          • Helmet (Security)  • Compression          │   │
│  │  • Morgan (Log)  • Body Parser        • Error Handler       │   │
│  │  • JWT Auth      • File Upload (Multer)                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      ROUTES LAYER                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │  Auth    │  │ Projects │  │ Datasets │  │ Analysis │   │   │
│  │  │ Routes   │  │  Routes  │  │  Routes  │  │  Routes  │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  │  ┌──────────┐  ┌──────────┐                                │   │
│  │  │ Reports  │  │  Users   │                                │   │
│  │  │  Routes  │  │  Routes  │                                │   │
│  │  └──────────┘  └──────────┘                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   CONTROLLERS LAYER                          │   │
│  │  • Business Logic                                            │   │
│  │  • Request Validation                                        │   │
│  │  • Response Formatting                                       │   │
│  │  • Error Handling                                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     UTILS LAYER                              │   │
│  │  • Statistical Calculations (simple-statistics)              │   │
│  │  • File Processing (xlsx parser)                             │   │
│  │  • Data Transformation                                       │   │
│  │  • Analysis Engine                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     MODELS LAYER (Mongoose)                  │   │
│  │  ┌─────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐           │   │
│  │  │User │  │ Project │  │ Dataset │  │ Analysis │           │   │
│  │  └─────┘  └─────────┘  └─────────┘  └──────────┘           │   │
│  │  ┌────────┐                                                  │   │
│  │  │ Report │                                                  │   │
│  │  └────────┘                                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                                │
│                  mongodb://localhost:27017/istabot                   │
│                                                                       │
│  Collections:                                                        │
│  • users         - User accounts & credits                          │
│  • projects      - Statistical projects                             │
│  • datasets      - Uploaded data files                              │
│  • analyses      - Analysis configurations & results                │
│  • reports       - Generated reports                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    FILE SYSTEM (Local Storage)                       │
│                         /uploads/                                    │
│  • CSV files                                                         │
│  • Excel files (.xls, .xlsx)                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Request Flow Example: Create Analysis

```
┌──────────┐
│ Frontend │
└────┬─────┘
     │ 1. POST /api/analysis
     │    Authorization: Bearer <token>
     │    Body: { projectId, datasetId, analysisType, ... }
     ▼
┌─────────────────┐
│ Express Server  │
└────┬────────────┘
     │ 2. Middleware Chain
     │    ├─ CORS Check
     │    ├─ Body Parser
     │    ├─ JWT Verification (protect middleware)
     │    └─ Check Credits (checkCredits middleware)
     ▼
┌─────────────────────┐
│ Analysis Controller │
└────┬────────────────┘
     │ 3. Business Logic
     │    ├─ Validate input
     │    ├─ Check project exists
     │    ├─ Check dataset exists
     │    └─ Verify user ownership
     ▼
┌─────────────────┐
│ Statistics Util │
└────┬────────────┘
     │ 4. Perform Analysis
     │    ├─ Read dataset file (xlsx)
     │    ├─ Extract data for selected variables
     │    ├─ Calculate statistics
     │    │   • Mean, Median, Std
     │    │   • Min, Max, Q1, Q3
     │    │   • Skewness, Kurtosis
     │    └─ Generate interpretation
     ▼
┌────────────────┐
│ MongoDB (Save) │
└────┬───────────┘
     │ 5. Database Operations
     │    ├─ Create Analysis document
     │    ├─ Deduct user credits
     │    ├─ Update project credits used
     │    └─ Return analysis with results
     ▼
┌─────────────────┐
│ Response to UI  │
└─────────────────┘
     {
       success: true,
       data: {
         _id: "...",
         results: {
           groups: [...],
           interpretation: "..."
         },
         creditsUsed: 2,
         status: "completed"
       }
     }
```

## Data Flow: Statistical Analysis

```
┌─────────────────┐
│ Upload Dataset  │
│  (Excel/CSV)    │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Multer File Processing   │
│ • Save to /uploads/      │
│ • Validate file type     │
│ • Check file size        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Parse with xlsx library  │
│ • Extract headers        │
│ • Read data rows         │
│ • Detect variable types  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Create Dataset Document  │
│ • Store variables        │
│ • Store metadata         │
│ • Link to project        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ User Selects Variables   │
│ • Choose analysis type   │
│ • Select variables       │
│ • Optional split var     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Statistics Engine        │
│ • Read dataset file      │
│ • Extract columns        │
│ • Calculate stats        │
│ • Generate results       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Analysis Results         │
│ • Descriptive stats      │
│ • Tables & charts data   │
│ • Interpretation text    │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Save & Return to UI      │
└──────────────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│  Register   │
└──────┬──────┘
       │ POST /api/auth/register
       │ { name, email, password }
       ▼
┌─────────────────┐
│ Hash Password   │
│  (bcrypt)       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Create User     │
│ (MongoDB)       │
│ Default Credits │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Generate JWT    │
│ Token (7 days)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Return Token    │
│ + User Info     │
└─────────────────┘

┌─────────────┐
│   Login     │
└──────┬──────┘
       │ POST /api/auth/login
       │ { email, password }
       ▼
┌─────────────────┐
│ Find User       │
│ (MongoDB)       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Compare         │
│ Password        │
│ (bcrypt)        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Generate JWT    │
│ Token           │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Return Token    │
│ + User Info     │
└─────────────────┘

Protected Routes:
┌─────────────────┐
│ API Request     │
│ with Token      │
└──────┬──────────┘
       │ Authorization: Bearer <token>
       ▼
┌─────────────────┐
│ Verify JWT      │
│ Signature       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Extract User ID │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Load User from  │
│ Database        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Attach to       │
│ req.user        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Continue to     │
│ Controller      │
└─────────────────┘
```

## Credit System Flow

```
┌──────────────────┐
│ New User Created │
│ Credits: 10      │
└────────┬─────────┘
         │
         ▼
┌────────────────────────┐
│ User Requests Analysis │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Check Credit Cost      │
│ • Descriptive: 2       │
│ • Single Group: 3      │
│ • Multiple Group: 4    │
│ • Dependent: 4         │
└────────┬───────────────┘
         │
         ▼
    ┌────────────┐
    │ Sufficient │
    │ Credits?   │
    └─┬────────┬─┘
  YES │        │ NO
      │        │
      │        ▼
      │   ┌──────────────┐
      │   │ Return 403   │
      │   │ Insufficient │
      │   └──────────────┘
      │
      ▼
┌────────────────┐
│ Process        │
│ Analysis       │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Deduct Credits │
│ from User      │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Add to Project │
│ Credits Used   │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Return Results │
└────────────────┘

Credit Purchase:
┌──────────────────┐
│ User Buys Credit │
└────────┬─────────┘
         │ POST /api/users/credits/add
         │ { amount: 10 }
         ▼
┌────────────────────┐
│ [Future: Payment   │
│  Gateway           │
│  Integration]      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Add Credits to     │
│ User Account       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Return New Balance │
└────────────────────┘
```

## Error Handling Flow

```
┌──────────────┐
│ Error Occurs │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Error Type?          │
└──┬──────────────┬────┘
   │              │
   ▼              ▼
Validation    MongoDB
Error         Error
   │              │
   ▼              ▼
┌──────┐    ┌──────────┐
│ 400  │    │ Duplicate│
│ Bad  │    │ Key?     │
│Request│   └────┬─────┘
└──────┘         │
                 ▼
            ┌─────────┐
            │ 400 Bad │
            │ Request │
            └─────────┘

┌──────────────┐
│ JWT Error    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 401          │
│ Unauthorized │
└──────────────┘

┌──────────────┐
│ Not Found    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 404 Not      │
│ Found        │
└──────────────┘

All errors flow through:
┌────────────────────┐
│ Error Handler      │
│ Middleware         │
│ • Format response  │
│ • Hide stack trace │
│   in production    │
│ • Log errors       │
└────────────────────┘
```

## File Structure by Feature

```
Authentication
├── routes/auth.routes.js
├── controllers/auth.controller.js
├── models/User.model.js
└── middleware/auth.js

Projects
├── routes/project.routes.js
├── controllers/project.controller.js
└── models/Project.model.js

Datasets
├── routes/dataset.routes.js
├── controllers/dataset.controller.js
├── models/Dataset.model.js
├── middleware/upload.js
└── uploads/ (directory)

Analysis
├── routes/analysis.routes.js
├── controllers/analysis.controller.js
├── models/Analysis.model.js
└── utils/statistics.js

Reports
├── routes/report.routes.js
├── controllers/report.controller.js
└── models/Report.model.js

Users & Credits
├── routes/user.routes.js
└── controllers/user.controller.js
```
