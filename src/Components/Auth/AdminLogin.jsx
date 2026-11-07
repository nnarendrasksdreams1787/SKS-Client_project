
import React, { useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom"
import "../../CSS/Auth.css";

const API_URL = "http://localhost:4000/api/admin" || "https://sks-serverproject-new.onrender.com/api/admin";

export default function AdminLogin() {
//   const [referenceId, setReferenceId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim().toLowerCase(),
        password,
      },
    {
        withCredentials: true,
    });

    if (response.status === 200){
        navigate("/admin/dashboard", {replace: true});
    }

      // Add dashboard navigation here when ready.
    } catch (err) {
      console.error("Admin login failed:", err.message);

      setError(
        err.response?.data?.message ||
        "Unable to log in. Please check your credentials or server connection."
      )

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sks-auth-page">
      <section className="sks-auth-layout">

        <section className="sks-auth-main">
          <div className="sks-auth-card sks-login-card">
            <span className="sks-eyebrow">ADMIN PORTAL</span>
            {/* <div className="up-links">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div> */}


            <h2>Sign in to SKS Dream Admin</h2>
            <p className="sks-form-subtitle">
              Login to continue your learning journey.
            </p>

            <form onSubmit={handleLogin}>
              <div className="sks-form-field">
                <label htmlFor="admin-email">ADMIN EMAIL</label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="sks-form-field sks-login-password">
                <label htmlFor="login-password">PASSWORD</label>

                <div className="sks-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="sks-forgot-row">
                <a href="/forgot-password">Forgot password?</a>
              </div>

              {error && (
                <p className="sks-auth-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="sks-submit-btn"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Login"}
                {!loading && <span>→</span>}
              </button>

              {/* <p className="sks-switch-text">
                New to SKS Dream?{" "}
                <a href="/register">Create an account</a>
              </p> */}
            </form>
          </div>
        </section>

      </section>
    </main>
  );
}
