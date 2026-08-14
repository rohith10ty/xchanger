import { useMemo, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { formatNumber, useExchange } from "./exchangeStore";
import "./Transactions.css";

function Transactions() {
  const { wallet, tickers, totalPnl, formatMoney } = useExchange();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const transactions = wallet.transactions;
  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const query = search.toLowerCase();
        const matchesSearch =
          transaction.id.toLowerCase().includes(query) ||
          transaction.crypto.toLowerCase().includes(query) ||
          transaction.symbol.toLowerCase().includes(query);
        return (
          matchesSearch && (filter === "All" || transaction.type === filter)
        );
      }),
    [filter, search, transactions],
  );

  const totalBought = transactions
    .filter((item) => item.type === "Buy")
    .reduce((sum, item) => sum + item.total, 0);
  const totalSold = transactions
    .filter((item) => item.type === "Sell")
    .reduce((sum, item) => sum + item.total, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonth = transactions.filter((item) => {
    const date = new Date(item.timestamp);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const getTransactionPnl = (transaction) => {
    if (transaction.type === "Sell") return transaction.realizedPnl || 0;
    const livePrice = tickers[transaction.symbol]?.price || transaction.price;
    return (
      (livePrice - transaction.price) * transaction.amount - transaction.fee
    );
  };

  return (
    <main className="transactions-page">
      <section className="transactions-header">
        <div>
          <div className="dashboard-eyebrow">
            <span></span>ACCOUNT ACTIVITY
          </div>
          <h1>Transactions</h1>
          <p>
            Review your paper trades, execution prices and live profit or loss.
          </p>
        </div>
        <div className="transactions-summary">
          <div>
            <span>Total Transactions</span>
            <strong>{transactions.length}</strong>
          </div>
          <div>
            <span>This Month</span>
            <strong>{thisMonth}</strong>
          </div>
        </div>
      </section>

      <section className="transaction-stats-grid">
        <article className="transaction-stat-card">
          <span>Total Bought</span>
          <strong>{formatMoney(totalBought)}</strong>
          <small>
            {transactions.filter((item) => item.type === "Buy").length}{" "}
            completed buys
          </small>
        </article>
        <article className="transaction-stat-card">
          <span>Total Sold</span>
          <strong>{formatMoney(totalSold)}</strong>
          <small>
            {transactions.filter((item) => item.type === "Sell").length}{" "}
            completed sells
          </small>
        </article>
        <article className="transaction-stat-card">
          <span>Net Profit / Loss</span>
          <strong className={totalPnl >= 0 ? "positive" : "negative"}>
            {totalPnl >= 0 ? "+" : ""}
            {formatMoney(totalPnl)}
          </strong>
          <small>Realized and unrealized</small>
        </article>
        <article className="transaction-stat-card">
          <span>Completed Orders</span>
          <strong>{transactions.length}</strong>
          <small className="positive">100% paper execution</small>
        </article>
      </section>

      <section className="transactions-table-card">
        <div className="transactions-toolbar">
          <div>
            <span className="section-kicker">HISTORY</span>
            <h2>Recent Transactions</h2>
          </div>
          <div className="transactions-tools">
            <div className="transactions-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search transaction..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="transaction-filter">
              <FiFilter />
              {["All", "Buy", "Sell"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Cryptocurrency</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Profit / Loss</th>
                <th>Status</th>
                <th>Date / Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const pnl = getTransactionPnl(transaction);
                const date = new Date(transaction.timestamp);
                return (
                  <tr key={transaction.id}>
                    <td data-label="Transaction ID" className="transaction-id">
                      {transaction.id}
                    </td>
                    <td data-label="Cryptocurrency">
                      <div className="transaction-asset">
                        <div className="market-coin-icon">
                          {transaction.icon}
                        </div>
                        <div>
                          <strong>{transaction.crypto}</strong>
                          <span>{transaction.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Order Type">
                      <div
                        className={
                          transaction.type === "Buy"
                            ? "transaction-type buy"
                            : "transaction-type sell"
                        }
                      >
                        {transaction.type === "Buy" ? (
                          <FiArrowDownRight />
                        ) : (
                          <FiArrowUpRight />
                        )}
                        {transaction.type}
                      </div>
                    </td>
                    <td data-label="Coin Amount">
                      {formatNumber(transaction.amount)} {transaction.symbol}
                    </td>
                    <td
                      data-label="Execution Price"
                      className="transaction-price"
                    >
                      {formatMoney(transaction.price)}
                    </td>
                    <td
                      data-label="Profit / Loss"
                      className={
                        pnl >= 0
                          ? "transaction-pnl positive"
                          : "transaction-pnl negative"
                      }
                    >
                      {pnl >= 0 ? "+" : ""}
                      {formatMoney(pnl)}
                    </td>
                    <td data-label="Status">
                      <span className="transaction-status completed">
                        <span></span>
                        {transaction.status}
                      </span>
                    </td>
                    <td data-label="Date / Time">
                      <div className="transaction-date">
                        <strong>{date.toLocaleDateString()}</strong>
                        <span>
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="transactions-empty">
            <span className="gold-symbol">Q</span>
            <h3>
              {transactions.length
                ? "No transactions found"
                : "No paper trades yet"}
            </h3>
            <p>
              {transactions.length
                ? "Try changing your search or transaction filter."
                : "Buy or sell a coin from the Trade page and it will appear here."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Transactions;
