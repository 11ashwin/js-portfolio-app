const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_INTERESTS = [
  'SOC / Incident Response',
  'Threat Hunting',
  'WAF / Application Security',
  'Cloud Security',
  'DevSecOps',
  'Kubernetes Security',
];
const ALLOWED_STATUSES = ['new', 'contacted', 'archived'];

// Anyone can hit this endpoint (it's a public "contact me" form), so it needs
// its own, stricter rate limit — separate from admin routes — keyed by IP.
const inquiryLimiter = rateLimit({
  windowMs: Number(process.env.INQUIRY_RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000),
  max: Number(process.env.INQUIRY_RATE_LIMIT_MAX || 5),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this network. Please try again later.' },
});

/**
 * POST /api/inquiries — public. A recruiter submits a hiring inquiry.
 * Every field is validated and length-capped server-side. The frontend also
 * validates, but client-side checks are a UX nicety, not a security boundary
 * — anyone can bypass them with curl, so the real gate lives here.
 */
router.post(
  '/',
  inquiryLimiter,
  [
    body('name').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('company').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('email').trim().isEmail().normalizeEmail().isLength({ max: 180 }),
    body('role').trim().notEmpty().isLength({ max: 150 }).escape(),
    body('location').optional({ checkFalsy: true }).trim().isLength({ max: 150 }).escape(),
    body('employmentType').optional({ checkFalsy: true }).trim().isIn(['Full-time', 'Contract', 'Consulting']),
    body('description').trim().notEmpty().isLength({ max: 4000 }).escape(),
    body('salaryRange').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).escape(),
    body('jobUrl').optional({ checkFalsy: true }).trim().isURL().isLength({ max: 500 }),
    body('interests').optional().isArray({ max: ALLOWED_INTERESTS.length }),
    body('interests.*').optional().isIn(ALLOWED_INTERESTS),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Please check the form for errors.', details: errors.array() });
      }

      const {
        name, company, email, role, location, employmentType,
        description, salaryRange, jobUrl, interests = [],
      } = req.body;

      const { rows } = await db.query(
        `INSERT INTO inquiries
           (name, company, email, role, location, employment_type, description, salary_range, job_url, interests, ip_address)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id, created_at`,
        [name, company, email, role, location || null, employmentType || null,
         description, salaryRange || null, jobUrl || null, interests, req.ip]
      );

      res.status(201).json({ message: 'Inquiry received.', id: rows[0].id });
    } catch (err) {
      next(err);
    }
  }
);

/** GET /api/inquiries — admin only. Optional ?status= filter + pagination. */
router.get(
  '/',
  requireAuth,
  [
    query('status').optional().isIn(ALLOWED_STATUSES),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid query parameters.' });

      const limit = req.query.limit || 50;
      const offset = req.query.offset || 0;
      const params = [];
      let where = '';
      if (req.query.status) {
        params.push(req.query.status);
        where = `WHERE status = $${params.length}`;
      }
      params.push(limit, offset);

      const { rows } = await db.query(
        `SELECT * FROM inquiries ${where}
         ORDER BY created_at DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      );
      const { rows: countRows } = await db.query(
        `SELECT status, COUNT(*)::int AS count FROM inquiries GROUP BY status`
      );

      res.json({ inquiries: rows, counts: countRows });
    } catch (err) {
      next(err);
    }
  }
);

/** PATCH /api/inquiries/:id — admin only. Update status (new/contacted/archived). */
router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isInt().toInt(),
    body('status').isIn(ALLOWED_STATUSES),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid request.' });

      const { rows } = await db.query(
        `UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *`,
        [req.body.status, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Inquiry not found.' });

      res.json({ inquiry: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

/** DELETE /api/inquiries/:id — admin only. */
router.delete(
  '/:id',
  requireAuth,
  [param('id').isInt().toInt()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid id.' });

      const { rowCount } = await db.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: 'Inquiry not found.' });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
