
import { useEffect, useMemo, useState } from "react";
import {
  Landmark,
  Search,
  ShieldCheck,
  Clock3,
  Eye,
  X,
  WalletCards,
} from "lucide-react";


import "../../CSS/Manager/ManagerBankDetails.css";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const BANK_API_URL = `${API_BASE}/api/manager/bank-details`;

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ManagerBankDetails() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAccounts() {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("authToken");

        const response = await fetch(BANK_API_URL, {
          headers: {
            Accept: "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          credentials: "include",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load bank accounts"
          );
        }

        if (!controller.signal.aborted) {
          setAccounts(data.accounts || []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAccounts();

    return () => controller.abort();
  }, []);

  const verified = accounts.filter((a) => a.verified).length;
  const unverified = accounts.length - verified;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        [
          account.userName,
          account.referenceId,
          account.accountHolder,
          account.bankName,
          account.branch,
          account.ifsc,
          account.accountNumber,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        status === "all" ||
        (status === "verified" && account.verified) ||
        (status === "unverified" && !account.verified);

      return matchesSearch && matchesStatus;
    });
  }, [accounts, search, status]);

  return (
    <div className="manager-bank-details">
      <header className="mbd-heading">
        <div>
          <h1>Bank Details</h1>
          <p>
            View registered users' bank accounts and verification
            status.
          </p>
        </div>
      </header>

      <section className="mbd-stats">
        <article className="mbd-stat">
          <span className="mbd-stat-icon blue">
            <Landmark size={23} />
          </span>
          <div>
            <p>Total Bank Accounts</p>
            <strong>{accounts.length}</strong>
          </div>
        </article>

        <article className="mbd-stat">
          <span className="mbd-stat-icon green">
            <ShieldCheck size={23} />
          </span>
          <div>
            <p>Verified Accounts</p>
            <strong>{verified}</strong>
          </div>
        </article>

        <article className="mbd-stat">
          <span className="mbd-stat-icon amber">
            <Clock3 size={23} />
          </span>
          <div>
            <p>Unverified Accounts</p>
            <strong>{unverified}</strong>
          </div>
        </article>
      </section>

      <section className="mbd-panel">
        {/* <div className="mbd-panel-heading">
          <span className="mbd-count">
            {filtered.length} records
          </span>
        </div> */}

        <div className="mbd-filters">
          <label className="mbd-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search user, reference ID, bank, IFSC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            aria-label="Filter by verification status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {loading ? (
          <div className="mbd-empty">
            Loading bank accounts...
          </div>
        ) : error ? (
          <div className="mbd-empty mbd-error">
            {error}
          </div>
        ) : (
          <div className="mbd-table-scroll">
            <table className="mbd-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Reference ID</th>
                  <th>Bank Name</th>
                  <th>Account Number</th>
                  <th>IFSC</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <div className="mbd-user">
                        <span className="mbd-user-avatar">
                          <WalletCards size={18} />
                        </span>
                        <div>
                          <strong>{account.userName}</strong>
                          <small>
                            {account.accountHolder}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td className="mbd-reference">
                      {account.referenceId}
                    </td>

                    <td>{account.bankName}</td>

                    <td className="mbd-account-number">
                      {account.accountNumber}
                    </td>

                    <td>{account.ifsc}</td>

                    <td>
                      <span
                        className={`mbd-status ${
                          account.verified
                            ? "verified"
                            : "unverified"
                        }`}
                      >
                        {account.verified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="mbd-view"
                        onClick={() => setSelected(account)}
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="mbd-empty">
                No matching bank accounts found.
              </div>
            )}
          </div>
        )}
      </section>

      {selected && (
        <div
          className="mbd-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            className="mbd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mbd-modal-title"
          >
            <div className="mbd-modal-heading">
              <div>
                <span>Bank Account Profile</span>
                <h2 id="mbd-modal-title">
                  {selected.userName}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelected(null)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="mbd-modal-fields">
              {[
                ["Reference ID", selected.referenceId],
                ["Account Holder", selected.accountHolder],
                ["Bank Name", selected.bankName],
                ["Branch", selected.branch || "—"],
                ["Account Type", selected.accountType || "—"],
                ["Account Number", selected.accountNumber],
                ["IFSC Code", selected.ifsc],
                [
                  "Verification",
                  selected.verified ? "Verified" : "Unverified",
                ],
                [
                  "Primary Account",
                  selected.primary ? "Yes" : "No",
                ],
                ["Added On", formatDate(selected.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mbd-close"
              onClick={() => setSelected(null)}
            >
              Close Details
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
