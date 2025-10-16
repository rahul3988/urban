import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UserManagement from './pages/UserManagement';
import VendorManagement from './pages/VendorManagement';
import DriverManagement from './pages/DriverManagement';
import SupportTickets from './pages/SupportTickets';
import FinancialReports from './pages/FinancialReports';
import SystemConfiguration from './pages/SystemConfiguration';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/vendors" element={<VendorManagement />} />
        <Route path="/drivers" element={<DriverManagement />} />
        <Route path="/support" element={<SupportTickets />} />
        <Route path="/financial" element={<FinancialReports />} />
        <Route path="/configuration" element={<SystemConfiguration />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;