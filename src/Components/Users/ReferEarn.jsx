import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, UserRoundPlus, UsersRound } from "lucide-react";
import "../../CSS/ReferEarn.css";

export default function ReferEarn() {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    fromDate: "",
    toDate: "",
  });


  const fetchReferrals = async (searchFilters = {}) => {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:4000/api/user/referrals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: searchFilters,
        }
      );

      if (response.data.success) {
        setReferrals(response.data.referrals);
      }
    } catch (err) {
      console.error("Referral fetch error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to fetch referral records"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReferrals();
  }, []);

  const updateFilter = (field, value) => {
    setFilters((previous) => ({ ...previous, [field]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchReferrals(filters);
  };


  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  return (
    <div className="sks-refer-earn">
      <section className="sks-refer-card">
        <div className="sks-refer-card-heading">
          <h2>Search &amp; Filter</h2>
          <button type="button" className="sks-refer-add-btn" disabled
            title="Add Refer functionality pending">
            <UserRoundPlus size={17} />
            <span>Add Refer</span>
          </button>
        </div>

        <form className="sks-refer-filters" onSubmit={handleSearch}>
          <label className="sks-refer-field">
            <span>Name</span>
            <input type="text" placeholder="Enter name"
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)} />
          </label>
          <label className="sks-refer-field">
            <span>Status</span>
            <select value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}>
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <label className="sks-refer-field">
            <span>From Date</span>
            <input type="date" value={filters.fromDate}
              onChange={(e) => updateFilter("fromDate", e.target.value)} />
          </label>
          <label className="sks-refer-field">
            <span>To Date</span>
            <input type="date" value={filters.toDate}
              onChange={(e) => updateFilter("toDate", e.target.value)} />
          </label>
          <button type="submit" className="sks-refer-search-btn">
            <Search size={16} />
            <span>Search</span>
          </button>
        </form>
      </section>

      <section className="sks-refer-card">
        <div className="sks-refer-records-heading">
          <span className="sks-refer-records-icon"><UsersRound size={20} /></span>
          <h2>Referral Records</h2>
        </div>
        {loading ? (
          <div className="sks-refer-empty">
            Loading referral records...
          </div>
        ) : error ? (
          <div className="sks-refer-empty" role="alert">
            {error}
          </div>
        ) : referrals.length === 0 ? (
          <div className="sks-refer-empty">
            No referral records found.
          </div>
        ) : (
          <div className="sks-refer-records-table-wrap">
            <table className="sks-refer-records-table">
              <thead>
                <tr>
                  <th>Login ID</th>
                  <th>Name</th>
                  <th>Referral Code</th>
                  <th>Status</th>
                  <th>Joining Date</th>
                </tr>
              </thead>

              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.user_id}>
                    <td>{referral.login_id}</td>
                    <td>{referral.full_name}</td>
                    <td>{referral.referral_code || "-"}</td>
                    <td>{referral.status}</td>
                    <td>
                      {referral.created_at
                        ? new Date(referral.created_at).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
