import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";

import rightImg from "../assets/Theme/rightSide.png";
import SearchBar from "./SearchBar";
import CategoryGrid from "./CategoryGrid";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner container">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            DIGITAL BOOKS <span /> ONLINE COURSES <span /> MPSC STUDY MATERIAL
          </div>

          <h1>
            Learn Today.
            <br />
            Build a <em>Brighter</em>
            <br />
            Tomorrow.
          </h1>

          <p className="hero-description">
            Explore high-quality digital books, expert-led online courses, and
            MPSC study material — all in one place.
          </p>

          <div className="hero-buttons">
            <a className="button button-gold hero-cta" href="#products">
              Explore Products <ArrowRight size={17} />
            </a>

            <a className="button button-outline hero-cta" href="#courses">
              View Courses
            </a>
          </div>

          <div className="hero-trust">
            <div>
              <BookOpen />
              <span>
                <strong>Quality</strong>
                <small>Learning resources</small>
              </span>
            </div>
            <div>
              <ShieldCheck />
              <span>
                <strong>Secure</strong>
                <small>Shopping experience</small>
              </span>
            </div>
            <div>
              <Zap />
              <span>
                <strong>Instant</strong>
                <small>Digital access</small>
              </span>
            </div>
            <div>
              <Headphones />
              <span>
                <strong>Support</strong>
                <small>Here to help</small>
              </span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          {/* <div className="hero-art-glow" /> */}

          {/* <img
            className="hero-image"
            // src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=85"
            src={rightImg}
            alt="SKS Dream learning experience with MPSC books, laptop and peacock feather"
          /> */}

          <div className="hero-caption">
            <span className="caption-symbol">✦</span>
            <span>
              <strong>Knowledge. Discipline. Success.</strong>
              <small>Your learning journey starts here.</small>
            </span>
          </div>

          <div className="hero-feather" aria-hidden="true">
            ✧
          </div>
        </div>

      </div>
        <SearchBar />
        <CategoryGrid />
    </section>
  );
}
