# Meridian HMS — Frontend

React + Vite frontend for the Hospital Management System backend (`hms-backend`).

## Setup

```bash
npm install
cp .env.example .env
# edit VITE_API_URL if your backend isn't on http://localhost:5000/api
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend is running first (see the
`hms-backend` README) and has been seeded:

```bash
# in hms-backend/
npm run seed
```

Then log in with the seeded demo accounts:

| Username | Password | Role |
|---|---|---|
| admin | Admin@123 | admin |
| dr.smith | Doctor@123 | doctor |

## What's included

- **Login** — JWT auth against `/api/auth/login`, token stored and attached to every
  request automatically (see `src/api/client.js`).
- **Role-aware navigation** — the sidebar and route guards (`src/config/nav.js`,
  `src/components/ProtectedRoute.jsx`) show/hide modules per role, matching the
  backend's permission rules exactly.
- **Dashboard** — live counters and an appointments-by-department chart (admin/accountant).
- **Patients** — registry + full history view (appointments, records, bills for one patient).
- **Doctors / Departments** — directory and org structure, admin-managed.
- **Appointments** — booking with conflict prevention (enforced server-side), plus
  quick complete/cancel actions for doctors.
- **Medical Records** — diagnoses and treatment notes, linked to prescriptions.
- **Billing** — line-item invoices with a "record payment" action that updates
  balance/status live.
- **Pharmacy** — medicine inventory with low-stock highlighting, and a prescription
  dispense action that decrements stock.
- **Reports** — revenue trend and doctor performance (admin/accountant).

## Project structure

```
src/
  api/client.js         Axios instance, attaches JWT, redirects to /login on 401
  context/AuthContext.jsx
  components/
    Layout.jsx           Sidebar + content shell
    ResourcePage.jsx      Generic CRUD table + modal form, reused by most pages
    Modal.jsx, StatusBadge.jsx, ProtectedRoute.jsx
  config/nav.js           Sidebar items and their allowed roles
  hooks/useOptions.js      Fetches a resource list for <select> dropdowns
  pages/                  One file per module (mirrors backend routes 1:1)
```

Most pages are thin configuration on top of `ResourcePage` — columns, form fields,
and which roles can create/edit/delete. Only Dashboard, Billing, Prescriptions,
Appointments, Reports, and PatientHistory have custom logic beyond plain CRUD.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/` — serve with any static host (Vercel, Nginx, etc.),
just make sure `VITE_API_URL` points at your deployed backend.
