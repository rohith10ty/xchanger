import { useEffect, useState } from "react";
import Lenis from "lenis";
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Markets from "./components/Markets";
import Trade from "./components/Trade";
import Portfolio from "./components/Portfolio";
import Transactions from "./components/Transactions";
import Profile from "./components/Profile";
import ExchangeProvider from "./components/ExchangeProvider";

function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.replace("#/", "");

    if (!hash) {
      return "home";
    }

    return hash;
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [marketSearch, setMarketSearch] = useState("");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quantumUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
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

      window.scrollTo({
        top: 0,
        left: 0,
      });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleNavigate = (page) => {
    window.location.hash = `/${page}`;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleCryptoSearch = (query) => {
    setMarketSearch(query);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "markets":
        return (
          <Markets
            externalSearch={marketSearch}
            setExternalSearch={setMarketSearch}
            onNavigate={handleNavigate}
          />
        );

      case "trade":
        return <Trade />;

      case "portfolio":
        return <Portfolio />;

      case "transactions":
        return <Transactions />;

      case "profile":
        return <Profile user={user} onUserChange={setUser} />;

      case "home":
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <ExchangeProvider>
      <div className="app dashboard-app">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onCryptoSearch={handleCryptoSearch}
          user={user}
        />

        {renderPage()}

        <Footer onNavigate={handleNavigate} />
      </div>
    </ExchangeProvider>
  );
}

export default App;
