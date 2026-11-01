const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/billController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/outstanding', authorize('admin', 'accountant'), ctrl.outstanding);
router.get('/', authorize('admin', 'accountant', 'receptionist'), ctrl.list);
router.get('/:id', authorize('admin', 'accountant', 'receptionist'), ctrl.getById);
router.post('/', authorize('admin', 'accountant', 'receptionist'), ctrl.create);
router.put('/:id', authorize('admin', 'accountant'), ctrl.update);
router.post('/:id/pay', authorize('admin', 'accountant', 'receptionist'), ctrl.recordPayment);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
