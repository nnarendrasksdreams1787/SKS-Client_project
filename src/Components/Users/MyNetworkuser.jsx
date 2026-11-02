import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../CSS/MyNetworkuser.css";

const initialFilters = {
  name: "",
  status: "",
  fromDate: "",
  toDate: "",
};

export default function MyNetwork() {
  const [filters, setFilters] = useState(initialFilters);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in user's direct referrals' orders
  const fetchNetwork = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setRecords([]);
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        "http://localhost:4010/api/user/network",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: searchFilters,
        }
      );

      if (response.data.success) {
        setRecords(response.data.records || []);
      } else {
        setRecords([]);
        setError(
          response.data.message || "Failed to fetch network records."
        );
      }
    } catch (err) {
      console.error("My Network API Error:", err);

      setRecords([]);
      setError(
        err.response?.data?.message ||
          "Unable to load network records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch network records when page opens
  useEffect(() => {
    fetchNetwork();
  }, []);

  // Update search filters
  const updateFilter = (field, value) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Search network records using filters
  const handleSearch = (event) => {
    event.preventDefault();
    fetchNetwork(filters);
  };

  return (
    <div className="sks-network-page">
      {/* Search & Filter Section */}
      <section
        className="sks-network-panel"
        aria-labelledby="network-search-title"
      >
        <div className="sks-network-panel-heading">
          <h2 id="network-search-title">
            Search &amp; Filter Users
          </h2>
        </div>

        <form
          className="sks-network-filters"
          onSubmit={handleSearch}
        >
          {/* Name Filter */}
          <label className="sks-network-field">
            <span>Name</span>
            <input
              type="text"
              placeholder="Enter name"
              value={filters.name}
              onChange={(event) =>
                updateFilter("name", event.target.value)
              }
            />
          </label>

          {/* Payment Status Filter */}
          <label className="sks-network-field">
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(event) =>
                updateFilter("status", event.target.value)
              }
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </label>

          {/* From Date Filter */}
          <label className="sks-network-field">
            <span>From Date</span>
            <input
              type="date"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(event) =>
                updateFilter("fromDate", event.target.value)
              }
            />
          </label>

          {/* To Date Filter */}
          <label className="sks-network-field">
            <span>To Date</span>
            <input
              type="date"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(event) =>
                updateFilter("toDate", event.target.value)
              }
            />
          </label>

          {/* Search Button */}
          <button
            className="sks-network-search-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {/* User Records Section */}
      <section
        className="sks-network-panel sks-network-records"
        aria-labelledby="network-records-title"
      >
        <div className="sks-network-records-heading">
          <h2 id="network-records-title">User Records</h2>
        </div>

        <div className="sks-network-table-scroll">
          <table className="sks-network-table">
            <thead>
              <tr>
                <th scope="col">Sr No</th>
                <th scope="col">Date</th>
                <th scope="col">Name</th>
                <th scope="col">Mobile</th>
                <th scope="col">City</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    className="sks-network-empty"
                    colSpan={8}
                  >
                    Loading network records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    className="sks-network-empty"
                    colSpan={8}
                  >
                    {error}
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    className="sks-network-empty"
                    colSpan={8}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={record.id ?? index}>
                    {/* Serial Number */}
                    <td>{index + 1}</td>

                    {/* Order Date */}
                    <td>
                      {record.date
                        ? new Date(
                            record.date
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    {/* Referral Name */}
                    <td>{record.name || "—"}</td>

                    {/* Mobile Number */}
                    <td>{record.mobile || "—"}</td>

                    {/* City */}
                    <td>{record.city || "—"}</td>

                    {/* Product Name */}
                    <td>{record.product || "—"}</td>

                    {/* Purchase Price */}
                    <td>
                      ₹
                      {Number(
                        record.price ?? 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Payment Status */}
                    <td>
                      {record.status === "paid"
                        ? "Paid"
                        : record.status === "pending"
                          ? "Pending"
                          : record.status || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}