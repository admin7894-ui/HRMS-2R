
const express = require('express');
const ctrl = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const r = express.Router();
r.post('/login', ctrl.login);
r.get('/me', auth, ctrl.me);
module.exports = r;
