const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const userRoutes = require('./routes/userRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (error pages)
app.use(express.static(path.join(__dirname, '../public')));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Client configuration endpoint
app.get('/config', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 
    (process.env.NODE_ENV === 'production' ? 'https://shortly.com' : 'http://localhost:5173');
  res.status(200).json({
    CLIENT_URL: clientUrl
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);
app.use('/', redirectRoutes);

// Global 404 handler
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;