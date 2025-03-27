// Navbar.tsx
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Set authenticated state to false
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-spacer"></div> {/* Spacer to push logout button to the right */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Navbar;