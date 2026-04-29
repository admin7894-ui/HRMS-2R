
const jwt = require('jsonwebtoken');
const { db } = require('../seed/store');
const SECRET = process.env.JWT_SECRET || 'hrms_v3_2024';

const auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const p = jwt.verify(h.slice(7), SECRET);
    const u = db._users.find(u => u.id === p.id);
    if (!u) return res.status(401).json({ success: false, message: 'Invalid token' });
    req.user = u;
    next();
  } catch { res.status(401).json({ success: false, message: 'Token expired' }); }
};
module.exports = { auth, SECRET };
