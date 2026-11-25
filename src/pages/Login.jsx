
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/students/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            if (!data.token) {
                alert("Login failed: Token not received");
                return;
            }

            localStorage.setItem("token", data.token);

            if (data.student) {
                localStorage.setItem(
                    "student",
                    JSON.stringify(data.student)
                );
            }

            alert("Login successful!");

            if (data.student && data.student.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Welcome Back!</h1>

                <p>
                    Login to your CampusConnect account
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="show-password">

                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) =>
                                setShowPassword(e.target.checked)
                            }
                        />

                        <span>Show Password</span>

                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                    >
                        Login
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?

                    <Link to="/signup">
                        {" "}Sign Up
                    </Link>
                </p>

                <Link to="/signup" className="back-home">
                    Back to Sign Up
                </Link>

            </div>
        </div>
    );
}

export default Login;
