require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const inquiriesRouter = require('./routes/inquiries');
const authRouter = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

/*
 * ---------------------------------------------------------
 * Security headers
 * ---------------------------------------------------------
 */

app.use(helmet());

/*
 * ---------------------------------------------------------
 * CORS
 * ---------------------------------------------------------
 *
 * Local development:
 *   http://localhost:5500
 *
 * Kubernetes/Ingress:
 *   Configure CORS_ORIGIN through the Kubernetes ConfigMap.
 */

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);

/*
 * ---------------------------------------------------------
 * Request parsing
 * ---------------------------------------------------------
 */

app.use(express.json({ limit: '100kb' }));

/*
 * ---------------------------------------------------------
 * HTTP request logging
 * ---------------------------------------------------------
 */

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

/*
 * ---------------------------------------------------------
 * Health check
 * ---------------------------------------------------------
 *
 * Kubernetes uses this endpoint for readiness/liveness probes.
 */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

/*
 * ---------------------------------------------------------
 * API routes
 * ---------------------------------------------------------
 */

app.use('/api/auth', authRouter);

app.use('/api/inquiries', inquiriesRouter);

/*
 * ---------------------------------------------------------
 * 404 handler
 * ---------------------------------------------------------
 */

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found.',
  });
});

/*
 * ---------------------------------------------------------
 * Global error handler
 * ---------------------------------------------------------
 */

app.use(errorHandler);

/*
 * ---------------------------------------------------------
 * Start server
 * ---------------------------------------------------------
 */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Portfolio API listening on http://localhost:${PORT}`
  );
});