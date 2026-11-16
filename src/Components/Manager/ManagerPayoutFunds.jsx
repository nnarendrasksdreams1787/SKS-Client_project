
import React, { useEffect, useMemo, useState } from "react";
import {
    Wallet,
    CheckCircle2,
    Layers,
    IndianRupee,
    Search,
    Eye,
    X,
    RefreshCw,
} from "lucide-react";

// import "./ManagerCSS/ManagerPayoutFunds.css";
import "../../CSS/Manager/ManagerPayoutFunds.css";

const API_BASE = (
    import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const API_URL = `${API_BASE}/api/manager/payout-batches`;

const money = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(Number(value || 0));

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

const statusLabel = (value) =>
    String(value || "unknown")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

export default function ManagerPayoutFunds() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchDetails, setBatchDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");

    const loadBatches = async (signal) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL, {
                credentials: "include",
                signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Unable to load payouts");
            }

            setBatches(Array.isArray(data.batches) ? data.batches : []);
        } catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message || "Failed to load payouts");
            }
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        loadBatches(controller.signal);

        return () => controller.abort();
    }, []);

    const filteredBatches = useMemo(() => {
        const query = search.trim().toLowerCase();

        return batches.filter((batch) => {
            const matchesSearch =
                !query ||
                String(batch.batch_number || "")
                    .toLowerCase()
                    .includes(query) ||
                String(batch.payout_batch_id).includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                batch.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [batches, search, statusFilter]);

    const totalAmount = batches.reduce(
        (sum, batch) => sum + Number(batch.total_amount || 0),
        0
    );

    const completedBatches = batches.filter(
        (batch) => batch.status === "completed"
    ).length;

    const totalRequests = batches.reduce(
        (sum, batch) => sum + Number(batch.total_requests || 0),
        0
    );

    const statuses = [...new Set(batches.map((b) => b.status))];

    const openDetails = async (batch) => {
        setSelectedBatch(batch);
        setBatchDetails(null);
        setDetailsError("");
        setDetailsLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/${batch.payout_batch_id}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Unable to load details");
            }

            setBatchDetails(data);
        } catch (err) {
            setDetailsError(err.message || "Unable to load details");
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeDetails = () => {
        setSelectedBatch(null);
        setBatchDetails(null);
        setDetailsError("");
    };

    return (
        <div className="manager-payout-funds">

            <h2 style={{ color: "red", fontSize: "30px" }}>
                Payout Funds Test
            </h2>

            <div className="mpf-heading">
                <div>
                    <h1>Payout Funds</h1>
                    <p>View payout batches, transactions and payment status.</p>
                </div>

                <button
                    type="button"
                    className="mpf-refresh"
                    onClick={() => loadBatches()}
                    disabled={loading}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="mpf-stats">
                <div className="mpf-stat">
                    <span className="mpf-stat-icon blue">
                        <Layers size={23} />
                    </span>
                    <div>
                        <p>Total Batches</p>
                        <strong>{batches.length}</strong>
                    </div>
                </div>

                <div className="mpf-stat">
                    <span className="mpf-stat-icon green">
                        <CheckCircle2 size={23} />
                    </span>
                    <div>
                        <p>Completed Batches</p>
                        <strong>{completedBatches}</strong>
                    </div>
                </div>

                <div className="mpf-stat">
                    <span className="mpf-stat-icon amber">
                        <Wallet size={23} />
                    </span>
                    <div>
                        <p>Total Requests</p>
                        <strong>{totalRequests}</strong>
                    </div>
                </div>

                <div className="mpf-stat">
                    <span className="mpf-stat-icon purple">
                        <IndianRupee size={23} />
                    </span>
                    <div>
                        <p>Total Batch Amount</p>
                        <strong>{money(totalAmount)}</strong>
                    </div>
                </div>
            </div>

            <section className="mpf-panel">
                <div className="mpf-panel-heading">
                    <div>
                        <h2>All Payout Batches</h2>
                        <p>Read-only payout records from the database.</p>
                    </div>

                    <span className="mpf-count">
                        {filteredBatches.length} records
                    </span>
                </div>

                <div className="mpf-filters">
                    <div className="mpf-search">
                        <Search size={17} />
                        <input
                            type="search"
                            placeholder="Search batch number or ID..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {statusLabel(status)}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="mpf-message mpf-error">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="mpf-message">Loading payout batches...</div>
                ) : (
                    <div className="mpf-table-scroll">
                        <table className="mpf-table">
                            <thead>
                                <tr>
                                    <th>Batch Number</th>
                                    <th>Requests</th>
                                    <th>Amount</th>
                                    <th>Created Date</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBatches.map((batch) => (
                                    <tr key={batch.payout_batch_id}>
                                        <td>
                                            <strong>{batch.batch_number}</strong>
                                            <small>ID: {batch.payout_batch_id}</small>
                                        </td>
                                        <td>{batch.total_requests}</td>
                                        <td className="mpf-amount">
                                            {money(batch.total_amount)}
                                        </td>
                                        <td>{formatDate(batch.created_at)}</td>
                                        <td>
                                            <span
                                                className={`mpf-status mpf-status-${batch.status}`}
                                            >
                                                {statusLabel(batch.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="mpf-view"
                                                onClick={() => openDetails(batch)}
                                            >
                                                <Eye size={15} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {!filteredBatches.length && (
                                    <tr>
                                        <td colSpan={6} className="mpf-empty">
                                            No payout batches found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selectedBatch && (
                <div
                    className="mpf-modal-backdrop"
                    onClick={closeDetails}
                >
                    <div
                        className="mpf-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Payout batch details"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mpf-modal-heading">
                            <div>
                                <small>PAYOUT BATCH DETAILS</small>
                                <h2>{selectedBatch.batch_number}</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetails}
                                aria-label="Close details"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="mpf-modal-summary">
                            <div>
                                <span>Batch Amount</span>
                                <strong>{money(selectedBatch.total_amount)}</strong>
                            </div>
                            <div>
                                <span>Requests</span>
                                <strong>{selectedBatch.total_requests}</strong>
                            </div>
                            <div>
                                <span>Status</span>
                                <strong>{statusLabel(selectedBatch.status)}</strong>
                            </div>
                        </div>

                        {detailsLoading ? (
                            <p className="mpf-message">Loading transactions...</p>
                        ) : detailsError ? (
                            <p className="mpf-message mpf-error">{detailsError}</p>
                        ) : (
                            <div className="mpf-table-scroll">
                                <table className="mpf-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Reference ID</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Provider Ref.</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(batchDetails?.items || []).map((item) => (
                                            <tr key={item.payout_batch_item_id}>
                                                <td>
                                                    <strong>{item.full_name}</strong>
                                                    <small>Withdrawal #{item.withdrawal_id}</small>
                                                </td>
                                                <td>{item.reference_id}</td>
                                                <td>{money(item.amount)}</td>
                                                <td>
                                                    <span
                                                        className={`mpf-status mpf-status-${item.status}`}
                                                    >
                                                        {statusLabel(item.status)}
                                                    </span>
                                                </td>
                                                <td>{item.provider_reference || "—"}</td>
                                            </tr>
                                        ))}

                                        {!batchDetails?.items?.length && (
                                            <tr>
                                                <td colSpan={5} className="mpf-empty">
                                                    No transactions in this batch.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            type="button"
                            className="mpf-close"
                            onClick={closeDetails}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
