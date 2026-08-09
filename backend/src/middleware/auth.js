const jwt = require('jsonwebtoken');

/**
 * Protects admin-only routes. Expects `Authorization: Bearer <token>`.
 * Verifies the JWT signature + expiry — never trusts the token's claims
 * without verification, and never accepts a token from a query string
 * (that would leak into server logs and browser history).
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = { requireAuth };
