import React from "react";
import Header from "../Components/Header";

export default function PaymentPolicy() {
  const pageStyle = {
    background: "#f1f3f5",
    minHeight: "100vh",
    padding: "0 20px 60px",
  };

  const contentStyle = {
    maxWidth: "850px",
    margin: "0 auto",
    padding: "30px 28px 55px",
    background: "#ffffff",
    color: "#222222",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.7",
  };

  const headingStyle = {
    fontSize: "17px",
    fontWeight: "700",
    marginBottom: "18px",
  };

  const sectionStyle = {
    marginTop: "22px",
  };

  const sectionHeadingStyle = {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "6px",
  };

  const listStyle = {
    paddingLeft: "24px",
    marginTop: "8px",
    marginBottom: "12px",
  };

  return (
    <>
      <Header />

      <main style={pageStyle}>
        <article style={contentStyle}>

          <h1 style={headingStyle}>
            SKS Dream – Payment Policy
          </h1>

          <p>
            At SKS Dream, we aim to provide a secure, smooth,
            and transparent payment experience for all our customers.
          </p>

          {/* ACCEPTED PAYMENT METHODS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              1. Accepted Payment Methods
            </h2>

            <ul style={listStyle}>
              <li>
                Credit/Debit Cards – Visa, Mastercard, Rupay,
                Maestro, etc.
              </li>
              <li>
                Net Banking – Major banks supported.
              </li>
              <li>
                UPI Payments – Google Pay, PhonePe, Paytm,
                and other UPI apps.
              </li>
              <li>
                Digital Wallets – If available on the platform.
              </li>
              <li>
                Cash on Delivery (COD) – For eligible products
                and locations.
              </li>
              <li>
                All payments are processed securely with
                industry-standard encryption.
              </li>
            </ul>
          </section>

          {/* PREPAID ORDERS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              2. Prepaid Orders
            </h2>

            <ul style={listStyle}>
              <li>
                Payment is collected at the time of placing the order.
              </li>
              <li>
                Prepaid orders are confirmed only after successful
                payment authorization.
              </li>
              <li>
                If payment fails, the order will not be processed,
                and you will be notified immediately.
              </li>
            </ul>
          </section>

          {/* CASH ON DELIVERY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              3. Cash on Delivery (COD)
            </h2>

            <ul style={listStyle}>
              <li>
                COD is available only for select products
                and locations.
              </li>
              <li>
                Payment must be made in full at the time of delivery.
              </li>
              <li>
                Partial payments or post-delivery requests
                cannot be accepted.
              </li>
              <li>
                In case of refusal or inability to pay COD,
                the order may be canceled.
              </li>
            </ul>
          </section>

          {/* PAYMENT SECURITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              4. Payment Security
            </h2>

            <ul style={listStyle}>
              <li>
                SKS Dream uses SSL/TLS encryption for all
                online transactions.
              </li>
              <li>
                Payment details such as card number, CVV,
                and UPI PIN are never stored on our servers.
              </li>
              <li>
                Transactions are processed via secure and
                authorized payment gateways only.
              </li>
            </ul>
          </section>

          {/* PAYMENT FAILURES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              5. Payment Failures
            </h2>

            <ul style={listStyle}>
              <li>
                If your payment fails during checkout,
                do not refresh the page repeatedly.
              </li>
              <li>
                Wait a few minutes and try the payment again,
                or choose an alternative payment method.
              </li>
              <li>
                If multiple failed attempts occur, your bank
                may temporarily block transactions for security reasons.
              </li>
            </ul>
          </section>

          {/* REFUNDS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              6. Refunds
            </h2>

            <ul style={listStyle}>
              <li>
                For canceled or returned orders, refunds are
                issued via the same payment method used for purchase.
              </li>
              <li>
                Refunds usually take 5–7 business days
                for prepaid payments.
              </li>
              <li>
                COD refunds (if applicable) may be issued
                via bank transfer or wallet, as communicated
                by SKS Dream.
              </li>
            </ul>
          </section>

          {/* PROMOTIONS AND WALLET USAGE */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              7. Promotions and Wallet Usage
            </h2>

            <ul style={listStyle}>
              <li>
                Any discount codes, gift cards, or wallet
                balances applied are deducted automatically
                during payment.
              </li>
              <li>
                SKS Dream reserves the right to verify and
                adjust discounts for any promotional misuse.
              </li>
            </ul>
          </section>

          {/* TAXES AND CHARGES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              8. Taxes and Charges
            </h2>

            <ul style={listStyle}>
              <li>
                All payments are inclusive of applicable
                taxes unless stated otherwise.
              </li>
              <li>
                Shipping charges, if applicable, will be
                clearly mentioned at checkout.
              </li>
            </ul>
          </section>

          {/* CUSTOMER RESPONSIBILITIES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              9. Customer Responsibilities
            </h2>

            <ul style={listStyle}>
              <li>
                Ensure payment details are correct before
                completing the transaction.
              </li>
              <li>
                Notify SKS Dream immediately if you notice
                unauthorized charges or discrepancies.
              </li>
              <li>
                Avoid making payments via unofficial channels
                or third-party apps not listed on the platform.
              </li>
            </ul>
          </section>

        </article>
      </main>
    </>
  );
}