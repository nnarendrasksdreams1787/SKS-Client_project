import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  NavLink,
  Outlet,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Share2,
  UsersRound,
  ShoppingCart,
  Wallet,
  Landmark,
  Flower2,
  Settings,
  UserRound,
  LogOut,
  Menu,
  X,
  List,
  History,
  BookOpen,
} from "lucide-react";
import "../../CSS/UserLayout.css";
import { USER_API_URL } from "../../Config/api";

// const navItems = [
//   { name: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
//   { name: "Refer & Earn", path: "/referearn", Icon: Share2 },
//   { name: "My Network", path: "/mynetwork", Icon: UsersRound },
//   { name: "My Orders", path: "/myorders", Icon: ShoppingCart },
//   { name: "My Wallet", path: "/mywallet", Icon: Wallet },
//   { name: "Bank Details", path: "/bankdetails", Icon: Landmark },
//   { name: "Chant", path: "/chant", Icon: Flower2 },
//   { name: "Settings", path: null, Icon: Settings },
// ];
// const pageTitles = {
//   "/dashboard": "My Dashboard",
//   "/referearn": "Refer & Earn",
//   "/mynetwork": "My Network",
//   "/myorders": "My Orders",
//   "/mywallet": "My Wallet",
//   "/bankdetails": "Bank Details",
//   "/chant": "Chant & Jaap Counter",
// };

const navItems = [
  { name: "Dashboard", path: "/user/dashboard", Icon: LayoutDashboard },
  { name: "Refer & Earn", path: "/user/referearn", Icon: Share2 },
  { name: "My Network", path: "/user/mynetwork", Icon: UsersRound },
  { name: "My Orders", path: "/user/myorders", Icon: ShoppingCart },
  { name: "My Wallet", path: "/user/mywallet", Icon: Wallet },
  { name: "Bank Details", path: "/user/bankdetails", Icon: Landmark },
  { name: "Chant", path: "/user/chant", Icon: Flower2 },
  { name: "Settings", path: null, Icon: Settings },
];

const pageTitles = {
  "/user/dashboard": "My Dashboard",
  "/user/referearn": "Refer & Earn",
  "/user/mynetwork": "My Network",
  "/user/myorders": "My Orders",
  "/user/mywallet": "My Wallet",
  "/user/bankdetails": "Bank Details",
  "/user/chant": "Chant & Jaap Counter",
};

export default function UserLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isChantPage = pathname === "/chant";
  const title = pageTitles[pathname] || "User Dashboard";
  const [menuOpen, setMenuOpen] = useState(false);

  const [purchasedBooks, setPurchasedBooks] = useState([]);

  // 1. NEW: Verify logged-in user
  useEffect(() => {
    const controller = new AbortController();

    const verifySession = async () => {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        // const response = await axios.get("http://localhost:4000/api/user/me", {
        // const response = await axios.get(`${USER_API_URL}/me`, {
        const response = await axios.get("https://sks-serverproject-new.onrender.com/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;

        console.error("Session verification failed:", err);

        // if (err.response?.status === 401 || err.response?.status === 403) {
        //   sessionStorage.removeItem("authToken");
        //   sessionStorage.removeItem("authUser");
        // }

        if (err.response?.status === 401 || err.response?.status === 403) {
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
        }
      } finally {
        if (!controller.signal.aborted) {
          setAuthLoading(false);
        }
      }
    };

    verifySession();

    return () => controller.abort();
  }, []);

  // 2. EXISTING: Close menu when page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 3. EXISTING: Mobile menu behavior
  useEffect(() => {
    if (!menuOpen) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);


  useEffect(() => {
    if (!isAuthenticated) return;

    const controller = new AbortController();

    async function loadPurchasedBooks() {
      try {
        const token = sessionStorage.getItem("authToken");

        const response = await axios.get(
          // "http://localhost:4000/api/library/my-books" || "https://sks-serverproject-new.onrender.com/api/library/my-books",
          "https://sks-serverproject-new.onrender.com/api/library/my-books",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (response.data.success) {
          setPurchasedBooks(response.data.data || []);
        }
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          console.error("Purchased books error:", error);
        }
      }
    }

    loadPurchasedBooks();

    return () => controller.abort();
  }, [isAuthenticated]);

  // Your existing openChantTools function comes next.

  const openChantTools = (section) => {
    setMenuOpen(false);
    window.dispatchEvent(
      new CustomEvent("sks:chant-menu", { detail: section }),
    );
  };


   const testKanhaVoice = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await axios.get(
        // "http://localhost:4000/api/chant-tts/test-voice" || "https://sks-serverproject-new.onrender.com/api/chant-tts/test-voice",
        "https://sks-serverproject-new.onrender.com/api/chant-tts/test-voice",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Kanha Voice Test:", response.data);

      alert(
        `Connected successfully!\nVoice: ${response.data.voiceName}`
      );
    } catch (error) {
      console.error(
        "Kanha Voice Test Failed:",
        error.response?.data || error.message
      );

      alert("Kanha voice connection failed. Check Console.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");

    setIsAuthenticated(false);
    setUser(null);
    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  if (authLoading) {
    return (
      <div className="sks-user-layout">
        <p role="status">Verifying your session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className={`sks-user-layout ${isChantPage ? "sks-user-chant-route" : ""}`}
    >
      {menuOpen && (
        <button
          className="sks-user-menu-backdrop"
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`sks-user-sidebar ${menuOpen ? "is-open" : ""}`}
        id="sks-user-mobile-navigation"
        aria-label="Dashboard menu"
      >
        <div className="sks-user-sidebar-top">
          <div className="sks-user-brand">✦ SKS Dream</div>
          <button
            className="sks-user-drawer-close"
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        <nav className="sks-user-nav" aria-label="User dashboard navigation">
          {navItems.map(({ name, path, Icon }) =>
            path ? (
              <NavLink
                key={name}
                to={path}
                end
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `sks-user-nav-link${isActive ? " is-active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{name}</span>
              </NavLink>
            ) : (
              <button
                key={name}
                type="button"
                className="sks-user-nav-link is-disabled"
                disabled
                title="Module coming soon"
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{name}</span>
              </button>
            ),
          )}
        </nav>

        {purchasedBooks.length > 0 && (
          <div className="sks-user-purchased-books">
            <span className="sks-user-books-heading">
              MY PURCHASED BOOKS
            </span>

            {purchasedBooks.map((book) => (
              <NavLink
                key={book.product_id}
                to={`/user/books/${book.product_id}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `sks-user-nav-link${isActive ? " is-active" : ""}`
                }
              >
                <BookOpen size={18} strokeWidth={1.8} />
                {/* <span>
                  {book.product_id === 16
                    ? "MPSC Geography"
                    : `Book ${book.product_id}`}
                </span> */}

                <span>
                  {book.title || book.name || `Book ${book.product_id}`}
                </span>


              </NavLink>
            ))}
          </div>
        )}







        {isChantPage && (
          <div className="sks-user-chant-shortcuts">
            <span>JAAP TOOLS</span>
            <button type="button" onClick={() => openChantTools("chants")}>
              <List size={18} /> Select / Add Jaap
            </button>
            <button type="button" onClick={() => openChantTools("history")}>
              <History size={18} /> Recent Jaap Activity
            </button>
          </div>
        )}
        <div className="sks-user-drawer-account">
          <strong>Account</strong>
          <span>{user.full_name}</span>
          <small>Refer ID: {user.referral_code}</small>
          <button
            type="button"
            className="sks-user-logout"
            onClick={handleLogout}
          >
            <LogOut size={14} /> Logout
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="sks-user-main">
        <button
          type="button"
          className="sks-user-mobile-toggle"
          aria-label="Open dashboard menu"
          aria-controls="sks-user-mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={23} />
        </button>
        <header className="sks-user-header">
          <div className="sks-user-heading">
            <span className="sks-user-eyebrow">WELCOME BACK</span>
            <h1>{title}</h1>
          </div>
          <div className="sks-user-header-right">
            <section
              className="sks-user-account"
              aria-label="Account information"
            >
              <span className="sks-user-account-label">WELCOME :</span>
              <span className="sks-user-account-value">{user.full_name}</span>
              <span className="sks-user-account-label">Refer ID :</span>
              <span className="sks-user-account-value">
                {user.referral_code}
              </span>
              <button
                type="button"
                className="sks-user-logout"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </section>
            <span className="sks-user-avatar" aria-label="User profile">
              <UserRound size={21} strokeWidth={1.8} />
            </span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
