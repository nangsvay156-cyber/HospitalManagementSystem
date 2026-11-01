# Hospital Management System — Backend API

Node.js + Express + Sequelize (MySQL) REST API implementing all modules from the HMS spec:
Departments, Doctors, Patients, Appointments, Medical Records, Billing, Pharmacy (Medicines +
Prescriptions), Reports, and JWT-based auth with role-based access control.

## 1. Prerequisites

- Node.js 18+
- MySQL 8+ (running locally or remotely)

## 2. Setup

```bash
npm install
cp .env.example .env
# edit .env with your MySQL credentials and a real JWT_SECRET
```

Create the database (Sequelize will create tables for you, but the database itself must exist):

```sql
CREATE DATABASE hms_db;
```

## 3. Seed sample data (optional but recommended)

This drops and recreates all tables, then inserts sample departments, doctors, patients,
an appointment, a medical record, a prescription, a bill, and two login accounts:

```bash
npm run seed
```

Seeded logins:
| Username | Password | Role |
|---|---|---|
| admin | Admin@123 | admin |
| dr.smith | Doctor@123 | doctor |

## 4. Run

```bash
npm run dev     # with nodemon, auto-restart
npm start        # plain node
```

Server starts on `http://localhost:5000` (or `PORT` from `.env`). On boot it runs
`sequelize.sync({ alter: true })`, which keeps tables in sync with the models — fine for
development, but swap for real migrations before production use.

## 5. Authentication

All routes except `/api/auth/login` require a Bearer token:

```
Authorization: Bearer <token>
```

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

Response includes a `token` — pass it on subsequent requests. Roles: `admin`, `doctor`,
`receptionist`, `pharmacist`, `accountant`. Each route restricts which roles may call it
(see `src/routes/*.js`).

## 6. API reference

### Auth
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/login | public |
| POST | /api/auth/register | admin |
| GET | /api/auth/me | authenticated |

### Departments
| Method | Route | Access |
|---|---|---|
| GET | /api/departments | any authenticated |
| GET | /api/departments/:id | any authenticated |
| POST | /api/departments | admin |
| PUT | /api/departments/:id | admin |
| DELETE | /api/departments/:id | admin |

### Doctors
| Method | Route | Access |
|---|---|---|
| GET | /api/doctors | any authenticated |
| GET | /api/doctors/:id | any authenticated |
| GET | /api/doctors/:id/schedule?date=YYYY-MM-DD | any authenticated |
| POST / PUT / DELETE | /api/doctors[/:id] | admin |

### Patients
| Method | Route | Access |
|---|---|---|
| GET | /api/patients | admin, doctor, receptionist, accountant |
| GET | /api/patients/:id/history | admin, doctor |
| POST / PUT | /api/patients[/:id] | admin, receptionist |
| DELETE | /api/patients/:id | admin |

### Appointments
| Method | Route | Access |
|---|---|---|
| GET | /api/appointments | any authenticated |
| POST | /api/appointments | admin, receptionist (rejects double-booked doctor/slot) |
| PATCH | /api/appointments/:id/status | admin, receptionist, doctor |
| DELETE | /api/appointments/:id | admin, receptionist |

### Medical records
| Method | Route | Access |
|---|---|---|
| GET / POST / PUT | /api/medical-records[/:id] | admin, doctor |
| DELETE | /api/medical-records/:id | admin |

### Billing
| Method | Route | Access |
|---|---|---|
| GET | /api/bills/outstanding | admin, accountant |
| GET / POST | /api/bills[/:id] | admin, accountant, receptionist |
| POST | /api/bills/:id/pay | admin, accountant, receptionist |
| DELETE | /api/bills/:id | admin |

### Pharmacy
| Method | Route | Access |
|---|---|---|
| GET | /api/medicines/low-stock | admin, pharmacist |
| GET | /api/medicines/expiring?days=30 | admin, pharmacist |
| GET / POST / PUT | /api/medicines[/:id] | any authenticated (write: admin, pharmacist) |
| GET / POST | /api/prescriptions[/:id] | admin, doctor, pharmacist |
| POST | /api/prescriptions/:id/dispense | admin, pharmacist (atomically decrements stock) |

### Reports
| Method | Route | Access |
|---|---|---|
| GET | /api/reports/dashboard | admin, accountant |
| GET | /api/reports/revenue?from=&to= | admin, accountant |
| GET | /api/reports/department-stats | admin, accountant |
| GET | /api/reports/doctor-performance | admin, accountant |

All list endpoints support `?limit=&offset=` pagination and field-based filtering via query
params (e.g. `/api/appointments?status=pending`).

## 7. Project structure

```
src/
  config/database.js      Sequelize connection
  models/                 One file per table + index.js wiring associations
  controllers/             Business logic per module
  routes/                  Express routers, role checks live here
  middleware/auth.js       JWT verification + role-based authorize()
  middleware/errorHandler.js
  utils/crudFactory.js     Generates create/list/get/update/delete for simple entities
  utils/seed.js            Sample data + demo logins
server.js                  Entry point
```

## 8. Notes on design decisions

- **Bill totals are computed server-side** in a Sequelize `beforeSave` hook — clients
  send line items (consultation_fee, medicine_charges, lab_fee, other_charges), the
  API derives `total_amount`, `balance`, and `payment_status`.
- **Prescription dispensing is transactional** — stock decrement and marking dispensed
  happen in a single DB transaction with row locks, so concurrent dispense requests
  can't oversell stock.
- **Appointment booking rejects conflicts** — the same doctor cannot have two
  pending/confirmed appointments at the same date/time.
- **Department ↔ Doctor circular FK** (`head_doctor_id`) is defined with
  `constraints: false` in Sequelize to avoid an insert-order deadlock, matching the
  ERD discussed earlier.
