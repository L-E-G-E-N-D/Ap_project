const app = require('./app');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});
