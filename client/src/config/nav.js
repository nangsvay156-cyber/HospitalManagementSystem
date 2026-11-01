import {
  LayoutDashboard, Users, Stethoscope, Building2, CalendarClock,
  ClipboardList, Receipt, Pill, FlaskConical, BarChart3
} from 'lucide-react';

// Each item's `roles` array controls sidebar visibility per logged-in user role.
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'accountant'] },
  { to: '/patients', label: 'Patients', icon: Users, roles: ['admin', 'doctor', 'receptionist', 'accountant'] },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, roles: ['admin', 'doctor', 'receptionist', 'accountant', 'pharmacist'] },
  { to: '/departments', label: 'Departments', icon: Building2, roles: ['admin', 'doctor', 'receptionist', 'accountant', 'pharmacist'] },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock, roles: ['admin', 'doctor', 'receptionist', 'accountant', 'pharmacist'] },
  { to: '/medical-records', label: 'Medical Records', icon: ClipboardList, roles: ['admin', 'doctor'] },
  { to: '/billing', label: 'Billing', icon: Receipt, roles: ['admin', 'accountant', 'receptionist'] },
  { to: '/medicines', label: 'Pharmacy', icon: Pill, roles: ['admin', 'pharmacist', 'doctor', 'receptionist', 'accountant'] },
  { to: '/prescriptions', label: 'Prescriptions', icon: FlaskConical, roles: ['admin', 'doctor', 'pharmacist'] },
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'accountant'] },
];
