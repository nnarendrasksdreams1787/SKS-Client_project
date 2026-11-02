import React, { useState } from 'react'
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    UserRound,
 } from "lucide-react";

//  import logo from "../assets/Theme/new-logo.png"
//  import logo from "../assets/Theme/main-logo3.png"
 import logo from "../assets/Theme/re-logo1.png"


const links = [
    ["Home", "/"],
    ["Products", "#products"],
    ["Courses", "#courses"],
    ["MPSC Series", "#mpsc"],
    ["About", "about"],
    ["Contact", "contact"],
]; 

function Header() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* <a className="brand" href="#home" aria-label="SKS Dreams">
          <span className="brand-logo">
            <img 
              // src="/images/logo.png" 
                src={logo}
              alt="" 
              onError={(e)=> {
                e.currentTarget.style.display = "none";
              }}

            />

            {/* <span className="brand-fallback">✦</span> */}

          {/* </span>  */}

          {/* <span>
            <strong>SKS Dream</strong>
            <small>Dream · Learn · Achieve</small>
          </span> */}

            {/* <span className="brand-logos">

            <img src={logo} alt="brand-Logo" />
            </span> */}
        {/* </a> */}

        <a href="/" aria-label="SKS Dreams" className="Mainlogo">
          <img src={logo} alt="main-logo" />
        </a>

        <nav
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >

        
          {links.map(([label, href], index) => (
            <a
              key={label}
              className={index === 0 ? "active" : ""}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}

          <div className="mobile-account-links">
            <a href="/login">Login</a>
            {/* <a href="/register">Register</a> */}

          </div>

        </nav>

        <div className="header-actions">
          <button
            className="header-icon"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={()=> setSearchOpen(!searchOpen)}
          >
            <Search size={19} />
          </button>

          <a href="#cart" className="header-icon cart-icon" aria-label="Cart">
            <ShoppingCart size={19} />
            <span>0</span>
          </a>

          <a href="/login" className="button button-outline desktop-account">
            Login
          </a>

          {/* <a href="/register" className="button button-gold desktop-account">
            Register
          </a> */}

          <button
            className="header-icon menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={()=> setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>

      {searchOpen && (
        <form
          className="header-search container"
          onSubmit={(event)=> {
            event.preventDefault();
            document.getElementById("search-products")?.focus();
            setSearchOpen(false);
          }}
        >
          <Search size={18} />
          <input id="search-products" type="text"
            placeholder="Search books, courses and MPSC material..."
            aria-label="Search the store"
          />
          <button className="button button-gold">Search</button>
        </form>
      )}
    </header>
  )
}

export default Header
