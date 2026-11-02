import React, { useEffect, useState } from "react";
import "../CSS/About.css";
import shlokaPlaque from "../assets/Theme/shloka_plaque_transparent.png";

const shlokas = [
  {
    chapter: "Bhagavad Gita · 2.47",
    sanskrit: [
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
      "मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    ],
    translation:
      "You have the right to work, but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.",
  },
  {
    chapter: "Bhagavad Gita · 4.7",
    sanskrit: [
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
      "अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    ],
    translation:
      "Whenever righteousness declines and unrighteousness rises, I manifest Myself.",
  },
  {
    chapter: "Bhagavad Gita · 4.8",
    sanskrit: [
      "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।",
      "धर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥",
    ],
    translation:
      "To protect the virtuous, destroy evil, and restore righteousness, I appear age after age.",
  },
  {
    chapter: "Bhagavad Gita · 2.14",
    sanskrit: [
      "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।",
      "आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    ],
    translation:
      "Pleasure and pain come and go; they are temporary. Learn to endure them with patience.",
  },
  {
    chapter: "Bhagavad Gita · 6.5",
    sanskrit: [
      "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
      "आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    ],
    translation:
      "Elevate yourself through your own efforts, and do not let yourself fall. The mind can be your friend or your enemy.",
  },
  {
    chapter: "Bhagavad Gita · 18.66",
    sanskrit: [
      "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
      "अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    ],
    translation:
      "Take refuge in Me alone. I will free you from all sins; do not grieve.",
  },
];

function ShlokaCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout;

    const interval = setInterval(() => {
      setIsVisible(false);

      timeout = setTimeout(() => {
        setActiveIndex((current) => (current + 1) % shlokas.length);
        setIsVisible(true);
      }, 350);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const currentShloka = shlokas[activeIndex];

  return (
    <section className="about-shloka-section">
      <div className="about-shloka-wrap">
        <img
          className="about-shloka-plaque-image"
          src={shlokaPlaque}
          alt=""
          aria-hidden="true"
        />

        <div
          className={`about-shloka-content ${
            isVisible ? "shloka-visible" : "shloka-hidden"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="about-shloka-reference">
            {currentShloka.chapter}
          </span>

          <div className="about-shloka-sanskrit">
            {currentShloka.sanskrit.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>

          <p className="about-shloka-translation">
            {currentShloka.translation}
          </p>
        </div>
      </div>

      <div className="about-shloka-indicators" aria-label="Shloka selection">
        {shlokas.map((shloka, index) => (
          <button
            key={shloka.chapter}
            type="button"
            className={`shloka-indicator ${
              index === activeIndex ? "active" : ""
            }`}
            onClick={() => {
              setActiveIndex(index);
              setIsVisible(true);
            }}
            aria-label={`Show ${shloka.chapter}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

export default ShlokaCarousel;
