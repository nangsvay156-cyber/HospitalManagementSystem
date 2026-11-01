const { MedicalRecord, Patient, Doctor, Appointment, Prescription, Medicine } = require('../models');
const buildCrudController = require('../utils/crudFactory');

module.exports = buildCrudController(MedicalRecord, {
  include: [
    { model: Patient, as: 'patient', attributes: ['id', 'full_name'] },
    { model: Doctor, as: 'doctor', attributes: ['id', 'full_name'] },
    { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date'] },
    {
      model: Prescription,
      as: 'prescriptions',
      include: [{ model: Medicine, as: 'medicine', attributes: ['id', 'name', 'price'] }]
    }
  ]
});
