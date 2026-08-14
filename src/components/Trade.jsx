import { useEffect, useMemo, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, REST_API, useExchange } from "./exchangeStore";
import "./Trade.css";

const periodConfig = {
  "1H": { interval: "5m", limit: 12 },
  "1D": { interval: "1h", limit: 24 },
  "1W": { interval: "4h", limit: 42 },
  "1M": { interval: "1d", limit: 30 },
};

function chartLabel(timestamp, period) {
  const date = new Date(timestamp);
  if (period === "1M")
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  if (period === "1W")
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      hour: "2-digit",
    });
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Trade() {
  const {
    coins,
    selectedSymbol,
    setSelectedSymbol,
    tickers,
    wallet,
    holdings,
    executeTrade,
    marketStatus,
    currency,
    convertUsd,
    convertToUsd,
    formatMoney,
  } = useExchange();
  const [period, setPeriod] = useState("1D");
  const [side, setSide] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [message, setMessage] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  const coin = coins.find((item) => item.symbol === selectedSymbol) || coins[0];
  const ticker = tickers[coin.symbol];
  const currentPriceUsd = ticker?.price || coin.fallback;
  const currentPrice = convertUsd(currentPriceUsd);
  const effectivePriceUsd =
    orderType === "market" ? currentPriceUsd : convertToUsd(limitPrice);
  const holding = holdings.find((item) => item.symbol === coin.symbol);

  const total = useMemo(() => {
    const quantity = Number(amount);
    return quantity > 0 && effectivePriceUsd > 0
      ? quantity * effectivePriceUsd
      : 0;
  }, [amount, effectivePriceUsd]);

  useEffect(() => {
    const controller = new AbortController();
    const config = periodConfig[period];

    const loadChart = async () => {
      try {
        const response = await fetch(
          `${REST_API}/klines?symbol=${coin.pair}&interval=${config.interval}&limit=${config.limit}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Chart request failed");
        const rows = await response.json();
        setChartData(
          rows.map((row) => ({
            time: chartLabel(row[0], period),
            price: convertUsd(Number(row[4])),
            high: convertUsd(Number(row[2])),
            low: convertUsd(Number(row[3])),
          })),
        );
      } catch (error) {
        if (error.name !== "AbortError")
          setChartData([{ time: "Live", price: convertUsd(coin.fallback) }]);
      }
    };

    loadChart();
    return () => controller.abort();
  }, [coin.fallback, coin.pair, convertUsd, period]);

  useEffect(() => {
    let active = true;
    const loadDepth = async () => {
      try {
        const response = await fetch(
          `${REST_API}/depth?symbol=${coin.pair}&limit=10`,
        );
        if (!response.ok) throw new Error("Depth request failed");
        const data = await response.json();
        if (active) {
          setOrderBook({
            asks: data.asks
              .slice(0, 5)
              .reverse()
              .map(([price, quantity]) => ({
                price: Number(price),
                amount: Number(quantity),
              })),
            bids: data.bids
              .slice(0, 5)
              .map(([price, quantity]) => ({
                price: Number(price),
                amount: Number(quantity),
              })),
          });
        }
      } catch {
        if (active) setOrderBook({ asks: [], bids: [] });
      }
    };

    loadDepth();
    const timer = window.setInterval(loadDepth, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [coin.pair]);

  const handleSubmit = () => {
    const result = executeTrade({
      side,
      symbol: coin.symbol,
      amount,
      orderType,
      limitPriceUsd: convertToUsd(limitPrice),
    });
    setMessage(result);
    if (result.ok) setAmount("");
  };

  const choosePercentage = (percentage) => {
    if (!effectivePriceUsd) return;
    const quantity =
      side === "buy"
        ? (wallet.cash * (percentage / 100)) / (effectivePriceUsd * 1.001)
        : (holding?.amount || 0) * (percentage / 100);
    setAmount(quantity > 0 ? quantity.toFixed(6) : "");
  };

  return (
    <main className="trade-page">
      <section className="trade-topbar">
        <div className="trade-pair">
          <div className="trade-pair-icon">{coin.icon}</div>
          <div>
            <div className="trade-pair-name">
              <select
                className="trade-coin-select"
                aria-label="Trading pair"
                value={coin.symbol}
                onChange={(event) => {
                  setSelectedSymbol(event.target.value);
                  setAmount("");
                  setMessage(null);
                }}
              >
                {coins.map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.symbol} / {currency}
                  </option>
                ))}
              </select>
            </div>
            <span>
              {coin.name} · {marketStatus === "live" ? "Live" : "Delayed"}
            </span>
          </div>
        </div>

        <div className="trade-market-stats">
          <div>
            <span>Price</span>
            <strong>{formatMoney(currentPriceUsd)}</strong>
          </div>
          <div>
            <span>24H Change</span>
            <strong className={ticker.change >= 0 ? "positive" : "negative"}>
              {ticker.change >= 0 ? "+" : ""}
              {ticker.change.toFixed(2)}%
            </strong>
          </div>
          <div>
            <span>24H Low</span>
            <strong>{formatMoney(ticker.low)}</strong>
          </div>
          <div>
            <span>24H Volume</span>
            <strong>{formatMoney(ticker.volume)}</strong>
          </div>
        </div>
      </section>

      <section className="trading-layout">
        <div className="trading-main-column">
          <section className="trade-chart-card">
            <div className="trade-chart-header">
              <div>
                <span className="section-kicker">
                  {coin.symbol} / {currency} · LIVE CANDLES
                </span>
                <div className="trade-current-price">
                  <h2>{formatMoney(currentPriceUsd)}</h2>
                  <div
                    className={
                      ticker.change >= 0
                        ? "trade-price-change positive"
                        : "trade-price-change negative"
                    }
                  >
                    {ticker.change >= 0 ? (
                      <FiArrowUpRight />
                    ) : (
                      <FiArrowDownRight />
                    )}
                    {ticker.change >= 0 ? "+" : ""}
                    {ticker.change.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="trade-periods">
                {Object.keys(periodConfig).map((item) => (
                  <button
                    key={item}
                    className={period === item ? "active" : ""}
                    onClick={() => setPeriod(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="trade-chart">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="quantumChartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#d4af37"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#d4af37"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#191919" vertical={false} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      minTickGap={28}
                      tick={{
                        fill: "#555",
                        fontSize: 10,
                        fontFamily: "Outfit",
                      }}
                    />
                    <YAxis
                      domain={["dataMin", "dataMax"]}
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      width={78}
                      tick={{
                        fill: "#555",
                        fontSize: 10,
                        fontFamily: "Outfit",
                      }}
                    />
                    <Tooltip
                      content={
                        <CustomTooltip
                          formatMoney={(value) =>
                            formatMoney(convertToUsd(value))
                          }
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#d4af37"
                      strokeWidth={2}
                      fill="url(#quantumChartGradient)"
                      activeDot={{ r: 4, fill: "#f0d471", stroke: "#8b6e18" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-loading">Loading live chart…</div>
              )}
            </div>
          </section>

          <OrderBook
            coin={coin}
            price={currentPriceUsd}
            orderBook={orderBook}
            currency={currency}
            formatMoney={formatMoney}
          />
        </div>

        <TradingPanel
          coin={coin}
          side={side}
          setSide={setSide}
          orderType={orderType}
          setOrderType={(type) => {
            setOrderType(type);
            if (type === "limit" && !limitPrice)
              setLimitPrice(String(currentPrice));
          }}
          amount={amount}
          setAmount={setAmount}
          currentPrice={currentPrice}
          limitPrice={limitPrice}
          setLimitPrice={setLimitPrice}
          total={total}
          message={message}
          handleSubmit={handleSubmit}
          choosePercentage={choosePercentage}
          cash={wallet.cash}
          heldAmount={holding?.amount || 0}
          currency={currency}
          formatMoney={formatMoney}
        />
      </section>
    </main>
  );
}

function TradingPanel({
  coin,
  side,
  setSide,
  orderType,
  setOrderType,
  amount,
  setAmount,
  currentPrice,
  limitPrice,
  setLimitPrice,
  total,
  message,
  handleSubmit,
  choosePercentage,
  cash,
  heldAmount,
  currency,
  formatMoney,
}) {
  return (
    <aside className="trading-panel">
      <div className="buy-sell-tabs">
        <button
          className={side === "buy" ? "buy active" : ""}
          onClick={() => setSide("buy")}
        >
          Buy
        </button>
        <button
          className={side === "sell" ? "sell active" : ""}
          onClick={() => setSide("sell")}
        >
          Sell
        </button>
      </div>
      <div className="trading-panel-content">
        <div className="paper-trading-label">PAPER TRADING · NO REAL FUNDS</div>
        <div className="trading-balance">
          <span>
            {side === "buy" ? "Available Balance" : `${coin.symbol} Available`}
          </span>
          <strong>
            {side === "buy"
              ? `${formatMoney(cash)} ${currency}`
              : `${formatNumber(heldAmount)} ${coin.symbol}`}
          </strong>
        </div>
        <div className="order-type-selector">
          <span>Order Type</span>
          <div>
            <button
              className={orderType === "market" ? "active" : ""}
              onClick={() => setOrderType("market")}
            >
              Market
            </button>
            <button
              className={orderType === "limit" ? "active" : ""}
              onClick={() => setOrderType("limit")}
            >
              Limit
            </button>
          </div>
        </div>
        <div className="trade-form-group">
          <label>Price</label>
          <div className="trade-input">
            <input
              type="number"
              value={orderType === "market" ? currentPrice : limitPrice}
              onChange={(event) => setLimitPrice(event.target.value)}
              disabled={orderType === "market"}
            />
            <span>{currency}</span>
          </div>
        </div>
        <div className="trade-form-group">
          <label>Amount</label>
          <div className="trade-input">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <span>{coin.symbol}</span>
          </div>
        </div>
        <div className="trade-percentage-buttons">
          {[25, 50, 75, 100].map((percentage) => (
            <button
              key={percentage}
              onClick={() => choosePercentage(percentage)}
            >
              {percentage}%
            </button>
          ))}
        </div>
        <div className="trade-total">
          <span>Total</span>
          <strong>
            {formatMoney(total)} {currency}
          </strong>
        </div>
        <button
          className={
            side === "buy"
              ? "trade-submit-button buy"
              : "trade-submit-button sell"
          }
          onClick={handleSubmit}
        >
          {side === "buy" ? `Buy ${coin.symbol}` : `Sell ${coin.symbol}`}
        </button>
        {message && (
          <div
            className={
              message.ok ? "trade-feedback success" : "trade-feedback error"
            }
          >
            {message.message}
          </div>
        )}
        <div className="trade-fee">
          <span>Paper fee</span>
          <strong>0.10%</strong>
        </div>
      </div>
    </aside>
  );
}

function OrderBook({ coin, price, orderBook, currency, formatMoney }) {
  return (
    <section className="order-book-card">
      <div className="order-book-header">
        <div>
          <span className="section-kicker">LIVE MARKET DEPTH</span>
          <h2>Order Book</h2>
          <p>
            Live buy and sell orders for {coin.name}, converted to {currency}.
          </p>
        </div>
        <strong>
          {coin.symbol} MARKET · {currency}
        </strong>
      </div>
      <div className="order-book-columns">
        <span>
          Price per {coin.symbol} ({currency})
        </span>
        <span>{coin.symbol} Quantity</span>
        <span>Order Value ({currency})</span>
      </div>
      <div className="order-list sell-orders">
        {orderBook.asks.map((order, index) => (
          <OrderRow
            key={`${order.price}-${index}`}
            order={order}
            type="sell"
            formatMoney={formatMoney}
          />
        ))}
      </div>
      <div className="current-market-price">
        <span>Current {coin.symbol} market price</span>
        <strong>
          <FiArrowUpRight /> {formatMoney(price)}
        </strong>
      </div>
      <div className="order-list buy-orders">
        {orderBook.bids.map((order, index) => (
          <OrderRow
            key={`${order.price}-${index}`}
            order={order}
            type="buy"
            formatMoney={formatMoney}
          />
        ))}
      </div>
      {!orderBook.asks.length && !orderBook.bids.length && (
        <div className="order-book-loading">Loading live order book…</div>
      )}
    </section>
  );
}

function OrderRow({ order, type, formatMoney }) {
  return (
    <div className="order-row">
      <span className={type === "buy" ? "positive" : "negative"}>
        {formatMoney(order.price)}
      </span>
      <span>{formatNumber(order.amount, 6)}</span>
      <span>{formatMoney(order.price * order.amount)}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label, formatMoney }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span>{label}</span>
      <strong>{formatMoney(payload[0].value)}</strong>
    </div>
  );
}

export default Trade;
