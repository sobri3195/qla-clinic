import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { LoginPage } from '@/pages/login-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { PatientsPage } from '@/pages/patients-page';
import { PatientDetailPage } from '@/pages/patient-detail-page';
import { PatientFormPage } from '@/pages/patient-form-page';
import { AppointmentsPage } from '@/pages/appointments-page';
import { QueuePage } from '@/pages/queue-page';
import { ConsultationPage } from '@/pages/consultation-page';
import { MedicalRecordsPage } from '@/pages/medical-records-page';
import { TreatmentsPage } from '@/pages/treatments-page';
import { ProductsPage } from '@/pages/products-page';
import { CashierPage } from '@/pages/cashier-page';
import { InvoicePage } from '@/pages/invoice-page';
import { ReportsPage } from '@/pages/reports-page';
import { StaffPage } from '@/pages/staff-page';
import { SettingsPage } from '@/pages/settings-page';
import { useAppStore } from '@/store/app-store';

function ProtectedRoutes() {
  const currentUser = useAppStore((state) => state.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/new" element={<PatientFormPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/patients/:id/edit" element={<PatientFormPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/medical-records" element={<MedicalRecordsPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cashier" element={<CashierPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
