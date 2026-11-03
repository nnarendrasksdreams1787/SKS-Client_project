import React, { useState, useMemo, useEffect } from 'react'
import "./AdminCSS/AdminMyNetwork.css";
import { ADMIN_API_URL } from "../../Config/api";

// const initialMembers = [
//   {
//     id: 1,
//     name: "Rahul Sharma",
//     email: "rahul@example.com",
//     referralCode: "RAHUL2026",
//     sponsor: "Priya Patil",
//     level: 1,
//     joined: "18 Oct 2026",
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Amit Verma",
//     email: "amit@example.com",
//     referralCode: "AMIT2026",
//     sponsor: "Rahul Sharma",
//     level: 2,
//     joined: "16 Oct 2026",
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Sneha Joshi",
//     email: "sneha@example.com",
//     referralCode: "SNEHA2026",
//     sponsor: "Priya Patil",
//     level: 1,
//     joined: "12 Oct 2026",
//     status: "Pending",
//   },
//   {
//     id: 4,
//     name: "Vikas More",
//     email: "vikas@example.com",
//     referralCode: "VIKAS2026",
//     sponsor: "Rahul Sharma",
//     level: 2,
//     joined: "08 Oct 2026",
//     status: "Active",
//   },
//   {
//     id: 5,
//     name: "Neha Kulkarni",
//     email: "neha@example.com",
//     referralCode: "NEHA2026",
//     sponsor: "Amit Verma",
//     level: 3,
//     joined: "04 Oct 2026",
//     status: "Inactive",
//   },
// ];



const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const mapMember = (member) => ({
  id: member.user_id,
  name: member.full_name || "Unknown",
  email: member.email || "—",
  mobile: member.mobile || "—",
  referralCode: member.referral_code || "—",
  sponsor: member.sponsor_name || "No Sponsor",
  sponsorId: member.sponsor_id,
  joined: formatDate(member.created_at),
  status: member.status
    ? member.status.charAt(0).toUpperCase() + member.status.slice(1)
    : "Unknown",
  directReferrals: Number(member.direct_referrals || 0),
  city: member.city || "—",
  state: member.state || "—",
  kycStatus: member.kyc_status || "—",
});



export default function AdminMyNetwork() {
  // const [members] = useState(initialMembers);
  //   const [search, setSearch] = useState("");
  //   const [statusFilter, setStatusFilter] = useState("All");
  //   const [levelFilter, setLevelFilter] = useState("All");
  //   const [page, setPage] = useState(1);
  //   const [selectedMember, setSelectedMember] = useState(null);


  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const pageSize = 20;


  // const pageSize = 5;


  useEffect(() => {
    const controller = new AbortController();

    const fetchNetwork = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          search: search.trim(),
          page: String(page),
          limit: String(pageSize),
        });

        if (statusFilter !== "All") {
          params.set("status", statusFilter.toLowerCase());
        }

        const response = await fetch(
          `${ADMIN_API_URL}/network?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load network members");
        }

        setMembers((data.members || []).map(mapMember));
        setPagination(data.pagination || {
          page: 1,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchNetwork();

    return () => controller.abort();
  }, [search, statusFilter, page]);


  const visibleMembers = members;
  const totalPages = pagination.totalPages || 1;

  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "Pending"
  ).length;


  // const filteredMembers = useMemo(() => {
  //   const query = search.trim().toLowerCase();

  //   return members.filter((member) => {
  //     const matchesSearch =
  //       member.name.toLowerCase().includes(query) ||
  //       member.email.toLowerCase().includes(query) ||
  //       member.referralCode.toLowerCase().includes(query) ||
  //       member.sponsor.toLowerCase().includes(query);

  //     const matchesStatus =
  //       statusFilter === "All" || member.status === statusFilter;

  //     const matchesLevel =
  //       levelFilter === "All" || member.level === Number(levelFilter);

  //     return matchesSearch && matchesStatus && matchesLevel;
  //   });
  // }, [members, search, statusFilter, levelFilter]);

  // const totalPages = Math.max(
  //   1,
  //   Math.ceil(filteredMembers.length / pageSize)
  // );

  // const visibleMembers = filteredMembers.slice(
  //   (page - 1) * pageSize,
  //   page * pageSize
  // );

  // const activeCount = members.filter(
  //   (member) => member.status === "Active"
  // ).length;

  // const pendingCount = members.filter(
  //   (member) => member.status === "Pending"
  // ).length;

  // const levelCount = (level) =>
  //   members.filter((member) => member.level === level).length;

  return (
    <div className="admin-network">
      <div className="admin-network-heading">
        <div>
          <h1>My Network</h1>
          <p>View your members, referral levels and network activity.</p>
        </div>
      </div>

      <div className="admin-network-stats">
        <article className="admin-network-stat-card">
          <div className="admin-network-stat-icon blue">♧</div>
          <div>
            <p>Total Members</p>
            {/* <h2>{members.length}</h2> */}
            <h2>{pagination.total}</h2>
            <span>All network members</span>
          </div>
        </article>

        <article className="admin-network-stat-card">
          <div className="admin-network-stat-icon green">✓</div>
          <div>
            <p>Active Members</p>
            <h2>{activeCount}</h2>
            <span>Currently active</span>
          </div>
        </article>

        <article className="admin-network-stat-card">
          <div className="admin-network-stat-icon orange">◷</div>
          <div>
            <p>Pending Members</p>
            <h2>{pendingCount}</h2>
            <span>Awaiting confirmation</span>
          </div>
        </article>

        <article className="admin-network-stat-card">
          <div className="admin-network-stat-icon purple">⌘</div>
          <div>
            <p>Network Levels</p>
            <h2>3</h2>
            <span>Levels represented in preview</span>
          </div>
        </article>
      </div>

      <section className="admin-network-panel">
        <div className="admin-network-panel-heading">
          <div>
            <h2>Network Members</h2>
            <p>Search and filter members in the network.</p>
          </div>
          {/* <span className="admin-network-count">
            {filteredMembers.length} members
          </span> */}

          <span className="admin-network-count">
            {pagination.total} members
          </span>
        </div>

        {/* <div className="admin-network-levels">
          {[1, 2, 3].map((level) => (
            <button
              type="button"
              key={level}
              className={`admin-network-level ${levelFilter === String(level) ? "selected" : ""
                }`}
              onClick={() => {
                setLevelFilter((previous) =>
                  previous === String(level) ? "All" : String(level)
                );
                setPage(1);
              }}
            >
              <span>Level {level}</span>
              <strong>{levelCount(level)}</strong>
              <small>Members</small>
            </button>
          ))}
        </div> */}

        <div className="admin-network-toolbar">
          <div className="admin-network-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search name, email, sponsor or code..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            aria-label="Filter by member status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            aria-label="Filter by network level"
            value={levelFilter}
            onChange={(event) => {
              setLevelFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>

        <div className="admin-network-table-wrap">
          <table className="admin-network-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>REFERRAL CODE</th>
                <th>SPONSOR</th>
                {/* <th>LEVEL</th> */}
                <th>DIRECT REFERRALS</th>
                <th>JOINED DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7" className="admin-network-empty">
                    Loading network members...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="7" className="admin-network-empty">
                    {error}
                  </td>
                </tr>
              )}


              {visibleMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="admin-network-person">
                      <div className="admin-network-avatar">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <strong>{member.name}</strong>
                        <small>{member.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="admin-network-code">
                      {member.referralCode}
                    </span>
                  </td>

                  <td className="admin-network-sponsor">
                    {member.sponsor}
                  </td>

                  {/* <td>
                    <span className={`admin-network-level-badge level-${member.level}`}>
                      Level {member.level}
                    </span>
                  </td> */}

                  <div>
                    <span>Direct referrals</span>
                    <strong>{selectedMember.directReferrals}</strong>
                  </div>

                  <td className="admin-network-date">{member.joined}</td>

                  <td>
                    <span
                      className={`admin-network-status ${member.status.toLowerCase()}`}
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="admin-network-view"
                      title="View member details"
                      aria-label={`View ${member.name}`}
                      onClick={() => setSelectedMember(member)}
                    >
                      ↗
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && !error && visibleMembers.length === 0 && (
                <tr>
                  <td colSpan="7" className="admin-network-empty">
                    <div>♧</div>
                    <strong>No members found</strong>
                    <p>Try changing your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-network-pagination">
          {/* <p>
            Showing{" "}
            {filteredMembers.length === 0
              ? 0
              : (page - 1) * pageSize + 1}
            {" - "}
            {Math.min(page * pageSize, filteredMembers.length)} of{" "}
            {filteredMembers.length}
          </p> */}

          <p>
            Showing{" "}
            {pagination.total === 0
              ? 0
              : (pagination.page - 1) * pagination.limit + 1}
            {" - "}
            {Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}{" "}
            of {pagination.total}
          </p>

          <div>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((previous) => previous - 1)}
            >
              Previous
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((previous) => previous + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {selectedMember && (
        <div
          className="admin-network-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <section
            className="admin-network-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-network-detail-title"
          >
            <div className="admin-network-modal-heading">
              <div>
                <h2 id="admin-network-detail-title">Member Details</h2>
                <p>Network member summary</p>
              </div>
              <button
                type="button"
                aria-label="Close member details"
                onClick={() => setSelectedMember(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-network-details">
              <div>
                <span>Full name</span>
                <strong>{selectedMember.name}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedMember.email}</strong>
              </div>
              <div>
                <span>Referral code</span>
                <strong>{selectedMember.referralCode}</strong>
              </div>
              <div>
                <span>Sponsor</span>
                <strong>{selectedMember.sponsor}</strong>
              </div>
              <div>
                <span>Network level</span>
                <strong>Level {selectedMember.level}</strong>
              </div>
              <div>
                <span>Joined date</span>
                <strong>{selectedMember.joined}</strong>
              </div>
              <div>
                <span>Member status</span>
                <strong>{selectedMember.status}</strong>
              </div>
            </div>

            <div className="admin-network-modal-actions">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
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
