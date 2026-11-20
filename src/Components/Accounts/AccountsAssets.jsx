
import React, { useEffect, useState } from "react";
import {
  Wallet,
  Landmark,
  WalletCards,
  BookOpenText,
  ReceiptText,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_URL
).replace(/\/+$/, "");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export default function AccountsAssets() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssets() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/accounts/assets/summary`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load assets"
          );
        }

        if (!controller.signal.aborted) {
          setSummary(data.summary);
        }
      } catch (err) {
        if (
          err.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAssets();

    return () => controller.abort();
  }, []);

  const sections = summary
    ? [
        {
          title: "Payment Collections",
          value: formatMoney(summary.successful_amount),
          description: `${formatNumber(
            summary.successful_count
          )} successful payments`,
          Icon: Wallet,
        },
        {
          title: "Bank Account Records",
          value: formatNumber(summary.total_bank_accounts),
          description: "Registered bank account records",
          Icon: Landmark,
        },
        {
          title: "User Wallets",
          value: formatNumber(summary.total_wallets),
          description: "Registered user wallets",
          Icon: WalletCards,
        },
        {
          title: "Accounting Journal",
          value: formatNumber(
            summary.total_journal_entries
          ),
          description: "Recorded journal entries",
          Icon: BookOpenText,
        },
      ]
    : [];

  const transactions = summary
    ? [
        {
          label: "Total Transactions",
          value: formatNumber(summary.total_payments),
          Icon: ReceiptText,
        },
        {
          label: "Successful",
          value: formatNumber(summary.successful_count),
          Icon: CheckCircle2,
        },
        {
          label: "Initiated",
          value: formatNumber(summary.initiated_count),
          Icon: Clock3,
        },
        {
          label: "Failed",
          value: formatNumber(summary.failed_count),
          Icon: XCircle,
        },
        {
          label: "Successful Payment Amount",
          value: formatMoney(summary.successful_amount),
          Icon: IndianRupee,
        },
      ]
    : [];

  return (
    <section className="acc-page acc-assets-page">
      <div className="acc-page-heading">
        <div>
          <span className="acc-eyebrow">
            FINANCIAL OVERVIEW
          </span>

          <h2>Assets & Collections</h2>

          <p>
            Payment collections and financial record
            overview.
          </p>
        </div>

        <span className="acc-preview-badge">
          Live Database
        </span>
      </div>

      {loading && (
        <p role="status">
          Loading financial summary...
        </p>
      )}

      {error && (
        <p role="alert" className="acc-assets-error">
          {error}
        </p>
      )}

      {!loading && !error && summary && (
        <>
          {/* SUMMARY CARDS */}
          <div className="acc-assets-stats">
            {sections.map(
              ({
                title,
                value,
                description,
                Icon,
              }) => (
                <div
                  className="acc-assets-stat-card"
                  key={title}
                >
                  <div className="acc-assets-stat-top">
                    <span>{title}</span>

                    <span className="acc-assets-stat-icon">
                      <Icon
                        size={26}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>

                  <strong>{value}</strong>
                  <small>{description}</small>
                </div>
              )
            )}
          </div>

          {/* TRANSACTION SUMMARY */}
          <div className="acc-panel acc-assets-summary">
            <div className="acc-assets-summary-heading">
              <div>
                <h3>
                  Payment Transaction Summary
                </h3>
                <p>
                  Overview of recorded payment activity
                </p>
              </div>

              <span>Database Records</span>
            </div>

            <div className="acc-assets-transactions">
              {transactions.map(
                ({ label, value, Icon }) => (
                  <div
                    className="acc-assets-transaction-row"
                    key={label}
                  >
                    <div className="acc-assets-transaction-label">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                      <span>{label}</span>
                    </div>

                    <strong>{value}</strong>
                  </div>
                )
              )}
            </div>
          </div>

          <p className="acc-info-note">
            Successful payment amounts are not
            necessarily settled bank deposits. Bank
            account and wallet counts include user
            records and do not represent company-owned
            assets.
          </p>
        </>
      )}
    </section>
  );
}
