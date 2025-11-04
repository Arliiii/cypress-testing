import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import reportRoutes from './routes/report.routes.js';
import userRoutes from './routes/user.routes.js';
import datasetRoutes from './routes/dataset.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'StatFlow API', 
    version: '1.0.0',
    status: 'active',
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      projects: '/api/projects',
      datasets: '/api/datasets',
      analysis: '/api/analysis',
      reports: '/api/reports',
      users: '/api/users'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'StatFlow API', 
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      projects: '/api/projects (GET, POST)',
      datasets: '/api/datasets/upload (POST)',
      analysis: '/api/analysis (GET, POST)',
      reports: '/api/reports (GET, POST)',
      users: '/api/users/credits (GET)'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/datasets', datasetRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
