const { Prescription, Medicine, MedicalRecord, sequelize } = require('../models');
const buildCrudController = require('../utils/crudFactory');
const asyncHandler = require('../utils/asyncHandler');

const base = buildCrudController(Prescription, {
  include: [
    { model: Medicine, as: 'medicine', attributes: ['id', 'name', 'price', 'stock_quantity'] },
    { model: MedicalRecord, as: 'medicalRecord', attributes: ['id', 'diagnosis'] }
  ]
});

// POST /api/prescriptions/:id/dispense - marks dispensed and decrements pharmacy stock atomically
const dispense = asyncHandler(async (req, res) => {
  const result = await sequelize.transaction(async (t) => {
    const prescription = await Prescription.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!prescription) {
      const err = new Error('Prescription not found');
      err.status = 404;
      throw err;
    }
    if (prescription.dispensed) {
      const err = new Error('Prescription already dispensed');
      err.status = 409;
      throw err;
    }

    const medicine = await Medicine.findByPk(prescription.medicine_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!medicine || medicine.stock_quantity < prescription.quantity) {
      const err = new Error('Insufficient medicine stock to dispense');
      err.status = 400;
      throw err;
    }

    medicine.stock_quantity -= prescription.quantity;
    await medicine.save({ transaction: t });

    prescription.dispensed = true;
    await prescription.save({ transaction: t });

    return prescription;
  });

  res.json(result);
});

module.exports = { ...base, dispense };
