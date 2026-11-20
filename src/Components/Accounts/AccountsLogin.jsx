
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/Account/AccountsPanel.css";

const API_BASE = (
  import.meta.env.VITE_API_URL 
).replace(/\/$/, "");

export default function AccountsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/accounts/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Accountant login failed");
      }

      navigate("/accounts/taxes", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7f6",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 32,
          borderRadius: 18,
          boxShadow: "0 12px 35px rgba(7,27,48,.08)",
        }}
      >
        <div style={{ color: "#087568", fontWeight: 700 }}>
          SKS DREAM
        </div>

        <h1 style={{ marginTop: 10, color: "#071b30" }}>
          Accountant Login
        </h1>

        <p style={{ color: "#64748b" }}>
          Sign in to manage accounting settings.
        </p>

        <label
          htmlFor="accounts-email"
          style={{ display: "block", marginTop: 24 }}
        >
          Email
        </label>

        <input
          id="accounts-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            border: "1px solid #cbd5e1",
            borderRadius: 8,
          }}
        />

        <label
          htmlFor="accounts-password"
          style={{ display: "block", marginTop: 18 }}
        >
          Password
        </label>

        <input
          id="accounts-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            border: "1px solid #cbd5e1",
            borderRadius: 8,
          }}
        />

        {error && (
          <p role="alert" style={{ color: "#b42318", marginTop: 16 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 24,
            padding: 13,
            border: 0,
            borderRadius: 9,
            background: "#0d766e",
            color: "#fff",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
