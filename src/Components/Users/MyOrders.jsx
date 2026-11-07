import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, ShoppingBag } from "lucide-react";
import "../../CSS/MyOrders.css";

export default function MyOrders() {
  // ==========================================
  // STATES
  // ==========================================

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ORDERS FROM BACKEND
  // ==========================================

  const fetchOrders = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setOrders([]);
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/user/orders" || "https://sks-serverproject-new.onrender.com/api/user/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: searchFilters,
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);
        setError(
          response.data.message || "Failed to load orders."
        );
      }
    } catch (err) {
      console.error("My Orders API Error:", err);

      setOrders([]);

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ORDERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // SEARCH / DATE FILTER
  // ==========================================

  const handleSearch = (event) => {
    event.preventDefault();

    if (fromDate && toDate && fromDate > toDate) {
      alert("From Date cannot be later than To Date.");
      return;
    }

    fetchOrders({
      fromDate,
      toDate,
    });
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="sks-orders-page">

      {/* ======================================
          SEARCH & FILTER SECTION
      ====================================== */}

      <section className="sks-orders-card">
        <div className="sks-orders-section-title">
          <Search size={18} />
          <h2>Search &amp; Filter Orders</h2>
        </div>

        <form
          className="sks-orders-filter"
          onSubmit={handleSearch}
        >
          {/* FROM DATE */}

          <div className="sks-orders-field">
            <label htmlFor="orders-from">
              FROM DATE
            </label>

            <input
              id="orders-from"
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(event.target.value)
              }
            />
          </div>

          {/* TO DATE */}

          <div className="sks-orders-field">
            <label htmlFor="orders-to">
              TO DATE
            </label>

            <input
              id="orders-to"
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(event.target.value)
              }
            />
          </div>

          {/* SEARCH BUTTON */}

          <button
            type="submit"
            className="sks-orders-search-btn"
            disabled={loading}
          >
            <Search size={16} />
            Search
          </button>
        </form>
      </section>

      {/* ======================================
          ORDERS TABLE SECTION
      ====================================== */}

      <section className="sks-orders-card">

        {/* TABLE HEADER */}

        <div className="sks-orders-table-heading">
          <div className="sks-orders-section-title">
            <ShoppingBag size={18} />
            <h2>Orders</h2>
          </div>

          <span className="sks-orders-count">
            {orders.length} Records
          </span>
        </div>

        {/* TABLE */}

        <div className="sks-orders-table-wrap">
          <table className="sks-orders-table">

            {/* TABLE HEAD */}

            <thead>
              <tr>
                <th>Sr No</th>
                <th>Product</th>
                <th>Tax</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Tax Amount</th>
                <th>Grand Total</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>

              {/* LOADING STATE */}

              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="sks-orders-empty"
                  >
                    Loading orders...
                  </td>
                </tr>

              ) : error ? (

                /* ERROR STATE */

                <tr>
                  <td
                    colSpan={9}
                    className="sks-orders-empty"
                  >
                    {error}
                  </td>
                </tr>

              ) : orders.length > 0 ? (

                /* ORDERS DATA */

                orders.map((order, index) => (
                  <tr key={order.id}>

                    {/* SERIAL NUMBER */}

                    <td>
                      {index + 1}
                    </td>

                    {/* PRODUCT NAME */}

                    <td className="sks-orders-product">
                      {order.product}
                    </td>

                    {/* TAX */}

                    <td>
                      {order.tax || "—"}
                    </td>

                    {/* PRICE */}

                    <td>
                      {formatMoney(order.price)}
                    </td>

                    {/* QUANTITY */}

                    <td>
                      {order.qty}
                    </td>

                    {/* TAX AMOUNT */}

                    <td>
                      {formatMoney(order.taxAmount)}
                    </td>

                    {/* PRODUCT GRAND TOTAL */}

                    <td className="sks-orders-total">
                      {formatMoney(order.grandTotal)}
                    </td>

                    {/* ORDER DATE */}

                    <td>
                      {formatDate(order.date)}
                    </td>

                    {/* RECEIPT */}

                    <td>
                      {order.status === "paid" &&
                      order.receiptUrl ? (
                        <a
                          href={order.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sks-orders-receipt"
                        >
                          Receipt
                        </a>
                      ) : (
                        <span className="sks-orders-receipt-pending">
                          Unavailable
                        </span>
                      )}
                    </td>

                  </tr>
                ))

              ) : (

                /* EMPTY STATE */

                <tr>
                  <td
                    colSpan={9}
                    className="sks-orders-empty"
                  >
                    No orders found.
                  </td>
                </tr>

              )}

            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}