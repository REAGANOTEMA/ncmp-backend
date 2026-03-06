require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const mpRoutes = require('./routes/mpRoutes');
const staffRoutes = require('./routes/staffRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json()); // parse JSON body
app.use(morgan('dev'));   // logging requests

// ===============================
// Health check
// ===============================
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running ✅', environment: process.env.NODE_ENV || 'development' });
});

// ===============================
// Routes
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/mps', mpRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/reports', reportRoutes);

// ===============================
// 404 handler
// ===============================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found ❌' });
});

// ===============================
// Global error handler
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong ❌', details: err.message });
});

// ===============================
// Start server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});