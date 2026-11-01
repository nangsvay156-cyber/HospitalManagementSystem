const { Patient, Appointment, MedicalRecord, Bill, Doctor } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const base = buildCrudController(Patient);

// GET /api/patients/:id/history - full patient record: appointments, diagnoses, bills
const getHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id, {
    include: [
      {
        model: Appointment,
        as: 'appointments',
        include: [{ model: Doctor, as: 'doctor', attributes: ['id', 'full_name', 'specialization'] }]
      },
      {
        model: MedicalRecord,
        as: 'medicalRecords',
        include: [{ model: Doctor, as: 'doctor', attributes: ['id', 'full_name'] }]
      },
      { model: Bill, as: 'bills' }
    ]
  });

  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

module.exports = { ...base, getHistory };
