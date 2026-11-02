import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../CSS/BookSlider.css";

const books = [
  {
    id: 1,
    title: "Spoken English",
    image: "/Books/AboutSlider/spoken-english.png",
  },
  {
    id: 2,
    title: "Bhagavad Gita",
    image: "/Books/AboutSlider/bhagavad-gita.png",
  },
  {
    id: 3,
    title: "Mahabharat",
    image: "/Books/AboutSlider/mahabharat.png",
  },
  {
    id: 4,
    title: "Hanuman Chalisa",
    image: "/Books/AboutSlider/hanuman-chalisa.png",
  },
];

export default function BookSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((previous) => (previous + 1) % books.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (previous) => (previous - 1 + books.length) % books.length
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % books.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sks-book-slider">
      <div className="sks-book-slider-stage">
        <button
          type="button"
          className="sks-book-slider-arrow sks-book-slider-prev"
          onClick={previousSlide}
          aria-label="Previous book"
        >
          <ChevronLeft size={24} />
        </button>

        <img
          src={books[activeIndex].image}
          alt={`${books[activeIndex].title} book cover`}
          className="sks-book-slider-image"
        />

        <button
          type="button"
          className="sks-book-slider-arrow sks-book-slider-next"
          onClick={nextSlide}
          aria-label="Next book"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="sks-book-slider-dots">
        {books.map((book, index) => (
          <button
            key={book.id}
            type="button"
            className={`sks-book-slider-dot ${
              index === activeIndex ? "is-active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${book.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}