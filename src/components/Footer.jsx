function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#050505]">
      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-sm font-black text-black">
                X
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Xchanger
              </span>
              <span className="rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                NSE • BSE • IPO
              </span>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
              Indian Equities, Shares &amp; IPO Paper Trading Terminal. All
              market prices, indices, and order executions are simulated with
              dummy data for educational demonstration.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-zinc-400">
            {[
              { id: "home", label: "Home" },
              { id: "markets", label: "Markets" },
              { id: "stock", label: "Stock Details" },
              { id: "trade", label: "Trade" },
              { id: "portfolio", label: "Portfolio" },
              { id: "transactions", label: "History" },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 pt-6 text-[11px] text-zinc-600">
          <span>© {new Date().getFullYear()} Xchanger India. All rights reserved.</span>
          <span>Monochrome Institutional Edition • INR (₹)</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
