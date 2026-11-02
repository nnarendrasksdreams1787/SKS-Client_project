import React from "react";
import {
  ShoppingBag,
  ShieldCheck,
  Lightbulb,
  Zap,
  UsersRound,
  ChartNoAxesCombined,
} from "lucide-react";

import "../CSS/WhyChooseUs.css";

const features = [
  {
    title: "Buy Quality Devotional Products",
    Icon: ShoppingBag,
  },
  {
    title: "Trusted Products",
    Icon: ShieldCheck,
  },
  {
    title: "The Smarter Way to Shop",
    Icon: Lightbulb,
  },
  {
    title: "Fast & Easy",
    Icon: Zap,
  },
  {
    title: "Trusted by Thousands",
    Icon: UsersRound,
  },
  {
    title: "Your Growth, Our Mission",
    Icon: ChartNoAxesCombined,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <h2 className="why-choose-title">Why Choose Us?</h2>

        <div className="why-choose-divider" />

        <p className="why-choose-subtitle">
          Where shopping meets opportunity — buy devotional products!
        </p>

        <div className="why-choose-grid">
          {features.map(({ title, Icon }) => (
            <div className="why-choose-card" key={title}>
              <div className="why-choose-icon">
                <Icon size={25} strokeWidth={2.3} />
              </div>

              <p>{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}