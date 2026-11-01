const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/medicineController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/low-stock', authorize('admin', 'pharmacist'), ctrl.lowStock);
router.get('/expiring', authorize('admin', 'pharmacist'), ctrl.expiringSoon);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', authorize('admin', 'pharmacist'), ctrl.create);
router.put('/:id', authorize('admin', 'pharmacist'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

module.exports = router;
