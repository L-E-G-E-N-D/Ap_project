require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Base check endpoint
app.get('/health', (req, res) => {
  res.status(200).json(ApiResponse.success('API is running smoothly'));
});

// We will mount router here in next steps
// const mainRouter = require('./routes');
// app.use('/api', mainRouter);

// Fallback for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error middleware
app.use(errorMiddleware);

module.exports = app;
