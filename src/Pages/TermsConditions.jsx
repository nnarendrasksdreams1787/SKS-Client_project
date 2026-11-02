import React from "react";
import Header from "../Components/Header";

export default function TermsConditions() {
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
            Terms of Use – SKS Dream
          </h1>

          <h2 style={sectionHeadingStyle}>
            Terms and Conditions
          </h2>

          {/* INTRODUCTION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>Introduction</h2>

            <p>
              This document is an electronic record under the{" "}
              <strong>Information Technology Act, 2000</strong>{" "}
              and related laws, including amendments for electronic
              records. It does not require physical or digital
              signatures.
            </p>

            <p>
              This Terms and Conditions document is published as per{" "}
              <strong>
                Rule 3(1) of the Information Technology
                (Intermediaries Guidelines) Rules, 2011
              </strong>{" "}
              for access to the domain{" "}
              <a
                href="https://sksdream.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://sksdream.com
              </a>{" "}
              (“Website”), including the mobile site and
              application (“Platform”).
            </p>

            <p>
              The Platform is owned and operated by{" "}
              <strong>Mr./Ms. SUBHASH SAKHARAM MANDAL</strong>,
              trading as “SKS Dream”, a sole proprietorship with
              its principal place of business at Plot No. 104,
              ABHINAV CO-OP HOUSING SOCIETY, N2,
              AURANGABAD-431001.
            </p>
          </section>

          {/* AGREEMENT TO TERMS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Agreement to Terms
            </h2>

            <p>
              Your use of the Platform, services, and tools is
              governed by these Terms and Conditions, along with
              applicable Platform policies. By using the Platform,
              you agree to contract with the Platform Owner, and
              these terms constitute your binding obligations.
              Any additional or conflicting terms proposed by
              you are rejected.
            </p>

            <p>
              These Terms of Use can be modified at any time.
              It is your responsibility to periodically review
              them. Users include any natural or legal persons
              who have registered on the Platform.{" "}
              <strong>
                Accessing or using the Platform constitutes
                your agreement
              </strong>{" "}
              to these terms.
            </p>
          </section>

          {/* USER RESPONSIBILITIES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              User Responsibilities
            </h2>

            <ul style={listStyle}>
              <li>
                Provide{" "}
                <strong>
                  true, accurate, and complete information
                </strong>{" "}
                during registration and usage.
              </li>

              <li>
                You are responsible for all activities carried
                out via your registered account.
              </li>
            </ul>
          </section>

          {/* DISCLAIMER AND WARRANTIES */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Disclaimer and Warranties
            </h2>

            <ul style={listStyle}>
              <li>
                The Platform and Services are provided{" "}
                <strong>“as is”</strong>.
              </li>

              <li>
                No warranty or guarantee is provided regarding
                the accuracy, completeness, timeliness,
                performance, or suitability of content.
              </li>

              <li>
                Use of the Platform and Services is{" "}
                <strong>at your own risk</strong>.
              </li>
            </ul>
          </section>

          {/* INTELLECTUAL PROPERTY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Intellectual Property
            </h2>

            <ul style={listStyle}>
              <li>
                All contents, including design, layout,
                graphics, and materials, are proprietary
                to SKS DREAM.
              </li>

              <li>
                Users{" "}
                <strong>
                  do not acquire intellectual property rights
                </strong>{" "}
                over Platform content.
              </li>

              <li>
                Unauthorized use may lead to legal action.
              </li>
            </ul>
          </section>

          {/* PROHIBITED USE */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Prohibited Use
            </h2>

            <ul style={listStyle}>
              <li>
                Users shall not use the Platform or Services
                for{" "}
                <strong>unlawful or illegal purposes</strong>,
                or in violation of Indian/local laws.
              </li>

              <li>
                Users agree to pay all charges associated
                with availing of the Services.
              </li>
            </ul>
          </section>

          {/* THIRD-PARTY LINKS */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Third-Party Links
            </h2>

            <p>
              The Platform may contain links to third-party
              websites. Users accessing such links are subject
              to the{" "}
              <strong>
                terms, privacy policies, and rules
              </strong>{" "}
              of the third-party websites.
            </p>
          </section>

          {/* LEGAL CONTRACT */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Legal Contract
            </h2>

            <p>
              Initiating a transaction on the Platform
              constitutes a{" "}
              <strong>legally binding contract</strong>{" "}
              with the Platform Owner.
            </p>
          </section>

          {/* INDEMNITY */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Indemnity
            </h2>

            <p>
              You shall indemnify and hold harmless the Platform
              Owner, its affiliates, group companies, and their
              officers, directors, agents, and employees from
              claims, demands, penalties, or actions arising from:
            </p>

            <ul style={listStyle}>
              <li>
                Breach of these Terms of Use, Privacy Policy,
                or other policies
              </li>

              <li>
                Violation of laws, rules, or third-party rights
                (including intellectual property infringement)
              </li>
            </ul>
          </section>

          {/* FORCE MAJEURE */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Force Majeure
            </h2>

            <p>
              Neither party shall be liable for failure to
              perform obligations due to{" "}
              <strong>force majeure events</strong>.
            </p>
          </section>

          {/* GOVERNING LAW */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Governing Law and Jurisdiction
            </h2>

            <p>
              These Terms and any disputes are governed by the{" "}
              <strong>laws of India</strong>. Exclusive
              jurisdiction lies with the courts of India.
            </p>
          </section>

          {/* COMMUNICATION */}
          <section style={sectionStyle}>
            <h2 style={sectionHeadingStyle}>
              Communication
            </h2>

            <p>
              All concerns or communications related to these
              Terms should be sent via the contact information
              provided on the Platform.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}