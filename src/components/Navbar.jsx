import { useState } from "react";
import { FiSearch, FiBell, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useExchange } from "./exchangeStore";
import "./Navbar.css";

function Navbar({ currentPage, onNavigate, onCryptoSearch, user }) {
  const { formatMoney } = useExchange();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Price alert",
      detail: "Bitcoin moved above",
      priceUsd: 67800,
      unread: true,
    },
    {
      id: 2,
      title: "Order completed",
      detail: "Your ETH sell order was completed.",
      unread: true,
    },
    {
      id: 3,
      title: "Account update",
      detail: "Your portfolio summary is ready.",
      unread: false,
    },
  ]);

  const displayName = user?.name || "My Profile";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "MP";
  const unreadCount = notifications.filter((item) => item.unread).length;

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Markets", page: "markets" },
    { name: "Trade", page: "trade" },
    { name: "Portfolio", page: "portfolio" },
    { name: "Transactions", page: "transactions" },
  ];

  const handleNavigation = (page) => {
    onNavigate(page);
    setMobileMenu(false);
    setShowNotifications(false);
  };

  const markAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false })),
    );
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (onCryptoSearch) {
      onCryptoSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    onCryptoSearch(search);
    onNavigate("markets");
    setMobileMenu(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          className="navbar-logo navbar-logo-button"
          onClick={() => handleNavigation("home")}
        >
          <span className="gold-symbol">⬢</span>
          <span>Quantum</span>
        </button>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={
                currentPage === link.page ? "nav-link active" : "nav-link"
              }
              onClick={() => handleNavigation(link.page)}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="navbar-actions">
          <form className="nav-search" onSubmit={handleSearchSubmit}>
            <FiSearch />

            <input
              type="text"
              placeholder="Search crypto..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <span className="search-shortcut">Enter</span>
          </form>

          <button
            className="icon-button notification-button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => setShowNotifications((open) => !open)}
          >
            <FiBell />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <div>
                  <strong>Notifications</strong>
                  <span>{unreadCount} unread</span>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notification-list">
                {notifications.map((item) => (
                  <button
                    className={
                      item.unread
                        ? "notification-item unread"
                        : "notification-item"
                    }
                    key={item.id}
                    onClick={() =>
                      setNotifications((items) =>
                        items.map((notice) =>
                          notice.id === item.id
                            ? { ...notice, unread: false }
                            : notice,
                        ),
                      )
                    }
                  >
                    <span className="notification-status"></span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.priceUsd
                          ? `${item.detail} ${formatMoney(item.priceUsd)}.`
                          : item.detail}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="profile-button"
            onClick={() => handleNavigation("profile")}
          >
            <div className="profile-avatar">{initials}</div>

            <div className="profile-text">
              <span className="profile-name">{displayName}</span>
              <span className="profile-account">
                {user ? "Main Account" : "Sign in or sign up"}
              </span>
            </div>

            <FiChevronDown className="profile-chevron" />
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${mobileMenu ? "mobile-nav-open" : ""}`}>
        <form className="mobile-search" onSubmit={handleSearchSubmit}>
          <FiSearch />

          <input
            type="text"
            placeholder="Search cryptocurrency..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>

        <div className="mobile-links">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={
                currentPage === link.page ? "mobile-link active" : "mobile-link"
              }
              onClick={() => handleNavigation(link.page)}
            >
              {link.name}
            </button>
          ))}
        </div>

        <button
          className="mobile-profile"
          onClick={() => handleNavigation("profile")}
        >
          <div className="profile-avatar">{initials}</div>

          <div>
            <p>{displayName}</p>
            <span>{user ? "Profile settings" : "Sign in or sign up"}</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
