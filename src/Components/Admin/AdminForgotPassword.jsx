import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "./AdminCSS/AdminForgotPassword.css";

export default function AdminForgotPassword() {
   const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Frontend preview only. No email is actually sent.
    setSubmitted(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
  };

  return (
    <main className="admin-forgot-password">
      <section className="forgot-password-card">
        <div className="forgot-password-brand">
          <div className="forgot-password-brand-mark">S</div>
          <span>SKS <strong>Dream</strong></span>
        </div>

        {!submitted ? (
          <>
            <div className="forgot-password-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15" r="1" />
                <path d="M12 16v2" />
              </svg>
            </div>

            <div className="forgot-password-heading">
              <h1>Forgot Password?</h1>
              <p>
                No worries! Enter the email address associated with your
                account and we'll help you reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="forgot-password-email">
                Email Address
              </label>

              <div
                className={`forgot-password-input-wrap ${
                  error ? "forgot-password-input-error" : ""
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="forgot-password-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={handleEmailChange}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "forgot-password-error" : undefined}
                />
              </div>

              {error && (
                <p
                  className="forgot-password-error"
                  id="forgot-password-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button type="submit" className="forgot-password-submit">
                Send Reset Instructions
                <span aria-hidden="true">→</span>
              </button>
            </form>

            <Link to="/admin/login" className="forgot-password-back">
              <span aria-hidden="true">←</span>
              Back to Login
            </Link>
          </>
        ) : (
          <div className="forgot-password-success" role="status">
            <div className="forgot-password-success-icon">✓</div>
            <h1>Request Validated</h1>
            <p>
              Your email address passed the frontend validation. The actual
              password-reset email feature will be available after backend
              integration.
            </p>

            <div className="forgot-password-email-preview">
              <span>Email entered</span>
              <strong>{email.trim()}</strong>
            </div>

            <button
              type="button"
              className="forgot-password-submit"
              onClick={() => {
                setSubmitted(false);
                setError("");
              }}
            >
              Try Another Email
            </button>

            <Link to="/admin/login" className="forgot-password-back">
              <span aria-hidden="true">←</span>
              Back to Login
            </Link>
          </div>
        )}

        <div className="forgot-password-footer">
          SKS Dream Admin Panel
        </div>
      </section>
    </main>
  );
}