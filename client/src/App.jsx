import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreateRTI from './pages/CreateRTI';
import ViewRTI from './pages/ViewRTI';
import OfficialDashboard from './pages/OfficialDashboard';
import RespondRTI from './pages/RespondRTI';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-rti" element={<ProtectedRoute><CreateRTI /></ProtectedRoute>} />
        <Route path="/rti/:id" element={<ProtectedRoute><ViewRTI /></ProtectedRoute>} />

        {/* Official Routes */}
        <Route path="/official/dashboard" element={<ProtectedRoute><OfficialDashboard /></ProtectedRoute>} />
        <Route path="/official/respond/:id" element={<ProtectedRoute><RespondRTI /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
