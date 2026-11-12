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
import { FiCheckCircle, FiClock, FiSliders } from "react-icons/fi";
import {
  formatINR,
  generateChartSeries,
  useExchange,
} from "./exchangeStore";

function Trade({ onSelectStock }) {
  const {
    stocks,
    tickers,
    selectedSymbol,
    setSelectedSymbol,
    wallet,
    executeOrder,
  } = useExchange();

  const stock = useMemo(
    () => stocks.find((s) => s.symbol === selectedSymbol) || stocks[0],
    [selectedSymbol, stocks],
  );

  const ticker = tickers[stock.symbol];
  const livePrice = ticker?.price ?? stock.basePrice;
  const changePct = ticker?.change ?? stock.baseChange;
  const isUp = changePct >= 0;

  const [side, setSide] = useState("BUY");
  const [orderType, setOrderType] = useState("MARKET");
  const [productType, setProductType] = useState("CNC");
  const [quantity, setQuantity] = useState("10");
  const [limitPrice, setLimitPrice] = useState(() => livePrice.toFixed(2));
  const [timeframe, setTimeframe] = useState("1D");
  const [feedback, setFeedback] = useState(null);

  const effectivePrice =
    orderType === "MARKET" ? livePrice : Number(limitPrice) || 0;
  const qtyNum = Math.max(0, Math.floor(Number(quantity) || 0));
  const grossValue = qtyNum * effectivePrice;
  const statutoryCharges = Number((grossValue * 0.0011).toFixed(2));
  const netTotal =
    side === "BUY"
      ? grossValue + statutoryCharges
      : Math.max(0, grossValue - statutoryCharges);

  const holding = wallet.holdings.find((h) => h.symbol === stock.symbol);

  const chartData = useMemo(
    () => generateChartSeries(stock, livePrice, timeframe),
    [stock, livePrice, timeframe],
  );

  // Simulated NSE Bid/Ask ladder
  const orderBook = useMemo(() => {
    const bids = [1, 2, 3, 4].map((step) => ({
      price: Number((livePrice - step * 0.65).toFixed(2)),
      qty: Math.round(120 + step * 85 + (livePrice % 40)),
    }));
    const asks = [1, 2, 3, 4].map((step) => ({
      price: Number((livePrice + step * 0.65).toFixed(2)),
      qty: Math.round(110 + step * 78 + (livePrice % 35)),
    }));
    return { bids, asks };
  }, [livePrice]);

  const handleStockChange = (sym) => {
    setSelectedSymbol(sym);
    const nextStock = stocks.find((s) => s.symbol === sym);
    const nextPrice = tickers[sym]?.price ?? nextStock?.basePrice ?? 0;
    setLimitPrice(nextPrice.toFixed(2));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const res = executeOrder({
      symbol: stock.symbol,
      side,
      orderType,
      productType,
      quantity: qtyNum,
      price: effectivePrice,
    });
    setFeedback(res);
    setTimeout(() => setFeedback(null), 4500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Paper Execution Desk • NSE
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Buy &amp; Sell Terminal
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={stock.symbol}
            onChange={(e) => handleStockChange(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-2 text-xs font-semibold text-white outline-none focus:border-white"
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol}>
                {s.symbol} — {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onSelectStock(stock.symbol)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
          >
            View Stock Details
          </button>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Chart + Market Depth */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {stock.symbol}
                  </h2>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                    {stock.exchange}
                  </span>
                </div>
                <div className="font-mono-num mt-1 flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-white">
                    {formatINR(livePrice)}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isUp ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {changePct.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-[#060606] p-1">
                {["1D", "1W", "1M"].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium ${
                      timeframe === tf
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tradeChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
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
                    formatter={(val) => [formatINR(val), stock.symbol]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#ffffff"
                    strokeWidth={2}
                    fill="url(#tradeChartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Depth */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
              Simulated Market Depth (NSE Level 1)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <span>Bid Price</span>
                  <span>Qty</span>
                </div>
                <div className="space-y-1.5">
                  {orderBook.bids.map((b, i) => (
                    <div
                      key={i}
                      className="font-mono-num flex justify-between rounded-lg bg-emerald-500/5 px-3 py-1.5 text-xs"
                    >
                      <span className="text-emerald-400">
                        {formatINR(b.price)}
                      </span>
                      <span className="text-zinc-300">{b.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  <span>Ask Price</span>
                  <span>Qty</span>
                </div>
                <div className="space-y-1.5">
                  {orderBook.asks.map((a, i) => (
                    <div
                      key={i}
                      className="font-mono-num flex justify-between rounded-lg bg-red-500/5 px-3 py-1.5 text-xs"
                    >
                      <span className="text-red-400">{formatINR(a.price)}</span>
                      <span className="text-zinc-300">{a.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Buy & Sell Order Ticket */}
        <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-5 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FiSliders className="h-4 w-4" />
              Order Ticket
            </div>
            <span className="font-mono-num text-[11px] text-zinc-400">
              Cash: {formatINR(wallet.cash, 0)}
            </span>
          </div>

          {/* Buy / Sell Buttons */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-[#060606] p-1">
            <button
              type="button"
              onClick={() => setSide("BUY")}
              className={`rounded-lg py-2.5 text-xs font-bold tracking-wider transition-all ${
                side === "BUY"
                  ? "bg-white text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide("SELL")}
              className={`rounded-lg py-2.5 text-xs font-bold tracking-wider transition-all ${
                side === "SELL"
                  ? "bg-zinc-200 text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SELL
            </button>
          </div>

          <form onSubmit={handleSubmitOrder} className="mt-5 space-y-4">
            {/* Order Type & Product Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] text-zinc-400">
                  Order Type
                </label>
                <div className="grid grid-cols-2 rounded-lg border border-zinc-800 bg-[#060606] p-0.5 text-[11px]">
                  {["MARKET", "LIMIT"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setOrderType(type);
                        if (type === "LIMIT") {
                          setLimitPrice(livePrice.toFixed(2));
                        }
                      }}
                      className={`rounded-md py-1.5 font-medium ${
                        orderType === type
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] text-zinc-400">
                  Product
                </label>
                <div className="grid grid-cols-2 rounded-lg border border-zinc-800 bg-[#060606] p-0.5 text-[11px]">
                  {[
                    { id: "CNC", label: "Delivery" },
                    { id: "MIS", label: "Intraday" },
                  ].map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setProductType(prod.id)}
                      className={`rounded-md py-1.5 font-medium ${
                        productType === prod.id
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {prod.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <div className="mb-1.5 flex justify-between text-[11px]">
                <label htmlFor="order-qty" className="text-zinc-400">
                  Quantity (Shares)
                </label>
                <span className="text-zinc-500">
                  Held: {holding?.quantity || 0}
                </span>
              </div>
              <input
                id="order-qty"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="font-mono-num w-full rounded-xl border border-zinc-800 bg-[#060606] px-3.5 py-2.5 text-sm text-white outline-none focus:border-white"
              />
              <div className="mt-2 flex gap-1.5">
                {[1, 5, 10, 25, 50].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(String(q))}
                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 py-1 text-[11px] text-zinc-400 hover:border-zinc-600 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Price Input */}
            <div>
              <div className="mb-1.5 flex justify-between text-[11px]">
                <label htmlFor="order-price" className="text-zinc-400">
                  Stock Price (₹)
                </label>
                <span className="text-zinc-500">
                  {orderType === "MARKET" ? "Live NSE LTP" : "Limit Price"}
                </span>
              </div>
              <input
                id="order-price"
                type="number"
                step="0.05"
                min="0.05"
                disabled={orderType === "MARKET"}
                value={
                  orderType === "MARKET" ? livePrice.toFixed(2) : limitPrice
                }
                onChange={(e) => setLimitPrice(e.target.value)}
                className="font-mono-num w-full rounded-xl border border-zinc-800 bg-[#060606] px-3.5 py-2.5 text-sm text-white outline-none focus:border-white disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {/* Order Summary */}
            <div className="space-y-2 rounded-xl border border-zinc-800/90 bg-[#070707] p-4 text-xs">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Order Summary
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>
                  {qtyNum} × {formatINR(effectivePrice)}
                </span>
                <span className="font-mono-num text-white">
                  {formatINR(grossValue)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Brokerage (Paper)</span>
                <span className="font-mono-num text-emerald-400">₹0.00</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>STT &amp; Exchange Txn (0.11%)</span>
                <span className="font-mono-num text-zinc-300">
                  {formatINR(statutoryCharges)}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 font-semibold text-white">
                <span>{side === "BUY" ? "Total Payable" : "Est. Proceeds"}</span>
                <span className="font-mono-num">{formatINR(netTotal)}</span>
              </div>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${
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
              className="w-full rounded-xl bg-white py-3 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200"
            >
              Place {side} Order ({stock.symbol})
            </button>
          </form>
        </div>
      </div>

      {/* Recent Transaction History */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FiClock className="h-4 w-4" />
            Recent Transaction History
          </div>
          <span className="text-[11px] text-zinc-500">
            Showing latest {Math.min(6, wallet.transactions.length)} simulated orders
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Side</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Exec. Price</th>
                <th className="px-4 py-3 text-right">Total (₹)</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {wallet.transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-900/40">
                  <td className="font-mono-num px-4 py-3 text-zinc-400">
                    {tx.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {tx.symbol}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        tx.side === "BUY"
                          ? "bg-white text-black"
                          : tx.side === "SELL"
                            ? "border border-zinc-700 bg-zinc-900 text-zinc-200"
                            : "border border-zinc-700 text-zinc-300"
                      }`}
                    >
                      {tx.side}
                    </span>
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right text-zinc-300">
                    {tx.quantity}
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right text-zinc-300">
                    {formatINR(tx.price)}
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right font-semibold text-white">
                    {formatINR(tx.total)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Trade;
