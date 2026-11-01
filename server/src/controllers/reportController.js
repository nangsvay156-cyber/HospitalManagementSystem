const { Patient, Doctor, Appointment, Bill, Medicine, Department, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { Op, fn, col, literal } = require('sequelize');

// GET /api/reports/dashboard - top-level counters
const dashboard = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date();
  monthStart.setDate(1);

  const [
    totalPatients,
    totalDoctors,
    todaysAppointments,
    monthlyRevenue,
    lowStockCount
  ] = await Promise.all([
    Patient.count(),
    Doctor.count(),
    Appointment.count({ where: { appointment_date: today } }),
    Bill.sum('paid_amount', { where: { created_at: { [Op.gte]: monthStart } } }),
    Medicine.count({ where: { stock_quantity: { [Op.lte]: col('low_stock_threshold') } } })
  ]);

  res.json({
    total_patients: totalPatients,
    total_doctors: totalDoctors,
    todays_appointments: todaysAppointments,
    monthly_revenue: monthlyRevenue || 0,
    medicine_stock_alerts: lowStockCount
  });
});

// GET /api/reports/revenue?from=YYYY-MM-DD&to=YYYY-MM-DD - revenue grouped by day
const revenue = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const where = {};
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = from;
    if (to) where.created_at[Op.lte] = to;
  }

  const rows = await Bill.findAll({
    where,
    attributes: [
      [fn('DATE', col('created_at')), 'date'],
      [fn('SUM', col('paid_amount')), 'total_paid'],
      [fn('COUNT', col('id')), 'bill_count']
    ],
    group: [literal('DATE(created_at)')],
    order: [[literal('DATE(created_at)'), 'ASC']]
  });

  res.json(rows);
});

// GET /api/reports/department-stats - appointments per department
const departmentStats = asyncHandler(async (req, res) => {
  const [rows] = await sequelize.query(`
    SELECT d.id, d.name AS department, COUNT(a.id) AS appointment_count
    FROM departments d
    LEFT JOIN doctors doc ON doc.department_id = d.id
    LEFT JOIN appointments a ON a.doctor_id = doc.id
    GROUP BY d.id, d.name
    ORDER BY appointment_count DESC
  `);
  res.json(rows);
});

// GET /api/reports/doctor-performance - completed appointments per doctor
const doctorPerformance = asyncHandler(async (req, res) => {
  const rows = await Appointment.findAll({
    where: { status: 'completed' },
    attributes: ['doctor_id', [fn('COUNT', col('Appointment.id')), 'completed_appointments']],
    include: [{ model: Doctor, as: 'doctor', attributes: ['full_name', 'specialization'] }],
    group: ['doctor_id', 'doctor.id'],
    order: [[literal('completed_appointments'), 'DESC']]
  });
  res.json(rows);
});

module.exports = { dashboard, revenue, departmentStats, doctorPerformance };
