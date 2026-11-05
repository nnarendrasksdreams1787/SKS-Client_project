
import { API_BASE_URL } from "../Config/api";

const PAYMENT_API = `${API_BASE_URL}/api/payments`;

async function paymentRequest(path, options = {}) {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    const error = new Error("Please login before purchasing.");
    error.status = 401;
    throw error;
  }

  const response = await fetch(`${PAYMENT_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const error = new Error(
      data.message || `Payment request failed (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function createPaymentOrder(
  productId,
  idempotencyKey
) {
  return paymentRequest("/orders", {
    method: "POST",
    body: JSON.stringify({
      productId,
      idempotencyKey,
    }),
  });
}

export async function initiatePayment(orderReference) {
  return paymentRequest("/checkout", {
    method: "POST",
    body: JSON.stringify({ orderReference }),
  });
}

export async function getPaymentStatus(orderReference) {
  return paymentRequest(
    `/orders/${encodeURIComponent(orderReference)}/status`
  );
}

export async function reconcilePayment(orderReference) {
  return paymentRequest(
    `/orders/${encodeURIComponent(orderReference)}/reconcile`,
    { method: "POST" }
  );
}
