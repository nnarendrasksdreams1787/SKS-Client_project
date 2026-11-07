// import React, { useState } from 'react'
// import axios from 'axios';
// import "./AdminCSS/AdminReferEarn.css"

// // const initialReferrals = [
// //   {
// //     id: 1,
// //     name: "Rahul Sharma",
// //     email: "rahul@example.com",
// //     referralCode: "RAHUL2026",
// //     referredUsers: 12,
// //     earnings: 2400,
// //     status: "Active",
// //     joined: "18 Oct 2026",
// //   },
// //   {
// //     id: 2,
// //     name: "Priya Patil",
// //     email: "priya@example.com",
// //     referralCode: "PRIYA2026",
// //     referredUsers: 8,
// //     earnings: 1600,
// //     status: "Active",
// //     joined: "16 Oct 2026",
// //   },
// //   {
// //     id: 3,
// //     name: "Amit Verma",
// //     email: "amit@example.com",
// //     referralCode: "AMIT2026",
// //     referredUsers: 3,
// //     earnings: 600,
// //     status: "Pending",
// //     joined: "12 Oct 2026",
// //   },
// //   {
// //     id: 4,
// //     name: "Sneha Joshi",
// //     email: "sneha@example.com",
// //     referralCode: "SNEHA2026",
// //     referredUsers: 0,
// //     earnings: 0,
// //     status: "Inactive",
// //     joined: "08 Oct 2026",
// //   },
// //   {
// //     id: 5,
// //     name: "Vikas More",
// //     email: "vikas@example.com",
// //     referralCode: "VIKAS2026",
// //     referredUsers: 6,
// //     earnings: 1200,
// //     status: "Active",
// //     joined: "04 Oct 2026",
// //   },
// // ];

// const initialSettings = {
//   rewardPerReferral: "200",
//   minimumPayout: "500",
//   referralEnabled: true,
// };



// export default function AdminReferEarn() {
//   // const [referrals, setReferrals] = useState(initialReferrals);
//   const [referrals, setReferrals] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [page, setPage] = useState(1);
//   const [settings, setSettings] = useState(initialSettings);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [settingsMessage, setSettingsMessage] = useState("");
//   const [selectedReferral, setSelectedReferral] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchReferrals = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await axios.get(
//           "http://localhost:4000/api/admin/referrals",
//           { withCredentials: true }
//         );

//         const members = response.data.referrals || [];

//         setReferrals(
//           members.map((member) => ({
//             id: member.user_id,
//             name: member.full_name || "—",
//             email: member.email || "—",
//             referralCode: member.referral_code || "—",
//             referredUsers: Number(member.direct_referrals || 0),
//             earnings: 0,
//             status:
//               member.status.charAt(0).toUpperCase() +
//               member.status.slice(1),
//             joined: member.created_at
//               ? new Date(member.created_at).toLocaleDateString("en-IN")
//               : "—",
//           }))
//         );
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to load referrals."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReferrals();
//   }, []);


//   const pageSize = 5;

//   const filteredReferrals = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return referrals.filter((referral) => {
//       const matchesSearch =
//         referral.name.toLowerCase().includes(query) ||
//         referral.email.toLowerCase().includes(query) ||
//         referral.referralCode.toLowerCase().includes(query);

//       const matchesStatus =
//         statusFilter === "All" || referral.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [referrals, search, statusFilter]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredReferrals.length / pageSize)
//   );

//   const visibleReferrals = filteredReferrals.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const totalEarnings = referrals.reduce(
//     (total, referral) => total + referral.earnings,
//     0
//   );

//   const totalReferredUsers = referrals.reduce(
//     (total, referral) => total + referral.referredUsers,
//     0
//   );

//   const activeReferrals = referrals.filter(
//     (referral) => referral.status === "Active"
//   ).length;

//   const updateSetting = (event) => {
//     const { name, value } = event.target;
//     setSettings((previous) => ({ ...previous, [name]: value }));
//     setSettingsMessage("");
//   };

//   const saveSettings = (event) => {
//     event.preventDefault();

//     const reward = Number(settings.rewardPerReferral);
//     const payout = Number(settings.minimumPayout);

//     if (
//       settings.rewardPerReferral === "" ||
//       settings.minimumPayout === "" ||
//       !Number.isFinite(reward) ||
//       !Number.isFinite(payout) ||
//       reward < 0 ||
//       payout < 0
//     ) {
//       setSettingsMessage("Enter valid non-negative amounts.");
//       return;
//     }

//     setSettingsMessage(
//       "Settings updated in this preview. They are not saved to a server."
//     );
//     setSettingsOpen(false);
//   };

//   const copyReferralCode = async (code) => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setSettingsMessage(`Referral code ${code} copied.`);
//     } catch {
//       setSettingsMessage(
//         "Clipboard access is unavailable. You can copy the code manually."
//       );
//     }
//   };

//   const toggleReferralStatus = (id) => {
//     setReferrals((previous) =>
//       previous.map((referral) =>
//         referral.id === id
//           ? {
//             ...referral,
//             status: referral.status === "Inactive" ? "Active" : "Inactive",
//           }
//           : referral
//       )
//     );
//   };

//   return (
//     <div className="admin-refer">
//       <div className="admin-refer-heading">
//         <div>
//           <h1>Refer &amp; Earn</h1>
//           <p>Manage referral activity, rewards and referral participants.</p>
//         </div>

//         <button
//           type="button"
//           className="admin-refer-primary"
//           onClick={() => {
//             setSettingsMessage("");
//             setSettingsOpen(true);
//           }}
//         >
//           <span>⚙</span> Referral Settings
//         </button>
//       </div>

//       {settingsMessage && (
//         <div className="admin-refer-message" role="status">
//           <span>{settingsMessage}</span>
//           <button
//             type="button"
//             aria-label="Dismiss message"
//             onClick={() => setSettingsMessage("")}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <div className="admin-refer-stats">
//         <div className="admin-refer-stat-card">
//           <div className="admin-refer-stat-icon purple">♧</div>
//           <div>
//             <p>Total Referrals</p>
//             <h2>{referrals.length}</h2>
//             <span>Registered participants</span>
//           </div>
//         </div>

//         <div className="admin-refer-stat-card">
//           <div className="admin-refer-stat-icon green">↗</div>
//           <div>
//             <p>Users Referred</p>
//             <h2>{totalReferredUsers}</h2>
//             <span>Across all participants</span>
//           </div>
//         </div>

//         <div className="admin-refer-stat-card">
//           <div className="admin-refer-stat-icon orange">₹</div>
//           <div>
//             <p>Total Rewards</p>
//             <h2>₹{totalEarnings.toLocaleString("en-IN")}</h2>
//             <span>Recorded in this preview</span>
//           </div>
//         </div>

//         <div className="admin-refer-stat-card">
//           <div className="admin-refer-stat-icon blue">✓</div>
//           <div>
//             <p>Active Referrers</p>
//             <h2>{activeReferrals}</h2>
//             <span>Currently active</span>
//           </div>
//         </div>
//       </div>

//       <section className="admin-refer-panel">
//         <div className="admin-refer-panel-heading">
//           <div>
//             <h2>Referral Participants</h2>
//             <p>Review referral codes, activity and reward totals.</p>
//           </div>
//           <span className="admin-refer-count">
//             {filteredReferrals.length} records
//           </span>
//         </div>

//         <div className="admin-refer-toolbar">
//           <div className="admin-refer-search">
//             <span>⌕</span>
//             <input
//               type="search"
//               placeholder="Search name, email or referral code..."
//               value={search}
//               onChange={(event) => {
//                 setSearch(event.target.value);
//                 setPage(1);
//               }}
//             />
//           </div>

//           <select
//             aria-label="Filter referral status"
//             value={statusFilter}
//             onChange={(event) => {
//               setStatusFilter(event.target.value);
//               setPage(1);
//             }}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Active">Active</option>
//             <option value="Pending">Pending</option>
//             <option value="Inactive">Inactive</option>
//           </select>
//         </div>

//         <div className="admin-refer-table-wrap">
//           <table className="admin-refer-table">
//             <thead>
//               <tr>
//                 <th>PARTICIPANT</th>
//                 <th>REFERRAL CODE</th>
//                 <th>USERS REFERRED</th>
//                 <th>REWARDS</th>
//                 <th>JOINED</th>
//                 <th>STATUS</th>
//                 <th>ACTIONS</th>
//               </tr>
//             </thead>

//             <tbody>
//               {visibleReferrals.map((referral) => (
//                 <tr key={referral.id}>
//                   <td>
//                     <div className="admin-refer-person">
//                       <div className="admin-refer-avatar">
//                         {referral.name.charAt(0)}
//                       </div>
//                       <div>
//                         <strong>{referral.name}</strong>
//                         <small>{referral.email}</small>
//                       </div>
//                     </div>
//                   </td>

//                   <td>
//                     <div className="admin-refer-code">
//                       <span>{referral.referralCode}</span>
//                       <button
//                         type="button"
//                         title="Copy referral code"
//                         aria-label={`Copy ${referral.referralCode}`}
//                         onClick={() => copyReferralCode(referral.referralCode)}
//                       >
//                         ⧉
//                       </button>
//                     </div>
//                   </td>

//                   <td className="admin-refer-number">
//                     {referral.referredUsers}
//                   </td>

//                   <td className="admin-refer-earnings">
//                     ₹{referral.earnings.toLocaleString("en-IN")}
//                   </td>

//                   <td className="admin-refer-date">{referral.joined}</td>

//                   <td>
//                     <span
//                       className={`admin-refer-status ${referral.status.toLowerCase()}`}
//                     >
//                       {referral.status}
//                     </span>
//                   </td>

//                   <td>
//                     <div className="admin-refer-actions">
//                       <button
//                         type="button"
//                         title="View participant"
//                         aria-label={`View ${referral.name}`}
//                         onClick={() => setSelectedReferral(referral)}
//                       >
//                         ↗
//                       </button>
//                       <button
//                         type="button"
//                         title={
//                           referral.status === "Inactive"
//                             ? "Activate participant"
//                             : "Deactivate participant"
//                         }
//                         aria-label={`Toggle status for ${referral.name}`}
//                         onClick={() => toggleReferralStatus(referral.id)}
//                       >
//                         {referral.status === "Inactive" ? "✓" : "⊘"}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}

//               {visibleReferrals.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="admin-refer-empty">
//                     <div>♧</div>
//                     <strong>No referral records found</strong>
//                     <p>Try another search term or status filter.</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="admin-refer-pagination">
//           <p>
//             Showing{" "}
//             {filteredReferrals.length === 0
//               ? 0
//               : (page - 1) * pageSize + 1}
//             {" - "}
//             {Math.min(page * pageSize, filteredReferrals.length)} of{" "}
//             {filteredReferrals.length}
//           </p>

//           <div>
//             <button
//               type="button"
//               disabled={page <= 1}
//               onClick={() => setPage((previous) => previous - 1)}
//             >
//               Previous
//             </button>
//             <span>
//               {page} / {totalPages}
//             </span>
//             <button
//               type="button"
//               disabled={page >= totalPages}
//               onClick={() => setPage((previous) => previous + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </section>

//       {settingsOpen && (
//         <div
//           className="admin-refer-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setSettingsOpen(false);
//             }
//           }}
//         >
//           <section
//             className="admin-refer-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="admin-refer-settings-title"
//           >
//             <div className="admin-refer-modal-heading">
//               <div>
//                 <h2 id="admin-refer-settings-title">Referral Settings</h2>
//                 <p>Configure the referral reward preview.</p>
//               </div>
//               <button
//                 type="button"
//                 aria-label="Close settings"
//                 onClick={() => setSettingsOpen(false)}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={saveSettings}>
//               <label>
//                 Reward per referral (₹)
//                 <input
//                   name="rewardPerReferral"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={settings.rewardPerReferral}
//                   onChange={updateSetting}
//                   required
//                 />
//               </label>

//               <label>
//                 Minimum payout (₹)
//                 <input
//                   name="minimumPayout"
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={settings.minimumPayout}
//                   onChange={updateSetting}
//                   required
//                 />
//               </label>

//               <label className="admin-refer-toggle">
//                 <span>
//                   <strong>Referral programme</strong>
//                   <small>Enable or disable the programme in this preview.</small>
//                 </span>
//                 <input
//                   type="checkbox"
//                   checked={settings.referralEnabled}
//                   onChange={(event) => {
//                     setSettings((previous) => ({
//                       ...previous,
//                       referralEnabled: event.target.checked,
//                     }));
//                     setSettingsMessage("");
//                   }}
//                 />
//               </label>

//               <div className="admin-refer-modal-actions">
//                 <button
//                   type="button"
//                   className="secondary"
//                   onClick={() => setSettingsOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="primary">
//                   Save Settings
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       )}

//       {selectedReferral && (
//         <div
//           className="admin-refer-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setSelectedReferral(null);
//             }
//           }}
//         >
//           <section
//             className="admin-refer-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="admin-refer-detail-title"
//           >
//             <div className="admin-refer-modal-heading">
//               <div>
//                 <h2 id="admin-refer-detail-title">Referral Details</h2>
//                 <p>Participant summary</p>
//               </div>
//               <button
//                 type="button"
//                 aria-label="Close details"
//                 onClick={() => setSelectedReferral(null)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="admin-refer-details">
//               <div>
//                 <span>Name</span>
//                 <strong>{selectedReferral.name}</strong>
//               </div>
//               <div>
//                 <span>Email</span>
//                 <strong>{selectedReferral.email}</strong>
//               </div>
//               <div>
//                 <span>Referral code</span>
//                 <strong>{selectedReferral.referralCode}</strong>
//               </div>
//               <div>
//                 <span>Users referred</span>
//                 <strong>{selectedReferral.referredUsers}</strong>
//               </div>
//               <div>
//                 <span>Recorded rewards</span>
//                 <strong>
//                   ₹{selectedReferral.earnings.toLocaleString("en-IN")}
//                 </strong>
//               </div>
//               <div>
//                 <span>Status</span>
//                 <strong>{selectedReferral.status}</strong>
//               </div>
//             </div>

//             <div className="admin-refer-modal-actions">
//               <button
//                 type="button"
//                 className="primary"
//                 onClick={() => setSelectedReferral(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </section>
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./AdminCSS/AdminReferEarn.css";

// const API_URL = "http://localhost:4000/api/admin" || "https://sks-serverproject-new.onrender.com/api/admin";
const API_URL =  "https://sks-serverproject-new.onrender.com/api/admin";
const PAGE_SIZE = 5;

const MEMBER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "blocked", label: "Blocked" },
];

const LEAD_STATUSES = [
  { value: "not_registered", label: "Not Registered" },
  { value: "registered_unpaid", label: "Registered — Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
];

const emptyLeadForm = {
  sponsor_user_id: "",
  full_name: "",
  mobile: "",
  email: "",
  status: "not_registered",
  notes: "",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong. Please try again.";

const AdminReferEarn = () => {
  // Registered members
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Search and server-side pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  // Selected member
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  // Lead creation
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [leadSaving, setLeadSaving] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");

  // Preview-only settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settings, setSettings] = useState({
    rewardPerReferral: "200",
    minimumPayout: "500",
    referralEnabled: true,
  });

  const fetchReferrals = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/referrals`, {
          withCredentials: true,
          signal,
          params: {
            search: search.trim(),
            status: statusFilter,
            page,
            limit: PAGE_SIZE,
          },
        });

        const data = response.data;

        setReferrals(Array.isArray(data.referrals) ? data.referrals : []);

        const serverPagination = data.pagination || {};

        setPagination({
          page: Number(serverPagination.page) || page,
          limit: Number(serverPagination.limit) || PAGE_SIZE,
          total: Number(serverPagination.total) || 0,
          totalPages: Number(serverPagination.totalPages) || 0,
        });
      } catch (err) {
        if (
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        setError(getErrorMessage(err));
        setReferrals([]);
        setPagination({
          page,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        });
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [search, statusFilter, page, refreshKey]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchReferrals(controller.signal);

    return () => controller.abort();
  }, [fetchReferrals]);

  // Reset pagination when search or status changes.
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Keep the current page within valid server pagination bounds.
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }

    if (pagination.totalPages === 0 && page !== 1) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

  const refreshReferrals = () => {
    setRefreshKey((current) => current + 1);
  };

  const visibleDirectReferrals = referrals.reduce(
    (total, member) => total + (Number(member.direct_referrals) || 0),
    0
  );

  const visibleActiveMembers = referrals.filter(
    (member) => member.status?.toLowerCase() === "active"
  ).length;

  const visiblePendingMembers = referrals.filter(
    (member) => member.status?.toLowerCase() === "pending"
  ).length;

  const handleCopyReferralCode = async (code) => {
    if (!code) {
      setCopyMessage("This member has no referral code.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage(`Referral code ${code} copied.`);
    } catch {
      setCopyMessage(
        "Could not copy automatically. Please copy the code manually."
      );
    }
  };

  const openLeadModal = () => {
    setLeadForm(emptyLeadForm);
    setLeadError("");
    setLeadSuccess("");
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    if (leadSaving) return;

    setLeadModalOpen(false);
    setLeadError("");
  };

  const handleLeadChange = (event) => {
    const { name, value } = event.target;

    setLeadForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateLead = async (event) => {
    event.preventDefault();

    setLeadError("");
    setLeadSuccess("");

    const sponsorId = Number(leadForm.sponsor_user_id);

    if (!Number.isInteger(sponsorId) || sponsorId <= 0) {
      setLeadError("Enter a valid Sponsor User ID.");
      return;
    }

    if (
      !leadForm.full_name.trim() &&
      !leadForm.mobile.trim() &&
      !leadForm.email.trim()
    ) {
      setLeadError("Enter at least a name, mobile number, or email.");
      return;
    }

    if (
      leadForm.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email.trim())
    ) {
      setLeadError("Enter a valid email address.");
      return;
    }

    setLeadSaving(true);

    try {
      const response = await axios.post(
        `${API_URL}/referrals/leads`,
        {
          sponsor_user_id: sponsorId,
          full_name: leadForm.full_name.trim(),
          mobile: leadForm.mobile.trim(),
          email: leadForm.email.trim(),
          status: leadForm.status,
          notes: leadForm.notes.trim(),
        },
        { withCredentials: true }
      );

      setLeadSuccess(
        response.data?.message || "Referral lead created successfully."
      );
      setLeadForm(emptyLeadForm);
    } catch (err) {
      setLeadError(getErrorMessage(err));
    } finally {
      setLeadSaving(false);
    }
  };

  const handleSaveSettings = (event) => {
    event.preventDefault();

    const reward = Number(settings.rewardPerReferral);
    const minimum = Number(settings.minimumPayout);

    if (!Number.isFinite(reward) || reward < 0) {
      setSettingsMessage("Enter a valid referral reward.");
      return;
    }

    if (!Number.isFinite(minimum) || minimum < 0) {
      setSettingsMessage("Enter a valid minimum payout.");
      return;
    }

    // No settings endpoint exists yet. Do not claim these values were saved.
    setSettingsMessage(
      "Preview updated in this session only. These settings have NOT been saved to the server."
    );
  };

  return (
    <div className="admin-refer-container">
      {/* Header */}
      <div className="admin-refer-header">
        <div>
          <h1>Refer &amp; Earn</h1>
          <p>
            Manage registered members, referral activity, and prospective
            referral leads.
          </p>
        </div>

        <div className="admin-refer-header-actions">
          <button
            type="button"
            className="admin-refer-settings-btn"
            onClick={() => {
              setSettingsMessage("");
              setSettingsOpen(true);
            }}
          >
            Settings
          </button>

          <button
            type="button"
            className="admin-refer-add-btn"
            onClick={openLeadModal}
          >
            + Add Referral Lead
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="admin-refer-stats">
        <div className="admin-refer-stat-card">
          <div className="admin-refer-stat-icon">👥</div>
          <div>
            <p>Total Registered Members</p>
            <h2>{pagination.total}</h2>
            <span>All members matching the current filters</span>
          </div>
        </div>

        <div className="admin-refer-stat-card">
          <div className="admin-refer-stat-icon">🔗</div>
          <div>
            <p>Direct Referrals</p>
            <h2>{visibleDirectReferrals}</h2>
            <span>Members on the current page</span>
          </div>
        </div>

        <div className="admin-refer-stat-card">
          <div className="admin-refer-stat-icon">✓</div>
          <div>
            <p>Active Members</p>
            <h2>{visibleActiveMembers}</h2>
            <span>On the current page</span>
          </div>
        </div>

        <div className="admin-refer-stat-card">
          <div className="admin-refer-stat-icon">◷</div>
          <div>
            <p>Pending Members</p>
            <h2>{visiblePendingMembers}</h2>
            <span>On the current page</span>
          </div>
        </div>
      </div>

      {/* Registered members */}
      <div className="admin-refer-content">
        <div className="admin-refer-table-header">
          <div>
            <h2>Registered Members</h2>
            <p>
              This table displays registered users returned by your backend.
              Prospective leads are stored separately.
            </p>
          </div>

          <button
            type="button"
            className="admin-refer-refresh-btn"
            onClick={refreshReferrals}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {/* Search and filters */}
        <div className="admin-refer-filters">
          <div className="admin-refer-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search name, email, mobile or referral code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search registered members"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter members by status"
          >
            <option value="">All Statuses</option>
            {MEMBER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {copyMessage && (
          <div className="admin-refer-message" role="status">
            {copyMessage}
            <button
              type="button"
              onClick={() => setCopyMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="admin-refer-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={refreshReferrals}>
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-refer-empty">
            <p>Loading registered members...</p>
          </div>
        ) : !error && referrals.length === 0 ? (
          <div className="admin-refer-empty">
            <h3>No registered members found</h3>
            <p>
              {search || statusFilter
                ? "Try changing your search or status filter."
                : "Registered members will appear here when the backend returns users for this tenant."}
            </p>
          </div>
        ) : (
          !error && (
            <>
              <div className="admin-refer-table-wrapper">
                <table className="admin-refer-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Referral Code</th>
                      <th>Sponsor</th>
                      <th>Direct Referrals</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {referrals.map((member) => (
                      <tr key={member.user_id}>
                        <td>
                          <div className="admin-refer-user">
                            <div className="admin-refer-avatar">
                              {(member.full_name || "U")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{member.full_name || "Unnamed Member"}</strong>
                              <span>{member.email || member.mobile || "—"}</span>
                              {member.email && member.mobile && (
                                <small>{member.mobile}</small>
                              )}
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-refer-code">
                            <span>{member.referral_code || "—"}</span>

                            {member.referral_code && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyReferralCode(member.referral_code)
                                }
                                title="Copy referral code"
                                aria-label={`Copy referral code ${member.referral_code}`}
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="admin-refer-sponsor">
                            <strong>{member.sponsor_name || "Direct / None"}</strong>
                            <span>
                              {member.sponsor_referral_code || "—"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="admin-refer-number">
                            {Number(member.direct_referrals) || 0}
                          </span>
                        </td>

                        <td>{formatDate(member.created_at)}</td>

                        <td>
                          <span
                            className={`admin-refer-status admin-refer-status-${(
                              member.status || "unknown"
                            )
                              .toLowerCase()
                              .replace(/[^a-z0-9_-]/g, "")}`}
                          >
                            {formatStatus(member.status)}
                          </span>
                        </td>

                        <td>
                          <div className="admin-refer-actions">
                            <button
                              type="button"
                              onClick={() => setSelectedReferral(member)}
                              title="View member details"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="admin-refer-pagination">
                <span>
                  {pagination.total === 0
                    ? "No members"
                    : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                        page * PAGE_SIZE,
                        pagination.total
                      )} of ${pagination.total} members`}
                </span>

                <div>
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {Math.max(1, pagination.totalPages)}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >= pagination.totalPages ||
                      pagination.totalPages === 0 ||
                      loading
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination.totalPages, current + 1)
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Registered member details modal */}
      {selectedReferral && (
        <div
          className="admin-refer-modal-overlay"
          onClick={() => setSelectedReferral(null)}
        >
          <div
            className="admin-refer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-refer-member-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-refer-modal-header">
              <div>
                <h2 id="admin-refer-member-title">Member Details</h2>
                <p>Information returned by the registered-members API.</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
                aria-label="Close member details"
              >
                ×
              </button>
            </div>

            <div className="admin-refer-details">
              <div>
                <span>Member ID</span>
                <strong>{selectedReferral.user_id ?? "—"}</strong>
              </div>

              <div>
                <span>Full Name</span>
                <strong>{selectedReferral.full_name || "—"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedReferral.email || "—"}</strong>
              </div>

              <div>
                <span>Mobile</span>
                <strong>{selectedReferral.mobile || "—"}</strong>
              </div>

              <div>
                <span>Referral Code</span>
                <strong>{selectedReferral.referral_code || "—"}</strong>
              </div>

              <div>
                <span>Sponsor</span>
                <strong>{selectedReferral.sponsor_name || "Direct / None"}</strong>
              </div>

              <div>
                <span>Sponsor Referral Code</span>
                <strong>{selectedReferral.sponsor_referral_code || "—"}</strong>
              </div>

              <div>
                <span>Direct Referrals</span>
                <strong>{Number(selectedReferral.direct_referrals) || 0}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formatStatus(selectedReferral.status)}</strong>
              </div>

              <div>
                <span>Joined Date</span>
                <strong>{formatDate(selectedReferral.created_at)}</strong>
              </div>
            </div>

            <div className="admin-refer-modal-footer">
              <button
                type="button"
                onClick={() =>
                  handleCopyReferralCode(selectedReferral.referral_code)
                }
                disabled={!selectedReferral.referral_code}
              >
                Copy Referral Code
              </button>

              <button
                type="button"
                onClick={() => setSelectedReferral(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add referral lead modal */}
      {leadModalOpen && (
        <div className="admin-refer-modal-overlay" onClick={closeLeadModal}>
          <div
            className="admin-refer-modal admin-refer-lead-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-refer-lead-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-refer-modal-header">
              <div>
                <h2 id="admin-refer-lead-title">Add Referral Lead</h2>
                <p>
                  Create a prospective referral lead linked to an existing
                  registered sponsor.
                </p>
              </div>

              <button
                type="button"
                onClick={closeLeadModal}
                disabled={leadSaving}
                aria-label="Close lead form"
              >
                ×
              </button>
            </div>

            {leadError && (
              <div className="admin-refer-error" role="alert">
                {leadError}
              </div>
            )}

            {leadSuccess && (
              <div className="admin-refer-message" role="status">
                <p>{leadSuccess}</p>
                <p>
                  This lead is stored separately and will not appear in the
                  Registered Members table unless the person registers.
                </p>
              </div>
            )}

            <form onSubmit={handleCreateLead}>
              <div className="admin-refer-form-grid">
                <label>
                  Sponsor User ID <span>*</span>
                  <input
                    type="number"
                    name="sponsor_user_id"
                    min="1"
                    step="1"
                    value={leadForm.sponsor_user_id}
                    onChange={handleLeadChange}
                    placeholder="Enter an existing user ID"
                    required
                  />
                  <small>
                    Use the ID of an existing user in the current tenant.
                  </small>
                </label>

                <label>
                  Lead Name
                  <input
                    type="text"
                    name="full_name"
                    value={leadForm.full_name}
                    onChange={handleLeadChange}
                    placeholder="Full name"
                    maxLength="150"
                  />
                </label>

                <label>
                  Mobile Number
                  <input
                    type="tel"
                    name="mobile"
                    value={leadForm.mobile}
                    onChange={handleLeadChange}
                    placeholder="Mobile number"
                    maxLength="20"
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    name="email"
                    value={leadForm.email}
                    onChange={handleLeadChange}
                    placeholder="name@example.com"
                    maxLength="254"
                  />
                </label>

                <label>
                  Lead Status
                  <select
                    name="status"
                    value={leadForm.status}
                    onChange={handleLeadChange}
                  >
                    {LEAD_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-refer-full-width">
                  Notes
                  <textarea
                    name="notes"
                    value={leadForm.notes}
                    onChange={handleLeadChange}
                    placeholder="Optional notes about this lead"
                    rows="3"
                  />
                </label>
              </div>

              <p className="admin-refer-form-note">
                At least one of the lead's name, mobile number, or email is
                required. The backend will verify that the sponsor exists.
              </p>

              <div className="admin-refer-modal-footer">
                <button
                  type="button"
                  onClick={closeLeadModal}
                  disabled={leadSaving}
                >
                  Close
                </button>

                <button type="submit" disabled={leadSaving}>
                  {leadSaving ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview-only referral settings */}
      {settingsOpen && (
        <div
          className="admin-refer-modal-overlay"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="admin-refer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-refer-settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-refer-modal-header">
              <div>
                <h2 id="admin-refer-settings-title">Referral Settings</h2>
                <p>
                  Preview only — the backend does not currently expose a
                  settings endpoint.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            {settingsMessage && (
              <div className="admin-refer-message" role="status">
                {settingsMessage}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div className="admin-refer-form-grid">
                <label>
                  Reward Per Referral (₹)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={settings.rewardPerReferral}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        rewardPerReferral: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Minimum Payout (₹)
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={settings.minimumPayout}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        minimumPayout: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="admin-refer-toggle-setting">
                  <input
                    type="checkbox"
                    checked={settings.referralEnabled}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        referralEnabled: event.target.checked,
                      }))
                    }
                  />
                  Referral program enabled (preview)
                </label>
              </div>

              <p className="admin-refer-form-note">
                These values are not connected to reward calculations and
                will not persist after leaving this page.
              </p>

              <div className="admin-refer-modal-footer">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                >
                  Close
                </button>

                <button type="submit">Update Preview</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferEarn;
