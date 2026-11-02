

import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import SearchBar from "./Components/SearchBar";
import CategoryGrid from "./Components/CategoryGrid";
import PromoBanners from "./Components/PromoBanners";

import HomePage from "./Components/HomePage";
import Routing from "./Routing";
import Register from "./Components/Auth/Register"
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Footer from "./Components/Footer";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import DocxExtractionTest from "./Test/DocxExtractionTest";

function App() {
  return (
    <>
      {/* <Header />

      <main>
        <Hero />
        <SearchBar />
        <CategoryGrid />

        <PromoBanners />
        
        <section className="container section" id="products">
          <h2 className="section-title">Featured Products</h2>
          <p>
            Discover books, courses, and resources to support your goals.
          </p>

        </section>

      </main> */}

      <Routing /> 

      {/* <AdminDashboard /> */}

      {/* <DocxExtractionTest /> */}
    </>
  );
}

export default App;
