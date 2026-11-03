import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Landmark, Plus, X, Pencil } from "lucide-react";

import "../../CSS/BankDetails.css";

const BANK_API = "http://localhost:4000/api/user/bank-accounts";

const initialForm = {
  beneficiaryName: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  branch: "",
  accountType: "Savings",
  upiId: "",
  primary: false,
};

export default function BankDetails() {
  const [banks, setBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [primaryUpdatingId, setPrimaryUpdatingId] = useState(null);

  const [fetchError, setFetchError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getAuthConfig = () => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      throw new Error("Please log in to manage your bank accounts.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const getErrorMessage = (err, fallback) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("authUser");

      return "Your session has expired. Please log in again.";
    }

    return err.response?.data?.message || err.message || fallback;
  };

  const fetchBankAccounts = useCallback(async (signal) => {
    try {
      setFetchError("");

      const config = getAuthConfig();

      const response = await axios.get(BANK_API, {
        ...config,
        ...(signal ? { signal } : {}),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load bank accounts."
        );
      }

      setBanks(response.data.accounts || []);
    } catch (err) {
      if (err.code === "ERR_CANCELED") {
        return;
      }

      console.error("Bank Accounts API error:", err);

      setFetchError(
        getErrorMessage(err, "Unable to load bank accounts.")
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchBankAccounts(controller.signal);

    return () => controller.abort();
  }, [fetchBankAccounts]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      primary: banks.length === 0,
    });

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const openEditModal = (bank) => {
    setEditingId(bank.bank_account_id);

    setForm({
      beneficiaryName: bank.account_holder || "",
      bankName: bank.bank_name || "",
      accountNumber: "",
      ifsc: bank.ifsc_code || "",
      branch: bank.branch || "",
      accountType: bank.account_type || "Savings",
      upiId: bank.upi_id || "",
      primary: Boolean(bank.is_primary),
    });

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccessMessage("");

    const accountNumber = form.accountNumber.trim();
    const ifsc = form.ifsc.trim().toUpperCase();

    if (!/^[0-9]{6,30}$/.test(accountNumber)) {
      setError("Enter a valid account number (6–30 digits).");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      setError("Enter a valid 11-character IFSC code.");
      return;
    }

    if (!form.beneficiaryName.trim()) {
      setError("Enter the account holder name.");
      return;
    }

    if (!form.bankName.trim()) {
      setError("Enter the bank name.");
      return;
    }

    if (!form.branch.trim()) {
      setError("Enter the bank branch.");
      return;
    }

    const payload = {
      account_holder: form.beneficiaryName.trim(),
      bank_name: form.bankName.trim(),
      account_number: accountNumber,
      ifsc_code: ifsc,
      branch: form.branch.trim(),
      account_type: form.accountType,
      upi_id: form.upiId.trim(),
    };

    setSaving(true);

    try {
      const config = getAuthConfig();

      let response;
      let accountId = editingId;

      if (editingId) {
        response = await axios.put(
          `${BANK_API}/${editingId}`,
          payload,
          config
        );
      } else {
        response = await axios.post(BANK_API, payload, config);
        accountId = response.data.bank_account_id;
      }

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to save bank account."
        );
      }

      // Primary account is managed by a separate backend API.
      if (form.primary && accountId) {
        const primaryResponse = await axios.patch(
          `${BANK_API}/${accountId}/primary`,
          {},
          config
        );

        if (!primaryResponse.data?.success) {
          throw new Error(
            primaryResponse.data?.message ||
              "Bank account saved, but setting primary failed."
          );
        }
      }

      setShowModal(false);
      setEditingId(null);
      setForm(initialForm);

      setSuccessMessage(
        editingId
          ? "Bank account updated successfully."
          : "Bank account added successfully."
      );

      await fetchBankAccounts();
    } catch (err) {
      console.error("Save bank account error:", err);

      setError(
        getErrorMessage(err, "Unable to save bank account.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (bankAccountId) => {
    if (primaryUpdatingId !== null) return;

    setFetchError("");
    setSuccessMessage("");
    setPrimaryUpdatingId(bankAccountId);

    try {
      const config = getAuthConfig();

      const response = await axios.patch(
        `${BANK_API}/${bankAccountId}/primary`,
        {},
        config
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to update primary bank account."
        );
      }

      setSuccessMessage(
        "Primary bank account updated successfully."
      );

      await fetchBankAccounts();
    } catch (err) {
      console.error("Set primary bank error:", err);

      setFetchError(
        getErrorMessage(err, "Unable to update primary bank account.")
      );
    } finally {
      setPrimaryUpdatingId(null);
    }
  };

  return (
    <div className="sks-bank-page">
      <div className="sks-bank-toolbar">
        <button
          type="button"
          className="sks-bank-add-btn"
          onClick={openAddModal}
          disabled={loading || Boolean(fetchError)}
        >
          <Plus size={17} />
          Add Bank
        </button>
      </div>

      {successMessage && (
        <p role="status" className="sks-bank-primary">
          {successMessage}
        </p>
      )}

      {fetchError && (
        <p role="alert" className="sks-bank-error">
          {fetchError}
        </p>
      )}

      <section className="sks-bank-card">
        <div className="sks-bank-card-heading">
          <div className="sks-bank-title">
            <Landmark size={19} />
            <h2>Bank Details</h2>
          </div>

          <span className="sks-bank-count">
            {banks.length} Records
          </span>
        </div>

        <div className="sks-bank-table-wrap">
          <table className="sks-bank-table">
            <thead>
              <tr>
                <th>Beneficiary Name</th>
                <th>Bank Name</th>
                <th>Acc/No</th>
                <th>IFSC</th>
                <th>Branch</th>
                <th>Acc Type</th>
                <th>Primary</th>
                <th>Verification</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="sks-bank-empty">
                    Loading bank accounts...
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={9} className="sks-bank-empty">
                    Unable to display bank accounts.
                  </td>
                </tr>
              ) : banks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="sks-bank-empty">
                    No bank accounts found.
                  </td>
                </tr>
              ) : (
                banks.map((bank) => (
                  <tr key={bank.bank_account_id}>
                    <td>{bank.account_holder}</td>

                    <td>{bank.bank_name}</td>

                    <td>{bank.masked_account_number}</td>

                    <td>{bank.ifsc_code}</td>

                    <td>{bank.branch || "—"}</td>

                    <td>{bank.account_type || "—"}</td>

                    <td>
                      <span
                        className={
                          bank.is_primary
                            ? "sks-bank-primary"
                            : "sks-bank-secondary"
                        }
                      >
                        {bank.is_primary ? "Yes" : "No"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          bank.is_verified
                            ? "sks-bank-primary"
                            : "sks-bank-secondary"
                        }
                      >
                        {bank.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="sks-bank-cancel"
                          onClick={() => openEditModal(bank)}
                          aria-label={`Edit ${bank.bank_name}`}
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        {!bank.is_primary && (
                          <button
                            type="button"
                            className="sks-bank-save"
                            disabled={primaryUpdatingId !== null}
                            onClick={() =>
                              handleSetPrimary(bank.bank_account_id)
                            }
                          >
                            {primaryUpdatingId === bank.bank_account_id
                              ? "Updating..."
                              : "Set Primary"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div
          className="sks-bank-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="sks-bank-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sks-bank-modal-title"
          >
            <div className="sks-bank-modal-header">
              <h2 id="sks-bank-modal-title">
                {editingId ? "Edit Bank Account" : "Add Bank Account"}
              </h2>

              <button
                type="button"
                className="sks-bank-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sks-bank-form-grid">
                <div className="sks-bank-field">
                  <label htmlFor="bank-beneficiary">
                    Beneficiary Name
                  </label>

                  <input
                    id="bank-beneficiary"
                    name="beneficiaryName"
                    value={form.beneficiaryName}
                    onChange={updateField}
                    required
                    maxLength={150}
                    placeholder="Enter account holder name"
                  />
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-name">
                    Bank Name
                  </label>

                  <input
                    id="bank-name"
                    name="bankName"
                    value={form.bankName}
                    onChange={updateField}
                    required
                    maxLength={100}
                    placeholder="Enter bank name"
                  />
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-account">
                    Account Number
                  </label>

                  <input
                    id="bank-account"
                    name="accountNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.accountNumber}
                    onChange={updateField}
                    required
                    minLength={6}
                    maxLength={30}
                    placeholder={
                      editingId
                        ? "Re-enter full account number"
                        : "Enter account number"
                    }
                  />

                  {editingId && (
                    <small>
                      For security, enter the complete account number
                      again when editing.
                    </small>
                  )}
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-ifsc">
                    IFSC Code
                  </label>

                  <input
                    id="bank-ifsc"
                    name="ifsc"
                    value={form.ifsc}
                    onChange={updateField}
                    required
                    maxLength={11}
                    placeholder="Example: SBIN0001234"
                  />
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-branch">
                    Branch
                  </label>

                  <input
                    id="bank-branch"
                    name="branch"
                    value={form.branch}
                    onChange={updateField}
                    required
                    maxLength={100}
                    placeholder="Enter branch"
                  />
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-type">
                    Account Type
                  </label>

                  <select
                    id="bank-type"
                    name="accountType"
                    value={form.accountType}
                    onChange={updateField}
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>

                <div className="sks-bank-field">
                  <label htmlFor="bank-upi">
                    UPI ID (Optional)
                  </label>

                  <input
                    id="bank-upi"
                    name="upiId"
                    value={form.upiId}
                    onChange={updateField}
                    maxLength={100}
                    placeholder="example@upi"
                  />
                </div>
              </div>

              <label className="sks-bank-checkbox">
                <input
                  type="checkbox"
                  name="primary"
                  checked={form.primary}
                  onChange={updateField}
                  disabled={saving}
                />
                Set as primary bank account
              </label>

              {error && (
                <p className="sks-bank-error" role="alert">
                  {error}
                </p>
              )}

              <div className="sks-bank-modal-actions">
                <button
                  type="button"
                  className="sks-bank-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sks-bank-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Bank"
                    : "Add Bank"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}