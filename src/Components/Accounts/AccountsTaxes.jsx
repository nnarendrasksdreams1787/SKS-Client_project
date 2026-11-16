
import React, { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  ReceiptText,
  HeartPulse,
  Wallet,
  BadgePercent,
  Pencil,
  Check,
  X,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

const DESCRIPTIONS = {
  PF: "Provident Fund",
  TDS: "Tax Deducted at Source",
  ESI: "Employee State Insurance",
  Expenses: "Internal expense allocation",
  GST: "Goods and Services Tax",
};

const ICONS = {
  PF: ShieldCheck,
  TDS: ReceiptText,
  ESI: HeartPulse,
  Expenses: Wallet,
  GST: BadgePercent,
};

const ORDER = ["PF", "TDS", "ESI", "Expenses", "GST"];

export default function AccountsTaxes() {
  const [taxes, setTaxes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTaxes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/accounts/taxes`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load taxes");
      }

      const records = data.taxes || [];

      setTaxes(
        [...records].sort(
          (a, b) =>
            ORDER.indexOf(a.tax_name) -
            ORDER.indexOf(b.tax_name)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTaxes();
  }, [loadTaxes]);

  const startEditing = (tax) => {
    setEditingId(tax.tax_id);
    setEditValue(String(tax.tax_percentage));
    setError("");
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveTax = async (taxId) => {
    const rate = Number(editValue);

    if (
      editValue.trim() === "" ||
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 100
    ) {
      setError("Enter a valid percentage between 0 and 100.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/api/accounts/taxes/${taxId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tax_percentage: rate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update tax");
      }

      setEditingId(null);
      setEditValue("");
      setMessage("Tax percentage updated successfully.");

      await loadTaxes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="acc-page acc-taxes-page">
      <div className="acc-page-heading">
        <div>
          <span className="acc-eyebrow">
            TAX CONFIGURATION
          </span>
          <h2>Taxes & Deductions</h2>
          <p>Manage accounting rates and deductions.</p>
        </div>

        <span className="acc-preview-badge">
          Live Database
        </span>
      </div>

      <div className="acc-panel acc-taxes-panel">
        <div className="acc-panel-heading">
          <h3>Current Tax Rates</h3>
          <span>Accountant-controlled settings</span>
        </div>

        {error && (
          <p role="alert" className="acc-tax-alert acc-tax-error">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="acc-tax-alert acc-tax-success">
            {message}
          </p>
        )}

        {loading ? (
          <p className="acc-tax-loading">
            Loading tax rates...
          </p>
        ) : taxes.length === 0 ? (
          <p className="acc-tax-loading">
            No tax records found.
          </p>
        ) : (
          <div className="acc-tax-grid">
            {taxes.map((tax) => {
              const editing = editingId === tax.tax_id;
              const Icon = ICONS[tax.tax_name] || BadgePercent;

              return (
                <div className="acc-tax-card" key={tax.tax_id}>
                  <div className="acc-tax-card-top">
                    <strong>{tax.tax_name}</strong>

                    <Icon
                      size={26}
                      strokeWidth={1.8}
                      className="acc-tax-card-icon"
                    />
                  </div>

                  {editing ? (
                    <div className="acc-tax-edit">
                      <label htmlFor={`tax-${tax.tax_id}`}>
                        Percentage (%)
                      </label>

                      <input
                        id={`tax-${tax.tax_id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={editValue}
                        onChange={(event) =>
                          setEditValue(event.target.value)
                        }
                      />

                      <div className="acc-tax-actions">
                        <button
                          type="button"
                          className="acc-tax-save"
                          disabled={saving}
                          onClick={() => saveTax(tax.tax_id)}
                        >
                          <Check size={16} />
                          {saving ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          className="acc-tax-cancel"
                          disabled={saving}
                          onClick={cancelEditing}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="acc-tax-rate">
                        {Number(tax.tax_percentage).toFixed(2)}%
                      </div>

                      <p>
                        {DESCRIPTIONS[tax.tax_name] ||
                          tax.tax_name}
                      </p>

                      <button
                        type="button"
                        className="acc-tax-edit-button"
                        disabled={saving}
                        onClick={() => startEditing(tax)}
                      >
                        <Pencil size={15} strokeWidth={1.8} />
                        Edit Rate
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="acc-info-note">
          These percentages are configurable accounting settings.
          Actual statutory deductions depend on applicable rules.
        </p>
      </div>
    </section>
  );
}
