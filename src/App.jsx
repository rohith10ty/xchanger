import { lazy, Suspense, useEffect, useState } from "react";
import Lenis from "lenis";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ExchangeProvider from "./components/ExchangeProvider";
import { useExchange } from "./components/exchangeStore";

const Home = lazy(() => import("./components/Home"));
const Markets = lazy(() => import("./components/Markets"));
const StockDetails = lazy(() => import("./components/StockDetails"));
const Trade = lazy(() => import("./components/Trade"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const Transactions = lazy(() => import("./components/Transactions"));
const Auth = lazy(() => import("./components/Auth"));
const Profile = lazy(() => import("./components/Profile"));

function AppShell() {
  const { setSelectedSymbol } = useExchange();

  const getPageFromHash = () => {
    const hash = window.location.hash.replace("#/", "");
    return hash || "home";
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("xchangerUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    let animationFrame;
    function raf(time) {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    }
    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, left: 0 });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    window.location.hash = `/${page}`;
    setCurrentPage(page);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleSelectStock = (symbol) => {
    setSelectedSymbol(symbol);
    handleNavigate("stock");
  };

  const handleTradeStock = (symbol) => {
    setSelectedSymbol(symbol);
    handleNavigate("trade");
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem("xchangerUser", JSON.stringify(userData));
    } catch {
      // ignore storage errors
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("xchangerUser");
    } catch {
      // ignore
    }
    handleNavigate("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "markets":
        return (
          <Markets
            onNavigate={handleNavigate}
            onSelectStock={handleSelectStock}
            onTradeStock={handleTradeStock}
          />
        );
      case "stock":
        return (
          <StockDetails
            onNavigate={handleNavigate}
            onTradeStock={handleTradeStock}
          />
        );
      case "trade":
        return <Trade onSelectStock={handleSelectStock} />;
      case "portfolio":
        return (
          <Portfolio
            onSelectStock={handleSelectStock}
            onTradeStock={handleTradeStock}
          />
        );
      case "transactions":
        return <Transactions />;
      case "login":
        return (
          <Auth
            mode="login"
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      case "signup":
        return (
          <Auth
            mode="signup"
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      case "profile":
        return (
          <Profile
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
      case "home":
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onSelectStock={handleSelectStock}
            user={user}
          />
        );
    }
  };

  return (
    <div className="xchanger-shell antialiased">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSelectStock={handleSelectStock}
        user={user}
        onLogout={handleLogout}
      />

      <main className="xchanger-main">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center text-xs tracking-wider text-zinc-500">
              LOADING XCHANGER TERMINAL...
            </div>
          }
        >
          {renderPage()}
        </Suspense>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  return (
    <ExchangeProvider>
      <AppShell />
    </ExchangeProvider>
  );
}

export default App;
