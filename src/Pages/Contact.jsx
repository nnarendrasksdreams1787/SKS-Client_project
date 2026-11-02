import React from "react";
import "../CSS/Contact.css";
import Header from "../Components/Header"
import whatsappIcon from "../assets/Theme/whatsapp.png";


import {
  MessagesSquare,
  Clock3,
  BadgeIndianRupee,
  Phone,
  Mail,
  MessageCircle,
  UserRound,
  MapPin
} from "lucide-react";
import Footer from "../Components/Footer";

const Contact = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend demo only — no backend request is made.
    setSubmitted(true);
    event.currentTarget.reset();
  };
  return (
    <section>
      <Header />
      <main className="contact-page">
        {/* Contact Page Hero */}
        <section className="contact-hero">
          <div className="contact-hero-inner">
            <span className="contact-hero-eyebrow">SKS DREAM</span>

            <h1>Contact Us</h1>

            <p>
              Have questions? We're here to help you get started on your journey
            </p>

            <span className="contact-hero-divider" aria-hidden="true" />
          </div>

          <div className="contact-hero-decoration" aria-hidden="true">
            {/* <i className="fa-regular fa-envelope" /> */}
            {/* <i className="fa-regular fa-comments" /> */}
            <Mail size={28} />
            <MessagesSquare size={28} />
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-container">
            {/* Service Highlights */}
            <div className="contact-benefits">
              <article className="contact-benefit">
                <div className="contact-benefit-icon">
                  {/* <i className="fa-solid fa-comments" aria-hidden="true" /> */}
                  <MessagesSquare size={24} color="#F4B544" />
                </div>

                <div className="contact-benefit-content">
                  <h2>Free Consultation</h2>
                  <p>
                    Get expert advice on your project requirements and receive a
                    detailed proposal tailored to your needs.
                  </p>
                </div>
              </article>

              <article className="contact-benefit">
                <div className="contact-benefit-icon">
                  {/* <i className="fa-solid fa-clock" aria-hidden="true" /> */}
                  <Clock3 size={24} color="#F4B544" />
                </div>

                <div className="contact-benefit-content">
                  <h2>Quick Response</h2>
                  <p>
                    Our team responds within 24 hours to discuss your project
                    timeline and deliverables.
                  </p>
                </div>
              </article>

              <article className="contact-benefit">
                <div className="contact-benefit-icon">
                  {/* <i className="fa-solid fa-scale-balanced" aria-hidden="true" /> */}
                  <BadgeIndianRupee size={24} color="#F4B544" />
                </div>

                <div className="contact-benefit-content">
                  <h2>Transparent Pricing</h2>
                  <p>
                    No hidden costs. Get detailed quotes with clear breakdowns for
                    informed decisions.
                  </p>
                </div>
              </article>
            </div>

            {/* Contact Information */}
            <aside className="contact-details">
              <div className="contact-details-decoration" aria-hidden="true" />

              <div className="contact-details-content">
                <span className="contact-eyebrow">SKS DREAM</span>

                <h2 className="contact-details-title">Get in Touch</h2>

                <div className="contact-details-list">
                  <a className="contact-detail" href="tel:+918788103520">
                    <span className="contact-detail-icon"> 
                      {/* <i className="fa-solid fa-phone" aria-hidden="true" /> */}
                      <Phone size={20} color="#F4B544" />
                    </span>
                    <span className="contact-detail-text">
                      <strong>Call Us :</strong> <span>+91 8788103520</span>
                    </span>
                  </a>

                  <a
                    className="contact-detail"
                    href="mailto:sksdreamrk@gmail.com"
                  >
                    <span className="contact-detail-icon">
                      {/* <i className="fa-regular fa-envelope" aria-hidden="true" /> */}
                      <Mail size={20} color="#F4B544" />
                    </span>
                    <span className="contact-detail-text">
                      <strong>Email Us:</strong> <span>sksdreamrk@gmail.com</span>
                    </span>
                  </a>

                  <a
                    className="contact-detail"
                    href="https://wa.me/918788103520"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-detail-icon">
                      {/* <i className="fa-brands fa-whatsapp" aria-hidden="true" /> */}
                      <span className="contact-detail-icon">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#F4B544"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8Z" />
                          <path d="M8.5 8.2c-.4.5-.6 1-.4 1.8.6 2.5 3.3 5.2 5.8 5.9.8.2 1.5 0 2-.5l-2.3-1.2-1 1c-1.4-.6-2.5-1.7-3.1-3.1l1-1-1.2-2.3-.8-.6Z" />
                      </svg>
                    </span>
                    </span>
                    <span className="contact-detail-text">
                      <strong>WhatsApp:</strong>{" "}
                      <span className="contact-inline-link">Quick Chat</span>
                    </span>
                  </a>

                  <div className="contact-detail">
                    <span className="contact-detail-icon">
                      {/* <i className="fa-solid fa-user-tie" aria-hidden="true" /> */}
                      <UserRound size={20} color="#F4B544" />
                    </span>
                    <span className="contact-detail-text">
                      <strong>Director :</strong>{" "}
                      <span>SUBHASH SAKHARAM MANDAL</span>
                    </span>
                  </div>

                  <div className="contact-detail contact-address">
                    <span className="contact-detail-icon">
                      <MapPin size={20} color="#F4B544" />
                      {/*  
                      <i 
                        className="fa-solid fa-location-dot"
                        aria-hidden="true"
                       
                      /> 
                      */}
                    </span>
                    <span className="contact-detail-text">
                      <strong>Address :</strong>{" "}
                      <span>
                        Plot No.104, ABHINAV CO-OP HOUSING SOCIETY, N2, CHH.
                        SAMBHAJINAGAR (AURANGABAD) – 431001.
                      </span>
                    </span>
                  </div>
                </div>

                <div className="contact-availability">
                  <p>
                    <strong>Response Time:</strong> Within 24 hours
                  </p>

                  <p>
                    <strong>Availability:</strong> Monday – Friday, 9 AM – 6 PM
                    EST
                  </p>
                </div>
              </div>

              <span className="contact-corner-ornament" aria-hidden="true" />
            </aside>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="contact-form-container">
            <div className="contact-form-heading">
              <span className="contact-eyebrow">CONTACT US</span>
              <h2>Let's Talk About Your Needs</h2>
              <p>Fill in the details below to share your enquiry with us.</p>
            </div>

            {/* <ContactForm />
           */}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div className="contact-field">
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <select
                    id="contact-subject"
                    name="subject"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Order Support">Order Support</option>
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="contact-field contact-field-full">
                  <label htmlFor="contact-message">Your Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    placeholder="Write your message here..."
                    required
                  />
                </div>
              </div>

              <div className="contact-form-footer">
                <p>Fields marked as required must be completed.</p>

                <button className="contact-submit-btn" type="submit">
                  Submit Enquiry
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {submitted && (
                <p className="contact-demo-notice" role="status">
                  Demo submitted successfully. No message has been sent yet.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </section>
  );
};

export default Contact;
