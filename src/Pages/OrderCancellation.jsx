import React from "react";
import Header from "../Components/Header";

export default function OrderCancellation() {
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
            SKS Dream – Order Cancellation &amp; Refund Policy
          </h1>

          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Refund &amp; Cancellation Policy
            </h2>

            <p>
              All sales of digital products are final and
              non-refundable.
            </p>

            <p>
              Due to the nature of instant delivery, we only
              issue refunds for:
            </p>

            <ul style={listStyle}>
              <li>Duplicate purchases</li>

              <li>
                Confirmed technical defects that prevent use
                (and cannot be resolved by support)
              </li>

              <li>
                Products that are fundamentally not as described
              </li>
            </ul>

            <p>
              We recommend carefully reviewing product requirements
              before buying. For refund eligibility, email{" "}
              <strong>
                <a href="mailto:sksdreamrk@gmail.com">
                  sksdreamrk@gmail.com
                </a>
              </strong>{" "}
              within <strong>7 days of purchase</strong> with your
              order number and evidence of the defect.
            </p>

            <p>
              Refunds will be credited to the{" "}
              <strong>
                original payment method within 10 business days
              </strong>.
            </p>
          </section>

        </article>
      </main>
    </>
  );
}