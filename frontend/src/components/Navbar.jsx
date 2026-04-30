import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../styles/Navbar.css";

const Navbar = () => {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const close = () => setMobileOpen(false);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      close();
    }
  };

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__top">
        Free shipping on orders over ₹2,500 · Modest. Crafted. Halal.
      </div>

      <div className="navbar__inner">
        {/* Mobile hamburger */}
        <button
          className="navbar__icon navbar__mobileToggle"
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop nav links */}
        <nav className="navbar__links" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/ladies">Ladies</NavLink>
          <NavLink to="/kids">Kids</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Brand */}
        <Link to="/" className="navbar__brand">
          Halal <span>Fashions</span>
        </Link>

        {/* Action icons */}
        <div className="navbar__actions">
          <button
            className="navbar__icon"
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
          >
            <Search size={18} />
          </button>

          {user ? (
            <Link to="/profile" className="navbar__icon navbar__userBtn" aria-label="Profile">
              <User size={18} />
              <span className="navbar__userName">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/login" className="navbar__icon navbar__loginBtn" aria-label="Login">
              <User size={18} />
              <span className="navbar__loginText">Login</span>
            </Link>
          )}

          <Link to="/cart" className="navbar__icon" aria-label="Cart">
            <ShoppingBag size={18} />
            {count > 0 && <span className="navbar__badge">{count}</span>}
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <form className="navbar__searchRow" onSubmit={submit}>
          <div className="navbar__search">
            <Search size={16} />
            <input
              autoFocus
              placeholder="Search suits, colors, sizes…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="button" className="navbar__searchClose" onClick={() => setSearchOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="navbar__mobileMenu" aria-label="Mobile">
          <NavLink to="/" onClick={close} end>Home</NavLink>
          <NavLink to="/shop" onClick={close}>Shop All</NavLink>
          <NavLink to="/ladies" onClick={close}>Ladies Suits</NavLink>
          <NavLink to="/kids" onClick={close}>Kids</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          <NavLink to="/contact" onClick={close}>Contact</NavLink>
          <div className="navbar__mobileDivider" />
          {user ? (
            <>
              <NavLink to="/profile" onClick={close}>My Profile</NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" onClick={close}>Admin Panel</NavLink>
              )}
              <button className="navbar__mobileLogout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/signup" onClick={close}>Sign Up</NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
