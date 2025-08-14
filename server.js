require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { exec } = require('child_process'); // <-- Auto browser open ke liye

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const leaveRoutes = require('./routes/leave');
const adminRoutes = require('./routes/admin');

const app = express();

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/auth', authLimiter);

// Static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/admin', adminRoutes);

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Windows ke liye browser auto-open
    exec(`start http://localhost:${PORT}`);
    // Mac pe hota to: exec(`open http://localhost:${PORT}`);
    // Linux pe hota to: exec(`xdg-open http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect DB:', err);
  process.exit(1);
});
