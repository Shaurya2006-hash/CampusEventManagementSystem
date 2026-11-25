
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    window.location.href = "/login";
};
  return (

    <nav className="navbar">

      <div className="logo">
        🎓 CampusConnect
      </div>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#events">Events</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-buttons">

        <Link to="/student" className="dashboard-btn">
          Student Dashboard
        </Link>
    <Link to="/admin" className="admin-btn">
  Admin Dashboard
</Link>
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
    <button onClick={handleLogout}>
    Logout
</button>
      </div>

    </nav>

  );

}

export default Navbar;
