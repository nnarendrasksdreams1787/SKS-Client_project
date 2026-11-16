
import React, { useState } from "react";
import {
  ShoppingBag,
  WalletCards,
  LayoutDashboard,
  Landmark,
  HandCoins,
  Network,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import "../../CSS/Manager/Manager.css";
import ManagerSales from "./ManagerSales";
import ManagerAccounts from "./ManagerAccounts";
import ManagerReferralTree from "./ManagerReferralTree";

import kanhaSidebar from "../../assets/Theme/kanha-sidebar.jpg";

import ManagerBankDetails from "./ManagerBankDetails";

import ManagerPayoutFunds from "./ManagerPayoutFunds";

import ManagerDashboard from "./ManagerDashboard";


// const MENU_ITEMS = [
//   {
//     id: "sales",
//     label: "Sales",
//     Icon: ShoppingBag,
//   },
//   {
//     id: "accounts",
//     label: "Accounts",
//     Icon: WalletCards,
//   },
// ];

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "sales", label: "Sales", Icon: ShoppingBag },
  // {id: "accounts", label: "Accounts", Icon: WalletCards },
  { id: "accounts", label: "Withdrawal Requests", Icon: WalletCards },
  { id: "bank-details", label: "Bank Details", Icon: Landmark },
  { id: "payout-funds", label: "Payout Funds", Icon: HandCoins },
  { id: "referral-tree", label: "Referral Tree", Icon: Network },
  { id: "forgot-password", label: "Forgot Password", Icon: KeyRound },
];

export default function ManagerLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const openTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`mgr-shell mgr-minimal-theme ${collapsed ? "mgr-collapsed" : ""
        }`}
    >
      {mobileMenuOpen && (
        <button
          type="button"
          className="mgr-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}


      <aside
        className={`mgr-sidebar ${mobileMenuOpen ? "mgr-sidebar-open" : ""
          }`}
      >
        {/* SKS Dream Branding */}
        <div className="mgr-brand">
          <div className="mgr-brand-logo">S</div>

          <div className="mgr-brand-text">
            <strong>SKS Dream</strong>
            <small>MANAGER PANEL</small>
          </div>
        </div>

        {/* Menu heading and collapse button */}

        <div className="mgr-sidebar-heading">
          <button
            type="button"
            className="mgr-collapse-button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>

          <button
            type="button"
            className="mgr-sidebar-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>


        <div className="mgr-krishna-art">
          <img src={kanhaSidebar} alt="Shri Krishna" />
        </div>



        {/* Navigation */}
        <nav className="mgr-nav" aria-label="Manager navigation">
          {MENU_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              title={collapsed ? label : undefined}
              className={`mgr-nav-item ${activeTab === id ? "mgr-nav-active" : ""
                }`}
              onClick={() => openTab(id)}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                className="mgr-nav-icon"
              />

              <span className="mgr-nav-text">{label}</span>
            </button>
          ))}
        </nav>


      </aside>


      <div className="mgr-workspace">
        <header className="mgr-topbar mgr-topbar-minimal">
          <button
            type="button"
            className="mgr-mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </header>

        <main className="mgr-main">
          {activeTab === "dashboard" && <ManagerDashboard />}

          {activeTab === "sales" && <ManagerSales />}

          {activeTab === "accounts" && <ManagerAccounts />}

          {activeTab === "bank-details" && <ManagerBankDetails />}

          {activeTab === "payout-funds" && <ManagerPayoutFunds />}

          {activeTab === "referral-tree" && <ManagerReferralTree />}

        </main>
      </div>
    </div>
  );
}
