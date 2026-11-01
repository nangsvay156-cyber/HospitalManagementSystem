import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';


import Login from './pages/Login';
import Home from './pages/Home';
import Patients from './pages/Patients';
import PatientHistory from './pages/PatientHistory';
import Doctors from './pages/Doctors';
import Departments from './pages/Departments';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Billing from './pages/Billing';
import Medicines from './pages/Medicines';
import Prescriptions from './pages/Prescriptions';
import Reports from './pages/Reports';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<Patients />} />
            <Route
              path="/patients/:id/history"
              element={
                <ProtectedRoute roles={['admin', 'doctor']}>
                  <PatientHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute roles={['admin', 'doctor']}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute roles={['admin', 'accountant', 'receptionist']}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route path="/medicines" element={<Medicines />} />
            <Route
              path="/prescriptions"
              element={
                <ProtectedRoute roles={['admin', 'doctor', 'pharmacist']}>
                  <Prescriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute roles={['admin', 'accountant']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
