
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");

  function handleSearch(event) {
    event.preventDefault();

    window.dispatchEvent(
      new CustomEvent("sks-search", {
        detail: { query, category },
      })
    );

    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <form className="store-search container" onSubmit={handleSearch}>
      <Search size={19} />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for books, courses, MPSC materials..."
        aria-label="Search products and courses"
      />

      <label className="search-category">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Select category"
        >
          <option>All Categories</option>
          <option>Digital Books</option>
          <option>Online Courses</option>
          <option>MPSC Study Material</option>
          <option>Combo Packs</option>
        </select>
        <ChevronDown size={15} />
      </label>

      <button className="button button-gold" type="submit">
        Search
      </button>
    </form>
  );
}
