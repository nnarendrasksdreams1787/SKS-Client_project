import React from "react";
import Header from "../Components/Header";

export default function PrivacyPolicy() {
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
      {/* EXISTING WEBSITE HEADER */}
      <Header />

      {/* PRIVACY POLICY PAGE */}
      <main style={pageStyle}>
        <article style={contentStyle}>
          <h1 style={headingStyle}>
            Privacy Policy – SKSDream
          </h1>

          {/* INTRODUCTION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Introduction</h2>

            <p>
              This Privacy Policy describes how SKS DREAM and its
              affiliates collect, use, share, protect, or otherwise
              process your information/personal data through our
              website{" "}
              <a
                href="https://sksdream.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://sksdream.com
              </a>{" "}
              (hereinafter referred to as “Platform”). You may
              browse certain sections of the Platform without
              registering. Our services are available only in
              India, and your data will primarily be stored and
              processed in India.
            </p>

            <p>
              By using this Platform, providing your information,
              or availing of any product/service, you agree to the
              terms of this Privacy Policy, the Terms of Use, and
              applicable product/service terms, and to be governed
              by Indian laws, including data protection and privacy
              laws. If you do not agree, please do not use the
              Platform.
            </p>
          </section>

          {/* INFORMATION COLLECTION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Information Collection
            </h2>

            <p>
              We collect information when you use our Platform,
              services, or interact with us. This may include,
              but is not limited to:
            </p>

            <ul style={listStyle}>
              <li>
                Personal data such as name, date of birth, address,
                telephone/mobile number, email.
              </li>

              <li>
                Identification or address proof provided by you.
              </li>

              <li>
                Sensitive personal data, such as bank account,
                credit/debit card information, biometric data
                (with consent), to enable specific features.
              </li>
            </ul>

            <p>
              You have the choice not to provide certain
              information by not using particular services or
              features. We may also track your behaviour,
              preferences, and other data you choose to provide.
            </p>
          </section>

          {/* USE OF INFORMATION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Use of Information
            </h2>

            <p>We use your data to:</p>

            <ul style={listStyle}>
              <li>Provide and improve our services.</li>

              <li>
                Assist sellers and partners in order fulfilment.
              </li>

              <li>
                Enhance customer experience, resolve disputes,
                and troubleshoot issues.
              </li>

              <li>
                Inform you about offers, products, and updates.
              </li>

              <li>
                Customize your experience on the Platform.
              </li>

              <li>
                Detect and prevent fraud, errors, or criminal
                activity.
              </li>

              <li>
                Conduct marketing research, analysis, and surveys.
              </li>
            </ul>

            <p>
              Your access to certain services may be affected
              if permission is not provided.
            </p>
          </section>

          {/* SHARING OF INFORMATION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Sharing of Information
            </h2>

            <p>We may share your data:</p>

            <ul style={listStyle}>
              <li>
                Internally within our corporate group and
                affiliates.
              </li>

              <li>
                With sellers, business partners, third-party
                service providers (including logistics partners),
                payment instrument issuers, and reward programs.
              </li>

              <li>
                To comply with legal obligations or enforce
                our Terms and Policies.
              </li>

              <li>
                With government agencies or law enforcement as
                required by law or to protect users, rights,
                property, or public safety.
              </li>
            </ul>

            <p>
              We are not responsible for the privacy practices
              of third-party business partners; please review
              their privacy policies.
            </p>
          </section>

          {/* SECURITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Security</h2>

            <p>
              We adopt reasonable security measures to protect
              your data against unauthorized access, disclosure,
              loss, or misuse. However, transmission over the
              internet cannot be guaranteed to be completely
              secure. Users are responsible for protecting login
              credentials and account information.
            </p>
          </section>

          {/* DATA RETENTION AND DELETION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Data Retention and Deletion
            </h2>

            <p>
              You may delete your account via your profile settings
              or by contacting us. Pending grievances, claims,
              or shipments may delay account deletion. Deleted
              accounts will lose access to all information.
              We retain data only as long as necessary or as
              required by law. Anonymized data may be retained
              for research and analytics.
            </p>
          </section>

          {/* YOUR RIGHTS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Your Rights
            </h2>

            <p>
              You may access, rectify, or update your personal
              data using Platform functionalities.
            </p>
          </section>

          {/* CONSENT */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Consent</h2>

            <p>
              By providing your information, you consent to its
              collection, storage, use, and disclosure in accordance
              with this Privacy Policy. You may withdraw consent
              by contacting our Grievance Officer. Withdrawal may
              restrict access to certain services but is not
              retrospective.
            </p>
          </section>

          {/* UPDATES TO PRIVACY POLICY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Updates to Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy periodically to
              reflect changes in our practices or legal requirements.
              Significant updates will be notified as required
              under applicable laws.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}