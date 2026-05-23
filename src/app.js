const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/verification', require('./routes/verificationRoutes'));

app.get('/', (req, res) => {
  res.send('GLT App API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
