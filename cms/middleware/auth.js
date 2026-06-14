/**
 * JWT Authentication Middleware
 */
const jwt = require('jsonwebtoken');
const { getDb } = require('../database/db');

const SECRET = process.env.JWT_SECRET || 'saovang_secret';

/**
 * Verify JWT token from Authorization header or cookie
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized — no token' });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    const db  = getDb();
    const user = db.prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ? AND is_active = 1').get(payload.userId);

    if (!user) return res.status(401).json({ error: 'User not found or inactive' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Role-based access control
 * @param {...string} roles - allowed roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const hierarchy = { superadmin: 4, admin: 3, editor: 2, viewer: 1 };
    const userLevel = hierarchy[req.user.role] || 0;
    const minLevel  = Math.min(...roles.map(r => hierarchy[r] || 99));
    if (userLevel < minLevel) {
      return res.status(403).json({ error: `Forbidden — requires: ${roles.join(' or ')}` });
    }
    next();
  };
}

function generateToken(userId) {
  return jwt.sign(
    { userId },
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { authenticate, authorize, generateToken };
