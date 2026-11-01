const jwt = require('jsonwebtoken');
const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/register  (admin-only in practice, see routes)
const register = asyncHandler(async (req, res) => {
  const { username, email, password, role, linked_id } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }

  const password_hash = await User.hashPassword(password);
  const user = await User.create({ username, email, password_hash, role, linked_id });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = await User.findOne({ where: { username } });
  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, linked_id: user.linked_id }
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password_hash'] } });
  res.json(user);
});

module.exports = { register, login, me };
