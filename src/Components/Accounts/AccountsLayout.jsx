import React, { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  UsersRound,
  ReceiptText,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";

import AccountsTaxes from "./AccountsTaxes";
import AccountsAssets from "./AccountsAssets";
import AccountsUsers from "./AccountsUsers";

import "../../CSS/Account/AccountsPanel.css";

export default function AccountsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    {
      to: "/accounts/users",
      label: "User Accounts",
      Icon: UsersRound,
    },
    {
      to: "/accounts/taxes",
      label: "Taxes",
      Icon: ReceiptText,
    },
    {
      to: "/accounts/assets",
      label: "Assets",
      Icon: Landmark,
    },
  ];

  return (
    <div className={`acc-shell acc-minimal-theme ${collapsed ? "acc-collapsed" : ""}`}>
      <aside className={`acc-sidebar ${menuOpen ? "acc-sidebar-open" : ""}`}>
        <div className="acc-sidebar-top">
          <span className="acc-sidebar-label">MENU</span>

          <button
            type="button"
            className="acc-collapse-button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>

          <button
            type="button"
            className="acc-sidebar-mobile-close"
            onClick={closeMenu}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="acc-navigation" aria-label="Accounts navigation">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              onClick={closeMenu}
              className={({ isActive }) =>
                `acc-nav-link ${isActive ? "acc-nav-active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} className="acc-nav-icon" />
              <span className="acc-nav-text">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="acc-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <div className="acc-main">
        <header className="acc-header">
          <button
            type="button"
            className="acc-menu-button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} />
          </button>
        </header>

        <main className="acc-content">
          <Routes>
            <Route index element={<Navigate to="taxes" replace />} />
            <Route path="taxes" element={<AccountsTaxes />} />
            <Route path="assets" element={<AccountsAssets />} />
            <Route path="users" element={<AccountsUsers />} />
            <Route path="*" element={<Navigate to="taxes" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}