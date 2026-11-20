
import { useState, useEffect, useMemo } from "react";

import "../../CSS/Manager/ManagerReferralTree.css";
// import { MANAGER_API_URL } from "../../Config/api";

const MANAGER_API_URL = `${
  (import.meta.env.VITE_API_URL)
    .replace(/\/$/, "")
}/api/manager`;

function getInitials(name) {
  return String(name || "U")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeMember(member) {
  return {
    id: String(member.user_id),
    name: member.full_name || "Unknown Member",
    email: "",
    mobile: member.mobile || "",
    parentId:
      member.sponsor_id != null
        ? String(member.sponsor_id)
        : null,
    joined: member.created_at,
    status: String(member.status || "pending").toLowerCase(),
    referrals: Number(member.direct_referrals || 0),
    referralCode: member.reference_id || "",
    sponsorName: member.sponsor_name || "",
  };
}

export default function ManagerReferralTree() {
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
    const controller = new AbortController();

    async function loadReferrals() {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("authToken");

        const requestOptions = {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          credentials: "include",
          signal: controller.signal,
        };

        const fetchPage = async (page) => {
          const response = await fetch(
            `${MANAGER_API_URL}/referrals?limit=100&page=${page}`,
            requestOptions
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Unable to load referral members"
            );
          }

          return data;
        };

        const firstPage = await fetchPage(1);

        const totalPages = Math.max(
          1,
          Number(firstPage.pagination?.totalPages || 1)
        );

        const allMembers = [...(firstPage.referrals || [])];

        for (let page = 2; page <= totalPages; page++) {
          const result = await fetchPage(page);
          allMembers.push(...(result.referrals || []));
        }

        if (!controller.signal.aborted) {
          setMembers(allMembers.map(normalizeMember));
          setExpanded(new Set());
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message ||
              "Something went wrong while loading referrals"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReferrals();

    return () => controller.abort();
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

  const rootMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          !member.parentId ||
          !membersById.has(member.parentId) ||
          member.parentId === member.id
      ),
    [members, membersById]
  );

  const levelById = useMemo(() => {
    const result = new Map();

    function visit(member, level) {
      if (result.has(member.id)) return;

      result.set(member.id, level);

      (childrenByParent.get(member.id) || []).forEach((child) => {
        if (child.id !== member.id) {
          visit(child, level + 1);
        }
      });
    }

    rootMembers.forEach((root) => visit(root, 1));

    members.forEach((member) => {
      if (!result.has(member.id)) {
        visit(member, 1);
      }
    });

    return result;
  }, [members, rootMembers, childrenByParent]);

  const matchingMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        String(member.name).toLowerCase().includes(query) ||
        String(member.id).toLowerCase().includes(query) ||
        String(member.mobile).toLowerCase().includes(query) ||
        String(member.referralCode).toLowerCase().includes(query);

      const matchesLevel =
        levelFilter === "All" ||
        levelById.get(member.id) === Number(levelFilter);

      const matchesStatus =
        statusFilter === "All" ||
        member.status === statusFilter;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [members, search, levelFilter, statusFilter, levelById]);

  const visibleIds = useMemo(() => {
    const result = new Set();

    matchingMembers.forEach((member) => {
      let current = member;
      const visited = new Set();

      while (current && !visited.has(current.id)) {
        visited.add(current.id);
        result.add(current.id);

        current = current.parentId
          ? membersById.get(current.parentId)
          : null;
      }
    });

    return result;
  }, [matchingMembers, membersById]);

  const isFiltering =
    search.trim() !== "" ||
    levelFilter !== "All" ||
    statusFilter !== "All";

  const expandedForDisplay = useMemo(() => {
    if (!isFiltering) return expanded;

    const result = new Set(expanded);

    visibleIds.forEach((id) => {
      const member = membersById.get(id);
      const children = childrenByParent.get(id) || [];

      if (
        member &&
        children.some((child) => visibleIds.has(child.id))
      ) {
        result.add(id);
      }
    });

    return result;
  }, [
    expanded,
    isFiltering,
    visibleIds,
    membersById,
    childrenByParent,
  ]);

  const activeCount = members.filter(
    (member) => member.status === "active"
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === "pending"
  ).length;

  const maximumLevel = Math.max(
    0,
    ...Array.from(levelById.values())
  );

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
          .filter(
            (member) =>
              (childrenByParent.get(member.id) || []).length > 0
          )
          .map((member) => member.id)
      )
    );
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  function renderMember(member, path = new Set()) {
    if (path.has(member.id)) return null;

    const nextPath = new Set(path);
    nextPath.add(member.id);

    const children = (
      childrenByParent.get(member.id) || []
    ).filter(
      (child) =>
        child.id !== member.id &&
        visibleIds.has(child.id) &&
        !nextPath.has(child.id)
    );

    const hasChildren = children.length > 0;
    const isExpanded = expandedForDisplay.has(member.id);
    const level = levelById.get(member.id) || 1;

    return (
      <li className="referral-tree-node" key={member.id}>
        <article
          className={`referral-member-card ${
            selectedMember?.id === member.id
              ? "referral-member-selected"
              : ""
          }`}
        >
          <div className="referral-member-top">
            <div className="referral-member-avatar">
              {getInitials(member.name)}
            </div>

            <span
              className={`referral-member-status referral-member-status-${member.status}`}
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

          <span className="referral-member-id">
            {member.referralCode || member.id}
          </span>

          <div className="referral-member-meta">
            <span>Level {level}</span>
            <span>
              {member.referrals} direct referrals
            </span>
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
                aria-label={`${
                  isExpanded ? "Collapse" : "Expand"
                } ${member.name}'s referrals`}
              >
                {isExpanded
                  ? "− Collapse"
                  : `+ ${children.length} Referrals`}
              </button>
            )}
          </div>
        </article>

        {hasChildren && isExpanded && (
          <ul className="referral-tree-children">
            {children.map((child) =>
              renderMember(child, nextPath)
            )}
          </ul>
        )}
      </li>
    );
  }

  if (loading) {
    return (
      <main className="manager-referral-tree">
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

  const displayRoots = [
    ...rootMembers,
    ...members.filter(
      (member) =>
        !levelById.has(member.id) &&
        !rootMembers.some((root) => root.id === member.id)
    ),
  ];

  return (
    <main className="admin-referral-tree">
      <header className="referral-tree-heading">
        <div>
          <h1>Referral Tree</h1>
          <p>
            Explore referral relationships and member hierarchy.
          </p>
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
            <strong>{maximumLevel}</strong>
          </div>
        </article>
      </section>

      <section className="referral-tree-panel">
        <div className="referral-tree-panel-heading">
          <div>
            <h2>Member Hierarchy</h2>
            <p>
              Select a member to view their profile details.
            </p>
          </div>

          <div className="referral-tree-heading-actions">
            <button
              type="button"
              className={
                viewMode === "vertical" ? "view-active" : ""
              }
              onClick={() => setViewMode("vertical")}
            >
              Vertical Tree
            </button>

            <button
              type="button"
              className={
                viewMode === "horizontal" ? "view-active" : ""
              }
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
            onChange={(event) =>
              setLevelFilter(event.target.value)
            }
          >
            <option value="All">All Levels</option>

            {Array.from(
              { length: Math.max(10, maximumLevel) },
              (_, index) => (
                <option
                  key={index + 1}
                  value={String(index + 1)}
                >
                  Level {index + 1}
                </option>
              )
            )}
          </select>

          <select
            aria-label="Filter by member status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="referral-tree-legend">
          <span>
            <i className="referral-legend-dot active" /> Active
          </span>

          <span>
            <i className="referral-legend-dot pending" /> Pending
          </span>

          <span>
            Click a member's name or View Profile for details.
          </span>
        </div>

        <div
          className={`referral-tree-canvas ${
            viewMode === "horizontal"
              ? "is-horizontal"
              : ""
          }`}
        >
          {displayRoots.some((member) =>
            visibleIds.has(member.id)
          ) ? (
            <ul className="referral-tree-root">
              {displayRoots
                .filter((member) => visibleIds.has(member.id))
                .map((member) => renderMember(member))}
            </ul>
          ) : (
            <div className="referral-tree-empty">
              <span>⌕</span>
              <strong>No matching members found</strong>
              <p>
                Try another name, level, or status filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedMember && (
        <div
          className="referral-profile-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
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
                <h2 id="referral-profile-title">
                  {selectedMember.name}
                </h2>
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
                <strong>
                  {selectedMember.referralCode ||
                    selectedMember.id}
                </strong>

                <span>
                  Level{" "}
                  {levelById.get(selectedMember.id) || 1}
                </span>
              </div>

              <span
                className={`referral-member-status referral-member-status-${selectedMember.status}`}
              >
                {selectedMember.status}
              </span>
            </div>

            <div className="referral-profile-fields">
              <div>
                <span>Mobile Number</span>
                <strong>
                  {selectedMember.mobile || "—"}
                </strong>
              </div>

              <div>
                <span>Reference ID</span>
                <strong>
                  {selectedMember.referralCode || "—"}
                </strong>
              </div>

              <div>
                <span>Sponsor</span>
                <strong>
                  {selectedMember.parentId
                    ? membersById.get(
                        selectedMember.parentId
                      )?.name ||
                      selectedMember.sponsorName ||
                      "—"
                    : "Root Member"}
                </strong>
              </div>

              <div>
                <span>Date Joined</span>
                <strong>
                  {formatDate(selectedMember.joined)}
                </strong>
              </div>

              <div>
                <span>Direct Referrals</span>
                <strong>
                  {selectedMember.referrals}
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
