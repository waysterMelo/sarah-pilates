import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import studentsRoutes from './routes/students.routes';
import instructorsRoutes from './routes/instructors.routes';
import schedulesRoutes from './routes/schedules.routes';
import evaluationsRoutes from './routes/evaluations.routes';
import evolutionRecordsRoutes from './routes/evolution-records.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Import middleware
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: 'Muitas tentativas, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: process.env.UPLOAD_MAX_SIZE || '5mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.UPLOAD_MAX_SIZE || '5mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Sarah Pilates API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/instructors', instructorsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/evolution-records', evolutionRecordsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;