import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ContactQueries from "./components/ContactQueries";
import Reservations from "./components/Reservations";
import Reviews from "./components/Reviews";
import Sidebar from "./components/Sidebar";
import "./App.css";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}
        <div className="main-content">
          <Routes>
            {/* Redirect to login if not authenticated */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/contact-queries"
              element={
                isAuthenticated ? <ContactQueries /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/reservations"
              element={
                isAuthenticated ? <Reservations /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/reviews"
              element={
                isAuthenticated ? <Reviews /> : <Navigate to="/login" />
              }
            />
            {/* Default route */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;