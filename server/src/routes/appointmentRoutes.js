const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authorize('admin', 'receptionist'), ctrl.create);
router.put('/:id', authorize('admin', 'receptionist'), ctrl.update);
router.patch('/:id/status', authorize('admin', 'receptionist', 'doctor'), ctrl.updateStatus);
router.delete('/:id', authorize('admin', 'receptionist'), ctrl.remove);

module.exports = router;
