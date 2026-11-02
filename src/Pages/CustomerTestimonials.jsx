import React from "react";
import radhaKrishna from "../assets/Theme/radha-krishna.webp";
import "../CSS/CustomerTestimonials.css";

export default function CustomerTestimonials() {
  return (
    <section className="customer-testimonials">

      {/* LEFT SIDE RADHA-KRISHNA IMAGE */}
      <div
        className="customer-testimonials-image"
        aria-hidden="true"
      >
        <img
          src={radhaKrishna}
          alt=""
        />
      </div>

      {/* RIGHT SIDE TESTIMONIAL CONTENT */}
      <div className="customer-testimonials-content">

        <h2>Our Happy Customers</h2>

        {/* GOLD DIVIDER */}
        <div className="testimonial-divider">
          <span>✦</span>
        </div>

        {/* CUSTOMER DETAILS */}
        <h3>Mr. Ramesh Thorat</h3>

        <p className="testimonial-role">
          Customer
        </p>

        {/* FIVE GOLD STARS */}
        <div
          className="testimonial-stars"
          aria-label="5 out of 5 stars"
        >
          ★★★★★
        </div>

        {/* CUSTOMER REVIEW */}
        <blockquote>
          <span className="testimonial-quote">“</span>
          A divine shopping experience with beautifully crafted products.
          <span className="testimonial-quote">”</span>
        </blockquote>

      </div>
    </section>
  );
}