const { Medicine } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { Op, col } = require('sequelize');

const base = buildCrudController(Medicine);

// GET /api/medicines/low-stock
const lowStock = asyncHandler(async (req, res) => {
  const medicines = await Medicine.findAll({
    where: { stock_quantity: { [Op.lte]: col('low_stock_threshold') } },
    order: [['stock_quantity', 'ASC']]
  });
  res.json(medicines);
});

// GET /api/medicines/expiring?days=30
const expiringSoon = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);

  const medicines = await Medicine.findAll({
    where: { expiry_date: { [Op.lte]: cutoff } },
    order: [['expiry_date', 'ASC']]
  });
  res.json(medicines);
});

module.exports = { ...base, lowStock, expiringSoon };
