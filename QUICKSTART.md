# StatFlow - Quick Start Guide

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **bun** package manager

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (already created with default values)
# Edit .env if needed to change MongoDB connection or other settings

# Make sure MongoDB is running on localhost:27017
# Or update MONGODB_URI in .env file

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already installed)
bun install
# or
npm install

# Start the frontend development server
bun run dev
# or
npm run dev
```

The frontend will start on `http://localhost:5173`

## Testing the Application

### 1. Register a New User

Visit `http://localhost:5173` and you'll see the auth page. Click "Create account" and register:

- Name: Test User
- Email: test@example.com
- Password: password123

### 2. Create a Project

After logging in, you'll be on the dashboard. Click "New Project" and create a project:

- Project Name: Demo Project

### 3. Upload a Dataset

Create a sample Excel/CSV file with the following structure:

| d1  | d2    | d5    | Group |
|-----|-------|-------|-------|
| 1   | 31.2  | 24.9  | A     |
| 1   | 29.5  | 23.7  | A     |
| 2   | 35.8  | 30.2  | B     |
| 2   | 27.3  | 21.5  | B     |

Upload this file to your project.

### 4. Perform Analysis

1. Click on your project
2. Select "Analysis" 
3. Choose "Descriptive Statistics"
4. Select variables (d2, d5)
5. Optionally select a split variable (d1)
6. Review settings and submit

### 5. View Results

After the analysis completes, you'll see the results with:
- Descriptive statistics tables
- Mean, median, standard deviation
- Quartiles (Q1, Q3)
- Interpretation text

## API Testing with Postman/Insomnia

### 1. Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `token` from the response.

### 3. Create Project (use token from login)
```http
POST http://localhost:5000/api/projects
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "My First Project",
  "description": "Testing the API"
}
```

### 4. Get Projects
```http
GET http://localhost:5000/api/projects
Authorization: Bearer <your_token>
```

## MongoDB Connection

### Local MongoDB
If you have MongoDB installed locally, it should be accessible at:
```
mongodb://localhost:27017/istabot
```

### MongoDB Atlas (Cloud)
If you want to use MongoDB Atlas:
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/istabot?retryWrites=true&w=majority
```

## Troubleshooting

### MongoDB Connection Error
**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:** 
- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Update MONGODB_URI in .env if using different port

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Change PORT in .env to a different port (e.g., 5001)
- Or kill the process using port 5000

### CORS Error in Frontend
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Make sure backend is running
- Check CORS_ORIGIN in backend .env matches frontend URL
- Default is `http://localhost:5173`

### File Upload Error
**Error:** `Invalid file type`

**Solution:**
- Only CSV, XLS, and XLSX files are supported
- File size limit is 10MB
- Make sure file has proper headers

## Environment Variables

### Backend (.env)
```env
PORT=5000                          # Server port
NODE_ENV=development               # development or production
MONGODB_URI=mongodb://localhost:27017/istabot  # MongoDB connection
JWT_SECRET=your-secret-key         # JWT signing key
JWT_EXPIRE=7d                      # Token expiration
CORS_ORIGIN=http://localhost:5173  # Frontend URL
DEFAULT_USER_CREDITS=10            # Starting credits for new users
```

## Default Credentials (After Setup)

After running the application, you can create users through the registration page. There are no default credentials - you must register first.

## Credit System

- **Descriptive Statistics**: 2 credits
- **Single Group Analysis**: 3 credits
- **Multiple Group Analysis**: 4 credits
- **Dependent Data Analysis**: 4 credits

Each new user starts with 10 credits (configurable in .env).

## Next Steps

1. ✅ Backend API is ready and running
2. ✅ Frontend is connected to backend
3. 🔄 Update frontend to use API instead of localStorage
4. 🔄 Add dataset upload functionality in frontend
5. 🔄 Integrate analysis creation with backend
6. 🔄 Display analysis results from backend

## Support

For issues or questions, check:
- Backend README.md for API details
- API_DOCUMENTATION.md for endpoint reference
- Frontend code for integration examples
