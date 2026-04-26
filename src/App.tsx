/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import SubmitProblemPage from './pages/SubmitProblemPage';
import CaseTrackingPage from './pages/CaseTrackingPage';
import FieldOfficerPage from './pages/FieldOfficerPage';
import ExpertDashboard from './pages/ExpertDashboard';
import ExpertResponsePage from './pages/ExpertResponsePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/submit" element={<SubmitProblemPage />} />
          <Route path="/farmer/tracking" element={<CaseTrackingPage />} />
          
          {/* Field Officer Routes */}
          <Route path="/officer" element={<FieldOfficerPage />} />
          
          {/* Expert Routes */}
          <Route path="/expert" element={<ExpertDashboard />} />
          <Route path="/expert/response/:id" element={<ExpertResponsePage />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
