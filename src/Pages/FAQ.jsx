import React from "react";
import Header from "../Components/Header";

export default function FAQ() {
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

  const questionStyle = {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "8px",
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
            SKS Dream – Frequently Asked Questions (FAQ)
          </h1>

          <p>
            Welcome to the SKS Dream FAQ section! Here you can find
            answers to the most common questions about orders,
            payments, delivery, and more.
          </p>

          {/* QUESTION 1 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              1. How do I place an order on SKS Dream?
            </h2>

            <ul style={listStyle}>
              <li>Browse products on our website or app.</li>
              <li>
                Select the product and choose options (size, color,
                quantity, etc.).
              </li>
              <li>
                Click Add to Cart and proceed to Checkout.
              </li>
              <li>
                Enter your shipping details and select a payment method.
              </li>
              <li>
                Confirm your order. You’ll receive an order
                confirmation via email or SMS.
              </li>
            </ul>
          </section>

          {/* QUESTION 2 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              2. Can I cancel my order?
            </h2>

            <ul style={listStyle}>
              <li>Orders can be canceled before dispatch.</li>
              <li>
                Once the order is shipped or out for delivery,
                it cannot be canceled.
              </li>
              <li>
                For prepaid orders, refunds will be processed
                within 5–7 business days.
              </li>
              <li>
                Certain products may have specific cancellation
                rules based on category.
              </li>
              <li>
                For instant or express delivery orders,
                cancellations may be restricted.
              </li>
              <li>
                For more details, see our{" "}
                <a href="/order-cancellation">
                  Order Cancellation Policy
                </a>.
              </li>
            </ul>
          </section>

          {/* QUESTION 3 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              3. How can I track my order?
            </h2>

            <ul style={listStyle}>
              <li>Log in to your SKS Dream account.</li>
              <li>Go to the Orders section.</li>
              <li>
                Click Track Order to see live updates from
                our delivery partners.
              </li>
            </ul>
          </section>

          {/* QUESTION 4 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              4. What payment methods are accepted?
            </h2>

            <ul style={listStyle}>
              <li>
                Credit/Debit Cards (Visa, Mastercard, Rupay, etc.)
              </li>
              <li>Net Banking</li>
              <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Wallets (if applicable)</li>
              <li>
                Cash on Delivery (COD) for eligible products
              </li>
              <li>
                All payments are processed securely with encryption.
              </li>
            </ul>
          </section>

          {/* QUESTION 5 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              5. How do refunds work?
            </h2>

            <ul style={listStyle}>
              <li>
                Refunds are processed once the cancellation
                or return is confirmed.
              </li>
              <li>
                Prepaid order refunds typically take
                5–7 business days.
              </li>
              <li>
                For returns, the refund will be made via the
                same payment method used for purchase.
              </li>
              <li>
                You can track your refund in your Orders section.
              </li>
            </ul>
          </section>

          {/* QUESTION 6 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              6. What is the return and replacement policy?
            </h2>

            <ul style={listStyle}>
              <li>
                SKS Dream offers returns, replacements, or
                refunds depending on the product category.
              </li>
              <li>
                Products must meet the return conditions:
                unused, intact, with original packaging
                and accessories.
              </li>
              <li>
                Certain categories like groceries, personal
                care items, and intimate products may have
                limited return options.
              </li>
              <li>
                For details, see our{" "}
                <a href="https://sksdream.com/ReturnsRefunds.aspx">
                  Returns &amp; Refund Policy
                </a>.
              </li>
            </ul>
          </section>

          {/* QUESTION 7 */}
          <section style={sectionStyle}>
            <h2 style={questionStyle}>
              7. My product is damaged or defective.
              What should I do?
            </h2>

            <ul style={listStyle}>
              <li>
                Contact SKS Dream Customer Support immediately.
              </li>
              <li>
                Keep the product in its original packaging
                until pickup or replacement.
              </li>
              <li>
                Depending on the product category, we may
                troubleshoot online, via phone, or schedule
                a service visit.
              </li>
              <li>
                A replacement or refund will be processed
                according to the product-specific policy.
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}