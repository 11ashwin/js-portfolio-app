require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const inquiriesRouter = require('./routes/inquiries');
const authRouter = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers on every response (CSP, no-sniff, frameguard, etc).
app.use(helmet());

// Only the configured frontend origin may call this API from a browser —
// prevents any other site from submitting inquiries or hitting admin routes
// using a logged-in admin's cookies/token via CSRF-style requests.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use(express.json({ limit: '100kb' })); // cap body size — cheap DoS guard
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRouter);
app.use('/api/inquiries', inquiriesRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Portfolio API listening on http://localhost:${PORT}`);
});
