const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force login attempts. Keyed by IP; 10 tries per 15 minutes
// is generous for a real admin who mistypes a password, harsh for a script.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const { email, password } = req.body;
      const { rows } = await db.query('SELECT * FROM admin_users WHERE email = $1', [email]);
      const admin = rows[0];

      // Compare against a real hash either way, so response timing doesn't
      // reveal whether the email exists in the database (timing side-channel).
      const dummyHash = '$2a$12$CwTycUXWue0Thq9StjUM0uJ8N/1P9EgQoJqjqNjuUOSSbFwqL8m0m';
      const isValid = await bcrypt.compare(password, admin ? admin.password_hash : dummyHash);

      if (!admin || !isValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { sub: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      res.json({ token, email: admin.email });
    } catch (err) {
      next(err);
    }
  }
);

// Lets the admin frontend verify an existing token is still valid on page load.
router.get('/me', requireAuth, (req, res) => {
  res.json({ email: req.admin.email });
});

module.exports = router;
