// import React, { useState } from 'react'
// import "./AdminCSS/AdminPaymentGetway.css";

// const initialGateways = [
//   {
//     id: "razorpay",
//     name: "Razorpay",
//     description: "Accept UPI, cards, net banking and wallets.",
//     category: "Online Payments",
//     enabled: true,
//     configured: true,
//     environment: "Test Mode",
//     publicKey: "rzp_test_demo123",
//     secretKey: "demo_secret_key",
//   },
//   {
//     id: "cashfree",
//     name: "Cashfree Payments",
//     description: "Online payment collection and payment processing.",
//     category: "Online Payments",
//     enabled: false,
//     configured: false,
//     environment: "Test Mode",
//     publicKey: "",
//     secretKey: "",
//   },
//   {
//     id: "upi",
//     name: "UPI Payments",
//     description: "Accept payments through UPI applications.",
//     category: "UPI",
//     enabled: true,
//     configured: true,
//     environment: "Live Mode",
//     publicKey: "merchant@upi",
//     secretKey: "",
//   },
//   {
//     id: "cod",
//     name: "Cash on Delivery",
//     description: "Allow customers to pay when their order arrives.",
//     category: "Offline Payments",
//     enabled: true,
//     configured: true,
//     environment: "Live Mode",
//     publicKey: "",
//     secretKey: "",
//   },
// ];

// export default function AdminPaymentGetway() {
//    const [gateways, setGateways] = useState(initialGateways);
//   const [selectedGateway, setSelectedGateway] = useState(null);
//   const [formData, setFormData] = useState(null);
//   const [showSecret, setShowSecret] = useState(false);
//   const [notice, setNotice] = useState("");
  

//   const enabledCount = gateways.filter((item) => item.enabled).length;
//   const configuredCount = gateways.filter((item) => item.configured).length;

//   const openSettings = (gateway) => {
//     setSelectedGateway(gateway);
//     setFormData({ ...gateway });
//     setShowSecret(false);
//     setNotice("");
//   };

//   const closeSettings = () => {
//     setSelectedGateway(null);
//     setFormData(null);
//     setShowSecret(false);
//   };

//   const toggleGateway = (id) => {
//     setGateways((current) =>
//       current.map((gateway) =>
//         gateway.id === id
//           ? { ...gateway, enabled: !gateway.enabled }
//           : gateway
//       )
//     );
//     setNotice("");
//   };

//   const updateField = (field, value) => {
//     setFormData((current) => ({ ...current, [field]: value }));
//   };

//   const saveSettings = (event) => {
//     event.preventDefault();

//     setGateways((current) =>
//       current.map((gateway) =>
//         gateway.id === formData.id
//           ? {
//               ...formData,
//               configured:
//                 formData.id === "cod" ||
//                 Boolean(formData.publicKey.trim()) ||
//                 Boolean(formData.secretKey.trim()),
//             }
//           : gateway
//       )
//     );

//     setNotice("Settings saved locally for this preview.");
//     closeSettings();
//     setNotice("Settings saved locally for this preview.");
//   };

//   return (
//     <main className="admin-gateway">
//       <div className="admin-gateway-heading">
//         <div>
//           <h1>Payment Gateway</h1>
//           <p>Manage payment providers and their configuration settings.</p>
//         </div>
//       </div>

//       <section className="gateway-summary">
//         <article className="gateway-summary-card">
//           <div className="gateway-summary-top">
//             <span>Total Gateways</span>
//             <span className="gateway-summary-icon blue">▤</span>
//           </div>
//           <strong>{gateways.length}</strong>
//           <small>Available payment methods</small>
//         </article>

//         <article className="gateway-summary-card">
//           <div className="gateway-summary-top">
//             <span>Enabled Gateways</span>
//             <span className="gateway-summary-icon green">✓</span>
//           </div>
//           <strong>{enabledCount}</strong>
//           <small>Currently enabled in this preview</small>
//         </article>

//         <article className="gateway-summary-card">
//           <div className="gateway-summary-top">
//             <span>Configured</span>
//             <span className="gateway-summary-icon purple">⚙</span>
//           </div>
//           <strong>{configuredCount}</strong>
//           <small>Marked as configured in sample data</small>
//         </article>
//       </section>

//       <section className="gateway-notice">
//         <span className="gateway-notice-icon">i</span>
//         <div>
//           <strong>Configuration preview</strong>
//           <p>
//             These settings are stored only in frontend state. No real payment
//             credentials are saved, and no payment provider is connected.
//           </p>
//         </div>
//       </section>

//       <section className="admin-gateway-panel">
//         <div className="gateway-panel-heading">
//           <div>
//             <h2>Available Payment Methods</h2>
//             <p>Enable methods and review their configuration.</p>
//           </div>
//           <span className="gateway-count">
//             {gateways.length} methods
//           </span>
//         </div>

//         <div className="gateway-list">
//           {gateways.map((gateway) => (
//             <article className="gateway-item" key={gateway.id}>
//               <div className={`gateway-provider-logo gateway-logo-${gateway.id}`}>
//                 {gateway.id === "razorpay" && "R"}
//                 {gateway.id === "cashfree" && "C"}
//                 {gateway.id === "upi" && "U"}
//                 {gateway.id === "cod" && "₹"}
//               </div>

//               <div className="gateway-provider-info">
//                 <div className="gateway-provider-title">
//                   <h3>{gateway.name}</h3>
//                   <span
//                     className={`gateway-status ${
//                       gateway.enabled ? "gateway-status-enabled" : "gateway-status-disabled"
//                     }`}
//                   >
//                     {gateway.enabled ? "Enabled" : "Disabled"}
//                   </span>
//                 </div>

//                 <p>{gateway.description}</p>

//                 <div className="gateway-provider-meta">
//                   <span>{gateway.category}</span>
//                   <span
//                     className={
//                       gateway.configured
//                         ? "gateway-configured"
//                         : "gateway-not-configured"
//                     }
//                   >
//                     <span className="gateway-status-dot" />
//                     {gateway.configured ? "Configured" : "Setup required"}
//                   </span>
//                   <span>{gateway.environment}</span>
//                 </div>
//               </div>

//               <div className="gateway-provider-actions">
//                 <label className="gateway-switch">
//                   <input
//                     type="checkbox"
//                     checked={gateway.enabled}
//                     onChange={() => toggleGateway(gateway.id)}
//                     aria-label={`Enable ${gateway.name}`}
//                   />
//                   <span className="gateway-switch-track" />
//                 </label>

//                 <button
//                   type="button"
//                   className="gateway-settings-button"
//                   onClick={() => openSettings(gateway)}
//                 >
//                   Configure
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {selectedGateway && formData && (
//         <div
//           className="gateway-modal-backdrop"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) closeSettings();
//           }}
//         >
//           <section
//             className="gateway-modal"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="gateway-modal-title"
//           >
//             <div className="gateway-modal-heading">
//               <div>
//                 <span>Payment Provider Settings</span>
//                 <h2 id="gateway-modal-title">{selectedGateway.name}</h2>
//               </div>
//               <button
//                 type="button"
//                 className="gateway-modal-close"
//                 aria-label="Close settings"
//                 onClick={closeSettings}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={saveSettings}>
//               <label className="gateway-form-label">
//                 Provider Status
//                 <select
//                   value={formData.enabled ? "enabled" : "disabled"}
//                   onChange={(event) =>
//                     updateField("enabled", event.target.value === "enabled")
//                   }
//                 >
//                   <option value="enabled">Enabled</option>
//                   <option value="disabled">Disabled</option>
//                 </select>
//               </label>

//               <label className="gateway-form-label">
//                 Environment
//                 <select
//                   value={formData.environment}
//                   onChange={(event) =>
//                     updateField("environment", event.target.value)
//                   }
//                 >
//                   <option value="Test Mode">Test Mode</option>
//                   <option value="Live Mode">Live Mode</option>
//                 </select>
//               </label>

//               {formData.id !== "cod" && (
//                 <>
//                   <label className="gateway-form-label">
//                     Public Key / Merchant ID
//                     <input
//                       type="text"
//                       value={formData.publicKey}
//                       onChange={(event) =>
//                         updateField("publicKey", event.target.value)
//                       }
//                       placeholder="Enter public key or merchant ID"
//                       autoComplete="off"
//                     />
//                   </label>

//                   {formData.id !== "upi" && (
//                     <label className="gateway-form-label">
//                       Secret Key
//                       <div className="gateway-secret-field">
//                         <input
//                           type={showSecret ? "text" : "password"}
//                           value={formData.secretKey}
//                           onChange={(event) =>
//                             updateField("secretKey", event.target.value)
//                           }
//                           placeholder="Enter secret key"
//                           autoComplete="new-password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowSecret((value) => !value)}
//                         >
//                           {showSecret ? "Hide" : "Show"}
//                         </button>
//                       </div>
//                     </label>
//                   )}
//                 </>
//               )}

//               <div className="gateway-test-warning">
//                 <strong>Important</strong>
//                 <p>
//                   This is a frontend-only demo. Never place real secret keys
//                   in frontend code. In production, credentials must be stored
//                   securely on the server.
//                 </p>
//               </div>

//               <div className="gateway-modal-actions">
//                 <button
//                   type="button"
//                   className="gateway-cancel-button"
//                   onClick={closeSettings}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="gateway-save-button">
//                   Save Preview Settings
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       )}
//     </main>
//   );
// }




import React, { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../../Config/api";
import "./AdminCSS/AdminPaymentGetway.css";

const BASE_URL = `${API_BASE_URL}/api/admin/payment-gateways`;
const ENVIRONMENT = "test";

async function gatewayRequest(path = "", options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || `Gateway request failed (${response.status})`
    );
  }

  return data;
}

export default function AdminPaymentGetway() {
  const [gateways, setGateways] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadGateways = useCallback(async () => {
    const [listing, selection] = await Promise.all([
      gatewayRequest(),
      gatewayRequest(`/selected?environment=${ENVIRONMENT}`),
    ]);

    const rows = Array.isArray(listing.gateways)
      ? listing.gateways
      : [];

    setGateways(
      rows
        .filter(
          (item) =>
            ["phonepe", "mswipe"].includes(item.provider_code) &&
            item.environment === ENVIRONMENT
        )
        .map((item) => ({
          id: item.provider_id,
          code: item.provider_code,
          name: item.provider_name,
          status: item.provider_status,
          enabled: item.is_enabled === true,
          configured: item.is_configured === true,
          ready: item.payment_ready === true,
        }))
    );

    setSelectedCode(
      selection.selectedGateway?.provider_code || ""
    );
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        await loadGateways();
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, [loadGateways]);

  async function performAction(action, successMessage) {
    if (busy) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await action();
      await loadGateways();
      setNotice(successMessage);
    } catch (err) {
      setError(err.message);
      try {
        await loadGateways();
      } catch {
        // Keep the original error visible.
      }
    } finally {
      setBusy(false);
    }
  }

  function updateStatus(gateway, status) {
    performAction(
      () =>
        gatewayRequest(`/${gateway.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      `${gateway.name} status updated to ${status}.`
    );
  }

  function toggleGateway(gateway) {
    performAction(
      () =>
        gatewayRequest(`/${gateway.id}/enabled`, {
          method: "PATCH",
          body: JSON.stringify({
            enabled: !gateway.enabled,
            environment: ENVIRONMENT,
          }),
        }),
      `${gateway.name} configuration updated.`
    );
  }

  function selectGateway(gateway) {
    if (
      gateway.status !== "active" ||
      !gateway.enabled ||
      !gateway.ready
    ) {
      setError(
        "Activate and enable this gateway before selecting it."
      );
      return;
    }

    performAction(
      () =>
        gatewayRequest("/selected", {
          method: "PATCH",
          body: JSON.stringify({
            providerCode: gateway.code,
            environment: ENVIRONMENT,
          }),
        }),
      `${gateway.name} selected for new test payments.`
    );
  }

  const enabledCount = gateways.filter(
    (g) => g.enabled && g.status === "active"
  ).length;

  const configuredCount = gateways.filter(
    (g) => g.configured
  ).length;

  return (
    <main className="admin-gateway">
      <div className="admin-gateway-heading">
        <div>
          <h1>Payment Gateway</h1>
          <p>
            Manage PhonePe and Mswipe payment gateways.
          </p>
        </div>
      </div>

      <section className="gateway-summary">
        <article className="gateway-summary-card">
          <div className="gateway-summary-top">
            <span>Total Gateways</span>
            <span className="gateway-summary-icon blue">▤</span>
          </div>
          <strong>{gateways.length}</strong>
          <small>Online payment providers</small>
        </article>

        <article className="gateway-summary-card">
          <div className="gateway-summary-top">
            <span>Enabled Gateways</span>
            <span className="gateway-summary-icon green">✓</span>
          </div>
          <strong>{enabledCount}</strong>
          <small>Active and enabled</small>
        </article>

        <article className="gateway-summary-card">
          <div className="gateway-summary-top">
            <span>Configured</span>
            <span className="gateway-summary-icon purple">⚙</span>
          </div>
          <strong>{configuredCount}</strong>
          <small>Required configuration present</small>
        </article>
      </section>

      <section className="gateway-notice">
        <span className="gateway-notice-icon">i</span>
        <div>
          <strong>Test Environment</strong>
          <p>
            The selected gateway handles new test checkout
            orders. Existing orders retain their original
            payment provider. Credentials remain on the server.
          </p>
        </div>
      </section>

      {error && (
        <p role="alert" style={{ color: "#b42318" }}>
          {error}
        </p>
      )}

      {notice && (
        <p role="status" style={{ color: "#0d766e" }}>
          {notice}
        </p>
      )}

      <section className="admin-gateway-panel">
        <div className="gateway-panel-heading">
          <div>
            <h2>Available Payment Methods</h2>
            <p>Select which gateway receives new payments.</p>
          </div>
          <span className="gateway-count">
            {gateways.length} methods
          </span>
        </div>

        {loading ? (
          <p>Loading payment gateways...</p>
        ) : (
          <div className="gateway-list">
            {gateways.map((gateway) => {
              const selected =
                selectedCode === gateway.code;

              return (
                <article
                  className="gateway-item"
                  key={gateway.id}
                >
                  <div
                    className={`gateway-provider-logo gateway-logo-${gateway.code}`}
                  >
                    {gateway.code === "phonepe" ? "P" : "M"}
                  </div>

                  <div className="gateway-provider-info">
                    <div className="gateway-provider-title">
                      <h3>{gateway.name}</h3>
                      <span
                        className={`gateway-status ${
                          gateway.enabled &&
                          gateway.status === "active"
                            ? "gateway-status-enabled"
                            : "gateway-status-disabled"
                        }`}
                      >
                        {gateway.status === "active" &&
                        gateway.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </span>

                      {selected && (
                        <strong style={{ color: "#0d766e" }}>
                          Selected
                        </strong>
                      )}
                    </div>

                    <p>
                      {gateway.code === "phonepe"
                        ? "PhonePe online payment gateway"
                        : "Mswipe online payment gateway"}
                    </p>

                    <div className="gateway-provider-meta">
                      <span>Test Mode</span>
                      <span>
                        Status: {gateway.status}
                      </span>
                      <span
                        className={
                          gateway.configured
                            ? "gateway-configured"
                            : "gateway-not-configured"
                        }
                      >
                        {gateway.configured
                          ? "Configured"
                          : "Setup required"}
                      </span>
                      <span>
                        {gateway.ready
                          ? "Payment flag ready"
                          : "Payment flag disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="gateway-provider-actions">
                    <label className="gateway-switch">
                      <input
                        type="checkbox"
                        checked={gateway.enabled}
                        disabled={busy || selected}
                        onChange={() => toggleGateway(gateway)}
                        aria-label={`Enable ${gateway.name}`}
                      />
                      <span className="gateway-switch-track" />
                    </label>

                    <button
                      type="button"
                      className="gateway-settings-button"
                      disabled={busy}
                      onClick={() =>
                        updateStatus(
                          gateway,
                          gateway.status === "active"
                            ? "maintenance"
                            : "active"
                        )
                      }
                    >
                      {gateway.status === "active"
                        ? "Maintenance"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="gateway-settings-button"
                      disabled={
                        busy ||
                        selected ||
                        gateway.status !== "active" ||
                        !gateway.enabled ||
                        !gateway.ready
                      }
                      onClick={() => selectGateway(gateway)}
                    >
                      {selected
                        ? "Currently Selected"
                        : "Select Gateway"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

