const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/departments', require('./departmentRoutes'));
router.use('/doctors', require('./doctorRoutes'));
router.use('/patients', require('./patientRoutes'));
router.use('/appointments', require('./appointmentRoutes'));
router.use('/medical-records', require('./medicalRecordRoutes'));
router.use('/bills', require('./billRoutes'));
router.use('/medicines', require('./medicineRoutes'));
router.use('/prescriptions', require('./prescriptionRoutes'));
router.use('/reports', require('./reportRoutes'));

module.exports = router;
