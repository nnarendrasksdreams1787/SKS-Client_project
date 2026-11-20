
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_URL
).replace(/\/+$/, "");

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(amount) || 0);

const displayDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN");
};

const displayValue = (value) =>
  value === null || value === undefined || value === ""
    ? "—"
    : String(value);

export default function ManagerSales() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSales() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/manager/sales`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error(
            "Manager API authentication required (401)."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Current account does not have Manager access (403)."
          );
        }

        if (!response.ok) {
          throw new Error("Unable to load sales records.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.sales)) {
          throw new Error("Invalid sales API response.");
        }

        setSales(result.sales);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setSales([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSales();

    return () => controller.abort();
  }, []);

  const orders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sales.filter((sale) => {
      const searchableText = [
        sale.order_number,
        sale.order_id,
        sale.buyer_name,
        sale.user_id,
        sale.buyer_reference_id,
        sale.referrer_name,
        sale.referrer_reference_id,
        sale.book_name,
        sale.payment_gateway,
      ]
        .map(displayValue)
        .join(" ")
        .toLowerCase();

      const paymentStatus = String(
        sale.payment_status || sale.order_status || ""
      ).toLowerCase();

      return (
        searchableText.includes(term) &&
        (status === "all" || paymentStatus === status)
      );
    });
  }, [sales, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(orders.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;

    return orders.slice(startIndex, startIndex + pageSize);
  }, [orders, safePage, pageSize]);

  const startRecord =
    orders.length === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const endRecord = Math.min(
    safePage * pageSize,
    orders.length
  );

  // One order can contain multiple book rows.
  // Count unique orders to avoid duplicate totals.
  const uniqueOrders = useMemo(() => {
    const map = new Map();

    for (const sale of sales) {
      if (!map.has(String(sale.order_id))) {
        map.set(String(sale.order_id), sale);
      }
    }

    return Array.from(map.values());
  }, [sales]);

  const successfulOrders = uniqueOrders.filter(
    (order) => order.order_status === "paid"
  );

  const pendingOrders = uniqueOrders.filter(
    (order) => order.order_status === "pending"
  );

  const totalSales = successfulOrders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

  return (
    <section className="mgr-page">
      <div className="mgr-page-heading">
        <div>
          {/* <span className="mgr-eyebrow">SALES OVERVIEW</span> */}
          <h2>Book Sales Records</h2>
          <p>
            View book purchases, buyers, reference IDs and
            payment details.
          </p>
        </div>
        {/* <span className="mgr-access-label">Live Data</span> */}
      </div>

      {error && (
        <div className="mgr-security-note" role="alert">
          {error}
        </div>
      )}

      <div className="mgr-stat-grid">
        <div className="mgr-stat-card">
          <span>Total Orders</span>
          <strong>{uniqueOrders.length}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Successful Sales</span>
          <strong>{successfulOrders.length}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Total Sales Amount</span>
          <strong>{money(totalSales)}</strong>
        </div>

        <div className="mgr-stat-card">
          <span>Pending Orders</span>
          <strong>{pendingOrders.length}</strong>
        </div>
      </div>

      <div className="mgr-panel">
        <div className="mgr-panel-heading">
          <h3>All Book Sales</h3>
          <span>{orders.length} book records</span>
        </div>

        <div className="mgr-filters">
          <input
            type="search"
            placeholder="Search order, buyer, book, reference ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Payments</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="mgr-table-scroll">
          <table className="mgr-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Buyer</th>
                <th>Reference ID</th>
                <th>Book</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="mgr-empty">
                    Loading sales records...
                  </td>
                </tr>
              ) : (
                <>
                  {paginatedOrders.map((sale) => {
                    const paymentStatus = String(
                      sale.payment_status ||
                      sale.order_status ||
                      "unknown"
                    ).toLowerCase();

                    return (
                      <tr key={sale.order_item_id}>
                        <td className="mgr-cell-strong">
                          {sale.order_number}
                        </td>

                        <td>{displayDate(sale.order_date)}</td>

                        <td>
                          <strong>{sale.buyer_name}</strong>
                          <small>User ID: {sale.user_id}</small>
                        </td>

                        <td>
                          {displayValue(sale.buyer_reference_id)}
                        </td>

                        <td>{sale.book_name}</td>

                        <td>{money(sale.line_total)}</td>

                        <td>
                          <span
                            className={`mgr-status mgr-status-${paymentStatus}`}
                          >
                            {paymentStatus}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="mgr-view-button"
                            onClick={() => setSelectedOrder(sale)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="8" className="mgr-empty">
                        {error
                          ? "Sales records could not be loaded."
                          : "No matching sales found."}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>


        <div className="mgr-pagination">
          <div className="mgr-pagination-info">
            Showing <strong>{startRecord}–{endRecord}</strong> of{" "}
            <strong>{orders.length}</strong> records
          </div>

          <div className="mgr-pagination-actions">
            <label htmlFor="mgr-page-size">Rows per page</label>

            <select
              id="mgr-page-size"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              
              
            </select>

            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              Previous
            </button>

            <div className="mgr-page-numbers">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safePage) <= 1
                )
                .map((page, index, visiblePages) => (
                  <React.Fragment key={page}>
                    {index > 0 &&
                      page - visiblePages[index - 1] > 1 && (
                        <span className="mgr-page-dots">...</span>
                      )}

                    <button
                      type="button"
                      className={
                        safePage === page ? "mgr-page-active" : ""
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {selectedOrder && (
        <div
          className="mgr-modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="mgr-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Order details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mgr-modal-header">
              <div>
                <span className="mgr-eyebrow">ORDER DETAILS</span>
                <h3>{selectedOrder.order_number}</h3>
              </div>

              <button
                type="button"
                className="mgr-close-button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            <div className="mgr-detail-grid">
              <div>
                <span>Buyer</span>
                <strong>{selectedOrder.buyer_name}</strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>{selectedOrder.user_id}</strong>
              </div>

              <div>
                <span>Buyer Reference ID</span>
                <strong>
                  {displayValue(selectedOrder.buyer_reference_id)}
                </strong>
              </div>

              <div>
                <span>Referrer Name</span>
                <strong>
                  {displayValue(selectedOrder.referrer_name)}
                </strong>
              </div>

              <div>
                <span>Referrer Reference ID</span>
                <strong>
                  {displayValue(selectedOrder.referrer_reference_id)}
                </strong>
              </div>

              <div>
                <span>Book</span>
                <strong>{selectedOrder.book_name}</strong>
              </div>

              <div>
                <span>Book Amount</span>
                <strong>{money(selectedOrder.line_total)}</strong>
              </div>

              <div>
                <span>Order Total</span>
                <strong>{money(selectedOrder.total_amount)}</strong>
              </div>

              <div>
                <span>Payment Gateway</span>
                <strong>
                  {displayValue(selectedOrder.payment_gateway)}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>
                <strong>
                  {displayValue(selectedOrder.payment_status)}
                </strong>
              </div>

              <div>
                <span>Order Status</span>
                <strong>
                  {displayValue(selectedOrder.order_status)}
                </strong>
              </div>

              <div>
                <span>Purchase Date</span>
                <strong>
                  {displayDate(selectedOrder.order_date)}
                </strong>
              </div>
            </div>

            <h4 className="mgr-section-title">
              Referral Commission Breakdown
            </h4>

            <p className="mgr-security-note">
              Commission data is not connected yet.
              No commission amounts are being estimated.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}
