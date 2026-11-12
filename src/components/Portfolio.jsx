import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiRefreshCw } from "react-icons/fi";
import {
  formatCompactINR,
  formatINR,
  useExchange,
} from "./exchangeStore";

function Portfolio({ onSelectStock, onTradeStock }) {
  const { portfolioSummary, wallet, resetWallet } = useExchange();

  const sectorData = useMemo(() => {
    const map = {};
    portfolioSummary.detailedHoldings.forEach((h) => {
      map[h.sector] = (map[h.sector] || 0) + h.currentValue;
    });
    return Object.entries(map).map(([sector, value]) => ({
      sector,
      value: Math.round(value),
    }));
  }, [portfolioSummary.detailedHoldings]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            Paper Demat &amp; Holdings
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Portfolio &amp; Allocation
          </h1>
        </div>
        <button
          type="button"
          onClick={resetWallet}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0b0b0b] px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
        >
          <FiRefreshCw className="h-3.5 w-3.5" />
          Reset Paper Account
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Total Account Value
          </div>
          <div className="font-mono-num mt-2 text-2xl font-bold text-white">
            {formatINR(portfolioSummary.totalAccountValue)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Cash + Equity Holdings
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Invested Capital
          </div>
          <div className="font-mono-num mt-2 text-2xl font-bold text-white">
            {formatINR(portfolioSummary.investedValue)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Current: {formatCompactINR(portfolioSummary.currentHoldingsValue)}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Overall P&amp;L
          </div>
          <div
            className={`font-mono-num mt-2 text-2xl font-bold ${
              portfolioSummary.totalPnL >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {portfolioSummary.totalPnL >= 0 ? "+" : ""}
            {formatINR(portfolioSummary.totalPnL)}
          </div>
          <div
            className={`font-mono-num mt-1 text-xs font-medium ${
              portfolioSummary.totalPnLPct >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {portfolioSummary.totalPnLPct >= 0 ? "+" : ""}
            {portfolioSummary.totalPnLPct.toFixed(2)}%
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0b0b0b] p-5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">
            Available INR Cash
          </div>
          <div className="font-mono-num mt-2 text-2xl font-bold text-white">
            {formatINR(portfolioSummary.cash)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Ready for NSE Equities &amp; IPOs
          </div>
        </div>
      </div>

      {/* Sector Exposure Chart */}
      <div className="rounded-2xl border border-zinc-800/90 bg-[#0b0b0b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              Sector Allocation (₹)
            </h2>
            <p className="text-[11px] text-zinc-500">
              Distribution of active equity holdings across NSE sectors
            </p>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData}>
              <XAxis
                dataKey="sector"
                stroke="#52525b"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#fff",
                }}
                formatter={(val) => [formatINR(val), "Allocation"]}
              />
              <Bar dataKey="value" fill="#ffffff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-bold text-white">
            Equity Holdings ({portfolioSummary.detailedHoldings.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Avg Buy Price</th>
                <th className="px-4 py-3 text-right">Live LTP</th>
                <th className="px-4 py-3 text-right">Current Value</th>
                <th className="px-4 py-3 text-right">P&amp;L</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {portfolioSummary.detailedHoldings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No holdings yet. Visit Markets or Trade to buy Indian stocks.
                  </td>
                </tr>
              ) : (
                portfolioSummary.detailedHoldings.map((h) => (
                  <tr key={h.symbol} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => onSelectStock(h.symbol)}
                        className="text-left hover:underline"
                      >
                        <div className="font-bold text-white">{h.symbol}</div>
                        <div className="text-[11px] text-zinc-500">
                          {h.name}
                        </div>
                      </button>
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right text-zinc-300">
                      {h.quantity}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right text-zinc-400">
                      {formatINR(h.averageCost)}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right font-semibold text-white">
                      {formatINR(h.currentPrice)}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right font-semibold text-white">
                      {formatINR(h.currentValue)}
                    </td>
                    <td
                      className={`font-mono-num px-4 py-3.5 text-right font-semibold ${
                        h.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {h.pnl >= 0 ? "+" : ""}
                      {formatINR(h.pnl)} ({h.pnlPct.toFixed(2)}%)
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectStock(h.symbol)}
                          className="rounded-lg border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 hover:border-white hover:text-white"
                        >
                          Chart
                        </button>
                        <button
                          type="button"
                          onClick={() => onTradeStock(h.symbol)}
                          className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-zinc-200"
                        >
                          Buy / Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* IPO Applications */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h2 className="text-sm font-bold text-white">
            IPO Applications (ASBA)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Application ID</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3 text-right">Lots / Shares</th>
                <th className="px-4 py-3 text-right">Bid Price</th>
                <th className="px-4 py-3 text-right">Blocked Amount</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {wallet.ipoApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-900/40">
                  <td className="font-mono-num px-4 py-3 text-zinc-400">
                    {app.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {app.company}
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right text-zinc-300">
                    {app.lots} Lot ({app.shares})
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right text-zinc-300">
                    {formatINR(app.bidPrice)}
                  </td>
                  <td className="font-mono-num px-4 py-3 text-right font-semibold text-white">
                    {formatINR(app.amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400">
                    {app.status}
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

export default Portfolio;
