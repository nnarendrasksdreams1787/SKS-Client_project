import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from "react-router-dom";
import "./AdminCSS/AdminPayout.css";
import { ADMIN_API_URL } from "../../Config/api";

// const initialBatches = [
//   { id: "PB-2026-001", date: "2026-10-22", total: 18, amount: 42500, status: "Completed" },
//   { id: "PB-2026-002", date: "2026-10-21", total: 12, amount: 28750, status: "Pending" },
//   { id: "PB-2026-003", date: "2026-10-19", total: 9, amount: 16400, status: "Processing" },
//   { id: "PB-2026-004", date: "2026-10-17", total: 7, amount: 12300, status: "Failed" },
//   { id: "PB-2026-005", date: "2026-10-15", total: 15, amount: 35200, status: "Completed" },
//   { id: "PB-2026-006", date: "2026-10-12", total: 11, amount: 22100, status: "Pending" },
// ];


const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

// const formatDate = (date) =>
//   new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(String(date).replace(" ", "T")).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


export default function AdminPayoutFunds() {
  const navigate = useNavigate();
  // const [batches] = useState(initialBatches);
  // const [search, setSearch] = useState("");
  // const [status, setStatus] = useState("All");
  // const [page, setPage] = useState(1);



  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchPayoutBatches = async () => {
      try {
        setLoading(true);
        setError("");

        const firstResponse = await fetch(
          `${ADMIN_API_URL}/payout-batches?page=1&limit=100`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const firstData = await firstResponse.json();

        if (!firstResponse.ok) {
          throw new Error(
            firstData.message || "Failed to fetch payout batches."
          );
        }

        let allBatches = firstData.batches || [];

        const totalPages = firstData.pagination?.totalPages || 1;

        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          const response = await fetch(
            `${ADMIN_API_URL}/payout-batches?page=${currentPage}&limit=100`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to fetch payout batches."
            );
          }

          allBatches = [...allBatches, ...(data.batches || [])];
        }

        const formattedBatches = allBatches.map((batch) => ({
          ...batch,
          id: batch.batch_number || String(batch.payout_batch_id),
          date: batch.created_at,
          total: Number(batch.total_requests || 0),
          amount: Number(batch.total_amount || 0),
          status: String(batch.status || "").toLowerCase(),
        }));

        setBatches(formattedBatches);
      } catch (err) {
        console.error("Payout batches fetch error:", err);
        setError(err.message || "Unable to load payout batches.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutBatches();
  }, []);

  const pageSize = 5;

  // const completedBatches = batches.filter((b) => b.status === "Completed");
  // const pendingBatches = batches.filter(
  //   (b) => b.status === "Pending" || b.status === "Processing"
  // );
  // const failedBatches = batches.filter((b) => b.status === "Failed");

  const completedBatches = batches.filter(
    (batch) => batch.status === "completed"
  );

  const pendingBatches = batches.filter(
    (batch) =>
      batch.status === "draft" ||
      batch.status === "processing"
  );

  const failedBatches = batches.filter(
    (batch) => batch.status === "failed"
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return batches.filter((batch) => {
      const matchesSearch =
        batch.id.toLowerCase().includes(query) ||
        batch.date.includes(query);

      return (
        matchesSearch &&
        (status === "All" || batch.status === status)
      );
    });
  }, [batches, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleBatches = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <main className="admin-payouts">
      <div className="admin-payouts-heading">
        <div>
          <h1>Payouts</h1>
          <p>Manage payout batches and review payment processing.</p>
        </div>
      </div>

      <section className="admin-payouts-summary">
        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Total Batches</span>
            <span className="payout-summary-icon blue">▤</span>
          </div>
          <strong>{batches.length}</strong>
          <small>All payout batches</small>
        </article>

        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Completed</span>
            <span className="payout-summary-icon green">✓</span>
          </div>
          <strong>{completedBatches.length}</strong>
          <small>
            {formatCurrency(
              completedBatches.reduce((sum, batch) => sum + batch.amount, 0)
            )}{" "}
            completed
          </small>
        </article>

        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Pending / Processing</span>
            <span className="payout-summary-icon amber">◷</span>
          </div>
          <strong>{pendingBatches.length}</strong>
          <small>Awaiting completion</small>
        </article>

        <article className="payout-summary-card">
          <div className="payout-summary-top">
            <span>Failed</span>
            <span className="payout-summary-icon red">!</span>
          </div>
          <strong>{failedBatches.length}</strong>
          <small>Require review</small>
        </article>
      </section>

      <section className="admin-payouts-panel">
        <div className="payout-panel-heading">
          <div>
            <h2>Payout Batches</h2>
            <p>Search batches and inspect their payout records.</p>
          </div>
          <span className="payout-record-count">
            {filtered.length} batches
          </span>
        </div>

        <div className="payout-filters">
          <div className="payout-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by batch ID or date..."
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter payout batches by status"
            value={status}
            onChange={(event) => changeStatus(event.target.value)}
          >
            {/* <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option> */}

            <option value="All">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="partially_failed">Partially Failed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="payout-table-wrap">
          <table className="payout-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Created Date</th>
                <th>Total Payouts</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="payout-empty">
                    Loading payout batches...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="payout-empty">
                    {error}
                  </td>
                </tr>
              )}
              {visibleBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="payout-batch-id">{batch.id}</td>
                  <td>{formatDate(batch.date)}</td>
                  <td>{batch.total}</td>
                  <td className="payout-batch-amount">
                    {formatCurrency(batch.amount)}
                  </td>
                  <td>
                    <span
                      className={`payout-status payout-status-${batch.status.toLowerCase()}`}
                    >
                      {/* {batch.status} */}

                      {batch.status
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="payout-view-button"
                      onClick={() =>
                        navigate(`/admin/payouts/${encodeURIComponent(batch.id)}`)
                      }
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !error && visibleBatches.length === 0 && (
                <tr>
                  <td colSpan="6" className="payout-empty">
                    No payout batches match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="payout-pagination">
          <span>
            Showing{" "}
            {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {"–"}
            {Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}