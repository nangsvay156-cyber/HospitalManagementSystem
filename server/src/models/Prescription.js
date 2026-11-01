const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  medical_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  medicine_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. 500mg twice daily'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  dispensed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'prescriptions'
});

module.exports = Prescription;
