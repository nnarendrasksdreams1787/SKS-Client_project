
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  UsersRound,
  BadgePercent,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

import "../../CSS/Dashboard.css";

const DASHBOARD_API = "http://localhost:4000/api/user/dashboard" || "https://sks-serverproject-new.onrender.com/api/user/dashboard";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data from backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(DASHBOARD_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = response.data;

        if (!data.success) {
          setError(data.message || "Unable to load dashboard.");
          return;
        }

        setDashboardData(data);
      } catch (err) {
        if (err.code === "ERR_CANCELED") {
          return;
        }

        console.error("Dashboard API error:", err);

        if (err.response?.status === 401) {
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("authUser");

          setError("Your session has expired. Please log in again.");
        } else {
          setError(
            err.response?.data?.message ||
            "Unable to load dashboard. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => controller.abort();
  }, []);

  // Format money in Indian Rupees
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
  };

  // Get statistics from backend response
  const stats = dashboardData?.statistics;

  const dashboardStats = stats
    ? [
      {
        label: "Total Amount",
        value: formatCurrency(stats.total_amount),
        Icon: IndianRupee,
        tone: "blue",
      },
      {
        label: "Total Referrals",
        value: String(stats.total_referrals ?? 0),
        Icon: UsersRound,
        tone: "indigo",
      },
      {
        label: "Total Commission",
        value: formatCurrency(stats.total_commission),
        Icon: BadgePercent,
        tone: "orange",
      },
      {
        label: "Total Orders",
        value: String(stats.total_orders ?? 0),
        Icon: ShoppingBag,
        tone: "green",
      },
    ]
    : [];

  const bankAdded = dashboardData?.bank?.is_added ?? false;

  return (
    <div className="sks-dashboard">

      {/* Dashboard Introduction */}
      <section className="sks-dashboard-intro">
        <h2>Your Dream Journey</h2>

        <p>
          Manage your earnings, referrals and orders in one place.
        </p>

        {/* Browse & Buy Books */}
        <Link
          to="/product"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "12px 20px",
            marginBottom: "20px",
            background: "#071B30",
            color: "#FFFFFF",
            borderRadius: "10px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Browse & Buy Books →
        </Link>

        {/* Bank Account Warning */}
        {!loading && !error && !bankAdded && (
          <p className="sks-dashboard-warning">
            <AlertTriangle size={17} />
            <span>Bank account not added</span>
          </p>
        )}

        {/* Bank Details Button */}
        <button
          type="button"
          className="sks-dashboard-bank-btn"
          disabled
          title="Bank Details module coming soon"
        >
          Add Bank Account →
        </button>
      </section>

      {/* Loading State */}
      {loading && (
        <p role="status" className="sks-dashboard-loading">
          Loading dashboard...
        </p>
      )}

      {/* Error State */}
      {!loading && error && (
        <p className="sks-auth-error" role="alert">
          {error}
        </p>
      )}

      {/* Dashboard Statistics */}
      {!loading && !error && dashboardData && (
        <section
          className="sks-dashboard-stats"
          aria-label="Dashboard statistics"
        >
          {dashboardStats.map(({ label, value, Icon, tone }) => (
            <article
              className={`sks-dashboard-stat sks-dashboard-stat--${tone}`}
              key={label}
            >
              <div className="sks-dashboard-stat-heading">

                <span className="sks-dashboard-stat-icon">
                  <Icon size={21} strokeWidth={1.7} />
                </span>

                <span className="sks-dashboard-stat-label">
                  {label}
                </span>
              </div>

              <strong className="sks-dashboard-stat-value">
                {value}
              </strong>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}