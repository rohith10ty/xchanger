import { useEffect, useState } from "react";
import {
  FiActivity,
  FiArrowDownRight,
  FiArrowUpRight,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { COINS, REST_API, useExchange } from "./exchangeStore";
import "./Home.css";

const leaderTrendOptions = {
  "1D": { label: "1 Day", interval: "1h", limit: 24 },
  "1M": { label: "1 Month", interval: "1d", limit: 30 },
  "1Y": { label: "1 Year", interval: "1w", limit: 52 },
  ALL: { label: "Overall", interval: "1M", limit: 1000 },
};

function Home({ onNavigate }) {
  const {
    coins,
    sparklines,
    marketStatus,
    lastUpdated,
    currency,
    setCurrency,
    formatMoney,
  } = useExchange();
  const [leaderTrend, setLeaderTrend] = useState("1M");
  const [leaderHistory, setLeaderHistory] = useState({});
  const [trendLoading, setTrendLoading] = useState(false);
  const featuredCoins = coins.slice(0, 4);
  const tickerCoins = [...coins, ...coins];
  const totalVolume = coins.reduce((sum, coin) => sum + (coin.volume || 0), 0);

  useEffect(() => {
    const controller = new AbortController();
    const config = leaderTrendOptions[leaderTrend];
    let active = true;

    const loadLeaderHistory = async () => {
      setTrendLoading(true);
      try {
        const entries = await Promise.all(
          COINS.slice(0, 4).map(async (coin) => {
            const response = await fetch(
              `${REST_API}/klines?symbol=${coin.pair}&interval=${config.interval}&limit=${config.limit}`,
              { signal: controller.signal },
            );
            if (!response.ok) throw new Error("Trend request failed");
            const rows = await response.json();
            return [coin.symbol, rows.map((row) => Number(row[4]))];
          }),
        );
        if (active) setLeaderHistory(Object.fromEntries(entries));
      } catch (error) {
        if (error.name !== "AbortError" && active) setLeaderHistory({});
      } finally {
        if (active) setTrendLoading(false);
      }
    };

    loadLeaderHistory();
    const refreshTimer = window.setInterval(loadLeaderHistory, 5 * 60 * 1000);
    return () => {
      active = false;
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, [leaderTrend]);

  return (
    <main className="quantum-home">
      <section className="quantum-hero">
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="home-placeholder-badge">
            <span></span>
            LIVE MARKET DATA
          </div>

          <h1>
            The future of
            <br />
            <span>digital trading.</span>
          </h1>

          <p>
            Follow live cryptocurrency prices and practise trading through a
            persistent paper portfolio powered by current market data.
          </p>

          <div className="hero-actions">
            <button
              className="primary-action hero-primary"
              onClick={() => onNavigate("markets")}
            >
              Explore Markets <FiArrowUpRight />
            </button>
            <button
              className="secondary-action hero-secondary"
              onClick={() => onNavigate("trade")}
            >
              Start Paper Trading
            </button>
            <label className="currency-selector">
              <span>Currency</span>
              <select
                aria-label="Display currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="hero-stats">
          <div>
            <span>Tracked 24H Volume</span>
            <strong>{formatMoney(totalVolume)}</strong>
          </div>
          <div>
            <span>Live Assets</span>
            <strong>{coins.length}</strong>
          </div>
          <div>
            <span>Display Currency</span>
            <strong>{currency}</strong>
          </div>
          <div>
            <span>Market Feed</span>
            <strong
              className={marketStatus === "live" ? "status-positive" : ""}
            >
              {marketStatus === "live"
                ? "Live"
                : marketStatus === "loading"
                  ? "Connecting"
                  : "Delayed"}
            </strong>
            {lastUpdated && (
              <small className="live-updated">
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </small>
            )}
          </div>
        </div>
      </section>

      <section className="market-ticker">
        <div className="ticker-track">
          {tickerCoins.map((coin, index) => (
            <div
              className="ticker-item"
              key={`${coin.symbol}-${index}`}
              aria-hidden={index >= coins.length ? "true" : undefined}
            >
              <span className="ticker-symbol">{coin.symbol}</span>
              <span className="ticker-price">{formatMoney(coin.price)}</span>
              <span
                className={
                  coin.change >= 0
                    ? "ticker-change positive"
                    : "ticker-change negative"
                }
              >
                {coin.change >= 0 ? "+" : ""}
                {coin.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span className="section-kicker">LIVE MARKETS</span>
            <h2>Market leaders</h2>
            <p>
              Prices, 24-hour movement and mini charts update from the live
              feed.
            </p>
          </div>
          <div className="market-leader-actions">
            <label className="leader-trend-selector">
              <span>Chart period</span>
              <select
                aria-label="Market leader chart period"
                value={leaderTrend}
                onChange={(event) => setLeaderTrend(event.target.value)}
              >
                {Object.entries(leaderTrendOptions).map(([value, option]) => (
                  <option key={value} value={value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="text-action"
              onClick={() => onNavigate("markets")}
            >
              View all markets <FiArrowUpRight />
            </button>
          </div>
        </div>

        <div className="featured-market-grid">
          {featuredCoins.map((coin) => {
            const positive = coin.change >= 0;
            const chartValues =
              leaderHistory[coin.symbol] || sparklines[coin.symbol] || [];
            const chartData = [...chartValues, coin.price].map(
              (price, index) => ({ point: index, price }),
            );
            const trendLow = Math.min(...chartData.map((point) => point.price));
            return (
              <article className="featured-market-card" key={coin.symbol}>
                <div className="featured-card-top">
                  <div className="featured-coin">
                    <div className="featured-coin-icon">{coin.icon}</div>
                    <div>
                      <h3>{coin.name}</h3>
                      <span>
                        {coin.symbol} / {currency}
                      </span>
                    </div>
                  </div>
                  <div
                    className={
                      positive
                        ? "featured-change positive"
                        : "featured-change negative"
                    }
                  >
                    {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {positive ? "+" : ""}
                    {coin.change.toFixed(2)}%
                  </div>
                </div>
                <div className="featured-price">{formatMoney(coin.price)}</div>
                <div className="mini-chart live-mini-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 4, right: 2, left: 2, bottom: 2 }}
                    >
                      <defs>
                        <linearGradient
                          id={`leader-${coin.symbol}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#d4af37"
                            stopOpacity={0.38}
                          />
                          <stop
                            offset="100%"
                            stopColor="#d4af37"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        content={<LeaderTooltip formatMoney={formatMoney} />}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#d4af37"
                        strokeWidth={2}
                        fill={`url(#leader-${coin.symbol})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="leader-chart-meta">
                  <span>
                    {trendLoading
                      ? "UPDATING"
                      : `LIVE ${leaderTrendOptions[leaderTrend].label.toUpperCase()} TREND`}
                  </span>
                  <span>
                    Low{" "}
                    {formatMoney(
                      Number.isFinite(trendLow) ? trendLow : coin.low,
                    )}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-section quantum-benefits-section">
        <div className="home-section-heading">
          <div>
            <span className="section-kicker">QUANTUM PLATFORM</span>
            <h2>Built for modern trading</h2>
            <p>Live information with a safe paper-trading wallet.</p>
          </div>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <FiTrendingUp />
            </div>
            <h3>Live Market Intelligence</h3>
            <p>
              Track live price, volume, daily low and market movement across
              supported assets.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <FiActivity />
            </div>
            <h3>Paper Execution</h3>
            <p>
              Practise buys and sells at current prices without moving real
              money.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <FiShield />
            </div>
            <h3>Portfolio Control</h3>
            <p>
              Holdings, cash, profit and loss update after every completed paper
              trade.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LeaderTooltip({ active, payload, formatMoney }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="leader-tooltip">
      <strong>{formatMoney(payload[0].value)}</strong>
    </div>
  );
}

export default Home;
