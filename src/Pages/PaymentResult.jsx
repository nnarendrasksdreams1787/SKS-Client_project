
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reconcilePayment } from "../Services/PaymentApi";

function findCheckoutAttempt() {
  const attempts = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);

    if (!key?.startsWith("sks_checkout_")) continue;

    try {
      const attempt = JSON.parse(sessionStorage.getItem(key));

      if (
        typeof attempt?.orderReference === "string" &&
        /^SKS_[a-f0-9]{32}$/.test(attempt.orderReference)
      ) {
        attempts.push({
          storageKey: key,
          orderReference: attempt.orderReference,
        });
      }
    } catch {
      // Ignore invalid saved attempts.
    }
  }

  // Never guess which order was paid.
  return attempts.length === 1 ? attempts[0] : null;
}

export default function PaymentResult() {
  const [state, setState] = useState({
    loading: true,
    status: "checking",
    message: "Verifying your payment with PhonePe...",
    orderReference: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const attempt = findCheckoutAttempt();

      if (!attempt) {
        setState({
          loading: false,
          status: "unknown",
          message:
            "Payment order could not be identified uniquely. Please check My Orders before making another payment.",
          orderReference: null,
        });
        return;
      }

      if (!sessionStorage.getItem("authToken")) {
        setState({
          loading: false,
          status: "unknown",
          message:
            "Please log in to verify this payment. Do not pay again yet.",
          orderReference: attempt.orderReference,
        });
        return;
      }

      try {
        const response = await reconcilePayment(
          attempt.orderReference
        );

        if (cancelled) return;

        const result = response.data || {};

        if (
          result.paymentStatus === "success" &&
          result.accessStatus === "granted" &&
          result.requiresReview !== true
        ) {
          sessionStorage.removeItem(attempt.storageKey);

          setState({
            loading: false,
            status: "success",
            message:
              "Payment verified successfully! Your ebook access has been granted.",
            orderReference: attempt.orderReference,
          });
          return;
        }

        if (result.requiresReview === true) {
          setState({
            loading: false,
            status: "review",
            message:
              result.message ||
              "Payment requires verification. Please do not pay again.",
            orderReference: attempt.orderReference,
          });
          return;
        }

        if (result.paymentStatus === "failed") {
          setState({
            loading: false,
            status: "failed",
            message:
              "PhonePe reported that this payment failed. Check My Orders before retrying.",
            orderReference: attempt.orderReference,
          });
          return;
        }

        setState({
          loading: false,
          status: "pending",
          message:
            "Payment confirmation is pending. Please check again later. Do not initiate another payment yet.",
          orderReference: attempt.orderReference,
        });
      } catch (error) {
        if (cancelled) return;

        setState({
          loading: false,
          status: "unknown",
          message:
            error.message ||
            "Payment verification is unavailable. Please check My Orders.",
          orderReference: attempt.orderReference,
        });
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, []);

  const isSuccess = state.status === "success";

  return (
    <main
      style={{
        minHeight: "75vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#F8F2E8",
      }}
    >
      <section
        style={{
          background: "#FFFDF9",
          padding: 32,
          borderRadius: 18,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          border: "1px solid #E9AD43",
        }}
      >
        <h1 style={{ color: "#071B30" }}>
          {state.loading
            ? "Verifying Payment"
            : isSuccess
              ? "Payment Successful"
              : "Payment Status"}
        </h1>

        <p style={{ lineHeight: 1.7 }}>
          {state.message}
        </p>

        {state.orderReference && (
          <p style={{ fontSize: 12, overflowWrap: "anywhere" }}>
            Order: {state.orderReference}
          </p>
        )}

        {!state.loading && (
          <Link
            to={isSuccess ? "/user/myorders" : "/user/myorders"}
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#071B30",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            View My Orders
          </Link>
        )}
      </section>
    </main>
  );
}
