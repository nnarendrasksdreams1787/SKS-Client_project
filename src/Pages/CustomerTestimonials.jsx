// import React, { useEffect, useRef, useState } from "react";
// import mandala from "../assets/Theme/mandala.jpg"; // use mandala.png if you switch to the PNG
// import "../CSS/CustomerTestimonials.css";

// // Add more customers here – the slider picks them up automatically
// const REVIEWS = [
//   {
//     name: "Mr. Ramesh Thorat",
//     role: "Customer",
//     rating: 5,
//     text: "A divine shopping experience with beautifully crafted products.",
//   },
//   {
//     name: "Mr. Narendra Narwade",
//     role: "Customer",
//     rating: 5,
//     text: "Instant e-book access, smooth reading and great value. I now keep my whole study material in one place.",
//   },

//   {
//     name: "Ms. Pooja Lavhale",
//     role: "Customer",
//     rating: 5,
//     text: "The e-books are clear, well organised and easy to read on my phone. I could start studying right after purchase.",
//   },
//   {
//     name: "Ms. Nikita Gaikwad",
//     role: "Customer",
//     rating: 5,
//     text: "Instant e-book access, smooth reading and great value. I now keep my whole study material in one place.",
//   },
// ];

// const DELAY = 4500; // ms between reviews (only when 2+ reviews)

// export default function CustomerTestimonials() {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [inView, setInView] = useState(false);
//   const sectionRef = useRef(null);

//   // slide in (right -> left) when the section scrolls into view
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => setInView(entry.isIntersecting),
//       { threshold: 0.35 }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   // auto-rotate reviews, paused on hover
//   useEffect(() => {
//     if (paused || !inView || REVIEWS.length < 2) return;
//     const id = setInterval(
//       () => setIndex((i) => (i + 1) % REVIEWS.length),
//       DELAY
//     );
//     return () => clearInterval(id);
//   }, [paused, inView]);

//   const r = REVIEWS[index];

//   return (
//     <section
//       ref={sectionRef}
//       className="customer-testimonials"
//       onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
//       onPointerLeave={() => setPaused(false)}
//     >
//       {/* SOFT GOLDEN MANDALA BACKGROUND */}
//       <div
//         className="customer-testimonials-bg"
//         style={{ backgroundImage: `url(${mandala})` }}
//         aria-hidden="true"
//       />

//       <div
//         className={`customer-testimonials-content ${inView ? "is-visible" : ""}`}
//       >
//         <h2>Our Happy Customers</h2>

//         <div className="testimonial-divider" aria-hidden="true">
//           <i />
//           <span>✦</span>
//           <i />
//         </div>

//         {/* key replays the slide when the review changes */}
//         <article className="testimonial-card" key={index} aria-live="polite">
//           <h3>{r.name}</h3>
//           <p className="testimonial-role">{r.role}</p>

//           <div
//             className="testimonial-stars"
//             aria-label={`${r.rating} out of 5 stars`}
//           >
//             {"★".repeat(r.rating)}
//           </div>

//           <blockquote>
//             <span className="testimonial-quote">“</span>
//             {r.text}
//             <span className="testimonial-quote">”</span>
//           </blockquote>
//         </article>

//         {REVIEWS.length > 1 && (
//           <div className="testimonial-dots">
//             {REVIEWS.map((_, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 className={i === index ? "is-active" : ""}
//                 onClick={() => setIndex(i)}
//                 aria-label={`Show review ${i + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }




import React, { useEffect, useRef, useState } from "react";
import goldenPeacockFeather from "../assets/Theme/golden-peacock-feather.png";
import "../CSS/CustomerTestimonials.css";

const REVIEWS = [
  {
    name: "Mr. Ramesh Thorat",
    role: "Customer",
    rating: 5,
    text: "A divine shopping experience with beautifully crafted products.",
  },
  {
    name: "Mr. Narendra Narwade",
    role: "Customer",
    rating: 5,
    text: "Instant e-book access, smooth reading and great value. I now keep my whole study material in one place.",
  },
  {
    name: "Ms. Pooja Lavhale",
    role: "Customer",
    rating: 5,
    text: "The e-books are clear, well organised and easy to read on my phone. I could start studying right after purchase.",
  },
  {
    name: "Ms. Nikita Gaikwad",
    role: "Customer",
    rating: 5,
    text: "Instant e-book access, smooth reading and great value. I now keep my whole study material in one place.",
  },
];

const DELAY = 4500;

export default function CustomerTestimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || REVIEWS.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % REVIEWS.length),
      DELAY
    );
    return () => clearInterval(id);
  }, [paused, inView]);

  const r = REVIEWS[index];

  return (
    <section
      ref={sectionRef}
      className="customer-testimonials"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="testimonial-split-layout">
        {/* LEFT: GOLDEN PEACOCK FEATHER */}
        <div className="testimonial-feather-side">
          <img
            src={goldenPeacockFeather}
            alt="Golden Peacock Feather"
            className="testimonial-golden-feather"
          />
        </div>

        {/* RIGHT: REVIEWS */}
        <div className="customer-testimonials-content">
          <h2>Our Happy Customers</h2>

          <div className="testimonial-divider" aria-hidden="true">
            <i />
            <span>✦</span>
            <i />
          </div>

          <article className="testimonial-card" key={index} aria-live="polite">
            <h3>{r.name}</h3>
            <p className="testimonial-role">{r.role}</p>

            <div
              className="testimonial-stars"
              aria-label={`${r.rating} out of 5 stars`}
            >
              {"★".repeat(r.rating)}
            </div>

            <blockquote>
              <span className="testimonial-quote">“</span>
              {r.text}
              <span className="testimonial-quote">”</span>
            </blockquote>
          </article>

          {REVIEWS.length > 1 && (
            <div className="testimonial-dots">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === index ? "is-active" : ""}
                  onClick={() => setIndex(i)}
                  aria-label={`Show review ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}