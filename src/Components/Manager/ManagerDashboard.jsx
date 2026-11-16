
import React, { useEffect, useState } from "react";
import {
  Users,
  Landmark,
  Wallet,
  Clock3,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import "../../CSS/Manager/ManagerDashboard.css";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const API_URL = `${API_BASE}/api/manager/dashboard`;

export default function ManagerDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard(signal) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        credentials: "include",
        signal,
      });

      if (!response.ok) {
        throw new Error(`Dashboard API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Dashboard loading failed");
      }

      setSummary(data.summary);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to load dashboard");
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    loadDashboard(controller.signal);

    return () => controller.abort();
  }, []);

  const cards = [
    {
      title: "Total Registered Users",
      value: summary?.total_users ?? 0,
      Icon: Users,
      color: "blue",
    },
    {
      title: "Total Bank Accounts",
      value: summary?.total_bank_accounts ?? 0,
      Icon: Landmark,
      color: "green",
    },
    {
      title: "Withdrawal Requests",
      value: summary?.total_withdrawals ?? 0,
      Icon: Wallet,
      color: "purple",
    },
    {
      title: "Pending Withdrawals",
      value: summary?.pending_withdrawals ?? 0,
      Icon: Clock3,
      color: "amber",
    },
  ];

  return (
    <div className="manager-dashboard">
      <div className="md-heading">
        <div>
          <h1>Manager Dashboard</h1>
          <p>Overview of SKS Dream user and financial records.</p>
        </div>

        <button
          type="button"
          className="md-refresh"
          onClick={() => loadDashboard()}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="md-error">{error}</div>
      )}

      {loading ? (
        <div className="md-loading">
          Loading dashboard data...
        </div>
      ) : (
        <>
          <div className="md-stats">
            {cards.map(({ title, value, Icon, color }) => (
              <div className="md-stat" key={title}>
                <span className={`md-stat-icon ${color}`}>
                  <Icon size={24} />
                </span>

                <div className="md-stat-content">
                  <p>{title}</p>
                  <strong>{Number(value).toLocaleString("en-IN")}</strong>
                </div>
              </div>
            ))}
          </div>

          <section className="md-overview">
            <div className="md-overview-heading">
              <LayoutDashboard size={20} />
              <h2>Manager Overview</h2>
            </div>

            <p>
              Welcome to the SKS Dream Manager Panel.
              View registered users, bank account records,
              withdrawal requests and pending withdrawals
              using the navigation menu.
            </p>

            <div className="md-info-grid">
              <div>
                <strong>User Network</strong>
                <span>
                  View referral relationships in Referral Tree.
                </span>
              </div>

              <div>
                <strong>Bank Details</strong>
                <span>
                  Review masked bank account information.
                </span>
              </div>

              <div>
                <strong>Payout Funds</strong>
                <span>
                  Review payout batches and transaction history.
                </span>
              </div>

              <div>
                <strong>Sales & Accounts</strong>
                <span>
                  View sales records and financial summaries.
                </span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
