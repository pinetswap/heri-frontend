
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Team from './pages/Team';
import VIP from './pages/VIP';
import Me from './pages/Me';
import Recharge from './pages/Recharge';
import Withdraw from './pages/Withdraw';
import ChangePassword from './pages/ChangePassword';

import SelectCurrency from './pages/SelectCurrency';

import Login from './pages/Login';
import Signup from './pages/Signup';

import { UserProvider } from './context/UserContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protect all routes within the Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="team" element={<Team />} />
          <Route path="vip" element={<VIP />} />
          <Route path="me" element={<Me />} />
          <Route path="select-currency" element={<SelectCurrency />} />
          <Route path="recharge" element={<Recharge />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
