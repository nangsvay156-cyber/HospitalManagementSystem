const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('admin', 'doctor'), ctrl.list);
router.get('/:id', authorize('admin', 'doctor'), ctrl.getById);
router.post('/', authorize('admin', 'doctor'), ctrl.create);
router.put('/:id', authorize('admin', 'doctor'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
