const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/login', login);
// Only admins can create new staff accounts; the very first admin should be created via the seed script
router.post('/register', authenticate, authorize('admin'), register);
router.get('/me', authenticate, me);

module.exports = router;
