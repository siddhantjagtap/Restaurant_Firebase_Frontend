// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";

// Remove the onLogout prop since it's no longer needed
const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact-queries" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact Queries
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservations" className={({ isActive }) => (isActive ? "active" : "")}>
              Reservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews" className={({ isActive }) => (isActive ? "active" : "")}>
              Reviews
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;