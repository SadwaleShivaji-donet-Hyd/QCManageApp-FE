import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // TODO: Enable authentication check when development is complete
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  
  // For development: allow all routes
  return <Outlet />;
};

export default ProtectedRoute;