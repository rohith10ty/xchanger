import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBarChart2,
  FiLayers,
  FiShield,
  FiTrendingDown,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import {
  formatCompactINR,
  formatINR,
  generateChartSeries,
  useExchange,
} from "./exchangeStore";

function Home({ onNavigate, onSelectStock, user }) {
  const { stocks, ipos, indices, tickers, portfolioSummary } = useExchange();

  const niftyIndex = indices[0];
  const niftySeries = useMemo(() => {
    const pseudoStock = {
      symbol: "NIFTY50",
      basePrice: niftyIndex?.basePrice || 24386.45,
      prevClose: 24197.85,
      baseChange: niftyIndex?.change || 0.78,
    };
    return generateChartSeries(pseudoStock, niftyIndex?.price, "1D");
  }, [niftyIndex]);

  const trendingStocks = useMemo(() => {
    return [...stocks]
      .sort((a, b) => {
        const chA = Math.abs(tickers[a.symbol]?.change ?? a.baseChange);
        const chB = Math.abs(tickers[b.symbol]?.change ?? b.baseChange);
        return chB - chA;
      })
      .slice(0, 8);
  }, [stocks, tickers]);

  const spotlightIpos = useMemo(() => ipos.slice(0, 4), [ipos]);

  return (
    <div className="space-y-12">
      {/* Live NSE Ticker Strip */}
      <div className="-mx-4 overflow-hidden border-y border-zinc-800/80 bg-[#080808] py-2.5 sm:-mx-6 lg:-mx-8">
        <div className="animate-marquee gap-8 px-4">
          {[...stocks, ...stocks].map((stock, idx) => {
            const t = tickers[stock.symbol];
            const price = t?.price ?? stock.basePrice;
            const change = t?.change ?? stock.baseChange;
            const isUp = change >= 0;
            return (
              <button
                key={`${stock.symbol}-${idx}`}
                type="button"
                onClick={() => onSelectStock(stock.symbol)}
                className="flex items-center gap-2.5 whitespace-nowrap text-xs transition-opacity hover:opacity-80"
              >
                <span className="font-semibold tracking-wide text-white">
                  {stock.symbol}
                </span>
                <span className="font-mono-num text-zinc-300">
                  {formatINR(price)}
                </span>
                <span
                  className={`font-mono-num flex items-center gap-0.5 text-[11px] font-medium ${
                    isUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                </span>
                <span className="text-zinc-800">|</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Section */}
      <section className="mono-grid-bg relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#080808] p-6 sm:p-10 lg:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-950 px-3 py-1 text-[11px] font-medium tracking-wide text-zinc-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              NSE &amp; BSE LIVE PAPER MARKET • INDIA
            </div>

            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[54px]">
              Trade Indian Equities, Shares &amp; IPOs in{" "}
              <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Pure Monochrome.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Xchanger is a modern Indian stock market terminal built for
              high-clarity execution. Track NIFTY 50 &amp; SENSEX, analyze
              company fundamentals, apply for upcoming IPOs, and manage your
              paper portfolio in real time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate("markets")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black transition-all hover:bg-zinc-200 sm:text-sm"
              >
                Explore Stock Dashboard
                <FiArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("trade")}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-3 text-xs font-medium text-white transition-all hover:border-white sm:text-sm"
              >
                Open Buy / Sell Terminal
              </button>
              {!user && (
                <button
                  type="button"
                  onClick={() => onNavigate("signup")}
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-zinc-400 transition-colors hover:text-white sm:text-sm"
                >
                  Create Free Account
                  <FiArrowUpRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Account Snapshot */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/80 pt-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Paper Balance
                </p>
                <p className="font-mono-num mt-1 text-base font-semibold text-white sm:text-lg">
                  {formatCompactINR(portfolioSummary.cash)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Portfolio Value
                </p>
                <p className="font-mono-num mt-1 text-base font-semibold text-white sm:text-lg">
                  {formatCompactINR(portfolioSummary.totalAccountValue)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                  Brokerage Fee
                </p>
                <p className="font-mono-num mt-1 text-base font-semibold text-white sm:text-lg">
                  ₹0.00
                </p>
              </div>
            </div>
          </div>

          {/* Right: NIFTY 50 Market Pulse Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Market Overview • NSE
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-white">
                    {niftyIndex.symbol}
                  </h2>
                </div>
                <div className="text-right font-mono-num">
                  <div className="text-xl font-bold text-white">
                    {niftyIndex.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div
                    className={`mt-0.5 text-xs font-medium ${
                      niftyIndex.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {niftyIndex.change >= 0 ? "+" : ""}
                    {niftyIndex.points.toFixed(2)} ({niftyIndex.change >= 0 ? "+" : ""}
                    {niftyIndex.change.toFixed(2)}%)
                  </div>
                </div>
              </div>

              <div className="mt-4 h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={niftySeries}>
                    <defs>
                      <linearGradient id="niftyMonoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" hide />
                    <YAxis domain={["dataMin - 20", "dataMax + 20"]} hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid #27272a",
                        borderRadius: "10px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(val) => [
                        Number(val).toLocaleString("en-IN"),
                        "NIFTY 50",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#ffffff"
                      strokeWidth={2}
                      fill="url(#niftyMonoGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 4 Indian Indices */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-zinc-800/90 pt-4">
                {indices.map((idx) => {
                  const up = idx.change >= 0;
                  return (
                    <div
                      key={idx.symbol}
                      className="rounded-xl border border-zinc-800/80 bg-[#080808] p-3"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-zinc-400">
                          {idx.symbol}
                        </span>
                        <span className="text-[10px] text-zinc-600">
                          {idx.exchange}
                        </span>
                      </div>
                      <div className="font-mono-num mt-1 flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-white">
                          {idx.price.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            up ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {up ? "+" : ""}
                          {idx.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Indian Stocks */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              NSE Movers
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Trending Indian Stocks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("markets")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
          >
            View All {stocks.length} Stocks
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingStocks.map((stock) => {
            const t = tickers[stock.symbol];
            const price = t?.price ?? stock.basePrice;
            const change = t?.change ?? stock.baseChange;
            const isUp = change >= 0;
            const flashClass =
              t?.direction === "up"
                ? "price-flash-up"
                : t?.direction === "down"
                  ? "price-flash-down"
                  : "";

            return (
              <div
                key={`${stock.symbol}-${t?.tickId || 0}`}
                onClick={() => onSelectStock(stock.symbol)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelectStock(stock.symbol)}
                className="group cursor-pointer rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-500/80 hover:bg-[#111111]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold tracking-tight text-white">
                        {stock.symbol}
                      </span>
                      <span className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                      {stock.name}
                    </p>
                  </div>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                      isUp
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isUp ? (
                      <FiTrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <FiTrendingDown className="h-3.5 w-3.5" />
                    )}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div
                      className={`font-mono-num inline-block px-1 py-0.5 text-lg font-bold text-white ${flashClass}`}
                    >
                      {formatINR(price)}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {stock.sector}
                    </div>
                  </div>
                  <span
                    className={`font-mono-num rounded-md px-2 py-1 text-xs font-semibold ${
                      isUp
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* IPO Spotlight */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
              Primary Market • India
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              IPO Watch &amp; New Listings
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("markets")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
          >
            View All IPOs
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {spotlightIpos.map((ipo) => (
            <div
              key={ipo.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5 transition-colors hover:border-zinc-600"
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
                    <span className="text-[11px] text-zinc-500">{ipo.sector}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white">
                    {ipo.company}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Est. GMP
                  </span>
                  <div className="font-mono-num text-sm font-semibold text-emerald-400">
                    {ipo.gmpPercent}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-800/80 pt-4 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500">Price Band</span>
                  <div className="font-mono-num mt-0.5 font-semibold text-white">
                    {ipo.priceBand}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500">Lot Size</span>
                  <div className="font-mono-num mt-0.5 font-semibold text-white">
                    {ipo.lotSize} Shares
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500">Subscription</span>
                  <div className="font-mono-num mt-0.5 font-semibold text-white">
                    {ipo.subscription}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: FiZap,
            title: "Instant Paper Execution",
            desc: "Simulate NSE equity delivery and intraday orders with realistic STT & exchange charges.",
          },
          {
            icon: FiBarChart2,
            title: "Multi-Timeframe Charts",
            desc: "Inspect 1D, 1W, 1M, and 1Y price action with interactive monochrome tooltips.",
          },
          {
            icon: FiLayers,
            title: "IPO & Primary Desk",
            desc: "Track open, upcoming, and listed Indian IPOs with lot size and ASBA simulation.",
          },
          {
            icon: FiShield,
            title: "Zero Risk Sandbox",
            desc: "Start with ₹5,00,000 virtual capital to test strategies before deploying real funds.",
          },
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="rounded-2xl border border-zinc-800/80 bg-[#0a0a0a] p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-white">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                {feat.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Home;
