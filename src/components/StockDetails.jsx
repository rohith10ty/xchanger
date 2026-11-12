import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiStar,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import {
  formatINR,
  generateChartSeries,
  useExchange,
} from "./exchangeStore";

function StockDetails({ onNavigate, onTradeStock }) {
  const {
    stocks,
    tickers,
    selectedSymbol,
    setSelectedSymbol,
    watchlist,
    toggleWatchlist,
    wallet,
    executeOrder,
  } = useExchange();

  const [timeframe, setTimeframe] = useState("1D");
  const [quickSide, setQuickSide] = useState("BUY");
  const [quickQty, setQuickQty] = useState("5");
  const [feedback, setFeedback] = useState(null);

  const stock = useMemo(
    () => stocks.find((s) => s.symbol === selectedSymbol) || stocks[0],
    [selectedSymbol, stocks],
  );

  const ticker = tickers[stock.symbol];
  const livePrice = ticker?.price ?? stock.basePrice;
  const changePct = ticker?.change ?? stock.baseChange;
  const priceDiff = livePrice - stock.prevClose;
  const isUp = changePct >= 0;
  const isStarred = watchlist.includes(stock.symbol);

  const holding = wallet.holdings.find((h) => h.symbol === stock.symbol);

  const chartData = useMemo(
    () => generateChartSeries(stock, livePrice, timeframe),
    [stock, livePrice, timeframe],
  );

  const flashClass =
    ticker?.direction === "up"
      ? "price-flash-up"
      : ticker?.direction === "down"
        ? "price-flash-down"
        : "";

  const handleQuickOrder = (e) => {
    e.preventDefault();
    const res = executeOrder({
      symbol: stock.symbol,
      side: quickSide,
      orderType: "MARKET",
      productType: "CNC",
      quantity: Number(quickQty),
      price: livePrice,
    });
    setFeedback(res);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onNavigate("markets")}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Stock Market Dashboard
        </button>

        <div className="flex items-center gap-2">
          <label
            htmlFor="stock-switcher"
            className="text-[11px] uppercase tracking-wider text-zinc-500"
          >
            Switch Stock
          </label>
          <select
            id="stock-switcher"
            value={stock.symbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-[#0b0b0b] px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-white"
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Header */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {stock.symbol}
              </h1>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                {stock.exchange}
              </span>
              <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-0.5 text-[11px] text-zinc-400">
                {stock.sector}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{stock.name}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right">
              <div
                className={`font-mono-num inline-block px-1.5 py-0.5 text-2xl font-bold text-white sm:text-3xl ${flashClass}`}
              >
                {formatINR(livePrice)}
              </div>
              <div
                className={`font-mono-num mt-1 flex items-center justify-end gap-1.5 text-xs font-semibold ${
                  isUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isUp ? (
                  <FiTrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <FiTrendingDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {priceDiff >= 0 ? "+" : ""}
                  {priceDiff.toFixed(2)} ({isUp ? "+" : ""}
                  {changePct.toFixed(2)}%)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleWatchlist(stock.symbol)}
              className={`flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-medium transition-colors ${
                isStarred
                  ? "border-white bg-white text-black"
                  : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-white hover:text-white"
              }`}
            >
              <FiStar
                className="h-3.5 w-3.5"
                fill={isStarred ? "currentColor" : "none"}
              />
              {isStarred ? "Watchlisted" : "Watchlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Quick Order */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Interactive Chart */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5 lg:col-span-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Price Performance ({timeframe})
              </h2>
              <p className="text-[11px] text-zinc-500">
                Interactive NSE price series — hover to inspect ticks
              </p>
            </div>

            {/* Daily, Weekly, Monthly, Yearly Filters */}
            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-[#060606] p-1">
              {[
                { id: "1D", label: "Daily (1D)" },
                { id: "1W", label: "Weekly (1W)" },
                { id: "1M", label: "Monthly (1M)" },
                { id: "1Y", label: "1Y" },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setTimeframe(tf.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    timeframe === tf.id
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="stockDetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#1f1f23"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  stroke="#52525b"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={68}
                  tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "10px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [formatINR(value), stock.symbol]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#ffffff"
                  strokeWidth={2}
                  fill="url(#stockDetailGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Buy / Sell Panel */}
        <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5 lg:col-span-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Quick Order</h2>
              <span className="text-[11px] text-zinc-500">
                Held: {holding?.quantity || 0} shares
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-zinc-800 bg-[#060606] p-1">
              <button
                type="button"
                onClick={() => setQuickSide("BUY")}
                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                  quickSide === "BUY"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setQuickSide("SELL")}
                className={`rounded-lg py-2 text-xs font-bold transition-all ${
                  quickSide === "SELL"
                    ? "bg-zinc-200 text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                SELL
              </button>
            </div>

            <form onSubmit={handleQuickOrder} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium text-zinc-400">
                  Quantity (Shares)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quickQty}
                  onChange={(e) => setQuickQty(e.target.value)}
                  className="font-mono-num w-full rounded-xl border border-zinc-800 bg-[#060606] px-3.5 py-2.5 text-sm text-white outline-none focus:border-white"
                />
                <div className="mt-2 flex gap-1.5">
                  {[1, 5, 10, 25, 50].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuickQty(String(q))}
                      className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 py-1 text-[11px] text-zinc-400 hover:border-zinc-600 hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-zinc-800/80 bg-[#070707] p-3.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Market Price</span>
                  <span className="font-mono-num text-white">
                    {formatINR(livePrice)}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Est. Order Value</span>
                  <span className="font-mono-num font-semibold text-white">
                    {formatINR((Number(quickQty) || 0) * livePrice)}
                  </span>
                </div>
              </div>

              {feedback && (
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                    feedback.ok
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/40 bg-red-500/10 text-red-300"
                  }`}
                >
                  <FiCheckCircle className="h-4 w-4 shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-zinc-200"
              >
                {quickSide} {stock.symbol} (Market)
              </button>
            </form>
          </div>

          <button
            type="button"
            onClick={() => onTradeStock(stock.symbol)}
            className="mt-4 w-full rounded-xl border border-zinc-800 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
          >
            Open Full Limit / Depth Terminal →
          </button>
        </div>
      </div>

      {/* Key Fundamentals & About */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-6 lg:col-span-7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Key Market Fundamentals
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Open", value: formatINR(stock.open) },
              { label: "Prev. Close", value: formatINR(stock.prevClose) },
              {
                label: "Day High / Low",
                value: `${formatINR(ticker?.high || stock.dayHigh, 0)} / ${formatINR(ticker?.low || stock.dayLow, 0)}`,
              },
              {
                label: "52W High / Low",
                value: `${formatINR(stock.week52High, 0)} / ${formatINR(stock.week52Low, 0)}`,
              },
              {
                label: "Market Cap",
                value: `₹${stock.marketCapCr.toLocaleString("en-IN")} Cr`,
              },
              { label: "P/E Ratio", value: stock.peRatio.toFixed(1) },
              {
                label: "Div. Yield",
                value: `${stock.dividendYield.toFixed(2)}%`,
              },
              { label: "Volume (NSE)", value: stock.volume },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-zinc-800/70 bg-[#070707] p-3.5"
              >
                <div className="text-[11px] text-zinc-500">{item.label}</div>
                <div className="font-mono-num mt-1 text-xs font-semibold text-white sm:text-sm">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-6 lg:col-span-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            About {stock.name}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {stock.about}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-400">
            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1">
              Exchange: NSE / BSE
            </span>
            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1">
              Sector: {stock.sector}
            </span>
            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1">
              Currency: INR (₹)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;
