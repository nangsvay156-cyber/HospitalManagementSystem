const sequelize = require('../config/database');

const Department = require('./Department');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Bill = require('./Bill');
const Medicine = require('./Medicine');
const Prescription = require('./Prescription');
const User = require('./User');

// Department <-> Doctor (1:M, department has many doctors)
Department.hasMany(Doctor, { foreignKey: 'department_id', as: 'doctors' });
Doctor.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

// Department -> Doctor (head_doctor_id, 1:1 optional, nullable to avoid insert-order issues)
Department.belongsTo(Doctor, { foreignKey: 'head_doctor_id', as: 'headDoctor', constraints: false });

// Doctor <-> Appointment (1:M)
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

// Patient <-> Appointment (1:M)
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Appointment <-> MedicalRecord (1:1 optional)
Appointment.hasOne(MedicalRecord, { foreignKey: 'appointment_id', as: 'medicalRecord' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// Patient <-> MedicalRecord (1:M)
Patient.hasMany(MedicalRecord, { foreignKey: 'patient_id', as: 'medicalRecords' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Doctor <-> MedicalRecord (1:M)
Doctor.hasMany(MedicalRecord, { foreignKey: 'doctor_id', as: 'medicalRecords' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

// Appointment <-> Bill (1:1 optional)
Appointment.hasOne(Bill, { foreignKey: 'appointment_id', as: 'bill' });
Bill.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

// Patient <-> Bill (1:M)
Patient.hasMany(Bill, { foreignKey: 'patient_id', as: 'bills' });
Bill.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// MedicalRecord <-> Prescription (1:M)
MedicalRecord.hasMany(Prescription, { foreignKey: 'medical_record_id', as: 'prescriptions' });
Prescription.belongsTo(MedicalRecord, { foreignKey: 'medical_record_id', as: 'medicalRecord' });

// Medicine <-> Prescription (1:M)
Medicine.hasMany(Prescription, { foreignKey: 'medicine_id', as: 'prescriptions' });
Prescription.belongsTo(Medicine, { foreignKey: 'medicine_id', as: 'medicine' });

// User <-> Doctor (1:1 optional, when role = doctor)
User.belongsTo(Doctor, { foreignKey: 'linked_id', as: 'doctorProfile', constraints: false });

module.exports = {
  sequelize,
  Department,
  Doctor,
  Patient,
  Appointment,
  MedicalRecord,
  Bill,
  Medicine,
  Prescription,
  User
};
