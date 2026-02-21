import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CustomerRouters from './rounters/CustomerRouters';
import AdminRouters from './rounters/AdminRouters';
import { getUser } from './state/auth/Action';

const getRole = (user) => String(user?.role || user?.authorities?.[0]?.authority || "").toUpperCase();

function AdminRoute({ children }) {
  const { jwt, user, isLoading } = useSelector((state) => state.auth);
  const role = getRole(user);

  if (!jwt) return <Navigate to="/login" replace />;
  if (jwt && !user && isLoading) return null;
  if (role === "ADMIN" || role === "ROLE_ADMIN") return children;

  return <Navigate to="/" replace />;
}

function CustomerRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const role = getRole(user);

  if (role === "ADMIN" || role === "ROLE_ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();
  const { jwt, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (jwt && !user) {
      dispatch(getUser());
    }
  }, [jwt, user, dispatch]);

  return (
    <>
      <Routes>
        <Route path='/*' element={<CustomerRoute><CustomerRouters /></CustomerRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminRouters /></AdminRoute>} />
      </Routes>
    </>
  )
}

export default App
