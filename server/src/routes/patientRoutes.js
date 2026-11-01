const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('admin', 'doctor', 'receptionist', 'accountant'), ctrl.list);
router.get('/:id', authorize('admin', 'doctor', 'receptionist', 'accountant'), ctrl.getById);
router.get('/:id/history', authorize('admin', 'doctor'), ctrl.getHistory);
router.post('/', authorize('admin', 'receptionist'), ctrl.create);
router.put('/:id', authorize('admin', 'receptionist'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
