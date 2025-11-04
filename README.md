# 🤖 IstaBot - Instagram Analytics Dashboard

A full-stack web application for Instagram analytics and automation, built with React, TypeScript, Node.js, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔐 User authentication and authorization
- 📊 Instagram analytics dashboard
- 📈 Data visualization and insights
- 🔄 Real-time data synchronization
- 📱 Responsive design
- 🧪 End-to-end testing with Cypress

## 🛠️ Tech Stack

### Frontend
- **React** 18.3 with TypeScript
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Testing
- **Cypress** - E2E testing framework

## 📁 Project Structure

```
istabot/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── cypress/             # Cypress tests
│   │   ├── e2e/            # End-to-end tests
│   │   ├── fixtures/       # Test data
│   │   └── support/        # Custom commands
│   └── package.json
│
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── database.js # MongoDB connection
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # API routes
│   └── package.json
│
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Arliiii/cypress-testing.git
cd istabot
```

2. **Install frontend dependencies:**

```bash
cd frontend
npm install
```

3. **Install backend dependencies:**

```bash
cd ../backend
npm install
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/istabot
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/istabot

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Instagram API (if applicable)
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally):

```bash
mongod
```

2. **Start the backend server:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

3. **Start the frontend development server:**

```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

4. **Open your browser:**

Navigate to `http://localhost:5173`

### Production Build

**Build frontend:**

```bash
cd frontend
npm run build
```

**Build backend:**

```bash
cd backend
npm run build
```

## 🧪 Testing

### Run Cypress Tests

**Interactive mode (Test Runner):**

```bash
cd frontend
npx cypress open
```

**Headless mode (CI/CD):**

```bash
cd frontend
npx cypress run
```

**Run specific test file:**

```bash
npx cypress run --spec "cypress/e2e/app.cy.ts"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/insights` - Get Instagram insights
- `POST /api/analytics/sync` - Sync data from Instagram

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Arlin**
- GitHub: [@Arliiii](https://github.com/Arliiii)
- Repository: [cypress-testing](https://github.com/Arliiii/cypress-testing)

## 🙏 Acknowledgments

- React and Vite teams for amazing tools
- MongoDB for database solutions
- Cypress for testing framework
- TailwindCSS for styling utilities

---

⭐ **Star this repository if you find it helpful!**
