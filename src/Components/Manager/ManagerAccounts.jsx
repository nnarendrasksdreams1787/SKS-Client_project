
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const formatWithdrawal = (row) => {
  const rawStatus = String(row.status || "unknown").toLowerCase();

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    processing: "Processing",
    paid: "Completed",
    completed: "Completed",
    rejected: "Rejected",
    failed: "Failed",
    cancelled: "Cancelled",
  };

  return {
    id: `WD-${row.withdrawal_id}`,
    user: row.user_name || "Unknown User",
    userId: row.login_id || String(row.user_id),
    referenceId: row.reference_id || "-",
    amount: Number(row.amount || 0),

    date: row.requested_at
      ? new Date(row.requested_at).toLocaleDateString("en-GB")
      : "-",

    status: statusLabels[rawStatus] || rawStatus,
    rawStatus,

    bank: row.bank_name || "-",
    account: row.masked_account_number || "-",
    accountHolder: row.account_holder || "-",
    branch: row.branch || "-",
    accountType: row.account_type || "-",
    bankVerified: row.bank_verified,

    payoutReference: row.payout_reference || "-",
    remark: row.remark || "-",

    availableBalance:
      row.available_balance === null ||
      row.available_balance === undefined
        ? null
        : Number(row.available_balance),

    reservedBalance:
      row.reserved_balance === null ||
      row.reserved_balance === undefined
        ? null
        : Number(row.reserved_balance),
  };
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount || 0));

export default function ManagerAccounts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadWithdrawals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/manager/accounts`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Manager session expired. Please log in again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "You do not have permission to view these records."
            );
          }

          throw new Error(
            `Unable to load withdrawals (HTTP ${response.status})`
          );
        }

        const data = await response.json();

        if (
          !data.success ||
          !Array.isArray(data.withdrawals)
        ) {
          throw new Error("Invalid accounts API response");
        }

        if (!controller.signal.aborted) {
          setAllWithdrawals(
            data.withdrawals.map(formatWithdrawal)
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Unable to load withdrawal records."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWithdrawals();

    return () => controller.abort();
  }, []);

  const withdrawals = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return allWithdrawals.filter((item) => {
      const matchesSearch = [
        item.id,
        item.user,
        item.userId,
        item.referenceId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

      const matchesStatus =
        status === "all" || item.rawStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [allWithdrawals, search, status]);

  const totalRequested = allWithdrawals.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const pendingCount = allWithdrawals.filter(
    (item) => item.rawStatus === "pending"
  ).length;

  const completedCount = allWithdrawals.filter(
    (item) =>
      item.rawStatus === "paid" ||
      item.rawStatus === "completed"
  ).length;

  return (
    <section className="mgr-page">
      <div className="mgr-page-heading">
        <div>
          {/* <span className="mgr-eyebrow">
            ACCOUNTING OVERVIEW
          </span> */}

          <h2>User Withdrawal Records</h2>

          <p>
            View user withdrawals and masked bank information.
          </p>
        </div>

        {/* <span className="mgr-demo-label">
          Live Database
        </span> */}
      </div>

      {loading && (
        <p role="status">
          Loading withdrawal records...
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{ color: "#b42318" }}
        >
          {error}
        </p>
      )}

      <div className="mgr-stat-grid">
        <div className="mgr-stat-card">
          <span>Total Requests</span>
          <strong>{allWithdrawals.length}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Pending Requests</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Completed Requests</span>
          <strong>{completedCount}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Total Requested Amount</span>
          <strong>{money(totalRequested)}</strong>
        </div>
      </div>

      <div className="mgr-panel">
        <div className="mgr-panel-heading">
          <h3>All Withdrawals</h3>
          <span>{withdrawals.length} records</span>
        </div>

        <div className="mgr-filters">
          <input
            type="search"
            placeholder="Search withdrawal, user, reference ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="processing">Processing</option>
            <option value="paid">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mgr-table-scroll">
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Withdrawal ID</th>
                <th>User</th>
                <th>Reference ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals.map((item) => (
                <tr key={item.id}>
                  <td className="mgr-cell-strong">
                    {item.id}
                  </td>

                  <td>
                    <strong>{item.user}</strong>
                    <small>{item.userId}</small>
                  </td>

                  <td>{item.referenceId}</td>

                  <td>{money(item.amount)}</td>

                  <td>{item.date}</td>

                  <td>
                    <span
                      className={`mgr-status mgr-status-${item.rawStatus}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="mgr-view-button"
                      onClick={() =>
                        setSelectedWithdrawal(item)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {withdrawals.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="mgr-empty"
                  >
                    {loading
                      ? "Loading withdrawals..."
                      : error
                        ? "Unable to load withdrawal records."
                        : "No matching withdrawals found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedWithdrawal && (
        <div
          className="mgr-modal-backdrop"
          onClick={() =>
            setSelectedWithdrawal(null)
          }
        >
          <section
            className="mgr-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Withdrawal details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mgr-modal-header">
              <div>
                <span className="mgr-eyebrow">
                  WITHDRAWAL DETAILS
                </span>

                <h3>{selectedWithdrawal.id}</h3>
              </div>

              <button
                type="button"
                className="mgr-close-button"
                onClick={() =>
                  setSelectedWithdrawal(null)
                }
                aria-label="Close withdrawal details"
              >
                ×
              </button>
            </div>

            <div className="mgr-detail-grid">
              <div>
                <span>User</span>
                <strong>
                  {selectedWithdrawal.user}
                </strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>
                  {selectedWithdrawal.userId}
                </strong>
              </div>

              <div>
                <span>Reference ID</span>
                <strong>
                  {selectedWithdrawal.referenceId}
                </strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  {money(selectedWithdrawal.amount)}
                </strong>
              </div>

              <div>
                <span>Bank</span>
                <strong>
                  {selectedWithdrawal.bank}
                </strong>
              </div>

              <div>
                <span>Account Holder</span>
                <strong>
                  {selectedWithdrawal.accountHolder}
                </strong>
              </div>

              <div>
                <span>Account</span>
                <strong>
                  {selectedWithdrawal.account}
                </strong>
              </div>

              <div>
                <span>Branch</span>
                <strong>
                  {selectedWithdrawal.branch}
                </strong>
              </div>

              <div>
                <span>Account Type</span>
                <strong>
                  {selectedWithdrawal.accountType}
                </strong>
              </div>

              <div>
                <span>Bank Verified</span>
                <strong>
                  {selectedWithdrawal.bankVerified === null
                    ? "Unknown"
                    : selectedWithdrawal.bankVerified
                      ? "Yes"
                      : "No"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedWithdrawal.status}
                </strong>
              </div>

              <div>
                <span>Payout Reference</span>
                <strong>
                  {selectedWithdrawal.payoutReference}
                </strong>
              </div>

              <div>
                <span>Available Balance</span>
                <strong>
                  {selectedWithdrawal.availableBalance === null
                    ? "-"
                    : money(selectedWithdrawal.availableBalance)}
                </strong>
              </div>

              <div>
                <span>Reserved Balance</span>
                <strong>
                  {selectedWithdrawal.reservedBalance === null
                    ? "-"
                    : money(selectedWithdrawal.reservedBalance)}
                </strong>
              </div>

              <div>
                <span>Remark</span>
                <strong>
                  {selectedWithdrawal.remark}
                </strong>
              </div>
            </div>

            <p className="mgr-security-note">
              Read-only access. Full bank account details
              are not displayed.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}
