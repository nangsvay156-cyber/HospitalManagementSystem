-- =====================================================================
-- Hospital Management System — Database Schema (MySQL 8+)
-- Matches the Sequelize models in the hms-backend project.
-- Run this against an empty database, e.g.:
--   CREATE DATABASE hms_db;
--   USE hms_db;
--   SOURCE hms_schema.sql;
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS departments;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- departments
-- head_doctor_id is added via ALTER after doctors exists (circular FK)
-- ---------------------------------------------------------------------
CREATE TABLE departments (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL UNIQUE,
  description      TEXT NULL,
  head_doctor_id   INT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- doctors
-- ---------------------------------------------------------------------
CREATE TABLE doctors (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  full_name           VARCHAR(255) NOT NULL,
  specialization      VARCHAR(255) NOT NULL,
  department_id       INT NULL,
  phone               VARCHAR(50) NULL,
  email               VARCHAR(255) NULL UNIQUE,
  consultation_fee    DECIMAL(10,2) NOT NULL DEFAULT 0,
  working_schedule    VARCHAR(255) NULL COMMENT 'e.g. Mon-Fri 9:00-17:00',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctors_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Now the circular FK on departments can be added
ALTER TABLE departments
  ADD CONSTRAINT fk_departments_head_doctor
    FOREIGN KEY (head_doctor_id) REFERENCES doctors(id)
    ON UPDATE CASCADE ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- patients
-- ---------------------------------------------------------------------
CREATE TABLE patients (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  full_name           VARCHAR(255) NOT NULL,
  gender              ENUM('male','female','other') NOT NULL,
  date_of_birth       DATE NOT NULL,
  phone               VARCHAR(50) NOT NULL,
  address             VARCHAR(255) NULL,
  blood_group         VARCHAR(10) NULL,
  emergency_contact   VARCHAR(50) NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- users (login accounts: admin, doctor, receptionist, pharmacist, accountant)
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(100) NOT NULL UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('admin','doctor','receptionist','pharmacist','accountant') NOT NULL DEFAULT 'receptionist',
  linked_id       INT NULL COMMENT 'FK to doctors.id when role = doctor; null otherwise',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_doctor
    FOREIGN KEY (linked_id) REFERENCES doctors(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- appointments
-- ---------------------------------------------------------------------
CREATE TABLE appointments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  patient_id          INT NOT NULL,
  doctor_id           INT NOT NULL,
  appointment_date    DATE NOT NULL,
  appointment_time    TIME NOT NULL,
  status              ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  reason              VARCHAR(255) NULL,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_appointments_doctor_slot (doctor_id, appointment_date, appointment_time)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- medical_records
-- ---------------------------------------------------------------------
CREATE TABLE medical_records (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  patient_id        INT NOT NULL,
  doctor_id         INT NOT NULL,
  appointment_id    INT NULL,
  diagnosis         VARCHAR(255) NULL,
  symptoms          TEXT NULL,
  treatment         TEXT NULL,
  notes             TEXT NULL,
  allergies         VARCHAR(255) NULL,
  visit_date        DATE NOT NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_medrec_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_medrec_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_medrec_appointment
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- bills
-- ---------------------------------------------------------------------
CREATE TABLE bills (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  patient_id          INT NOT NULL,
  appointment_id      INT NULL,
  consultation_fee    DECIMAL(10,2) NOT NULL DEFAULT 0,
  medicine_charges    DECIMAL(10,2) NOT NULL DEFAULT 0,
  lab_fee             DECIMAL(10,2) NOT NULL DEFAULT 0,
  other_charges       DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount         DECIMAL(10,2) NOT NULL DEFAULT 0,
  balance             DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method      ENUM('cash','card','insurance','online') NULL,
  payment_status      ENUM('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bills_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_bills_appointment
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- medicines
-- ---------------------------------------------------------------------
CREATE TABLE medicines (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  name                  VARCHAR(255) NOT NULL,
  category              VARCHAR(100) NULL,
  price                 DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity        INT NOT NULL DEFAULT 0,
  expiry_date           DATE NULL,
  supplier              VARCHAR(255) NULL,
  low_stock_threshold   INT NOT NULL DEFAULT 10,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- prescriptions (join table: medical_records <-> medicines)
-- ---------------------------------------------------------------------
CREATE TABLE prescriptions (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  medical_record_id   INT NOT NULL,
  medicine_id         INT NOT NULL,
  dosage              VARCHAR(255) NULL COMMENT 'e.g. 500mg twice daily',
  quantity            INT NOT NULL DEFAULT 1,
  dispensed           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prescriptions_medrec
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_prescriptions_medicine
    FOREIGN KEY (medicine_id) REFERENCES medicines(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================================
-- Done. Table creation order handles all foreign key dependencies:
-- departments -> doctors -> (departments.head_doctor_id patched in) ->
-- patients -> users -> appointments -> medical_records -> bills ->
-- medicines -> prescriptions
-- =====================================================================