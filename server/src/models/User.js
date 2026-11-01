const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'receptionist', 'pharmacist', 'accountant'),
    allowNull: false,
    defaultValue: 'receptionist'
  },
  linked_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'FK to doctors.id when role = doctor; null otherwise'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'users'
});

User.prototype.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password_hash);
};

User.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

module.exports = User;
