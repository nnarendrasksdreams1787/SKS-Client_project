import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./AdminCSS/AdminDashboard.css"

// const API_URL = "http://localhost:4000/api/admin" || "https://sks-serverproject-new.onrender.com/api/admin";
const API_URL = "https://sks-serverproject-new.onrender.com/api/admin";



export default function AdminDashboard() {

  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [checkingSection, setCheckingSection] = useState(true);
  // const [activeTab, setActiveTab] = useState("Dashboard");
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(true);



  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const response = await axios.get(`${API_URL}/me`, {
        // const response = await axios.get("https://sks-serverproject-new.onrender.com/me", {
          withCredentials: true,
        });

        if (!cancelled) {
          setAdmin(response.data.admin);
        }
      } catch {
        if (!cancelled) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        if (!cancelled) {
          setCheckingSection(false);
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    }

  }, [navigate])

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardStats() {
      setLoadingStats(true);

      try {
        const response = await axios.get(`${API_URL}/dashboard`, {
          withCredentials: true,
        });

        if (!cancelled) {
          setStats(response.data.stats);
          setError("");
        }


      } catch (error) {
        if (cancelled) return;

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          navigate("/admin/login", { replace: true });
          return;
        }

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard statistics."
        )
      }
      finally {
        if (!cancelled) {
          setLoadingStats(false)
        }
      }

    }

    fetchDashboardStats();

    return () => {
      cancelled = true;
    }
  }, [navigate])


  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    setError("");

    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );

      navigate("/admin/login", { replace: true })
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to log out. Please try again"
      );

      setLoggingOut(false);
    }
  }

  if (checkingSection || !admin) {
    return (
      <main className="sks-admin-loading">
        <div className="sks-admin-loader" />
        <p>Verifying your admin session....</p>
      </main>
    );
  }



  return (
    <div className="sks-dashboard">
      <div className="sks-dashboard-heading">
        <div>
          <span className="sks-dashboard-eyebrow">
            SKS DREAM / ADMINISTRATION
          </span>
          <h1>Dashboard</h1>
          <p>
            Welcome back. Here's an overview of your platform.
          </p>
        </div>

        <span className="sks-dashboard-session">
          <span className="sks-dashboard-dot" />
          Admin session active
        </span>
      </div>

      <section className="sks-dashboard-stats">
        {/* {[
          {
            title: "Total Customers",
            icon: "♙",
            color: "teal",
          },
          {
            title: "Total Products",
            icon: "▤",
            color: "blue",
          },
          {
            title: "Total Orders",
            icon: "▣",
            color: "gold",
          },
          {
            title: "Pending Payouts",
            icon: "₹",
            color: "purple",
          },
        ].map((item) => (
          <article
            className="sks-dashboard-stat"
            key={item.title}
          >
            <div className="sks-dashboard-stat-top">
              <span>{item.title}</span>
              <span
                className={`sks-dashboard-stat-icon ${item.color}`}
              >
                {item.icon}
              </span>
            </div>

            <strong className="sks-dashboard-stat-value">
              —
            </strong>

            <span className="sks-dashboard-stat-note">
              Data connection pending
            </span>
          </article>
        ))} */}

        {[
          {
            title: "Total Members",
            key: "totalCustomers",
            icon: "♟",
            color: "teal",
          },
          {
            title: "Total Products",
            key: "totalProducts",
            icon: "▤",
            color: "blue",
          },
          {
            title: "Total Revenue",
            key: "totalRevenue",
            icon: "₹",
            color: "gold",
            currency: true,
          },
          {
            title: "Total Tax Collected",
            key: "totalTaxCollected",
            icon: "▤",
            color: "teal",
            currency: true,
          },
          {
            title: "Commission Earned",
            key: "commissionEarned",
            icon: "%",
            color: "gold",
            currency: true,
          },
          {
            title: "Total Withdrawn",
            key: "totalWithdrawn",
            icon: "₹",
            color: "blue",
            currency: true,
          },
          {
            title: "Withdrawal Requests",
            key: "pendingPayouts",
            icon: "⇄",
            color: "purple",
          },
          {
            title: "KYC Requests",
            key: "pendingKycRequests",
            icon: "✓",
            color: "purple",
          },
        ].map((item) => (
          <article
            className="sks-dashboard-stat"
            key={item.key}
          >
            <div className="sks-dashboard-stat-top">
              <span>{item.title}</span>

              <span
                className={`sks-dashboard-stat-icon ${item.color}`}
              >
                {item.icon}
              </span>
            </div>

            <strong className="sks-dashboard-stat-value">
              {loadingStats
                ? "..."
                : item.currency
                  ? Number(stats[item.key] ?? 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                  : Number(stats[item.key] ?? 0).toLocaleString("en-IN")}
            </strong>

            <span className="sks-dashboard-stat-note">
              {loadingStats ? "Loading..." : "Live database data"}
            </span>
          </article>
        ))}
      </section>

      <section className="sks-dashboard-panels">
        <article className="sks-dashboard-panel">
          <div className="sks-dashboard-panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Navigate to your management sections.</p>
            </div>
          </div>

          <div className="sks-dashboard-actions">
            {[
              {
                label: "Manage Products",
                detail: "Products and catalog",
                path: "/admin/products",
                icon: "▤",
              },
              {
                label: "View Orders",
                detail: "Order management",
                path: "/admin/orders",
                icon: "▣",
              },
              {
                label: "Manage Customers",
                detail: "Member accounts",
                path: "/admin/my-network",
                icon: "♙",
              },
              {
                label: "Review Payouts",
                detail: "Payout batches",
                path: "/admin/payouts",
                icon: "₹",
              },
            ].map((action) => (
              <button
                key={action.path}
                type="button"
                className="sks-dashboard-action"
                onClick={() =>
                  navigate(action.path)
                }
              >
                <span className="sks-dashboard-action-icon">
                  {action.icon}
                </span>

                <span className="sks-dashboard-action-copy">
                  <strong>{action.label}</strong>
                  <span>{action.detail}</span>
                </span>

                <span className="sks-dashboard-arrow">→</span>
              </button>
            ))}
          </div>
        </article>

        <article className="sks-dashboard-panel">
          <div className="sks-dashboard-panel-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest platform events.</p>
            </div>
          </div>

          <div className="sks-dashboard-empty">
            <span className="sks-dashboard-empty-icon">◷</span>
            <strong>No activity available</strong>
            <p>
              Recent orders, customer registrations, and
              payout events will appear here when connected.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}