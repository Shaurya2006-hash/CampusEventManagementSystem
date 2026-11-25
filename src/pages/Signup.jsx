
import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check password confirmation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            studentId,
            department,
            year
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // Do not automatically log in after registration
      localStorage.removeItem("token");
      localStorage.removeItem("student");

      alert("Registration successful! Please login.");

      // Redirect to Login page
      window.location.href = "/login";

    } catch (error) {
      console.error("Signup Error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create Account</h1>
        <p>Join CampusConnect today!</p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Student ID</label>
          <input
            type="text"
            placeholder="Enter your student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />

          <label>Department</label>
          <input
            type="text"
            placeholder="Enter your department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <label>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          >
            <option value="">Select your year</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Create Account
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

        <Link to="/" className="back-home">
          Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Signup;
