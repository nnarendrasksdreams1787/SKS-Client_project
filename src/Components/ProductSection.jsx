import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { products } from "../Data/products";
import "../ProductSection.css";

export default function ProductSection() {
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToCart = (product) => {
    setCartCount((count) => count + 1);
    setMessage(`${product.name} added to your bag`);
  };

  return (
    <section className="product-section" id="products">
      <div className="product-section__header">
        <div>
          <span className="product-eyebrow">OUR COLLECTION</span>
          <h2>Featured Products</h2>
          <p>Discover resources designed to support your learning journey.</p>
        </div>

        <div className="product-section__actions">
          <span className="product-cart-count">
            <ShoppingBag size={17} />
            Bag ({cartCount})
          </span>
          <a href="#products" className="product-view-all">
            Explore all <ArrowRight size={17} />
          </a>
        </div>
      </div>

      {message && (
        <p className="product-message" role="status">
          {message}
        </p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-card__image-wrap">
              <Link to={`/reader/${product.id}`} aria-label={`View ${product.name}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card__image"
                  loading="lazy"
                />
              </Link>

              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}

              <button
                type="button"
                className={`product-wishlist ${
                  wishlist.includes(product.id) ? "is-active" : ""
                }`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  wishlist.includes(product.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={19}
                  fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            <div className="product-card__content">
              <span className="product-card__category">
                {product.category}
              </span>

              <Link
                to={`/reader/${product.id}`}
                className="product-card__title"
              >
                {product.name}
              </Link>

              <div className="product-rating">
                <Star size={15} fill="currentColor" />
                <span>{product.rating}</span>
                <span className="product-reviews">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="product-price">
                <strong>₹{product.price}</strong>
                <del>₹{product.originalPrice}</del>
              </div>

              <button
                type="button"
                className="product-add-button"
                onClick={() => addToCart(product)}
              >
                <ShoppingBag size={17} />
                Add to Bag
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}