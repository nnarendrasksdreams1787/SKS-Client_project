
import React, { useEffect, useMemo, useState } from "react";
import {
  UsersRound,
  Wallet,
  LockKeyhole,
  Landmark,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

const PAGE_SIZE = 5;
const GOLD = "#C69232";

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export default function AccountsUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/accounts/users`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load users"
          );
        }

        if (!controller.signal.aborted) {
          setUsers(
            Array.isArray(data.users) ? data.users : []
          );
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

    loadUsers();

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => {
    return users.reduce(
      (result, user) => {
        result.totalAvailable += Number(
          user.available_balance || 0
        );

        result.totalReserved += Number(
          user.reserved_balance || 0
        );

        result.bankAccounts += Number(
          user.bank_accounts_count || 0
        );

        if (
          String(user.status || "").toLowerCase() ===
          "active"
        ) {
          result.activeUsers += 1;
        }

        return result;
      },
      {
        totalAvailable: 0,
        totalReserved: 0,
        bankAccounts: 0,
        activeUsers: 0,
      }
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = [
        user.full_name,
        user.reference_id,
        user.mobile,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term)
      );

      const matchesStatus =
        statusFilter === "all" ||
        String(user.status || "").toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredUsers.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredUsers, currentPage]);

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const updateStatus = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const statCards = [
    {
      label: "Registered Users",
      value: users.length,
      description: `${summary.activeUsers} active accounts`,
      Icon: UsersRound,
    },
    {
      label: "Available Balance",
      value: formatAmount(summary.totalAvailable),
      description: "Total user wallet availability",
      Icon: Wallet,
    },
    {
      label: "Reserved Balance",
      value: formatAmount(summary.totalReserved),
      description: "Total reserved wallet funds",
      Icon: LockKeyhole,
    },
    {
      label: "Bank Accounts",
      value: summary.bankAccounts,
      description: "Linked bank account records",
      Icon: Landmark,
    },
  ];

  return (
    <section className="acc-page acc-users-page">
      <div className="acc-page-heading acc-users-heading">
        <div>
          <span className="acc-eyebrow">
            USER ACCOUNT MANAGEMENT
          </span>

          <h2>User Accounts</h2>

          <p>
            Review registered users, wallet balances and
            financial account information.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="acc-users-stats">
        {statCards.map(
          ({ label, value, description, Icon }) => (
            <div
              className="acc-users-stat-card"
              key={label}
            >
              <div className="acc-users-stat-top">
                <span>{label}</span>

                <span className="acc-users-stat-icon">
                  <Icon
                    size={26}
                    strokeWidth={1.8}
                    color={GOLD}
                  />
                </span>
              </div>

              <strong>{value}</strong>
              <small>{description}</small>
            </div>
          )
        )}
      </div>

      {/* USER DIRECTORY */}
      <div className="acc-panel acc-users-directory">
        <div className="acc-users-toolbar">
          <div className="acc-users-search">
            <Search
              size={18}
              strokeWidth={1.8}
              color="#8A9BAA"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                updateSearch(event.target.value)
              }
              placeholder="Search name, reference ID or mobile..."
              aria-label="Search user accounts"
            />
          </div>

          <select
            className="acc-users-filter"
            value={statusFilter}
            onChange={(event) =>
              updateStatus(event.target.value)
            }
            aria-label="Filter users by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {loading && (
          <div className="acc-users-message">
            Loading user accounts...
          </div>
        )}

        {error && (
          <div
            className="acc-users-message acc-users-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="acc-users-table-scroll">
              <table className="acc-users-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Reference ID</th>
                    <th>Mobile</th>
                    <th>Available</th>
                    <th>Reserved</th>
                    <th>Bank A/C</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => {
                    const status = String(
                      user.status || "unknown"
                    ).toLowerCase();

                    return (
                      <tr key={user.user_id}>
                        <td>
                          <div className="acc-users-person">
                            <div className="acc-users-person-info">
                              <strong>
                                {user.full_name ||
                                  "Unnamed User"}
                              </strong>

                              <small>
                                User #{user.user_id}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="acc-users-reference">
                            {user.reference_id || "—"}
                          </span>
                        </td>

                        <td>{user.mobile || "—"}</td>

                        <td className="acc-users-money">
                          {formatAmount(
                            user.available_balance
                          )}
                        </td>

                        <td className="acc-users-money">
                          {formatAmount(
                            user.reserved_balance
                          )}
                        </td>

                        <td>
                          <span className="acc-users-bank-count">
                            {user.bank_accounts_count ?? 0}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`acc-users-status ${
                              status === "active"
                                ? "acc-users-status-active"
                                : "acc-users-status-other"
                            }`}
                          >
                            <span className="acc-users-status-dot" />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="acc-users-empty">
                <strong>
                  No matching users found
                </strong>
                <p>
                  Try changing your search or status
                  filter.
                </p>
              </div>
            )}

            <div className="acc-users-pagination">
              <span>
                {filteredUsers.length === 0
                  ? "Showing 0 users"
                  : `Showing ${
                      (currentPage - 1) *
                        PAGE_SIZE +
                      1
                    }–${Math.min(
                      currentPage * PAGE_SIZE,
                      filteredUsers.length
                    )} of ${
                      filteredUsers.length
                    } users`}
              </span>

              <div className="acc-users-page-actions">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage >= totalPages
                  }
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                    )
                  }
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
