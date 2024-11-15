import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddCarPage from './pages/AddCarPage';
import CarDetailPage from './pages/CarDetailPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/add-car" 
          element={isAuthenticated ? <AddCarPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/cars/:id" 
          element={isAuthenticated ? <CarDetailPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
