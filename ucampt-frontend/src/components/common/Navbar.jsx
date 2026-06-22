import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path if needed
import NotificationIcon from "./NotificationIcon";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get data from your global state
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* YOUR LOGO SECTION */}
        <span to="/" className="navbar1stchild" onClick={closeMenu}>
          <img 
            src="src/assets/images/ucamptlogo.jpg" 
            width="50px" 
            height="50px" 
            style={{ borderRadius: "12px", objectFit: "cover" }} 
            alt="ucampt logo" 
          />
          <h2>Ucampt</h2>
        </span>

        {/* HAMBURGER ICON (Visible on Mobile) */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMenuOpen ? "bar open" : "bar"}></span>
        </div>

        {/* NAVIGATION LINKS */}
        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/products" className="nav-link" onClick={closeMenu}>Marketplace</Link>
          </li>

          {/* Cart removed: platform uses off-system contact process */}

          {/* DYNAMIC AUTH LINKS */}
          {user ? (
            <>
              {/* Show Dashboard only if Admin */}
              {user.role === "ADMIN" && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link" onClick={closeMenu}>Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button id="nav-linklogout-btn" className="nav-link logout-btn" onClick={handleLogout} style={{fontSize:"16px", border:"none", background:"#1e3a8a"}}>Logout</button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-link" onClick={closeMenu}>Admin Login</Link>
            </li>
          )}
          {/* Notification Icon */}
          {user && (
            <li className="nav-item">
              <NotificationIcon />
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
}

