import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import "./AdminCSS/AdminLayout.css"

// const API_URL = "http://localhost:4000/api/admin" || "https://sks-serverproject-new.onrender.com/api/admin";
const API_URL = "https://sks-serverproject-new.onrender.com/api/admin";

const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "◫" },
    { label: "Products", path: "/admin/products", icon: "+" },
    { label: "Refer & Earn", path: "/admin/refer-earn", icon: "♧" },
    { label: "My Network", path: "/admin/my-network", icon: "♙" },
    { label: "My Wallet", path: "/admin/my-wallet", icon: "▣" },
    { label: "Payout Funds", path: "/admin/payouts", icon: "₹" },
    { label: "All Orders", path: "/admin/orders", icon: "♧" },
    {
        label: "Payment Gateway",
        path: "/admin/payment-gateway",
        icon: "▤",
    },
    {
        label: "Referral Tree",
        path: "/admin/referral-tree",
        icon: "♧",
    },
    {
        label: "Bank Details",
        path: "/admin/bank-details",
        icon: "⌂",
    },
    {
        label: "Forgot-Password",
        path: "/admin/forgot-password",
        icon: "♙",
    },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [checking, setChecking] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        axios
            .get(`${API_URL}/me`, { withCredentials: true })
            .then((response) => {
                if (!cancelled) setAdmin(response.data.admin);
            })
            .catch(() => {
                if (!cancelled) {
                    navigate("/admin/login", { replace: true });
                }
            })
            .finally(() => {
                if (!cancelled) setChecking(false);
            });

        return () => {
            cancelled = true;
        };
    }, [navigate]);



    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);


    useEffect(() => {
        if (!menuOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        }

        const handleResize = () => {
            if (window.innerWidth > 1024) setMenuOpen(false);
        }

        document.addEventListener("keydown", handleEscape);
        window.addEventListener("resize", handleResize);


        return () => {
            document.addEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handleResize);
        }
    }, [menuOpen])


    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await axios.post(
                `${API_URL}/logout`,
                {},
                { withCredentials: true }
            );

            navigate("/admin/login", { replace: true });
        } catch (error) {
            console.error("Admin logout failed:", error.message);
            setLoggingOut(false);
        }
    }


    if (checking || !admin) {
        return (
            <div className="sks-admin-shell-loading">
                <span className="sks-admin-spinner" />
                <p>Checking admin session...</p>
            </div>
        );
    }

    return (
        <div className="sks-admin-layout">
            {menuOpen && (
                <button
                    type="button"
                    className="sks-admin-mobile-overlay"
                    aria-label="Close admin menu"
                    onClick={() => setMenuOpen(false)}
                />
            )}
            <aside id="sks-admin-mobile-navigation" className={`sks-admin-sidebar ${menuOpen ? "is-open" : ""}`}>
                <div className="sks-admin-brand">
                    <div className="sks-admin-brand-logo">S</div>
                    <div>
                        <h2>SKS Dream</h2>
                        <span>ADMIN PANEL</span>
                    </div>

                    <button
                        type="button"
                        className="sks-admin-mobile-close"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="sks-admin-menu-label">MAIN MENU</div>

                <nav className="sks-admin-menu">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sks-admin-menu-link ${isActive ? "active" : ""
                                }`
                            }

                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="sks-admin-menu-icon">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sks-admin-sidebar-footer">
                    <div className="sks-admin-user">
                        <div className="sks-admin-user-avatar">
                            {(admin.email || "A")[0].toUpperCase()}
                        </div>
                        <div className="sks-admin-user-info">
                            <strong>Administrator</strong>
                            <span>{admin.email}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="sks-admin-logout"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Signing out..." : "↪ Sign out"}
                    </button>
                </div>
            </aside>

            <div className="sks-admin-main">
                <header className="sks-admin-topbar">
                    <button
                        type="button"
                        className="sks-admin-mobile-toggle"
                        aria-label="Open admin menu"
                        aria-controls="sks-admin-mobile-navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(true)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <div>
                        <span>SKS Dream</span>
                        <span className="sks-admin-breadcrumb-separator">
                            /
                        </span>
                        <strong>
                            {menuItems.find(
                                (item) =>
                                    item.path === window.location.pathname
                            )?.label || "Admin"}
                        </strong>
                    </div>
                    <span className="sks-admin-session-status">
                        <i />
                        Session active
                    </span>
                </header>

                <main className="sks-admin-page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
