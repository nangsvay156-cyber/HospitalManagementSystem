const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('admin', 'doctor', 'pharmacist'), ctrl.list);
router.get('/:id', authorize('admin', 'doctor', 'pharmacist'), ctrl.getById);
router.post('/', authorize('admin', 'doctor'), ctrl.create);
router.post('/:id/dispense', authorize('admin', 'pharmacist'), ctrl.dispense);
router.put('/:id', authorize('admin', 'doctor'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
