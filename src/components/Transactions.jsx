import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { formatINR, useExchange } from "./exchangeStore";

function Transactions() {
  const { wallet } = useExchange();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return wallet.transactions.filter((tx) => {
      if (filter !== "ALL" && tx.side !== filter) return false;
      if (
        q &&
        !tx.symbol.toLowerCase().includes(q) &&
        !tx.name.toLowerCase().includes(q) &&
        !tx.id.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [filter, search, wallet.transactions]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Order Book &amp; Audit Ledger
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Transaction History
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-xl border border-zinc-800 bg-[#0a0a0a] p-1">
          {["ALL", "BUY", "SELL", "IPO"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === tab
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2">
          <FiSearch className="mr-2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Stock..."
            className="w-56 bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0b0b0b]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#080808] text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Date &amp; Time</th>
                <th className="px-4 py-3.5">Stock / IPO</th>
                <th className="px-4 py-3.5">Side</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5 text-right">Qty</th>
                <th className="px-4 py-3.5 text-right">Price</th>
                <th className="px-4 py-3.5 text-right">Charges</th>
                <th className="px-4 py-3.5 text-right">Net Total</th>
                <th className="px-4 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-zinc-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/40">
                    <td className="font-mono-num px-4 py-3.5 text-zinc-400">
                      {tx.id}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {new Date(tx.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{tx.symbol}</div>
                      <div className="text-[11px] text-zinc-500">{tx.name}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          tx.side === "BUY"
                            ? "bg-white text-black"
                            : "border border-zinc-700 bg-zinc-900 text-zinc-200"
                        }`}
                      >
                        {tx.side}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-zinc-400">
                      {tx.orderType} • {tx.productType}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right text-zinc-300">
                      {tx.quantity}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right text-zinc-300">
                      {formatINR(tx.price)}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right text-zinc-400">
                      {formatINR(tx.charges)}
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right font-semibold text-white">
                      {formatINR(tx.total)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-emerald-400">
                      {tx.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
