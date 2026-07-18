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

// Routes
app.use('/api/scan', scannerRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
