const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bill = sequelize.define('Bill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  medicine_charges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  lab_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  other_charges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  paid_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'insurance', 'online'),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid'),
    allowNull: false,
    defaultValue: 'unpaid'
  }
}, {
  tableName: 'bills',
  hooks: {
    beforeSave: (bill) => {
      bill.total_amount = (
        parseFloat(bill.consultation_fee) +
        parseFloat(bill.medicine_charges) +
        parseFloat(bill.lab_fee) +
        parseFloat(bill.other_charges)
      ).toFixed(2);
      bill.balance = (parseFloat(bill.total_amount) - parseFloat(bill.paid_amount)).toFixed(2);
      if (parseFloat(bill.balance) <= 0) bill.payment_status = 'paid';
      else if (parseFloat(bill.paid_amount) > 0) bill.payment_status = 'partial';
      else bill.payment_status = 'unpaid';
    }
  }
});

module.exports = Bill;
