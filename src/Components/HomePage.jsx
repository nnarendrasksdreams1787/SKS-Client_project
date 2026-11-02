import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import SearchBar from "./SearchBar";
import CategoryGrid from "./CategoryGrid";
import PromoBanners from "./PromoBanners";
import ProductSection from "./ProductSection";
// import divider2 from "../assets/Theme/Section_Divider_1.png"
import divider2 from "../assets/Theme/section-divider4.png"
import Footer from "./Footer";
// import divider2 from "../assets/Theme/Golden-section-divider1.png"
// import divider2 from "../assets/Theme/Section-Divider_3.png"
// K:\SKS-Dreams\client\src\assets\Theme\Section-Divider_3.png
// C:\Projects\SKS-Dreams\client\src\assets\Theme\Golden-section-divider1.png

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* <section className="Combiner"> */}
          {/* <SearchBar /> */}
          {/* <CategoryGrid /> */}
        {/* </section> */}
        <PromoBanners />

        {/* <section className="container section" id="products">
          <h2 className="section-title">Featured Products</h2>
          <p>Discover books, courses, and resources to support your goals.</p>
        </section> */}
        <section className="Section-Dividers"> 
          <img src={divider2} alt="Divider" />
        </section>
        <ProductSection />
      </main>
      <Footer />
    </>
  );
}
