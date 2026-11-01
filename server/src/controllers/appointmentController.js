const { Appointment, Patient, Doctor } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const includeAssoc = [
  { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'phone'] },
  { model: Doctor, as: 'doctor', attributes: ['id', 'full_name', 'specialization'] }
];

const base = buildCrudController(Appointment, { include: includeAssoc });

// POST /api/appointments - overrides base.create to prevent double-booking the same doctor/slot
const create = asyncHandler(async (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;

  const conflict = await Appointment.findOne({
    where: {
      doctor_id,
      appointment_date,
      appointment_time,
      status: { [Op.in]: ['pending', 'confirmed'] }
    }
  });

  if (conflict) {
    return res.status(409).json({ error: 'This doctor already has an appointment at that date/time' });
  }

  const appointment = await Appointment.create(req.body);
  res.status(201).json(appointment);
});

// PATCH /api/appointments/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
  }

  const appointment = await Appointment.findByPk(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  appointment.status = status;
  await appointment.save();
  res.json(appointment);
});

module.exports = { ...base, create, updateStatus };
