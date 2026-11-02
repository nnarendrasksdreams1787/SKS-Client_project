import { BookOpen, ArrowUpRight, ArrowUp } from "lucide-react";
import "../CSS/Footer.css";
const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      // { label: "Courses", href: "/courses" },
      { label: "Books & Learning", href: "/shop" },
      { label: "About SKS Dream", href: "/about" },

    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "My Account", href: "/login" },
      { label: "My Orders", href: "/orders" },
      { label: "Payment policy", href: "/payment-policy" },
      { label: "Order Cancellation Policy", href: "/order-cancellation-policy" },

    ],
  },
  {
    title: "Information",
    links: [
      // { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Security Policy", href: "/security-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      // { label: "Shipping Policy", href: "/shipping-policy" },
      // { label: "Return Policy", href: "/return-policy" },
    ],
  },
];
const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "LinkedIn", href: "#" },
];
export default function Footer() {
  const year = new Date().getFullYear();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="sks-footer">
      <div className="sks-footer-inner">
        <div className="sks-footer-main">
          <div className="sks-footer-brand">
            <a href="/" className="sks-footer-logo">
              <span className="sks-footer-logo-mark">
                <BookOpen size={25} strokeWidth={1.7} />
              </span>
              <span className="sks-footer-logo-text">
                SKS <span>Dream</span>
              </span>
            </a>
            <p className="sks-footer-description">
              Learn with purpose. Grow with confidence.
              Discover learning resources and educational
              products designed to support every step
              of your journey.
            </p>
            <a href="/courses" className="sks-footer-cta">
              Start exploring
              <ArrowUpRight size={17} />
            </a>
            <div className="sks-footer-socials">
              <span className="sks-footer-social-label">
                CONNECT WITH US
              </span>
              <div className="sks-footer-social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="sks-footer-social"
                  >
                    {social.label}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {footerSections.map((section) => (
            <div className="sks-footer-column" key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="sks-footer-link-icon"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="sks-footer-bottom">
          <p>
            © {year} <strong>SKS Dream</strong>. All rights reserved.
          </p>
          <p className="sks-footer-tagline">
            A little learning. A brighter tomorrow.
          </p>
          <button
            type="button"
            className="sks-footer-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}