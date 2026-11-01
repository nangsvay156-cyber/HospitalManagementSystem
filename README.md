# Hospital Management System (HMS)

A full-stack Hospital Management System designed to automate healthcare workflows, patient records, doctor schedules, pharmacy inventory, and medical billing.

## 🚀 Features

- **Patient Management:** Medical history, consultation records, and digital registration
- **Doctor & Staff Portal:** Specialization details, duty rotas, and appointment logs
- **Appointment Scheduling:** Real-time doctor availability and online booking
- **Pharmacy & Inventory:** Digital prescription integration and automatic low-stock alerts
- **Billing & Diagnostics:** Automated itemized invoicing and lab test report storage
- **Role-Based Access Control (RBAC):** Distinct access levels for Admin, Doctor, Pharmacist, and Patient

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Caching & Sessions:** Redis
- **Security:** JSON Web Tokens (JWT) and bcrypt

## 📁 Repository Structure

```
HospitalManagementSystem/
├── client/              # Frontend application (React / Vite)
├── server/              # Node.js Express backend API
│   ├── config/          # MySQL and Redis connection setups
│   ├── controllers/     # Business logic (Patients, Doctors, Auth)
│   ├── routes/          # Express API endpoints
│   └── middleware/      # JWT authentication and RBAC permissions
└── README.md
```

## 🧰 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- Redis Server

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nangsvay156-cyber/HospitalManagementSystem.git
   cd HospitalManagementSystem
   ```

2. **Install backend dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables.** Create a `.env` file inside the `server/` folder:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=hospital_db
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Create the database.** Open MySQL and run:

   ```sql
   CREATE DATABASE hospital_db;
   ```

5. **Start the backend server:**

   ```bash
   npm run dev
   ```

6. **Start the frontend** (in a second terminal):

   ```bash
   cd client
   npm install
   npm run dev
   ```

> Never upload your `.env` file to GitHub. Add `.env` and `node_modules/` to `.gitignore`.

## 📄 License

This project is open-source and available under the MIT License.
