import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";
// import { products } from "../Data/products";
import "../ProductSection.css";

import { useNavigate } from "react-router-dom";

import { createPaymentOrder, initiatePayment } from "../Services/PaymentApi";

export default function ProductSection() {
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const navigate = useNavigate();
  const [payingProductId, setPayingProductId] = useState(null);
  const databaseProductIds = {
    "bhagavad-gita": 11,
    "mpsc-geography": 16,
    "mpsc-history": 18,
  };

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        // const response = await fetch("http://localhost:4000/api/products");
        const response = await fetch(
          "https://sks-serverproject-new.onrender.com/api/products",
        );

        if (!response.ok) {
          throw new Error("Unable to load products");
        }

        const data = await response.json();

        // if (!cancelled) {
        //   setProducts(data.products || []);
        // }

        if (!cancelled) {
          const filteredProducts = (data.products || []).filter((product) => {
            const productId = Number(product.product_id ?? product.id);
            return productId >= 29;
          });

          setProducts(filteredProducts);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuyNow = async (product) => {
    if (payingProductId !== null) return;

    // const productId = databaseProductIds[product.id];

    const productId = Number(product.id);

    if (!productId) {
      setMessage("This product is not available for purchase yet.");
      return;
    }

    // if (!sessionStorage.getItem("authToken")) {
    //   navigate("/login");
    //   return;
    // }

    if (!sessionStorage.getItem("authToken")) {
      sessionStorage.setItem("sks_pending_purchase", String(productId));

      navigate("/register");
      return;
    }

    setPayingProductId(product.id);
    setMessage("");

    try {
      // Reuse the same attempt if the user retries.
      const storageKey = `sks_checkout_${productId}`;
      let attempt = JSON.parse(sessionStorage.getItem(storageKey) || "null");

      if (!attempt?.idempotencyKey) {
        attempt = {
          idempotencyKey: `sks_${crypto.randomUUID().replace(/-/g, "")}`,
        };
        sessionStorage.setItem(storageKey, JSON.stringify(attempt));
      }

      if (!attempt.orderReference) {
        const created = await createPaymentOrder(
          productId,
          attempt.idempotencyKey,
        );

        const orderReference =
          created.order?.orderReference ?? created.order?.order_reference;

        if (!orderReference) {
          throw new Error("Order reference missing from backend.");
        }

        attempt.orderReference = orderReference;
        sessionStorage.setItem(storageKey, JSON.stringify(attempt));
      }

      const checkout = await initiatePayment(attempt.orderReference);

      if (!checkout.checkoutUrl) {
        throw new Error(
          "Checkout URL unavailable. Check the existing payment status before retrying.",
        );
      }

      const url = new URL(checkout.checkoutUrl);

      // if (
      //   url.protocol !== "https:" ||
      //   !(
      //     url.hostname === "phonepe.com" ||
      //     url.hostname.endsWith(".phonepe.com")
      //   )
      // ) {
      //   throw new Error("Unexpected payment checkout destination.");
      // }

      const allowedCheckoutHosts = [
        "phonepe.com",
        "www.phonepe.com",
        "mercury.phonepe.com",
      ];

      // Mswipe checkout host will be added only after
      // confirming the exact UAT domain returned by backend.

      if (
        url.protocol !== "https:" ||
        !allowedCheckoutHosts.some(
          (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
        )
      ) {
        throw new Error("Payment checkout destination is not approved.");
      }

      sessionStorage.removeItem("sks_pending_purchase");
      window.location.assign(url.href);
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to start payment. Check your order before retrying.",
      );
    } finally {
      setPayingProductId(null);
    }
  };

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);

  //   if (params.get("resumePurchase") !== "1") return;

  //   const pendingProductId = sessionStorage.getItem(
  //     "sks_pending_purchase"
  //   );

  //   const token = sessionStorage.getItem("authToken");

  //   if (!pendingProductId || !token) return;

  //   // const product = products.find(
  //   //   (item) =>
  //   //     String(databaseProductIds[item.id]) === pendingProductId
  //   // );

  //   const product = products.find(
  //     (item) => String(item.id) === pendingProductId
  //   );

  //   if (!product) {
  //     setMessage("Pending purchase product not found.");
  //     return;
  //   }

  //   // Remove the resume flag to prevent repeated checkout.
  //   window.history.replaceState(
  //     window.history.state,
  //     "",
  //     window.location.pathname + window.location.hash
  //   );

  //   // Reuse the existing Buy Now payment logic.
  //   handleBuyNow(product);
  // }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("resumePurchase") !== "1") return;
    if (loadingProducts) return;

    const pendingProductId = sessionStorage.getItem("sks_pending_purchase");

    const token = sessionStorage.getItem("authToken");

    if (!pendingProductId || !token) {
      setMessage("Please log in to continue your purchase.");
      return;
    }

    const product = products.find(
      (item) => String(item.id) === pendingProductId,
    );

    if (!product) {
      setMessage("Pending purchase product not found.");
      return;
    }

    // Remove resume flag to prevent duplicate automatic attempts.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.hash,
    );

    handleBuyNow(product);
  }, [loadingProducts, products]);

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
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
              <Link
                to={`/reader/${product.id}`}
                aria-label={`View ${product.name}`}
              >
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
              <span className="product-card__category">{product.category}</span>

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

              <button
                type="button"
                className="product-add-button"
                style={{ marginTop: "8px", background: "#071B30" }}
                disabled={payingProductId !== null}
                onClick={() => handleBuyNow(product)}
              >
                {payingProductId === product.id ? "Processing..." : "Buy Now"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
