// server.js  (showing the important parts)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { tenantMiddleware } = require('./middleware/tenant'); // <-- NEW

const app = express();
const port = process.env.PORT || 5000;

// security
app.use(helmet());
app.use(express.json());

// CORS (you already have something similar)
const allowed = new Set([process.env.FRONTEND_ORIGIN, 'http://localhost:5000', 'http://127.0.0.1:5000'].filter(Boolean));
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    return allowed.has(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'));
  }
}));

// rate limit
app.use('/api/', rateLimit({ windowMs: 60_000, max: 30 }));

// ---- TENANT MIDDLEWARE (apply before routes) ----
app.use(tenantMiddleware);

// serve UI
app.use(express.static(path.join(__dirname, 'public')));

// Mongo connect (yours unchanged)
mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log(JSON.stringify({ level: 30, msg: 'Connected to MongoDB Atlas' })))
  .catch(err => { console.error('Mongo error:', err.message); process.exit(1); });

  // simple health for uptime monitors
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// health
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);

app.listen(port, () => {
  console.log(JSON.stringify({ level: 30, msg: `Server running on http://localhost:${port}` }));
});
