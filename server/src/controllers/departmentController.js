const { Department, Doctor } = require('../models');
const buildCrudController = require('../utils/crudFactory');

module.exports = buildCrudController(Department, {
  include: [
    { model: Doctor, as: 'doctors', attributes: ['id', 'full_name', 'specialization'] },
    { model: Doctor, as: 'headDoctor', attributes: ['id', 'full_name'] }
  ]
});
