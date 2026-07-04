require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');
const { success } = require('./utils/apiResponse');

const app = express();

const mainRouter = require('./routes');

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json(success('API is running smoothly'));
});

app.use('/api', mainRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

module.exports = app;
