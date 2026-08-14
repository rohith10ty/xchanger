import { FiGithub, FiGlobe, FiArrowUpRight } from "react-icons/fi";
import "./Footer.css";

function Footer({ onNavigate }) {
  const links = [
    { label: "Home", page: "home" },
    { label: "Markets", page: "markets" },
    { label: "Trade", page: "trade" },
    { label: "Portfolio", page: "portfolio" },
    { label: "Transactions", page: "transactions" },
  ];

  return (
    <footer className="quantum-footer">
      <div className="quantum-footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <button className="footer-logo" onClick={() => onNavigate("home")}>
              <span className="gold-symbol">⬢</span>
              <span>Quantum</span>
            </button>

            <p>
              A modern cryptocurrency exchange interface built with React, Vite
              and Tailwind CSS.
            </p>
          </div>

          <div className="footer-nav">
            <span>Platform</span>

            <div>
              {links.map((link) => (
                <button key={link.page} onClick={() => onNavigate(link.page)}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-connect">
            <span>Project</span>

            <div>
              <a href="#" onClick={(e) => e.preventDefault()}>
                <FiGithub />
                GitHub
                <FiArrowUpRight />
              </a>

              <a href="#" onClick={(e) => e.preventDefault()}>
                <FiGlobe />
                Live Demo
                <FiArrowUpRight />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Quantum Exchange. UI demonstration project.</p>

          <div className="footer-status">
            <span></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
