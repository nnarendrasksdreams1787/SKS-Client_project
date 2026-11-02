
import React, { useState } from "react";
import "../../CSS/Auth.css";
import { Link } from "react-router-dom"
import { AUTH_API_URL } from "../../Config/api";

const API_URL = "http://localhost:4010/api/auth";
// const API_URL = "AUTH_API_URL/api/auth";

export default function Login() {
  const [referenceId, setReferenceId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        reference_id: referenceId.trim(),
        password,
      });

      const data = await response.data;

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      sessionStorage.setItem("authToken", data.token);
      alert(`Welcome back, ${data.user.full_name}! Login successful.`);

      // Add dashboard navigation here when ready.
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        (err.response
          ? "Login failed. Please check your credentials."
          : "Cannot connect to the backend. Check that your server is running on port 4010.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sks-auth-page">
      <section className="sks-auth-layout">

        <section className="sks-auth-main">
          <div className="sks-auth-card sks-login-card">
            <span className="sks-eyebrow">WELCOME BACK</span>
            <div className="up-links">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>


            <h2>Sign in to SKS Dream</h2>
            <p className="sks-form-subtitle">
              Login to continue your learning journey.
            </p>

            <form onSubmit={handleLogin}>
              <div className="sks-form-field">
                <label htmlFor="login-reference">REFERENCE ID</label>
                <input
                  id="login-reference"
                  type="text"
                  placeholder="Enter your reference ID"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
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

              <p className="sks-switch-text">
                New to SKS Dream?{" "}
                <a href="/register">Create an account</a>
              </p>
            </form>
          </div>
        </section>

      </section>
    </main>
  );
}
