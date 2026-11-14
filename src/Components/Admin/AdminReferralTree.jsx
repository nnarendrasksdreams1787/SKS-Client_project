import { useState, useEffect, useMemo } from "react";
import "./AdminCSS/AdminReferralTree.css";
import { ADMIN_API_URL } from "../../Config/api";


// const initialMembers = [
//   {
//     id: "SKS001",
//     name: "Narendra Sharma",
//     email: "narendra@example.com",
//     parentId: null,
//     joined: "2026-08-01",
//     status: "Active",
//     referrals: 3,
//   },
//   {
//     id: "SKS002",
//     name: "Rahul Sharma",
//     email: "rahul@example.com",
//     parentId: "SKS001",
//     joined: "2026-08-05",
//     status: "Active",
//     referrals: 2,
//   },
//   {
//     id: "SKS003",
//     name: "Sneha Joshi",
//     email: "sneha@example.com",
//     parentId: "SKS001",
//     joined: "2026-08-08",
//     status: "Active",
//     referrals: 1,
//   },
//   {
//     id: "SKS004",
//     name: "Amit Verma",
//     email: "amit@example.com",
//     parentId: "SKS001",
//     joined: "2026-08-10",
//     status: "Pending",
//     referrals: 0,
//   },
//   {
//     id: "SKS005",
//     name: "Vikas More",
//     email: "vikas@example.com",
//     parentId: "SKS002",
//     joined: "2026-08-15",
//     status: "Active",
//     referrals: 1,
//   },
//   {
//     id: "SKS006",
//     name: "Neha Kulkarni",
//     email: "neha@example.com",
//     parentId: "SKS002",
//     joined: "2026-08-18",
//     status: "Active",
//     referrals: 0,
//   },
//   {
//     id: "SKS007",
//     name: "Priya Patil",
//     email: "priya@example.com",
//     parentId: "SKS003",
//     joined: "2026-08-20",
//     status: "Pending",
//     referrals: 0,
//   },
//   {
//     id: "SKS008",
//     name: "Karan Deshmukh",
//     email: "karan@example.com",
//     parentId: "SKS005",
//     joined: "2026-08-25",
//     status: "Active",
//     referrals: 0,
//   },
// ];

// const formatDate = (value) =>
//   new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });



function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}



export default function AdminReferralTree() {

  //  const [members] = useState(initialMembers);
  // const [search, setSearch] = useState("");
  // const [levelFilter, setLevelFilter] = useState("All");
  // const [statusFilter, setStatusFilter] = useState("All");
  // const [expanded, setExpanded] = useState(
  //   () => new Set(["SKS001", "SKS002", "SKS003", "SKS005"])
  // );
  // const [selectedMember, setSelectedMember] = useState(null);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [expanded, setExpanded] = useState(new Set());
  const [selectedMember, setSelectedMember] = useState(null);

  const [viewMode, setViewMode] = useState("vertical");



  useEffect(() => {
    let cancelled = false;

    async function loadReferrals() {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("authToken");

        const response = await fetch(
          `${ADMIN_API_URL}/referrals?limit=100&page=1`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load referral members");
        }

        const totalPages = data.pagination?.totalPages || 1;

        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetch(
              `${ADMIN_API_URL}/referrals?limit=100&page=${index + 2}`,
              {
                headers: {
                  Accept: "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: "include",
              }
            ).then(async (res) => {
              const result = await res.json();

              if (!res.ok) {
                throw new Error(result.message || "Unable to load referral members");
              }

              return result.referrals || [];
            })
          )
        );

        const allMembers = [
          ...(data.referrals || []),
          ...remainingPages.flat(),
        ];

        if (!cancelled) {
          const normalizedMembers = allMembers.map((member) => ({
            id: String(member.user_id),
            name: member.full_name || "Unknown Member",
            email: "",
            mobile: member.mobile || "",
            parentId: member.sponsor_id ? String(member.sponsor_id) : null,
            joined: member.created_at,
            status: member.status || "pending",
            referrals: Number(member.direct_referrals || 0),
            referralCode: member.referral_code || "",
            sponsorName: member.sponsor_name || "",
          }));

          setMembers(normalizedMembers);
          setExpanded(new Set());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong while loading referrals");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReferrals();

    return () => {
      cancelled = true;
    };
  }, []);

  const membersById = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members]
  );


  const childrenByParent = useMemo(() => {
    const result = new Map();

    members.forEach((member) => {
      if (!result.has(member.parentId)) {
        result.set(member.parentId, []);
      }

      result.get(member.parentId).push(member);
    });

    return result;
  }, [members]);

  const levelById = useMemo(() => {
    const result = new Map();

    function visit(member, level) {
      result.set(member.id, level);

      (childrenByParent.get(member.id) || []).forEach((child) =>
        visit(child, level + 1)
      );
    }

    (childrenByParent.get(null) || []).forEach((root) => visit(root, 1));

    return result;
  }, [childrenByParent]);

  const matchingMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        String(member.name || "").toLowerCase().includes(query) ||
        String(member.id || "").toLowerCase().includes(query) ||
        String(member.mobile || "").toLowerCase().includes(query) ||
        String(member.referralCode || "").toLowerCase().includes(query);

      const matchesLevel =
        levelFilter === "All" ||
        levelById.get(member.id) === Number(levelFilter);

      const matchesStatus =
        statusFilter === "All" || String(member.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [members, search, levelFilter, statusFilter, levelById]);

  const visibleIds = useMemo(() => {
    const result = new Set();

    matchingMembers.forEach((member) => {
      let current = member;

      while (current) {
        result.add(current.id);
        current = current.parentId
          ? membersById.get(current.parentId)
          : null;
      }
    });

    return result;
  }, [matchingMembers, membersById]);

  // const activeCount = members.filter(
  //   (member) => member.status === "Active"
  // ).length;

  // const pendingCount = members.filter(
  //   (member) => member.status === "Pending"
  // ).length;

  const activeCount = members.filter(
    (member) => String(member.status).toLowerCase() === "active"
  ).length;

  const pendingCount = members.filter(
    (member) => String(member.status).toLowerCase() === "pending"
  ).length;

  const rootMembers = childrenByParent.get(null) || [];

  function toggleExpanded(id) {
    setExpanded((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function expandAll() {
    setExpanded(
      new Set(
        members
          .filter((member) => (childrenByParent.get(member.id) || []).length)
          .map((member) => member.id)
      )
    );
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  function renderMember(member) {
    const children = (childrenByParent.get(member.id) || []).filter(
      (child) => visibleIds.has(child.id)
    );

    const hasChildren = (childrenByParent.get(member.id) || []).length > 0;
    const isExpanded = expanded.has(member.id);
    const level = levelById.get(member.id) || 1;

    return (
      <li className="referral-tree-node" key={member.id}>
        <article
          className={`referral-member-card ${selectedMember?.id === member.id ? "referral-member-selected" : ""
            }`}
        >
          <div className="referral-member-top">
            <div className="referral-member-avatar">
              {getInitials(member.name)}
            </div>

            <span
              // className={`referral-member-status referral-member-status-${member.status.toLowerCase()}`}
              className={`referral-member-status referral-member-status-${String(member.status || "pending").toLowerCase()}`}
            >
              {member.status}
            </span>
          </div>

          <button
            type="button"
            className="referral-member-name"
            onClick={() => setSelectedMember(member)}
          >
            {member.name}
          </button>

          {/* <span className="referral-member-id">{member.id}</span> */}
          <span className="referral-member-id">
            {member.referralCode || member.id}
          </span>

          <div className="referral-member-meta">
            <span>Level {level}</span>
            <span>{childrenByParent.get(member.id)?.length || 0} direct referrals</span>
          </div>

          <div className="referral-member-actions">
            <button
              type="button"
              onClick={() => setSelectedMember(member)}
            >
              View Profile
            </button>

            {hasChildren && (
              <button
                type="button"
                className="referral-expand-button"
                onClick={() => toggleExpanded(member.id)}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${member.name}'s referrals`}
              >
                {isExpanded ? "− Collapse" : `+ ${children.length || "View"} Referrals`}
              </button>
            )}
          </div>
        </article>

        {hasChildren && isExpanded && children.length > 0 && (
          <ul className="referral-tree-children">
            {children.map((child) => renderMember(child))}
          </ul>
        )}
      </li>
    );
  }

  if (loading) {
    return (
      <main className="admin-referral-tree">
        <div className="referral-tree-empty">
          <strong>Loading referral network...</strong>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-referral-tree">
        <div className="referral-tree-empty">
          <strong>Unable to load referral network</strong>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (


    <main className="admin-referral-tree">
      <header className="referral-tree-heading">
        <div>
          <h1>Referral Tree</h1>
          <p>Explore referral relationships and member hierarchy.</p>
        </div>

        <div className="referral-tree-heading-actions">
          <button type="button" onClick={expandAll}>
            Expand All
          </button>
          <button type="button" onClick={collapseAll}>
            Collapse All
          </button>
        </div>
      </header>

      <section className="referral-tree-stats">
        <article className="referral-tree-stat">
          <span className="referral-stat-icon blue">♧</span>
          <div>
            <p>Total Members</p>
            <strong>{members.length}</strong>
          </div>
        </article>

        <article className="referral-tree-stat">
          <span className="referral-stat-icon green">✓</span>
          <div>
            <p>Active Members</p>
            <strong>{activeCount}</strong>
          </div>
        </article>

        <article className="referral-tree-stat">
          <span className="referral-stat-icon amber">◷</span>
          <div>
            <p>Pending Members</p>
            <strong>{pendingCount}</strong>
          </div>
        </article>

        <article className="referral-tree-stat">
          <span className="referral-stat-icon purple">⌘</span>
          <div>
            <p>Referral Levels</p>
            <strong>{Math.max(0, ...levelById.values())}</strong>
          </div>
        </article>
      </section>

      <section className="referral-tree-panel">
        <div className="referral-tree-panel-heading">
          <div>
            <h2>Member Hierarchy</h2>
            <p>Select a member to view their profile details.</p>
          </div>
          {/* <span className="referral-tree-count">
            {matchingMembers.length} matching members
          </span> */}
          <div className="referral-tree-heading-actions">
            <button
              type="button"
              className={viewMode === "vertical" ? "view-active" : ""}
              onClick={() => setViewMode("vertical")}
            >
              Vertical Tree
            </button>

            <button
              type="button"
              className={viewMode === "horizontal" ? "view-active" : ""}
              onClick={() => setViewMode("horizontal")}
            >
              Horizontal Tree
            </button>
          </div>

          <span className="referral-tree-count">
            {matchingMembers.length} matching members
          </span>
        </div>

        <div className="referral-tree-filters">
          <label className="referral-tree-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search name, member ID, mobile or referral code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            aria-label="Filter by referral level"
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
          >
            {/* <option value="All">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option> */}
            <option value="All">All Levels</option>
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                Level {index + 1}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by member status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {/* <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option> */}
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="referral-tree-legend">
          <span><i className="referral-legend-dot active" /> Active</span>
          <span><i className="referral-legend-dot pending" /> Pending</span>
          <span>Click a member's name or View Profile for details.</span>
        </div>

        <div className={`referral-tree-canvas ${viewMode === "horizontal" ? "is-horizontal" : ""} `}>
          {rootMembers.some((member) => visibleIds.has(member.id)) ? (
            <ul className="referral-tree-root">
              {rootMembers
                .filter((member) => visibleIds.has(member.id))
                .map((member) => renderMember(member))}
            </ul>
          ) : (
            <div className="referral-tree-empty">
              <span>⌕</span>
              <strong>No matching members found</strong>
              <p>Try another name, level, or status filter.</p>
            </div>
          )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="referral-profile-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMember(null);
          }}
        >
          <section
            className="referral-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="referral-profile-title"
          >
            <div className="referral-profile-heading">
              <div>
                <span>Member Profile</span>
                <h2 id="referral-profile-title">{selectedMember.name}</h2>
              </div>
              <button
                type="button"
                aria-label="Close member profile"
                onClick={() => setSelectedMember(null)}
              >
                ×
              </button>
            </div>

            <div className="referral-profile-identity">
              <div className="referral-member-avatar referral-profile-avatar">
                {getInitials(selectedMember.name)}
              </div>
              <div>
                <strong>{selectedMember.id}</strong>
                <span>Level {levelById.get(selectedMember.id) || 1}</span>
              </div>
              <span
                className={`referral-member-status referral-member-status-${selectedMember.status.toLowerCase()}`}
              >
                {selectedMember.status}
              </span>
            </div>

            <div className="referral-profile-fields">
              {/* <div>
                <span>Email Address</span>
                <strong>{selectedMember.email}</strong>
              </div> */}
              <div>
                <span>Mobile Number</span>
                <strong>{selectedMember.mobile || "—"}</strong>
              </div>

              <div>
                <span>Referral Code</span>
                <strong>{selectedMember.referralCode || "—"}</strong>
              </div>
              <div>
                <span>Sponsor</span>
                <strong>
                  {selectedMember.parentId
                    ? membersById.get(selectedMember.parentId)?.name || "—"
                    : "Root Member"}
                </strong>
              </div>
              <div>
                <span>Date Joined</span>
                <strong>{formatDate(selectedMember.joined)}</strong>
              </div>
              <div>
                <span>Direct Referrals</span>
                <strong>
                  {childrenByParent.get(selectedMember.id)?.length || 0}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="referral-profile-close"
              onClick={() => setSelectedMember(null)}
            >
              Close Profile
            </button>
          </section>
        </div>
      )}
    </main>
  );
}