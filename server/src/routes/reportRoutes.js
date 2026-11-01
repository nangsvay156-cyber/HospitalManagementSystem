const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin', 'accountant'));

router.get('/dashboard', ctrl.dashboard);
router.get('/revenue', ctrl.revenue);
router.get('/department-stats', ctrl.departmentStats);
router.get('/doctor-performance', ctrl.doctorPerformance);

module.exports = router;
