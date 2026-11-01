const { Bill, Patient, Appointment } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const base = buildCrudController(Bill, {
  include: [
    { model: Patient, as: 'patient', attributes: ['id', 'full_name'] },
    { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date'] }
  ]
});

// POST /api/bills/:id/pay - record a payment against a bill (partial or full)
const recordPayment = asyncHandler(async (req, res) => {
  const { amount, payment_method } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  const bill = await Bill.findByPk(req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });

  bill.paid_amount = parseFloat(bill.paid_amount) + parseFloat(amount);
  if (payment_method) bill.payment_method = payment_method;
  await bill.save(); // beforeSave hook recalculates balance + payment_status

  res.json(bill);
});

// GET /api/bills/outstanding - list unpaid/partial bills
const outstanding = asyncHandler(async (req, res) => {
  const bills = await Bill.findAll({
    where: { payment_status: ['unpaid', 'partial'] },
    include: [{ model: Patient, as: 'patient', attributes: ['id', 'full_name', 'phone'] }],
    order: [['created_at', 'ASC']]
  });
  res.json(bills);
});

module.exports = { ...base, recordPayment, outstanding };
