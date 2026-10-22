import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminProjects } from './admin/AdminProjects';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AuthProvider } from './admin/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Portfolio Route */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
