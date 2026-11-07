import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminCSS/AdminAllOrders.css";

const API_URL = "http://localhost:4000/api/admin" || "https://sks-serverproject-new.onrender.com/api/admin"



// const initialOrders = [
//   {
//     id: "SKS-ORD-1001",
//     customer: "Rahul Sharma",
//     email: "rahul@example.com",
//     date: "2026-10-21",
//     items: 2,
//     amount: 2499,
//     payment: "Paid",
//     status: "Delivered",
//   },
//   {
//     id: "SKS-ORD-1002",
//     customer: "Priya Patil",
//     email: "priya@example.com",
//     date: "2026-10-22",
//     items: 1,
//     amount: 1299,
//     payment: "Paid",
//     status: "Processing",
//   },
//   {
//     id: "SKS-ORD-1003",
//     customer: "Amit Verma",
//     email: "amit@example.com",
//     date: "2026-10-22",
//     items: 3,
//     amount: 3899,
//     payment: "Pending",
//     status: "Pending",
//   },
//   {
//     id: "SKS-ORD-1004",
//     customer: "Sneha Joshi",
//     email: "sneha@example.com",
//     date: "2026-10-23",
//     items: 1,
//     amount: 799,
//     payment: "Paid",
//     status: "Shipped",
//   },
//   {
//     id: "SKS-ORD-1005",
//     customer: "Karan Singh",
//     email: "karan@example.com",
//     date: "2026-10-23",
//     items: 2,
//     amount: 1799,
//     payment: "Failed",
//     status: "Cancelled",
//   },
//   {
//     id: "SKS-ORD-1006",
//     customer: "Neha Kulkarni",
//     email: "neha@example.com",
//     date: "2026-10-24",
//     items: 2,
//     amount: 2199,
//     payment: "Paid",
//     status: "Processing",
//   },
// ];

const currency = (amount, currencyCode = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode || "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

  


const formatOrderStatus = (status = "") => {
  const labels = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    cancelled: "Cancelled",
    partially_refunded: "Partially Refunded",
    refunded: "Refunded",
  }

  return labels[status] || status;
}


const formatPaymentStatus = (status = "") => {
  const labels = {
    initiated: "Initiated",
    authorized: "Authorized",
    success: "Paid",
    failed: "Failed",
    partially_refunded: "Patially Refunded",
    refunded: "Refunded",
  };

  return labels[status] || "No Payment";
}


export default function AdminAllOrders() {
  const navigate = useNavigate();

 

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");


  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });


  const pageSize = 5;


  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: currentPage,
          limit: pageSize,
        };

        if (search.trim()) params.search = search.trim();

        if (statusFilter !== "All") {
          params.status = statusFilter;
        }

        if (dateFilter) {
          params.fromDate = dateFilter;
          params.toDate = dateFilter;
        }

        const response = await axios.get(`${API_URL}/orders`, {
          params,
          withCredentials: true,
        });

        if (cancelled) return;

        const rows = (response.data.orders || []).map((row) => ({
          ...row,
          id: row.order_number,
          orderId: row.order_id,
          customer: row.full_name || "Unknown Customer",
          email: row.email || "",
          date: row.created_at
            ? String(row.created_at).slice(0, 10)
            : "",
          items: Number(row.item_count) || 0,
          amount: Number(row.total_amount) || 0,
          currency: row.currency || "INR",
          rawStatus: row.status,
          status: formatOrderStatus(row.status),
          rawPaymentStatus: row.payment_status || "",
          payment: formatPaymentStatus(row.payment_status),
        }));

        setOrders(rows);
        setPagination(
          response.data.pagination || {
            page: currentPage,
            limit: pageSize,
            total: rows.length,
            totalPages: 1,
          }
        );
      } catch (err) {
        if (cancelled) return;

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          window.location.assign("/admin/login");
          return;
        }

        setError(
          err.response?.data?.message ||
          "Unable to load orders. Please try again."
        );
        setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [search, statusFilter, dateFilter, currentPage]);



  // const filteredOrders = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   return orders.filter((order) => {
  //     const matchesSearch =
  //       !query ||
  //       order.id.toLowerCase().includes(query) ||
  //       order.customer.toLowerCase().includes(query) ||
  //       order.email.toLowerCase().includes(query);

  //     const matchesStatus =
  //       statusFilter === "All" || order.status === statusFilter;

  //     const matchesPayment =
  //       paymentFilter === "All" || order.payment === paymentFilter;

  //     const matchesDate = !dateFilter || order.date === dateFilter;

  //     return (
  //       matchesSearch &&
  //       matchesStatus &&
  //       matchesPayment &&
  //       matchesDate
  //     );
  //   });
  // }, [orders, search, statusFilter, paymentFilter, dateFilter]);

  const filteredOrders = useMemo(() => {
    if (paymentFilter === "All") return orders;

    return orders.filter(
      (order) => order.payment === paymentFilter
    )
  }, [orders, paymentFilter]);


  const totalPages = Math.max(
    1,
    // Math.ceil(filteredOrders.length / pageSize)
    pagination.totalPages || 1
  );

  const safePage = Math.min(currentPage, totalPages);

  // const paginatedOrders = filteredOrders.slice(
  //   (safePage - 1) * pageSize,
  //   safePage * pageSize
  // );

  const paginatedOrders = filteredOrders;

  const totalRevenue = orders
    .filter((order) => order.rawStatus === "Paid")
    .reduce((sum, order) => sum + order.amount, 0);

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const processingCount = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const openOrderDetails = async (order) => {
    setSelectedOrder(order);
    setOrderDetails(null);
    setDetailsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/orders/${order.orderId}`,
        { withCredentials: true }
      );

      setOrderDetails(response.data);
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        window.location.assign("/admin/login");
        return;
      }

      setNotice(
        err.response?.data?.message ||
        "Unable to load order details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };



  const updateStatus = (orderId, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

    setSelectedOrder((previous) =>
      previous?.id === orderId
        ? { ...previous, status: newStatus }
        : previous
    );

    setNotice(`Order ${orderId} updated to ${newStatus}.`);

    window.setTimeout(() => setNotice(""), 3000);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders__header">
        <div>
          <span className="admin-orders__eyebrow">
            ORDER MANAGEMENT
          </span>
          <h1>All Orders</h1>
          <p>View, track, and manage customer orders.</p>
        </div>

        <button
          className="admin-orders__secondary-btn"
          onClick={() => {
            const headers = [
              "Order ID",
              "Customer",
              "Email",
              "Date",
              "Items",
              "Amount",
              "Payment",
              "Status",
            ];

            const rows = orders.map((order) => [
              order.id,
              order.customer,
              order.email,
              order.date,
              order.items,
              order.amount,
              order.payment,
              order.status,
            ]);

            const csv = [headers, ...rows]
              .map((row) =>
                row
                  .map(
                    (value) =>
                      `"${String(value).replace(/"/g, '""')}"`
                  )
                  .join(",")
              )
              .join("\n");

            const blob = new Blob([csv], {
              type: "text/csv;charset=utf-8;",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "sks-dream-orders.csv";
            link.click();

            URL.revokeObjectURL(url);
          }}
        >
          <span aria-hidden="true">↓</span> Export CSV
        </button>
      </div>

      {notice && (
        <div className="admin-orders__notice" role="status">
          {notice}
        </div>
      )}

      <div className="admin-orders__stats">
        <div className="admin-orders__stat-card">
          <div className="admin-orders__stat-top">
            <span>Total Orders</span>
            <span className="admin-orders__stat-icon">▤</span>
          </div>
          <strong>{orders.length}</strong>
          <small>Orders in this view</small>
        </div>

        <div className="admin-orders__stat-card">
          <div className="admin-orders__stat-top">
            <span>Paid Order Value</span>
            <span className="admin-orders__stat-icon">₹</span>
          </div>
          <strong>{currency(totalRevenue)}</strong>
          <small>Orders marked as paid</small>
        </div>

        <div className="admin-orders__stat-card">
          <div className="admin-orders__stat-top">
            <span>Processing</span>
            <span className="admin-orders__stat-icon">◷</span>
          </div>
          <strong>{processingCount}</strong>
          <small>Orders being prepared</small>
        </div>

        <div className="admin-orders__stat-card">
          <div className="admin-orders__stat-top">
            <span>Pending</span>
            <span className="admin-orders__stat-icon">!</span>
          </div>
          <strong>{pendingCount}</strong>
          <small>Orders awaiting action</small>
        </div>
      </div>

      <section className="admin-orders__panel">
        <div className="admin-orders__panel-heading">
          <div>
            <h2>Order List</h2>
            <p>Search and manage all customer orders.</p>
          </div>

          <span className="admin-orders__count">
            {filteredOrders.length} orders
          </span>
        </div>

        <div className="admin-orders__filters">
          <div className="admin-orders__search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search order ID, customer..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search orders"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by order status"
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(event) => {
              setPaymentFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by payment status"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) => {
              setDateFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by order date"
          />

          <button
            className="admin-orders__reset-btn"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="admin-orders__table-wrap">
          {loading && <p>Loading orders...</p>}

          {error && (
            <div className="admin-orders__notice" role="alert">
              {error}
              <button onClick={() => setCurrentPage((page) => page)}>
                Retry
              </button>
            </div>
          )}
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>ITEMS</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <button
                      className="admin-orders__order-link"
                      // onClick={() => setSelectedOrder(order)}
                      onClick={() => openOrderDetails(order)}
                    >
                      {order.id}
                    </button>
                  </td>

                  <td>
                    <div className="admin-orders__customer">
                      <span className="admin-orders__avatar">
                        {order.customer
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>

                      <div>
                        <strong>{order.customer}</strong>
                        <small>{order.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    {new Date(
                      `${order.date}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td>{order.items}</td>
                  <td className="admin-orders__amount">
                    {currency(order.amount)}
                  </td>

                  <td>
                    <span
                      className={`admin-orders__badge admin-orders__badge--payment-${order.payment.toLowerCase()}`}
                    >
                      {order.payment}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`admin-orders__badge admin-orders__badge--status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="admin-orders__view-btn"
                      // onClick={() => setSelectedOrder(order)}
                      onClick={() => openOrderDetails(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="admin-orders__empty"
                  >
                    <span aria-hidden="true">⌕</span>
                    <strong>No orders found</strong>
                    <small>
                      Try changing your search or filter options.
                    </small>
                    <button onClick={resetFilters}>
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-orders__pagination">
          <span>
            Showing{" "}
            {filteredOrders.length === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {" "}to{" "}
            {Math.min(safePage * pageSize, filteredOrders.length)}
            {" "}of {filteredOrders.length} orders
          </span>

          <div>
            <button
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              Previous
            </button>

            <span className="admin-orders__page-number">
              {safePage} / {totalPages}
            </span>

            <button
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedOrder && (
        <div
          className="admin-orders__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="admin-orders__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-modal-title"
          >
            <div className="admin-orders__modal-header">
              <div>
                <span>ORDER DETAILS</span>
                <h2 id="admin-order-modal-title">
                  {selectedOrder.id}
                </h2>
              </div>

              <button
                className="admin-orders__close-btn"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                ×
              </button>
            </div>

            {/* <div className="admin-orders__modal-body">
              <div className="admin-orders__detail-grid">
                <div>
                  <small>Customer</small>
                  <strong>{selectedOrder.customer}</strong>
                  <span>{selectedOrder.email}</span>
                </div>

                <div>
                  <small>Order Date</small>
                  <strong>{selectedOrder.date}</strong>
                </div>

                <div>
                  <small>Items</small>
                  <strong>{selectedOrder.items}</strong>
                </div>

                <div>
                  <small>Order Amount</small>
                  <strong>{currency(selectedOrder.amount)}</strong>
                </div>

                <div>
                  <small>Payment Status</small>
                  <strong>{selectedOrder.payment}</strong>
                </div>

                <div>
                  <small>Order Status</small>
                  <strong>{selectedOrder.status}</strong>
                </div>
              </div>

              <div className="admin-orders__status-editor">
                <label htmlFor="admin-order-status">
                  Update order status
                </label>

                <select
                  id="admin-order-status"
                  value={selectedOrder.status}
                  onChange={(event) =>
                    updateStatus(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div> */}


            <div className="admin-orders__modal-body">
              <div className="admin-orders__detail-grid">
                <div>
                  <small>Customer</small>
                  <strong>{selectedOrder.customer}</strong>
                  <span>{selectedOrder.email}</span>
                </div>

                <div>
                  <small>Order Date</small>
                  <strong>{selectedOrder.date}</strong>
                </div>

                <div>
                  <small>Items</small>
                  <strong>{selectedOrder.items}</strong>
                </div>

                <div>
                  <small>Order Amount</small>
                  <strong>
                    {currency(selectedOrder.amount, selectedOrder.currency)}
                  </strong>
                </div>

                <div>
                  <small>Payment Status</small>
                  <strong>{selectedOrder.payment}</strong>
                </div>

                <div>
                  <small>Order Status</small>
                  <strong>{selectedOrder.status}</strong>
                </div>
              </div>

              {detailsLoading && <p>Loading order details...</p>}

              {!detailsLoading && orderDetails && (
                <>
                  <h3>Order Items</h3>

                  {orderDetails.items?.length ? (
                    orderDetails.items.map((item) => (
                      <div key={item.order_item_id}>
                        <strong>{item.product_title_snapshot}</strong>
                        <span>
                          {" "}× {item.quantity} —{" "}
                          {currency(item.line_total, selectedOrder.currency)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No items found.</p>
                  )}

                  <h3>Payments</h3>

                  {orderDetails.payments?.length ? (
                    orderDetails.payments.map((payment) => (
                      <div key={payment.payment_id}>
                        <span>{formatPaymentStatus(payment.status)}</span>
                        {" — "}
                        <span>
                          {currency(payment.amount, payment.currency)}
                        </span>

                        {payment.gateway_txn_id && (
                          <small>
                            {" "}Transaction: {payment.gateway_txn_id}
                          </small>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No payment records found.</p>
                  )}

                  <h3>Refunds</h3>

                  {orderDetails.refunds?.length ? (
                    orderDetails.refunds.map((refund) => (
                      <div key={refund.refund_id}>
                        {refund.status} —{" "}
                        {currency(refund.amount, refund.currency)}
                      </div>
                    ))
                  ) : (
                    <p>No refunds found.</p>
                  )}
                </>
              )}

              <div className="admin-orders__status-editor">
                <label>Order status</label>
                <strong>{selectedOrder.status}</strong>
                <small>
                  Status changes are disabled until the backend
                  update workflow is implemented.
                </small>
              </div>
            </div>


            <div className="admin-orders__modal-footer">
              <button
                className="admin-orders__secondary-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
