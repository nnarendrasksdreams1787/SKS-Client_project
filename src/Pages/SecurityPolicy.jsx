import React from "react";
import Header from "../Components/Header";

export default function SecurityPolicy() {
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
            SKS Dream – Security Policy
          </h1>

          <p>
            At SKS Dream, the safety and security of your personal
            information, account, and transactions is our top priority.
            We use advanced technology, strict processes, and best
            practices to ensure that your data remains safe and your
            shopping experience is secure.
          </p>

          {/* ACCOUNT SECURITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              1. Account Security
            </h2>

            <ul style={listStyle}>
              <li>
                Protect your login credentials: username, password,
                OTP, and other verification details.
              </li>

              <li>
                Do not share your account information with anyone.
              </li>

              <li>
                SKS Dream will never ask for your password or payment
                PIN via email, call, or message.
              </li>

              <li>
                Enable two-factor authentication (2FA) if available
                to add an extra layer of protection.
              </li>
            </ul>
          </section>

          {/* DATA PROTECTION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              2. Data Protection
            </h2>

            <ul style={listStyle}>
              <li>
                We use industry-standard encryption (SSL/TLS) to
                protect your personal and payment information
                during transactions.
              </li>

              <li>
                Personal information such as name, email, address,
                phone number, and payment details are securely
                stored and processed.
              </li>

              <li>
                SKS Dream does not sell, trade, or share your
                personal data with unauthorized third parties.
              </li>
            </ul>
          </section>

          {/* PAYMENT SECURITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              3. Payment Security
            </h2>

            <ul style={listStyle}>
              <li>
                All payment transactions are encrypted and
                processed through secure, verified payment gateways.
              </li>

              <li>
                We do not store your full card details on our
                servers. Only authorized payment processors
                handle sensitive payment data.
              </li>

              <li>
                In case of failed or suspicious transactions,
                SKS Dream may temporarily hold the order until
                verification is complete to ensure security.
              </li>
            </ul>
          </section>

          {/* WEBSITE AND APP SECURITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              4. Website and App Security
            </h2>

            <ul style={listStyle}>
              <li>
                SKS Dream uses advanced security measures to
                prevent unauthorized access, hacking, or data
                breaches.
              </li>

              <li>
                Firewalls, intrusion detection systems, and
                continuous monitoring help protect our platform
                from cyber threats.
              </li>

              <li>
                We recommend keeping your browser, app, and
                operating system updated to enhance security.
              </li>
            </ul>
          </section>

          {/* FRAUD PREVENTION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              5. Fraud Prevention
            </h2>

            <ul style={listStyle}>
              <li>
                SKS Dream actively monitors transactions and
                activities for signs of fraud.
              </li>

              <li>
                Suspicious behaviour may trigger account
                verification or order review.
              </li>

              <li>
                Any fraudulent activity is reported to law
                enforcement or relevant authorities as needed.
              </li>
            </ul>
          </section>

          {/* SAFE RETURNS AND DELIVERY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              6. Safe Returns and Delivery
            </h2>

            <ul style={listStyle}>
              <li>
                Pickup agents are verified and trained to handle
                your returned products securely.
              </li>

              <li>
                During delivery, ensure that packages are received
                by the authorized person at your address.
              </li>

              <li>
                For cash-on-delivery payments, handle money safely
                and verify the order before making the payment.
              </li>
            </ul>
          </section>

          {/* USER RESPONSIBILITIES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              7. User Responsibilities
            </h2>

            <ul style={listStyle}>
              <li>
                Use a strong, unique password and change it regularly
              </li>

              <li>
                Avoid using public Wi-Fi for transactions
              </li>

              <li>
                Log out from shared devices after each session
              </li>

              <li>
                Report any suspicious activity or unauthorized
                transactions immediately to SKS Dream Support
              </li>
            </ul>
          </section>

          {/* REPORTING SECURITY ISSUES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              8. Reporting Security Issues
            </h2>

            <ul style={listStyle}>
              <li>
                If you notice any security vulnerabilities,
                suspicious messages, or unauthorized activity,
                contact{" "}
                <a href="/contact">
                  https://sksdream.com/contact
                </a>{" "}
                immediately.
              </li>

              <li>
                Provide details of the issue so that our team
                can investigate and resolve it quickly.
              </li>
            </ul>
          </section>

          {/* POLICY UPDATES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              9. Policy Updates
            </h2>

            <p>
              SKS Dream may update this Security Policy to improve
              safety and compliance. The latest version will always
              be available on this page. By continuing to use
              SKS Dream, you agree to abide by the updated
              security practices.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}