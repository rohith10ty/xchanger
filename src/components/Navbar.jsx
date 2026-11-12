import { useMemo, useState } from "react";
import {
  FiActivity,
  FiArrowUpRight,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { formatINR, useExchange } from "./exchangeStore";

function Navbar({ currentPage, onNavigate, onSelectStock, user, onLogout }) {
  const { stocks, tickers, portfolioSummary } = useExchange();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "markets", label: "Markets" },
    { id: "stock", label: "Stock Details" },
    { id: "trade", label: "Trade" },
    { id: "portfolio", label: "Portfolio" },
    { id: "transactions", label: "History" },
  ];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return stocks
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [searchQuery, stocks]);

  const handlePickStock = (symbol) => {
    setSearchQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
    onSelectStock(symbol);
  };

  const handleNavClick = (pageId) => {
    setMobileOpen(false);
    onNavigate(pageId);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/90 bg-[#050505]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleNavClick("home")}
            className="group flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white text-black transition-transform duration-200 group-hover:scale-105">
              <span className="text-lg font-black tracking-tighter">X</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  Xchanger
                </span>
                <span className="hidden rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-zinc-300 sm:inline-block">
                  NSE • BSE
                </span>
              </div>
              <p className="hidden text-[10px] tracking-wide text-zinc-500 lg:block">
                EQUITIES &amp; IPO TERMINAL
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search + Auth */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 transition-colors focus-within:border-white/50">
              <FiSearch className="mr-2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search NSE stocks (RELIANCE, TCS...)"
                className="w-52 bg-transparent text-xs text-white placeholder-zinc-500 outline-none lg:w-64"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-500 hover:text-white"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {searchOpen && searchResults.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-800 bg-[#0b0b0b] shadow-2xl">
                <div className="border-b border-zinc-800/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  NSE Equities
                </div>
                {searchResults.map((stock) => {
                  const t = tickers[stock.symbol];
                  const isUp = (t?.change ?? 0) >= 0;
                  return (
                    <button
                      key={stock.symbol}
                      type="button"
                      onMouseDown={() => handlePickStock(stock.symbol)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-zinc-900"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {stock.symbol}
                          </span>
                          <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            {stock.sector}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{stock.name}</p>
                      </div>
                      <div className="text-right font-mono-num">
                        <div className="text-xs font-medium text-white">
                          {formatINR(t?.price || stock.basePrice)}
                        </div>
                        <div
                          className={`text-[11px] ${
                            isUp ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isUp ? "+" : ""}
                          {(t?.change ?? 0).toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auth / User Controls */}
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => handleNavClick("portfolio")}
                className="hidden items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white xl:flex"
              >
                <FiActivity className="h-3.5 w-3.5 text-white" />
                <span className="font-mono-num font-medium">
                  {formatINR(portfolioSummary.cash, 0)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("profile")}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:border-white"
              >
                <FiUser className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
              >
                <FiLogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => handleNavClick("login")}
                className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  currentPage === "login"
                    ? "border-white bg-zinc-900 text-white"
                    : "border-zinc-800 bg-transparent text-zinc-300 hover:border-zinc-600 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleNavClick("signup")}
                className="flex items-center gap-1 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-all hover:bg-zinc-200"
              >
                Sign Up
                <FiArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white lg:hidden"
          >
            {mobileOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-[#080808] px-4 py-4 lg:hidden">
          <div className="mb-3 flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
            <FiSearch className="mr-2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NSE stocks..."
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mb-3 divide-y divide-zinc-900 rounded-lg border border-zinc-800 bg-zinc-950">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => handlePickStock(stock.symbol)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-xs"
                >
                  <span className="font-semibold text-white">{stock.symbol}</span>
                  <span className="text-zinc-400">{stock.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`rounded-lg px-3 py-2 text-left text-xs font-medium ${
                  currentPage === item.id
                    ? "bg-white text-black"
                    : "border border-zinc-800/80 bg-zinc-950 text-zinc-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-3">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick("profile")}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 py-2 text-xs font-medium text-white"
                >
                  {user.name} (Profile)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout();
                  }}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick("login")}
                  className="flex-1 rounded-lg border border-zinc-700 py-2 text-xs font-medium text-white"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick("signup")}
                  className="flex-1 rounded-lg bg-white py-2 text-xs font-semibold text-black"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
