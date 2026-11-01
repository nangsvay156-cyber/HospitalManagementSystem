const { Doctor, Department, Appointment, Patient } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const base = buildCrudController(Doctor, {
  include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }]
});

// GET /api/doctors/:id/schedule?date=YYYY-MM-DD
const getSchedule = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const where = { doctor_id: req.params.id };
  if (date) where.appointment_date = date;

  const appointments = await Appointment.findAll({
    where,
    include: [{ model: Patient, as: 'patient', attributes: ['id', 'full_name', 'phone'] }],
    order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
  });

  res.json(appointments);
});

module.exports = { ...base, getSchedule };
