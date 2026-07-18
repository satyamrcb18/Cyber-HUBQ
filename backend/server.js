require('dotenv').config();
const express = require('express');
const cors = require('cors');

const scannerRoutes = require('./routes/scanner');
const feedRoutes = require('./routes/feed');
const emailRoutes = require('./routes/email');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
  res.send('🚀 Cyber-HUBQ Backend is Running Successfully!');
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running successfully'
  });
});

// API Routes
app.use('/api/scan', scannerRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/email', emailRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});