
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { SECRET } = require('../middleware/auth');

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return err(res, 'Username and password required');
  const u = db._users.find(u => u.username === username);
  if (!u || !bcrypt.compareSync(password, u.password)) return err(res, 'Invalid credentials', 401);
  const token = jwt.sign({ id: u.id, username: u.username, role: u.role }, SECRET, { expiresIn: '8h' });
  const { password: _, ...safe } = u;
  ok(res, { token, user: safe });
};

exports.me = (req, res) => {
  const { password: _, ...safe } = req.user;
  ok(res, safe);
};
