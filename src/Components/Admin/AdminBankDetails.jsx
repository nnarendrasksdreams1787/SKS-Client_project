import React, { useState, useEffect, useMemo } from 'react'
import { ADMIN_API_URL } from "../../Config/api";
import "./AdminCSS/AdminBankDetails.css";

// const initialAccounts = [
//   {
//     id: "BNK-1001",
//     memberId: "SKS001",
//     name: "Rahul Sharma",
//     bank: "State Bank of India",
//     accountNumber: "XXXXXX4821",
//     ifsc: "SBIN0001234",
//     accountType: "Savings",
//     addedDate: "2026-10-10",
//     status: "Verified",
//   },
//   {
//     id: "BNK-1002",
//     memberId: "SKS002",
//     name: "Sneha Joshi",
//     bank: "HDFC Bank",
//     accountNumber: "XXXXXX7392",
//     ifsc: "HDFC0001234",
//     accountType: "Savings",
//     addedDate: "2026-10-12",
//     status: "Pending",
//   },
//   {
//     id: "BNK-1003",
//     memberId: "SKS003",
//     name: "Amit Verma",
//     bank: "ICICI Bank",
//     accountNumber: "XXXXXX1567",
//     ifsc: "ICIC0001234",
//     accountType: "Current",
//     addedDate: "2026-10-14",
//     status: "Verified",
//   },
//   {
//     id: "BNK-1004",
//     memberId: "SKS004",
//     name: "Neha Kulkarni",
//     bank: "Axis Bank",
//     accountNumber: "XXXXXX9045",
//     ifsc: "UTIB0001234",
//     accountType: "Savings",
//     addedDate: "2026-10-17",
//     status: "Rejected",
//   },
//   {
//     id: "BNK-1005",
//     memberId: "SKS005",
//     name: "Vikas More",
//     bank: "Punjab National Bank",
//     accountNumber: "XXXXXX6210",
//     ifsc: "PUNB0001234",
//     accountType: "Savings",
//     addedDate: "2026-10-20",
//     status: "Pending",
//   },
// ];

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminBankDetails() {
  // const [accounts] = useState(initialAccounts);
  // const [search, setSearch] = useState("");
  // const [statusFilter, setStatusFilter] = useState("All");
  // const [typeFilter, setTypeFilter] = useState("All");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [selectedAccount, setSelectedAccount] = useState(null);

  // const pageSize = 5;

  // const verifiedCount = accounts.filter(
  //   (account) => account.status === "Verified"
  // ).length;

  // const pendingCount = accounts.filter(
  //   (account) => account.status === "Pending"
  // ).length;

  // const rejectedCount = accounts.filter(
  //   (account) => account.status === "Rejected"
  // ).length;


  // const filteredAccounts = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   return accounts.filter((account) => {
  //     const matchesSearch =
  //       !query ||
  //       account.name.toLowerCase().includes(query) ||
  //       account.memberId.toLowerCase().includes(query) ||
  //       account.bank.toLowerCase().includes(query) ||
  //       account.id.toLowerCase().includes(query);

  //     const matchesStatus =
  //       statusFilter === "All" || account.status === statusFilter;

  //     const matchesType =
  //       typeFilter === "All" || account.accountType === typeFilter;

  //     return matchesSearch && matchesStatus && matchesType;
  //   });
  // }, [accounts, search, statusFilter, typeFilter]);

  // const totalPages = Math.max(
  //   1,
  //   Math.ceil(filteredAccounts.length / pageSize)
  // );

  // const safePage = Math.min(currentPage, totalPages);

  // const visibleAccounts = filteredAccounts.slice(
  //   (safePage - 1) * pageSize,
  //   safePage * pageSize
  // );

  // const resetPage = () => setCurrentPage(1);

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [updatingVerification, setUpdatingVerification] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  const pageSize = 5;

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          search: search.trim(),
          status:
            statusFilter === "All"
              ? ""
              : statusFilter.toLowerCase(),
          page: String(currentPage),
          limit: String(pageSize),
        });

        const response = await fetch(
          `${ADMIN_API_URL}/bank-details?${params.toString()}`,
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
          throw new Error(data.message || "Unable to fetch bank details.");
        }

        const mappedAccounts = (data.bankDetails || []).map((item) => ({
          id: String(item.bank_account_id),
          memberId: item.referral_code || `User #${item.user_id}`,
          name: item.full_name || "N/A",
          bank: item.bank_name || "N/A",
          accountNumber: item.masked_account_number || "N/A",
          ifsc: item.ifsc_code || "N/A",
          accountType: item.is_primary ? "Primary" : "Additional",
          addedDate: item.created_at,
          status: item.is_verified ? "Verified" : "Unverified",

          bankAccountId: item.bank_account_id,
          userId: item.user_id,
          email: item.email,
          mobile: item.mobile,
          accountHolder: item.account_holder,
          upiId: item.upi_id,
          isPrimary: item.is_primary,
          isVerified: item.is_verified,
        }));

        setAccounts(mappedAccounts);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Bank details fetch error:", err);
        setError(err.message || "Unable to load bank details.");
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, [search, statusFilter, currentPage]);

  const verifiedCount = accounts.filter(
    (account) => account.isVerified
  ).length;

  const pendingCount = accounts.filter(
    (account) => !account.isVerified
  ).length;

  const rejectedCount = 0;

  const filteredAccounts = accounts;

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const safePage = pagination.page || currentPage;

  const visibleAccounts = filteredAccounts;

  const resetPage = () => setCurrentPage(1);

  const handleToggleVerification = async () => {
    if (!selectedAccount || updatingVerification) return;

    const newVerificationStatus = !selectedAccount.isVerified;

    try {
      setUpdatingVerification(true);
      setError("");

      const response = await fetch(
        `${ADMIN_API_URL}/bank-details/${selectedAccount.bankAccountId}/verification`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            is_verified: newVerificationStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update verification status.");
      }

      const updatedAccount = {
        ...selectedAccount,
        isVerified: newVerificationStatus,
        status: newVerificationStatus ? "Verified" : "Unverified",
      };

      setAccounts((previousAccounts) =>
        previousAccounts.map((account) =>
          account.bankAccountId === selectedAccount.bankAccountId
            ? updatedAccount
            : account
        )
      );

      setSelectedAccount(updatedAccount);
    } catch (err) {
      console.error("Bank verification update error:", err);
      setError(err.message || "Unable to update verification status.");
    } finally {
      setUpdatingVerification(false);
    }
  };



  return (
    <main className="admin-bank-details">
      <header className="admin-bank-heading">
        <div>
          <h1>Bank Details</h1>
          <p>Review member bank accounts and verification statuses.</p>
        </div>
      </header>

      <section className="admin-bank-summary">
        <article className="bank-summary-card">
          <div className="bank-summary-top">
            <span>Total Accounts</span>
            <span className="bank-summary-icon blue">▤</span>
          </div>
          {/* <strong>{accounts.length}</strong>
           */}
          <strong>{pagination.total}</strong>
          <small>Member accounts submitted</small>
        </article>

        <article className="bank-summary-card">
          <div className="bank-summary-top">
            <span>Verified</span>
            <span className="bank-summary-icon green">✓</span>
          </div>
          <strong>{verifiedCount}</strong>
          <small>Verified in sample data</small>
        </article>

        <article className="bank-summary-card">
          <div className="bank-summary-top">
            <span>Pending Review</span>
            <span className="bank-summary-icon amber">◷</span>
          </div>
          <strong>{pendingCount}</strong>
          <small>Awaiting verification</small>
        </article>

        <article className="bank-summary-card">
          <div className="bank-summary-top">
            <span>Rejected</span>
            <span className="bank-summary-icon red">!</span>
          </div>
          <strong>{rejectedCount}</strong>
          <small>Require follow-up</small>
        </article>
      </section>

      <section className="admin-bank-panel">
        <div className="bank-panel-heading">
          <div>
            <h2>Member Bank Accounts</h2>
            <p>Search accounts and review submitted bank information.</p>
          </div>
          <span className="bank-record-count">
            {filteredAccounts.length} accounts
          </span>
        </div>

        <div className="bank-filters">
          <label className="bank-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search member, bank or account ID..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />
          </label>

          <select
            aria-label="Filter bank accounts by verification status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              resetPage();
            }}
          >
            {/* <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option> */}

            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>

          <select
            aria-label="Filter by account type"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              resetPage();
            }}
          >
            {/* <option value="All">All Account Types</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option> */}

            <option value="All">Account Role</option>
            <option value="Primary" disabled>Primary (filter not available)</option>
            <option value="Additional" disabled>Additional (filter not available)</option>
          </select>
        </div>

        <div className="bank-table-wrap">
          <table className="bank-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Bank Name</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Account Type</th>
                <th>Added Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="8" className="bank-empty">
                    Loading bank details...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="8" className="bank-empty">
                    {error}
                  </td>
                </tr>
              )}


              {visibleAccounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <div className="bank-member-cell">
                      <span className="bank-member-avatar">
                        {account.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div>
                        <strong>{account.name}</strong>
                        <span>{account.memberId}</span>
                      </div>
                    </div>
                  </td>
                  <td>{account.bank}</td>
                  <td className="bank-account-number">
                    {account.accountNumber}
                  </td>
                  <td>{account.ifsc}</td>
                  <td>{account.accountType}</td>
                  <td>{formatDate(account.addedDate)}</td>
                  <td>
                    <span
                      className={`bank-status bank-status-${account.status.toLowerCase()}`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="bank-view-button"
                      onClick={() => setSelectedAccount(account)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !error && visibleAccounts.length === 0 && (
                <tr>
                  <td colSpan="8" className="bank-empty">
                    <strong>No bank accounts found</strong>
                    <p>Try changing your search or filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bank-pagination">
          <span>
            {/* Showing{" "}
            {filteredAccounts.length === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {"–"}
            {Math.min(safePage * pageSize, filteredAccounts.length)} of{" "}
            {filteredAccounts.length} */}

            Showing{" "}
            {pagination.total === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {"–"}
            {Math.min(safePage * pageSize, pagination.total)} of{" "}
            {pagination.total}
          </span>

          <div>
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              Previous
            </button>
            <span>{safePage} / {totalPages}</span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedAccount && (
        <div
          className="bank-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedAccount(null);
            }
          }}
        >
          <section
            className="bank-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-modal-title"
          >
            <div className="bank-modal-heading">
              <div>
                <span>Account Information</span>
                <h2 id="bank-modal-title">{selectedAccount.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close bank details"
                onClick={() => setSelectedAccount(null)}
              >
                ×
              </button>
            </div>

            <div className="bank-modal-member">
              <span className="bank-member-avatar bank-modal-avatar">
                {selectedAccount.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div>
                <strong>{selectedAccount.memberId}</strong>
                <span>{selectedAccount.id}</span>
              </div>
              <span
                className={`bank-status bank-status-${selectedAccount.status.toLowerCase()}`}
              >
                {selectedAccount.status}
              </span>
            </div>

            <div className="bank-modal-fields">
              <div>
                <span>Bank Name</span>
                <strong>{selectedAccount.bank}</strong>
              </div>
              <div>
                <span>Account Number</span>
                <strong>{selectedAccount.accountNumber}</strong>
              </div>
              <div>
                <span>IFSC Code</span>
                <strong>{selectedAccount.ifsc}</strong>
              </div>
              <div>
                <span>Account Type</span>
                <strong>{selectedAccount.accountType}</strong>
              </div>
              <div>
                <span>Date Added</span>
                <strong>{formatDate(selectedAccount.addedDate)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="bank-modal-close-button"
              onClick={() => setSelectedAccount(null)}
            >
              Close Details
            </button>

            <button
              type="button"
              onClick={handleToggleVerification}
              disabled={updatingVerification}
            >
              {updatingVerification
                ? "Updating..."
                : selectedAccount.isVerified
                  ? "Mark as Unverified"
                  : "Verify Account"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
