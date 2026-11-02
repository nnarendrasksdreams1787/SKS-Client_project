import React from "react";

import "../PromoBanners.css"

const promotions = [
  {
    id: 1,
    eyebrow: "MPSC MASTER SERIES",
    title: "Complate Study Material for MPSC Preperation",
    description: "Structured content · Exam focused · Well organized",
    button: "Explore MPSC Series",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=85",
    theme: "navy",
    action: "#products",
  },
  {
    id: 2,
    eyebrow: "LEARN AT YOUR OWN PACE",
    title: "Online Video Courses",
    description: "Learn from experts anytime, anywhere.",
    button: "Start Learning",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    theme: "cream",
    action: "#courses",
  },
];

export default function PromoBanners() {
  return (
    <section
      className="promo-section container"
      aria-label="Featured promotions"
    >
      <div className="promo-grid">
        {promotions.map((promo) => (
          <article
            className={`promo-card promo-card --${promo.theme}`}
            key={promo.id}
          >
            <div className="promo-content">
              <span className="promo-eyebrow">{promo.eyebrow}</span>
              <h2>{promo.title}</h2>
              <p>{promo.description}</p>

              <a className="button button-gold promo-button" href="">
                {promo.button}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="promo-image-wrap">
              <img
                className="promo-image"
                src={promo.image}
                alt=""
                loading="lazy"
              />
            </div>
            <span className="promo-decoration" aria-hidden="true">
              ✦
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
