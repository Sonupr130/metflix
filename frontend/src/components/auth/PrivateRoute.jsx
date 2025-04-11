import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authStore from '../../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated, loading, checkAuth } = authStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;