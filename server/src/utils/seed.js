require('dotenv').config();
const {
  sequelize, Department, Doctor, Patient, Appointment,
  MedicalRecord, Bill, Medicine, Prescription, User
} = require('../models');

async function seed() {
  await sequelize.sync({ force: true }); // WARNING: drops and recreates all tables
  console.log('Tables recreated.');

  const cardiology = await Department.create({ name: 'Cardiology', description: 'Heart care' });
  const pediatrics = await Department.create({ name: 'Pediatrics', description: 'Child care' });

  const drSmith = await Doctor.create({
    full_name: 'Dr. Alice Smith',
    specialization: 'Cardiologist',
    department_id: cardiology.id,
    phone: '555-0101',
    email: 'alice.smith@hospital.com',
    consultation_fee: 120.0,
    working_schedule: 'Mon-Fri 09:00-17:00'
  });

  const drJones = await Doctor.create({
    full_name: 'Dr. Ben Jones',
    specialization: 'Pediatrician',
    department_id: pediatrics.id,
    phone: '555-0102',
    email: 'ben.jones@hospital.com',
    consultation_fee: 90.0,
    working_schedule: 'Mon-Sat 08:00-14:00'
  });

  await cardiology.update({ head_doctor_id: drSmith.id });

  const patient1 = await Patient.create({
    full_name: 'John Doe',
    gender: 'male',
    date_of_birth: '1985-04-12',
    phone: '555-0201',
    address: '12 Elm Street',
    blood_group: 'O+',
    emergency_contact: '555-0999'
  });

  const patient2 = await Patient.create({
    full_name: 'Mary Poppins',
    gender: 'female',
    date_of_birth: '1990-09-30',
    phone: '555-0202',
    address: '34 Oak Avenue',
    blood_group: 'A-',
    emergency_contact: '555-0998'
  });

  const appt1 = await Appointment.create({
    patient_id: patient1.id,
    doctor_id: drSmith.id,
    appointment_date: '2026-07-05',
    appointment_time: '10:00:00',
    status: 'confirmed',
    reason: 'Chest pain follow-up'
  });

  const record1 = await MedicalRecord.create({
    patient_id: patient1.id,
    doctor_id: drSmith.id,
    appointment_id: appt1.id,
    diagnosis: 'Mild hypertension',
    symptoms: 'Occasional chest tightness',
    treatment: 'Lifestyle changes, medication',
    visit_date: '2026-07-05'
  });

  const amlodipine = await Medicine.create({
    name: 'Amlodipine 5mg',
    category: 'Antihypertensive',
    price: 8.5,
    stock_quantity: 200,
    expiry_date: '2027-12-31',
    supplier: 'PharmaCo',
    low_stock_threshold: 20
  });

  await Medicine.create({
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    price: 2.0,
    stock_quantity: 15,
    expiry_date: '2026-08-15',
    supplier: 'PharmaCo',
    low_stock_threshold: 20
  });

  await Prescription.create({
    medical_record_id: record1.id,
    medicine_id: amlodipine.id,
    dosage: '5mg once daily',
    quantity: 30
  });

  await Bill.create({
    patient_id: patient1.id,
    appointment_id: appt1.id,
    consultation_fee: 120.0,
    medicine_charges: 25.5,
    lab_fee: 40.0,
    other_charges: 0,
    paid_amount: 100.0,
    payment_method: 'card'
  });

  const adminPassword = await User.hashPassword('Admin@123');
  await User.create({
    username: 'admin',
    email: 'admin@hospital.com',
    password_hash: adminPassword,
    role: 'admin'
  });

  const doctorPassword = await User.hashPassword('Doctor@123');
  await User.create({
    username: 'dr.smith',
    email: 'alice.smith.login@hospital.com',
    password_hash: doctorPassword,
    role: 'doctor',
    linked_id: drSmith.id
  });

  console.log('Seed complete.');
  console.log('Login with username: admin / password: Admin@123');
  console.log('Login with username: dr.smith / password: Doctor@123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
