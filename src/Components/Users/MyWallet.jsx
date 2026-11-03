
import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  History,
} from "lucide-react";
import "../../CSS/MyWallet.css";

// Demo data based on your screenshot.
// Replace with authenticated API data later.


const PAGE_SIZE = 5;


const WALLET_API_URL = "http://localhost:4000/api/user/wallet";

// Screenshot summary figures, not calculated from the
// five sample transactions above.


const formatMoney = (amount) =>
  `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MyWallet() {
  const [transactionType, setTransactionType] = useState("All");
  const [page, setPage] = useState(1);

  const [walletSummary, setWalletSummary] = useState({
    balance: 0,
    totalCredit: 0,
    totalDebit: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchWallet = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("authToken");

        if (!token) {
          throw new Error("Login session not found. Please login again.");
        }

        const response = await fetch(WALLET_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch wallet details.");
        }

        if (controller.signal.aborted) return;

        setWalletSummary({
          balance: Number(data.summary?.balance ?? 0),
          totalCredit: Number(data.summary?.totalCredit ?? 0),
          totalDebit: Number(data.summary?.totalDebit ?? 0),
        });

        const mappedTransactions = (data.transactions ?? []).map((item) => ({
          ...item,
          amount: Number(item.amount),
          type:
            item.type === "credit"
              ? "Credit"
              : item.type === "debit"
                ? "Debit"
                : item.type,
        }));

        setTransactions(mappedTransactions);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Wallet API error:", err);
        setError(err.message || "Unable to load wallet.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWallet();

    return () => controller.abort();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (item) =>
        transactionType === "All" || item.type === transactionType
    );
  }, [transactions, transactionType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );

  const visibleTransactions = filteredTransactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleTypeChange = (event) => {
    setTransactionType(event.target.value);
    setPage(1);
  };

  const handleExport = () => {
    const headers = ["Sr No", "Date", "Amount", "Type", "Remarks"];

    const escapeCsv = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = filteredTransactions.map((item, index) => [
      index + 1,
      item.date,
      item.amount.toFixed(2),
      item.type,
      item.remarks,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "sks-wallet-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="sks-wallet-page">

      {loading && (
        <p role="status">Loading wallet details...</p>
      )}

      {error && (
        <p role="alert" style={{ color: "#c62828" }}>
          {error}
        </p>
      )}
      <div className="sks-wallet-stats">
        <article className="sks-wallet-stat sks-wallet-stat--balance">
          <div>
            <p>Total Wallet Balance</p>
            <h2>{formatMoney(walletSummary.balance)}</h2>
          </div>
          <span className="sks-wallet-stat-icon">
            <Wallet size={23} />
          </span>
        </article>

        <article className="sks-wallet-stat sks-wallet-stat--credit">
          <div>
            <p>Total Credit</p>
            <h2>{formatMoney(walletSummary.totalCredit)}</h2>
          </div>
          <span className="sks-wallet-stat-icon">
            <ArrowDownCircle size={23} />
          </span>
        </article>

        <article className="sks-wallet-stat sks-wallet-stat--debit">
          <div>
            <p>Total Debit</p>
            <h2>{formatMoney(walletSummary.totalDebit)}</h2>
          </div>
          <span className="sks-wallet-stat-icon">
            <ArrowUpCircle size={23} />
          </span>
        </article>
      </div>

      <section className="sks-wallet-history">
        <div className="sks-wallet-history-header">
          <div className="sks-wallet-history-title">
            <History size={20} />
            <h2>Transaction History</h2>
          </div>

          <div className="sks-wallet-actions">
            <select
              aria-label="Filter transactions"
              value={transactionType}
              onChange={handleTypeChange}
            >
              <option value="All">All Transactions</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>

            <button
              type="button"
              className="sks-wallet-export"
              onClick={handleExport}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="sks-wallet-table-wrap">
          <table className="sks-wallet-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.length > 0 ? (
                visibleTransactions.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td>{formatDate(item.date)}</td>
                    <td className="sks-wallet-amount">
                      {formatMoney(item.amount)}
                    </td>
                    <td>
                      <span
                        className={`sks-wallet-type sks-wallet-type--${item.type.toLowerCase()}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>{item.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="sks-wallet-empty">
                    {loading
                      ? "Loading transactions..."
                      : error
                        ? "Unable to load transactions."
                        : "No transactions found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sks-wallet-pagination">
          <span>
            Showing {visibleTransactions.length} of{" "}
            {filteredTransactions.length} transactions
          </span>

          <div className="sks-wallet-page-buttons">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                type="button"
                className={page === index + 1 ? "is-active" : ""}
                onClick={() => setPage(index + 1)}
                aria-label={`Page ${index + 1}`}
                aria-current={page === index + 1 ? "page" : undefined}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
