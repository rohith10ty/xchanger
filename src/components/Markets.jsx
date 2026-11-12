import { useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
  FiSearch,
  FiStar,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import {
  formatCompactINR,
  formatINR,
  useExchange,
} from "./exchangeStore";

function Markets({ onNavigate, onSelectStock, onTradeStock }) {
  const {
    stocks,
    ipos,
    indices,
    tickers,
    watchlist,
    toggleWatchlist,
    portfolioSummary,
    applyIpo,
  } = useExchange();

  const [activeTab, setActiveTab] = useState("all"); // all | watchlist | portfolio | ipos
  const [sectorFilter, setSectorFilter] = useState("All");
  const [ipoStatusFilter, setIpoStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [ipoFeedback, setIpoFeedback] = useState(null);

  const sectors = useMemo(() => {
    const unique = Array.from(new Set(stocks.map((s) => s.sector)));
    return ["All", ...unique];
  }, [stocks]);

  const enrichedStocks = useMemo(() => {
    return stocks.map((stock) => {
      const t = tickers[stock.symbol];
      return {
        ...stock,
        price: t?.price ?? stock.basePrice,
        change: t?.change ?? stock.baseChange,
        high: t?.high ?? stock.dayHigh,
        low: t?.low ?? stock.dayLow,
        direction: t?.direction ?? "flat",
        tickId: t?.tickId ?? 0,
      };
    });
  }, [stocks, tickers]);

  const topGainers = useMemo(() => {
    return [...enrichedStocks]
      .sort((a, b) => b.change - a.change)
      .slice(0, 4);
  }, [enrichedStocks]);

  const topLosers = useMemo(() => {
    return [...enrichedStocks]
      .sort((a, b) => a.change - b.change)
      .slice(0, 4);
  }, [enrichedStocks]);

  const filteredStocks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrichedStocks.filter((s) => {
      if (activeTab === "watchlist" && !watchlist.includes(s.symbol)) {
        return false;
      }
      if (sectorFilter !== "All" && s.sector !== sectorFilter) {
        return false;
      }
      if (
        q &&
        !s.symbol.toLowerCase().includes(q) &&
        !s.name.toLowerCase().includes(q) &&
        !s.sector.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [activeTab, enrichedStocks, search, sectorFilter, watchlist]);

  const filteredIpos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ipos.filter((ipo) => {
      if (ipoStatusFilter !== "All" && ipo.status !== ipoStatusFilter) {
        return false;
      }
      if (
        q &&
        !ipo.company.toLowerCase().includes(q) &&
        !ipo.symbol.toLowerCase().includes(q) &&
        !ipo.sector.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [ipoStatusFilter, ipos, search]);

  const handleApplyIpo = (ipoId) => {
    const res = applyIpo(ipoId, 1);
    setIpoFeedback(res);
    setTimeout(() => setIpoFeedback(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            NSE &amp; BSE Equities • Primary Market
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Stock Market Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0b0b0b] px-3.5 py-2 text-xs text-zinc-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Live Simulated Market Feed
        </div>
      </div>

      {/* Indian Indices Strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {indices.map((idx) => {
          const isUp = idx.change >= 0;
          return (
            <div
              key={idx.symbol}
              className="rounded-xl border border-zinc-800/90 bg-[#0b0b0b] p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  {idx.symbol}
                </span>
                <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-500">
                  {idx.exchange}
                </span>
              </div>
              <div className="font-mono-num mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white">
                  {idx.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isUp ? "+" : ""}
                  {idx.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Gainers & Top Losers */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Gainers */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Top Gainers
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500">NSE Intraday</span>
          </div>
          <div className="space-y-2.5">
            {topGainers.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => onSelectStock(stock.symbol)}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800/70 bg-[#070707] px-3.5 py-2.5 text-left transition-colors hover:border-zinc-600 hover:bg-zinc-950"
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-[11px] text-zinc-500">{stock.name}</div>
                </div>
                <div className="font-mono-num text-right">
                  <div className="text-xs font-semibold text-white">
                    {formatINR(stock.price)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-400">
                    +{stock.change.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTrendingDown className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Top Losers
              </h2>
            </div>
            <span className="text-[11px] text-zinc-500">NSE Intraday</span>
          </div>
          <div className="space-y-2.5">
            {topLosers.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                onClick={() => onSelectStock(stock.symbol)}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800/70 bg-[#070707] px-3.5 py-2.5 text-left transition-colors hover:border-zinc-600 hover:bg-zinc-950"
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-[11px] text-zinc-500">{stock.name}</div>
                </div>
                <div className="font-mono-num text-right">
                  <div className="text-xs font-semibold text-white">
                    {formatINR(stock.price)}
                  </div>
                  <div className="text-[11px] font-semibold text-red-400">
                    {stock.change.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs + Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0a0a0a] p-1">
            {[
              { id: "all", label: `All Stocks (${stocks.length})` },
              { id: "watchlist", label: `Watchlist (${watchlist.length})` },
              {
                id: "portfolio",
                label: `Portfolio (${portfolioSummary.detailedHoldings.length})`,
              },
              { id: "ipos", label: `IPOs (${ipos.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 focus-within:border-white/50">
            <FiSearch className="mr-2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === "ipos"
                  ? "Filter IPOs by company or sector..."
                  : "Filter stocks by name or sector..."
              }
              className="w-56 bg-transparent text-xs text-white placeholder-zinc-500 outline-none sm:w-64"
            />
          </div>
        </div>

        {/* Sector Filters for Equity Tabs */}
        {(activeTab === "all" || activeTab === "watchlist") && (
          <div className="flex flex-wrap gap-2">
            {sectors.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSectorFilter(sec)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                  sectorFilter === sec
                    ? "border-white bg-white text-black"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        )}

        {/* Equity Table (All Stocks & Watchlist) */}
        {(activeTab === "all" || activeTab === "watchlist") && (
          <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="px-4 py-3.5">Stock / Company</th>
                    <th className="px-4 py-3.5">Sector</th>
                    <th className="px-4 py-3.5 text-right">LTP (₹)</th>
                    <th className="px-4 py-3.5 text-right">Change %</th>
                    <th className="px-4 py-3.5 text-right">Day High / Low</th>
                    <th className="px-4 py-3.5 text-right">Mkt Cap</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {filteredStocks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-xs text-zinc-500"
                      >
                        No stocks match your current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStocks.map((stock) => {
                      const isUp = stock.change >= 0;
                      const starred = watchlist.includes(stock.symbol);
                      const flashClass =
                        stock.direction === "up"
                          ? "price-flash-up"
                          : stock.direction === "down"
                            ? "price-flash-down"
                            : "";

                      return (
                        <tr
                          key={stock.symbol}
                          className="transition-colors hover:bg-zinc-900/50"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => toggleWatchlist(stock.symbol)}
                                title={
                                  starred
                                    ? "Remove from Watchlist"
                                    : "Add to Watchlist"
                                }
                                className={`transition-colors ${
                                  starred
                                    ? "text-white"
                                    : "text-zinc-600 hover:text-zinc-300"
                                }`}
                              >
                                <FiStar
                                  className="h-4 w-4"
                                  fill={starred ? "currentColor" : "none"}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => onSelectStock(stock.symbol)}
                                className="text-left hover:underline"
                              >
                                <div className="font-bold text-white">
                                  {stock.symbol}
                                </div>
                                <div className="text-[11px] text-zinc-500">
                                  {stock.name}
                                </div>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-400">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="font-mono-num px-4 py-3.5 text-right font-semibold text-white">
                            <span className={`inline-block px-1.5 py-0.5 ${flashClass}`}>
                              {formatINR(stock.price)}
                            </span>
                          </td>
                          <td className="font-mono-num px-4 py-3.5 text-right">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 font-semibold ${
                                isUp
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isUp ? "+" : ""}
                              {stock.change.toFixed(2)}%
                            </span>
                          </td>
                          <td className="font-mono-num px-4 py-3.5 text-right text-[11px] text-zinc-400">
                            {formatINR(stock.high)} / {formatINR(stock.low)}
                          </td>
                          <td className="font-mono-num px-4 py-3.5 text-right text-zinc-300">
                            ₹{(stock.marketCapCr / 1000).toFixed(1)}K Cr
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onSelectStock(stock.symbol)}
                                className="rounded-lg border border-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => onTradeStock(stock.symbol)}
                                className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-black transition-colors hover:bg-zinc-200"
                              >
                                Trade
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Portfolio Section inside Dashboard */}
        {activeTab === "portfolio" && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-[#0b0b0b] p-4">
                <div className="text-[11px] text-zinc-500">Invested</div>
                <div className="font-mono-num mt-1 text-base font-bold text-white">
                  {formatCompactINR(portfolioSummary.investedValue)}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0b0b0b] p-4">
                <div className="text-[11px] text-zinc-500">Current Value</div>
                <div className="font-mono-num mt-1 text-base font-bold text-white">
                  {formatCompactINR(portfolioSummary.currentHoldingsValue)}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0b0b0b] p-4">
                <div className="text-[11px] text-zinc-500">Overall P&amp;L</div>
                <div
                  className={`font-mono-num mt-1 text-base font-bold ${
                    portfolioSummary.totalPnL >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {portfolioSummary.totalPnL >= 0 ? "+" : ""}
                  {formatINR(portfolioSummary.totalPnL)}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0b0b0b] p-4">
                <div className="text-[11px] text-zinc-500">Available Cash</div>
                <div className="font-mono-num mt-1 text-base font-bold text-white">
                  {formatINR(portfolioSummary.cash)}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
              <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <FiBriefcase className="h-4 w-4" />
                  Active Equity Holdings
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("portfolio")}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                >
                  Full Portfolio View <FiArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Avg Cost</th>
                      <th className="px-4 py-3 text-right">LTP</th>
                      <th className="px-4 py-3 text-right">Current Value</th>
                      <th className="px-4 py-3 text-right">P&amp;L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {portfolioSummary.detailedHoldings.map((h) => (
                      <tr
                        key={h.symbol}
                        onClick={() => onSelectStock(h.symbol)}
                        className="cursor-pointer transition-colors hover:bg-zinc-900/50"
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{h.symbol}</div>
                          <div className="text-[11px] text-zinc-500">
                            {h.name}
                          </div>
                        </td>
                        <td className="font-mono-num px-4 py-3 text-right text-zinc-300">
                          {h.quantity}
                        </td>
                        <td className="font-mono-num px-4 py-3 text-right text-zinc-400">
                          {formatINR(h.averageCost)}
                        </td>
                        <td className="font-mono-num px-4 py-3 text-right font-semibold text-white">
                          {formatINR(h.currentPrice)}
                        </td>
                        <td className="font-mono-num px-4 py-3 text-right font-semibold text-white">
                          {formatINR(h.currentValue)}
                        </td>
                        <td
                          className={`font-mono-num px-4 py-3 text-right font-semibold ${
                            h.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {h.pnl >= 0 ? "+" : ""}
                          {formatINR(h.pnl)} ({h.pnlPct.toFixed(2)}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* IPOs Tab */}
        {activeTab === "ipos" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {["All", "Open", "Upcoming", "Listed"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setIpoStatusFilter(status)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      ipoStatusFilter === status
                        ? "border-white bg-white text-black"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {ipoFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
                    ipoFeedback.ok
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300"
                  }`}
                >
                  <FiCheckCircle className="h-3.5 w-3.5" />
                  {ipoFeedback.message}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredIpos.map((ipo) => (
                <div
                  key={ipo.id}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            ipo.status === "Open"
                              ? "bg-white text-black"
                              : ipo.status === "Upcoming"
                                ? "border border-zinc-700 bg-zinc-900 text-zinc-300"
                                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {ipo.status}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {ipo.openDate} – {ipo.closeDate}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-white">
                        {ipo.company}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {ipo.sector} • {ipo.exchange}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                        {ipo.status === "Listed" ? "Listing Price" : "Est. GMP"}
                      </span>
                      <div className="font-mono-num text-sm font-bold text-emerald-400">
                        {ipo.status === "Listed"
                          ? formatINR(ipo.listingPrice)
                          : ipo.gmpPercent}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2 border-t border-zinc-800/80 pt-4 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500">Price Band</span>
                      <div className="font-mono-num mt-0.5 font-semibold text-white">
                        {ipo.priceBand}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500">Lot Size</span>
                      <div className="font-mono-num mt-0.5 font-semibold text-white">
                        {ipo.lotSize}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500">Issue Size</span>
                      <div className="font-mono-num mt-0.5 font-semibold text-white">
                        ₹{ipo.issueSizeCr.toLocaleString("en-IN")} Cr
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500">Sub</span>
                      <div className="font-mono-num mt-0.5 font-semibold text-white">
                        {ipo.subscription}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3">
                    <span className="font-mono-num text-[11px] text-zinc-400">
                      1 Lot = {formatINR(ipo.lotSize * ipo.issuePrice, 0)}
                    </span>
                    {ipo.status === "Open" ? (
                      <button
                        type="button"
                        onClick={() => handleApplyIpo(ipo.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
                      >
                        <FiBookmark className="h-3.5 w-3.5" />
                        Apply 1 Lot (ASBA)
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500">
                        {ipo.status === "Upcoming"
                          ? "Bidding Opens Soon"
                          : "Listed on NSE/BSE"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Markets;
