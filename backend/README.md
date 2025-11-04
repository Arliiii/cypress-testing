# StatFlow Backend API

Backend API for StatFlow - Statistical Analysis Application

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Project Management**: Create, read, update, and delete projects
- **Dataset Upload**: Upload CSV/Excel files for analysis
- **Statistical Analysis**: Perform various types of statistical analyses
  - Descriptive Statistics
  - Single Group Analysis
  - Multiple Group Analysis
  - Dependent Data Analysis
- **Report Generation**: Create and export analysis reports
- **Credit System**: Credit-based analysis system

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- File Upload (Multer)
- Statistical Analysis (simple-statistics)
- Excel/CSV parsing (xlsx)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
copy .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/istabot
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
DEFAULT_USER_CREDITS=10
```

4. Make sure MongoDB is running

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/star` - Toggle star

### Datasets
- `POST /api/datasets/upload` - Upload dataset file
- `GET /api/datasets` - Get all datasets
- `GET /api/datasets/:id` - Get single dataset
- `DELETE /api/datasets/:id` - Delete dataset
- `GET /api/datasets/:id/variables` - Get dataset variables

### Analysis
- `POST /api/analysis` - Create new analysis
- `GET /api/analysis` - Get all analyses
- `GET /api/analysis/:id` - Get single analysis
- `DELETE /api/analysis/:id` - Delete analysis
- `PATCH /api/analysis/:id/star` - Toggle star

### Reports
- `POST /api/reports` - Create report from analysis
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report
- `DELETE /api/reports/:id` - Delete report
- `PATCH /api/reports/:id/star` - Toggle star
- `GET /api/reports/:id/export` - Export report

### Users
- `GET /api/users/credits` - Get user credits
- `POST /api/users/credits/add` - Add credits
- `GET /api/users/credits/history` - Get credit history

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── dataset.controller.js
│   │   ├── analysis.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   ├── Dataset.model.js
│   │   ├── Analysis.model.js
│   │   └── Report.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── dataset.routes.js
│   │   ├── analysis.routes.js
│   │   ├── report.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   └── statistics.js
│   └── server.js
├── uploads/
├── .env.example
├── .gitignore
└── package.json
```

## License

ISC
