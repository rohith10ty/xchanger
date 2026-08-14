import { useMemo, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiEye,
  FiEyeOff,
  FiPlus,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, useExchange } from "./exchangeStore";
import "./Portfolio.css";

function Portfolio() {
  const {
    holdings,
    wallet,
    totalBalance,
    totalPnl,
    unrealizedPnl,
    realizedPnl,
    addFunds,
    currency,
    formatMoney,
  } = useExchange();
  const [hideBalance, setHideBalance] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleHoldings = showAll ? holdings : holdings.slice(0, 4);
  const costBasis = holdings.reduce(
    (sum, asset) => sum + asset.amount * asset.averageCost,
    0,
  );
  const totalPnlPercent = costBasis ? (totalPnl / costBasis) * 100 : 0;
  const todayPnl = holdings.reduce((sum, asset) => {
    const previousPrice = asset.change
      ? asset.price / (1 + asset.change / 100)
      : asset.price;
    return sum + (asset.price - previousPrice) * asset.amount;
  }, 0);
  const todayPositive = todayPnl >= 0;
  const pnlPositive = totalPnl >= 0;
  const bestPerformer = holdings.reduce(
    (best, asset) =>
      !best || asset.profitLossPercent > best.profitLossPercent ? asset : best,
    null,
  );

  const balanceTrend = useMemo(() => {
    const movement = todayPnl || totalBalance * 0.008;
    const variation = [0.002, -0.001, 0.0015, -0.0005, 0.001, -0.0015, 0];
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return {
        label: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        value:
          totalBalance -
          movement * ((6 - index) / 6) +
          totalBalance * variation[index],
      };
    });
  }, [todayPnl, totalBalance]);

  const growthTrend = useMemo(() => {
    const startValue = Math.max(totalBalance - totalPnl, totalBalance * 0.2);
    const variation = [
      0, 0.015, -0.008, 0.011, -0.004, 0.009, -0.012, 0.006, -0.004, 0.008,
      -0.003, 0,
    ];
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index));
      const progress = index / 11;
      return {
        label: date.toLocaleDateString(undefined, { month: "short" }),
        value:
          startValue +
          (totalBalance - startValue) * progress +
          totalBalance * variation[index],
      };
    });
  }, [totalBalance, totalPnl]);

  const hidden = "********";

  return (
    <main className="portfolio-page">
      <section className="portfolio-header">
        <div>
          <div className="dashboard-eyebrow">
            <span></span>YOUR ASSETS
          </div>
          <h1>Portfolio</h1>
          <p>
            Monitor your live holdings, paper balance and overall portfolio
            performance across Quantum.
          </p>
        </div>
        <button
          className="primary-action portfolio-deposit-button"
          onClick={addFunds}
        >
          <FiPlus />
          Add {formatMoney(1000)} Paper Cash
        </button>
      </section>

      <section className="portfolio-summary-grid">
        <article className="portfolio-main-balance">
          <div className="portfolio-balance-top">
            <span>Total Portfolio Balance</span>
            <button
              className="balance-visibility-button"
              onClick={() => setHideBalance((value) => !value)}
              aria-label="Toggle balance visibility"
            >
              {hideBalance ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <h2>{hideBalance ? hidden : formatMoney(totalBalance)}</h2>
          <div className="portfolio-main-meta">
            <div>
              <span>Today</span>
              <strong className={todayPositive ? "positive" : "negative"}>
                {todayPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {todayPositive ? "+" : ""}
                {formatMoney(todayPnl)}
              </strong>
            </div>
            <div>
              <span>All-time Return</span>
              <strong className={pnlPositive ? "positive" : "negative"}>
                {pnlPositive ? "+" : ""}
                {totalPnlPercent.toFixed(2)}%
              </strong>
            </div>
          </div>
          <div className="portfolio-balance-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={balanceTrend}
                margin={{ top: 8, right: 5, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#202020"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 9 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#555", fontSize: 8 }}
                  tickFormatter={(value) => formatMoney(value)}
                />
                <Tooltip
                  content={<PortfolioChartTooltip formatMoney={formatMoney} />}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#balanceArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="portfolio-stat-card">
          <span>Available Balance</span>
          <strong>{hideBalance ? hidden : formatMoney(wallet.cash)}</strong>
          <small>Ready for paper trades in {currency}</small>
        </article>
        <article className="portfolio-stat-card">
          <span>Total Profit / Loss</span>
          <strong className={pnlPositive ? "positive" : "negative"}>
            {hideBalance
              ? hidden
              : `${pnlPositive ? "+" : ""}${formatMoney(totalPnl)}`}
          </strong>
          <small className={pnlPositive ? "positive" : "negative"}>
            {totalPnlPercent.toFixed(2)}% all time
          </small>
        </article>
      </section>

      <section className="portfolio-middle-grid">
        <article className="allocation-card">
          <div className="portfolio-card-header">
            <div>
              <span className="section-kicker">DISTRIBUTION</span>
              <h2>Asset Allocation</h2>
            </div>
            <span>Portfolio %</span>
          </div>
          <div className="allocation-content">
            <div className="allocation-donut">
              <div className="allocation-donut-inner">
                <span>Total</span>
                <strong>
                  {hideBalance
                    ? hidden
                    : formatMoney(
                        holdings.reduce((sum, item) => sum + item.value, 0),
                      )}
                </strong>
              </div>
            </div>
            <div className="allocation-list">
              {holdings.map((asset) => (
                <div className="allocation-item" key={asset.symbol}>
                  <div className="allocation-item-name">
                    <span className="allocation-dot"></span>
                    <div>
                      <strong>{asset.symbol}</strong>
                      <span>{asset.name}</span>
                    </div>
                  </div>
                  <strong>{asset.allocation.toFixed(1)}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="portfolio-performance-card">
          <div className="portfolio-card-header">
            <div>
              <span className="section-kicker">PERFORMANCE</span>
              <h2>Portfolio Growth</h2>
            </div>
            <span>Paper account</span>
          </div>
          <div className="performance-value">
            <span>Net Performance</span>
            <strong className={pnlPositive ? "positive" : "negative"}>
              {pnlPositive ? "+" : ""}
              {totalPnlPercent.toFixed(2)}%
            </strong>
          </div>
          <div className="performance-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={growthTrend}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="growthArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#202020"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666", fontSize: 9 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  axisLine={false}
                  tickLine={false}
                  width={82}
                  tick={{ fill: "#555", fontSize: 8 }}
                  tickFormatter={(value) => formatMoney(value)}
                />
                <Tooltip
                  content={<PortfolioChartTooltip formatMoney={formatMoney} />}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#growthArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="performance-bottom">
            <div>
              <span>Best Performer</span>
              <strong>{bestPerformer?.symbol || "--"}</strong>
            </div>
            <div>
              <span>Return</span>
              <strong
                className={
                  (bestPerformer?.profitLossPercent || 0) >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {bestPerformer
                  ? `${bestPerformer.profitLossPercent >= 0 ? "+" : ""}${bestPerformer.profitLossPercent.toFixed(2)}%`
                  : "--"}
              </strong>
            </div>
          </div>
          <div className="performance-bottom">
            <div>
              <span>Unrealized P/L</span>
              <strong>{formatMoney(unrealizedPnl)}</strong>
            </div>
            <div>
              <span>Realized P/L</span>
              <strong>{formatMoney(realizedPnl)}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="holdings-card">
        <div className="portfolio-card-header holdings-header">
          <div>
            <span className="section-kicker">ASSETS</span>
            <h2>Your Holdings</h2>
          </div>
          <button
            className="text-action"
            onClick={() => setShowAll((value) => !value)}
          >
            {showAll ? "Show less" : "View all holdings"}
            <FiArrowUpRight />
          </button>
        </div>
        <div className="holdings-table-wrapper">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Holdings</th>
                <th>Live Price</th>
                <th>Value</th>
                <th>24H</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {visibleHoldings.map((asset) => {
                const positive = asset.change >= 0;
                return (
                  <tr key={asset.symbol}>
                    <td data-label="Asset">
                      <div className="holding-asset">
                        <div className="market-coin-icon">{asset.icon}</div>
                        <div>
                          <strong>{asset.name}</strong>
                          <span>{asset.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Coin Holdings">
                      {hideBalance
                        ? hidden
                        : `${formatNumber(asset.amount)} ${asset.symbol}`}
                    </td>
                    <td data-label="Live Price">{formatMoney(asset.price)}</td>
                    <td data-label="Holding Value" className="holding-value">
                      {hideBalance ? hidden : formatMoney(asset.value)}
                    </td>
                    <td data-label="24H Change">
                      <div
                        className={
                          positive
                            ? "holding-change positive"
                            : "holding-change negative"
                        }
                      >
                        {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                        {positive ? "+" : ""}
                        {asset.change.toFixed(2)}%
                      </div>
                    </td>
                    <td data-label="Portfolio Allocation">
                      <div className="allocation-progress">
                        <div>
                          <span
                            style={{ width: `${asset.allocation}%` }}
                          ></span>
                        </div>
                        <strong>{asset.allocation.toFixed(1)}%</strong>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function PortfolioChartTooltip({ active, payload, label, formatMoney }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="portfolio-chart-tooltip">
      <span>{label}</span>
      <strong>{formatMoney(payload[0].value)}</strong>
    </div>
  );
}

export default Portfolio;
