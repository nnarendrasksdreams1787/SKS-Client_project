import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import "./AdminCSS/AdminPayout.css"

const batches = [
  { id: "PB-2026-001", date: "2026-10-22", status: "Completed", amount: 42500 },
  { id: "PB-2026-002", date: "2026-10-21", status: "Pending", amount: 28750 },
  { id: "PB-2026-003", date: "2026-10-19", status: "Processing", amount: 16400 },
  { id: "PB-2026-004", date: "2026-10-17", status: "Failed", amount: 12300 },
  { id: "PB-2026-005", date: "2026-10-15", status: "Completed", amount: 35200 },
  { id: "PB-2026-006", date: "2026-10-12", status: "Pending", amount: 22100 },
];


const initialPayouts = [
  { id: "PAY-1001", name: "Rahul Sharma", email: "rahul@example.com", amount: 2500, method: "Bank Transfer", status: "Completed" },
  { id: "PAY-1002", name: "Sneha Joshi", email: "sneha@example.com", amount: 1800, method: "UPI", status: "Pending" },
  { id: "PAY-1003", name: "Amit Verma", email: "amit@example.com", amount: 3200, method: "Bank Transfer", status: "Completed" },
  { id: "PAY-1004", name: "Neha Kulkarni", email: "neha@example.com", amount: 1500, method: "UPI", status: "Failed" },
  { id: "PAY-1005", name: "Vikas More", email: "vikas@example.com", amount: 2750, method: "Bank Transfer", status: "Pending" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);


export default function AdminPayoutBatchDetails() {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const batch = batches.find((item) => item.id === batchId);
  const [payouts] = useState(initialPayouts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedPayout, setSelectedPayout] = useState(null);

  const filteredPayouts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payouts.filter((payout) => {
      const matchesSearch =
        payout.id.toLowerCase().includes(query) ||
        payout.name.toLowerCase().includes(query) ||
        payout.email.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (status === "All" || payout.status === status)
      );
    });
  }, [payouts, search, status]);

  if (!batch) {
    return (
      <main className="admin-payouts">
        <button
          type="button"
          className="payout-back-button"
          onClick={() => navigate("/admin/payouts")}
        >
          ← Back to Payouts
        </button>
        <section className="admin-payouts-panel payout-not-found">
          <h2>Batch not found</h2>
          <p>This batch ID does not exist in the current sample data.</p>
        </section>
      </main>
    );
  }

  const completedAmount = payouts
    .filter((payout) => payout.status === "Completed")
    .reduce((sum, payout) => sum + payout.amount, 0);

  const pendingCount = payouts.filter(
    (payout) => payout.status === "Pending"
  ).length;

  const failedCount = payouts.filter(
    (payout) => payout.status === "Failed"
  ).length;

  return (
    <main className="admin-payouts">
      <button
        type="button"
        className="payout-back-button"
        onClick={() => navigate("/admin/payouts")}
      >
        ← Back to Payouts
      </button>

      <div className="admin-payouts-heading payout-details-heading">
        <div>
          <h1>Batch Details</h1>
          <p>Review payout records and their processing status.</p>
        </div>
        <span
          className={`payout-status payout-status-${batch.status.toLowerCase()}`}
        >
          {batch.status}
        </span>
      </div>

      <section className="payout-batch-overview">
        <div>
          <span>Batch ID</span>
          <strong>{batch.id}</strong>
        </div>
        <div>
          <span>Created Date</span>
          <strong>{batch.date}</strong>
        </div>
        <div>
          <span>Batch Amount</span>
          <strong>{formatCurrency(batch.amount)}</strong>
        </div>
        <div>
          <span>Payout Records</span>
          <strong>{payouts.length}</strong>
        </div>
      </section>

      <section className="admin-payouts-summary payout-detail-summary">
        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Completed Amount</span>
            <span className="payout-summary-icon green">✓</span>
          </div>
          <strong>{formatCurrency(completedAmount)}</strong>
          <small>Completed sample payouts</small>
        </article>

        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Pending</span>
            <span className="payout-summary-icon amber">◷</span>
          </div>
          <strong>{pendingCount}</strong>
          <small>Awaiting processing</small>
        </article>

        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Failed</span>
            <span className="payout-summary-icon red">!</span>
          </div>
          <strong>{failedCount}</strong>
          <small>Require review</small>
        </article>
      </section>

      <section className="admin-payouts-panel">
        <div className="payout-panel-heading">
          <div>
            <h2>Individual Payouts</h2>
            <p>Search payout recipients and inspect individual records.</p>
          </div>
          <span className="payout-record-count">
            {filteredPayouts.length} records
          </span>
        </div>

        <div className="payout-filters">
          <div className="payout-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search payout ID, name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter individual payouts by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="payout-table-wrap">
          <table className="payout-table">
            <thead>
              <tr>
                <th>Payout ID</th>
                <th>Recipient</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="payout-batch-id">{payout.id}</td>
                  <td>
                    <div className="payout-recipient">
                      <strong>{payout.name}</strong>
                      <span>{payout.email}</span>
                    </div>
                  </td>
                  <td>{payout.method}</td>
                  <td className="payout-batch-amount">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td>
                    <span
                      className={`payout-status payout-status-${payout.status.toLowerCase()}`}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="payout-view-button"
                      onClick={() => setSelectedPayout(payout)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan="6" className="payout-empty">
                    No payout records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedPayout && (
        <div
          className="payout-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPayout(null);
            }
          }}
        >
          <section
            className="payout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payout-modal-title"
          >
            <div className="payout-modal-heading">
              <div>
                <span>Payout Record</span>
                <h2 id="payout-modal-title">{selectedPayout.id}</h2>
              </div>
              <button
                type="button"
                aria-label="Close payout details"
                onClick={() => setSelectedPayout(null)}
              >
                ×
              </button>
            </div>

            <div className="payout-modal-amount">
              {formatCurrency(selectedPayout.amount)}
            </div>

            <div className="payout-modal-fields">
              <div><span>Recipient</span><strong>{selectedPayout.name}</strong></div>
              <div><span>Email</span><strong>{selectedPayout.email}</strong></div>
              <div><span>Payment Method</span><strong>{selectedPayout.method}</strong></div>
              <div><span>Status</span><strong>{selectedPayout.status}</strong></div>
              <div><span>Batch ID</span><strong>{batch.id}</strong></div>
            </div>

            <button
              type="button"
              className="payout-modal-done"
              onClick={() => setSelectedPayout(null)}
            >
              Close Details
            </button>
          </section>
        </div>
      )}
    </main>
  );
}