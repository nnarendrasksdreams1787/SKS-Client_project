import React from "react";
import { ShieldCheck, Headset, ChartNoAxesCombined, ArrowRight } from "lucide-react";
import BookSlider from "../Components/BookSlider";
import "../CSS/HomeBookShowcase.css";

export default function HomeBookShowcase() {
  return (
    <section className="home-book-showcase">
      <div className="home-book-showcase-container">

        {/* LEFT SIDE — BOOK SLIDER */}
        <div className="home-book-showcase-left">
          <BookSlider />
        </div>

        {/* RIGHT SIDE — EXISTING DESIGN CONTENT */}
        <div className="home-book-showcase-right">
          <h2>SKS Dream</h2>

          <p>
            We’re more than just a shopping site — we’re a growing
            community of smart shoppers. Enjoy great products,
            exclusive offers every purchase. Join us and experience
            shopping that truly delivers a great experience!
          </p>

          <p>
            We are a trusted shopping platform designed to help users
            save more on everyday purchases. Every order adds value
            through exclusive deals and smart savings. Shop quality
            products from top brands at competitive prices, all in
            one place. With fast processing and a seamless experience,
            shopping becomes simple. Join thousands of happy customers
            who shop smarter with us today!
          </p>

          <div className="home-book-showcase-features">
            <div className="home-book-showcase-feature">
              <span className="home-book-showcase-feature-icon">
                <ShieldCheck size={23} />
              </span>
              <span>Enterprise<br />Security</span>
            </div>

            <div className="home-book-showcase-feature">
              <span className="home-book-showcase-feature-icon">
                <Headset size={23} />
              </span>
              <span>24/7<br />Support</span>
            </div>

            <div className="home-book-showcase-feature">
              <span className="home-book-showcase-feature-icon">
                <ChartNoAxesCombined size={23} />
              </span>
              <span>Scale with<br />Confidence</span>
            </div>
          </div>

          <a href="/about" className="home-book-showcase-button">
            <span>Learn More</span>
            <ArrowRight size={19} />
          </a>
        </div>

      </div>
    </section>
  );
}