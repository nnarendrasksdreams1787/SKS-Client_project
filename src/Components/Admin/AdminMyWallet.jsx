import React, { useState, useEffect, useMemo } from "react";
import "./AdminCSS/AdminMyWallet.css";
import { ADMIN_API_URL } from "../../Config/api";

// const initialTransactions = [
//   {
//     id: "TXN-1001",
//     date: "2026-10-20",
//     description: "Referral Commission",
//     type: "Credit",
//     amount: 1250,
//     status: "Completed",
//   },
//   {
//     id: "TXN-1002",
//     date: "2026-10-19",
//     description: "Payout Request",
//     type: "Debit",
//     amount: 2000,
//     status: "Pending",
//   },
//   {
//     id: "TXN-1003",
//     date: "2026-10-18",
//     description: "Product Commission",
//     type: "Credit",
//     amount: 850,
//     status: "Completed",
//   },
//   {
//     id: "TXN-1004",
//     date: "2026-10-16",
//     description: "Referral Commission",
//     type: "Credit",
//     amount: 600,
//     status: "Completed",
//   },
//   {
//     id: "TXN-1005",
//     date: "2026-10-14",
//     description: "Payout Request",
//     type: "Debit",
//     amount: 1000,
//     status: "Failed",
//   },
//   {
//     id: "TXN-1006",
//     date: "2026-10-12",
//     description: "Product Commission",
//     type: "Credit",
//     amount: 1500,
//     status: "Completed",
//   },
// ];

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);


export default function AdminMyWallet() {
  // const [transactions] = useState(initialTransactions);
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  // const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    const fetchMyWallet = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${ADMIN_API_URL}/my-wallet`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(
            `Wallet API returned a non-JSON response. HTTP ${response.status}. Backend route may not exist yet.`
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch wallet.");
        }

        setWallet(data.summary || null);
        // setTransactions(data.transactions || []);

        const normalizedTransations = (data.transactions || []).map((item) => ({
          ...item,
          id: item.txn_id,
          date: item.paid_at || item.created_at,
          type: item.event_type || item.status || "",
          referenceId: item.gateway_txn_id || "",
          referenceType: item.gateway_txn_id || item.gateway || "",
          status: item.status || "",
          description: item.description || item.product_names || "Order payment",
        }))

        setTransactions(normalizedTransations);

      } catch (err) {
        console.error("Admin wallet fetch error:", err);
        setError(err.message || "Unable to load wallet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyWallet();
  }, []);

  // const completedCredits = transactions
  //   .filter((item) => item.type === "Credit" && item.status === "Completed")
  //   .reduce((total, item) => total + item.amount, 0);

  // const completedDebits = transactions
  //   .filter((item) => item.type === "Debit" && item.status === "Completed")
  //   .reduce((total, item) => total + item.amount, 0);

  // const pendingAmount = transactions
  //   .filter((item) => item.status === "Pending")
  //   .reduce((total, item) => total + item.amount, 0);

  // const walletBalance = completedCredits - completedDebits;


  // const walletBalance = Number(wallet?.balance || 0);
  // const completedCredits = Number(wallet?.totalCredit || 0);
  // const completedDebits = Number(wallet?.totalDebit || 0);
  // const pendingAmount = Number(wallet?.reservedBalance || 0);

  const totalSales = Number(wallet?.totalSales || 0);
  const totalCollections = Number(wallet?.totalCollections || 0);
  const totalCommissions = Number(wallet?.totalCommissions || 0);
  const totalWithdrawals = Number(wallet?.totalWithdrawals || 0);
  const successfulPayments = Number(wallet?.successfulPayments || 0);
  const totalOrders = Number(wallet?.totalOrders || 0);

  // const filteredTransactions = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   return transactions.filter((item) => {
  //     const matchesSearch =
  //       !query ||
  //       item.id.toLowerCase().includes(query) ||
  //       item.description.toLowerCase().includes(query);

  //     const matchesType =
  //       typeFilter === "All" || item.type === typeFilter;

  //     const matchesStatus =
  //       statusFilter === "All" || item.status === statusFilter;

  //     return matchesSearch && matchesType && matchesStatus;
  //   });
  // }, [transactions, search, typeFilter, statusFilter]);

  // const filteredTransactions = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   return transactions.filter((item) => {
  //     const matchesSearch =
  //       !query ||
  //       String(item.id).toLowerCase().includes(query) ||
  //       String(item.description).toLowerCase().includes(query) ||
  //       String(item.referenceId || "").toLowerCase().includes(query);

  //     const matchesType =
  //       typeFilter === "All" ||
  //       item.type.toLowerCase() === typeFilter.toLowerCase();

  //     return matchesSearch && matchesType;
  //   });
  // }, [transactions, search, typeFilter]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((item) => {
      const transactionId = String(item.id ?? "").toLowerCase();
      const description = String(item.description ?? "").toLowerCase();
      const reference = String(item.referenceId ?? "").toLowerCase();
      const eventType = String(item.type ?? "").toLowerCase();

      const matchesSearch =
        !query ||
        transactionId.includes(query) ||
        description.includes(query) ||
        reference.includes(query);

      const matchesType =
        typeFilter === "All" ||
        eventType === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [transactions, search, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const resetPage = () => setCurrentPage(1);

  return (
    <>
      <div className="admin-wallet">
        <div className="admin-wallet-heading">
          <div>
            <h1>My Wallet</h1>
            {/* <p>View your wallet balance and transaction history.</p> */}
            <p>Overview of SKS Dream business collections and financial activity.</p>
          </div>
        </div>

        {/* <div className="admin-wallet-summary">
          <div className="admin-wallet-card admin-wallet-card-balance">
            <div className="admin-wallet-card-top">
              <span>Available Balance</span>
              <span className="admin-wallet-icon">₹</span>
            </div>
            <h2>{currency(walletBalance)}</h2>
            <p>Your current wallet balance</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              <span>Total Credits</span>
              <span className="admin-wallet-icon credit-icon">↙</span>
            </div>
            <h2>{currency(completedCredits)}</h2>
            <p>Completed incoming transactions</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              <span>Total Debits</span>
              <span className="admin-wallet-icon debit-icon">↗</span>
            </div>
            <h2>{currency(completedDebits)}</h2>
            <p>Completed outgoing transactions</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              
              <span>Reserved Amount</span>
              <span className="admin-wallet-icon pending-icon">◷</span>
            </div>
            <h2>{currency(pendingAmount)}</h2>
           
            <p>Amount currently reserved in your wallet</p>
          </div>
        </div> */}

        <div className="admin-wallet-summary">
          <div className="admin-wallet-card admin-wallet-card-balance">
            <div className="admin-wallet-card-top">
              <span>Total Sales</span>
              <span className="admin-wallet-icon">₹</span>
            </div>
            <h2>{currency(totalSales)}</h2>
            <p>{totalOrders} paid orders</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              <span>Payment Collections</span>
              <span className="admin-wallet-icon credit-icon">↙</span>
            </div>
            <h2>{currency(totalCollections)}</h2>
            <p>{successfulPayments} successful payments</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              <span>Total Commissions</span>
              <span className="admin-wallet-icon debit-icon">↗</span>
            </div>
            <h2>{currency(totalCommissions)}</h2>
            <p>Approved member commissions</p>
          </div>

          <div className="admin-wallet-card">
            <div className="admin-wallet-card-top">
              <span>Paid Withdrawals</span>
              <span className="admin-wallet-icon pending-icon">◷</span>
            </div>
            <h2>{currency(totalWithdrawals)}</h2>
            <p>Completed member payouts</p>
          </div>
        </div>

        <section className="admin-wallet-panel">
          <div className="admin-wallet-panel-heading">
            <div>
              <h2>Transaction History</h2>
              <p>Review your wallet activity and transaction status.</p>
            </div>
            <span className="admin-wallet-count">
              {filteredTransactions.length} transactions
            </span>
          </div>

          <div className="admin-wallet-filters">
            <div className="admin-wallet-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search transaction ID or description..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetPage();
                }}
              />
            </div>

            <select
              aria-label="Filter by transaction type"
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value);
                resetPage();
              }}
            >
              <option value="All">All Types</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
              <option value="reserve">Reserve</option>
              <option value="release">Release</option>

            </select>

            {/* <select
              aria-label="Filter by transaction status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetPage();
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select> */}
          </div>

          <div className="admin-wallet-table-wrap">
            <table className="admin-wallet-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* 
                {paginatedTransactions.map((item) => {

                  const isCredit = item.type.toLowerCase() === "credit" ||
                    item.type.toLowerCase() === "release";
                  return (
                    <tr key={item.id}>

                      <td className={isCredit ? "wallet-amount-credit" : "wallet-amount-debit"}>
                        {isCredit ? "+" : "-"}
                        {currency(Number(item.amount))}
                      </td>
                      <td className="wallet-transaction-id">{item.id}</td>
                      <td>
                        {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td>{item.description}</td>
                    
                      <td>
                        <span
                          className={`wallet-type wallet-type-${item.type.toLowerCase()}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td
                        className={
                          item.type === "Credit"
                            ? "wallet-amount-credit"
                            : "wallet-amount-debit"
                        }
                      >
                        {item.type === "Credit" ? "+" : "-"}
                        {currency(item.amount)}
                      </td>
                      <td>
                      <span
                      className={`wallet-status wallet-status-${item.status.toLowerCase()}`}
                      >
                      {item.status}
                      </span>
                      </td> 
                      <td>{item.referenceType || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="wallet-view-btn"
                          onClick={() => setSelectedTransaction(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                }
                )}
                        */}

                {paginatedTransactions.map((item) => {
                  const eventType = String(item.type || "").toLowerCase();

                  const isCredit =
                    eventType === "credit" || eventType === "release";

                  return (
                    <tr key={item.id}>
                      <td className="wallet-transaction-id">
                        {item.id}
                      </td>

                      <td>
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "—"}
                      </td>

                      <td>{item.description || "—"}</td>

                      <td>
                        <span
                          className={`wallet-type wallet-type-${eventType}`}
                        >
                          {eventType
                            ? eventType.charAt(0).toUpperCase() + eventType.slice(1)
                            : "—"}
                        </span>
                      </td>

                      {/* <td
                        className={
                          isCredit
                            ? "wallet-amount-credit"
                            : "wallet-amount-debit"
                        }
                      >
                        {isCredit ? "+" : "-"}
                        {currency(Number(item.amount || 0))}
                      </td> */}
                      <td
                        className={
                          eventType === "credit" || eventType === "release"
                            ? "wallet-amount-credit"
                            : "wallet-amount-debit"
                        }
                      >
                        {eventType === "credit" || eventType === "release" ? "+" : "-"}
                        {currency(Number(item.amount || 0))}
                      </td>

                      <td>{item.referenceId || item.referenceType || "—"}</td>

                      <td>
                        <button
                          type="button"
                          className="wallet-view-btn"
                          onClick={() => setSelectedTransaction(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="admin-wallet-empty">
                      <span>⌕</span>
                      <strong>No transactions found</strong>
                      <p>Try changing your search or filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-wallet-pagination">
            <span>
              Showing{" "}
              {filteredTransactions.length === 0
                ? 0
                : (safePage - 1) * pageSize + 1}
              {"–"}
              {Math.min(safePage * pageSize, filteredTransactions.length)} of{" "}
              {filteredTransactions.length}
            </span>

            <div className="wallet-pagination-buttons">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
              >
                Previous
              </button>
              <span>
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {selectedTransaction && (
          <div
            className="admin-wallet-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedTransaction(null);
              }
            }}
          >
            <section
              className="admin-wallet-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wallet-transaction-title"
            >
              <div className="admin-wallet-modal-heading">
                <div>
                  <span>Transaction Details</span>
                  <h2 id="wallet-transaction-title">
                    {selectedTransaction.id}
                  </h2>
                </div>
                <button
                  type="button"
                  className="wallet-modal-close"
                  aria-label="Close transaction details"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ×
                </button>
              </div>

              <div className="wallet-detail-amount">
                <span>{selectedTransaction.type}</span>
                {/* <strong
                  className={
                    selectedTransaction.type === "Credit"
                      ? "wallet-amount-credit"
                      : "wallet-amount-debit"
                  }
                >
                  {selectedTransaction.type === "Credit" ? "+" : "-"}
                  {currency(selectedTransaction.amount)}
                </strong> */}

                <strong
                  className={
                    ["credit", "release"].includes(
                      String(selectedTransaction.type || "").toLowerCase()
                    )
                      ? "wallet-amount-credit"
                      : "wallet-amount-debit"
                  }
                >
                  {["credit", "release"].includes(
                    String(selectedTransaction.type || "").toLowerCase()
                  )
                    ? "+"
                    : "-"}
                  {currency(Number(selectedTransaction.amount || 0))}
                </strong>
              </div>

              <div className="wallet-detail-list">
                <div>
                  <span>Description</span>
                  <strong>{selectedTransaction.description}</strong>
                </div>
                <div>
                  <span>Date</span>
                  <strong>{selectedTransaction.date}</strong>
                </div>
                <div>
                  <span>Transaction Type</span>
                  <strong>{selectedTransaction.type}</strong>
                </div>
                <div>
                  {/* <span>Status</span> */}
                  <span>Reference Type</span>
                  {/* <strong>{selectedTransaction.status}</strong> */}
                  <strong>{selectedTransaction.referenceType || "—"}</strong>
                </div>
              </div>

              <button
                type="button"
                className="wallet-modal-done"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </section>
          </div>
        )}
      </div>

      {
        loading && (
          <p className="admin-wallet-empty">Loading wallet details...</p>
        )
      }

      {
        !loading && error && (
          <p className="admin-wallet-empty">{error}</p>
        )
      }
    </>

  );

}