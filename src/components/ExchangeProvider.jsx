import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COINS,
  ExchangeContext,
  formatCurrency,
  REST_API,
} from "./exchangeStore";

const WALLET_KEY = "quantumPaperWalletV1";
const CURRENCY_KEY = "quantumDisplayCurrency";
const INR_FALLBACK_RATE = 96;

const initialWallet = {
  cash: 12480.62,
  holdings: [
    { symbol: "BTC", amount: 0.1842, averageCost: 67842.18 },
    { symbol: "ETH", amount: 2.46, averageCost: 3496.42 },
    { symbol: "SOL", amount: 18.72, averageCost: 172.34 },
    { symbol: "BNB", amount: 4.25, averageCost: 592.18 },
    { symbol: "XRP", amount: 3200, averageCost: 0.61 },
  ],
  transactions: [],
  history: [],
};

function loadWallet() {
  try {
    const saved = JSON.parse(localStorage.getItem(WALLET_KEY));
    return saved?.cash != null ? { ...initialWallet, ...saved } : initialWallet;
  } catch {
    return initialWallet;
  }
}

function fallbackTickers() {
  return Object.fromEntries(
    COINS.map((coin) => [
      coin.symbol,
      {
        price: coin.fallback,
        change: 0,
        high: coin.fallback,
        low: coin.fallback,
        volume: 0,
        trades: 0,
      },
    ]),
  );
}

function tickerFromApi(item) {
  return {
    price: Number(item.lastPrice ?? item.c),
    change: Number(item.priceChangePercent ?? item.P),
    high: Number(item.highPrice ?? item.h),
    low: Number(item.lowPrice ?? item.l),
    volume: Number(item.quoteVolume ?? item.q),
    trades: Number(item.count ?? item.n),
  };
}

function ExchangeProvider({ children }) {
  const [tickers, setTickers] = useState(fallbackTickers);
  const [sparklines, setSparklines] = useState({});
  const [marketStatus, setMarketStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [wallet, setWallet] = useState(loadWallet);
  const [currency, setCurrency] = useState(
    () => localStorage.getItem(CURRENCY_KEY) || "USD",
  );
  const [usdToInr, setUsdToInr] = useState(INR_FALLBACK_RATE);

  const updateTicker = useCallback((pair, payload) => {
    const coin = COINS.find((item) => item.pair === pair);
    if (!coin) return;

    setTickers((current) => ({
      ...current,
      [coin.symbol]: tickerFromApi(payload),
    }));
    setMarketStatus("live");
    setLastUpdated(Date.now());
  }, []);

  useEffect(() => {
    let active = true;
    let socket;
    let pollTimer;

    const fetchTickers = async () => {
      try {
        const symbols = encodeURIComponent(
          JSON.stringify(COINS.map((coin) => coin.pair)),
        );
        const response = await fetch(
          `${REST_API}/ticker/24hr?symbols=${symbols}`,
        );
        if (!response.ok) throw new Error("Market data request failed");
        const data = await response.json();
        if (!active) return;
        data.forEach((item) => updateTicker(item.symbol, item));
      } catch {
        if (active)
          setMarketStatus((status) => (status === "live" ? status : "delayed"));
      }
    };

    fetchTickers();
    pollTimer = window.setInterval(fetchTickers, 15000);

    try {
      const streams = COINS.map(
        (coin) => `${coin.pair.toLowerCase()}@ticker`,
      ).join("/");
      socket = new WebSocket(
        `wss://data-stream.binance.vision/stream?streams=${streams}`,
      );
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        updateTicker(message.data.s, message.data);
      };
      socket.onerror = () =>
        setMarketStatus((status) => (status === "live" ? status : "delayed"));
    } catch {
      queueMicrotask(() => active && setMarketStatus("delayed"));
    }

    Promise.all(
      COINS.slice(0, 4).map(async (coin) => {
        const response = await fetch(
          `${REST_API}/klines?symbol=${coin.pair}&interval=1h&limit=8`,
        );
        const rows = response.ok ? await response.json() : [];
        return [coin.symbol, rows.map((row) => Number(row[4]))];
      }),
    )
      .then((entries) => active && setSparklines(Object.fromEntries(entries)))
      .catch(() => {});

    return () => {
      active = false;
      window.clearInterval(pollTimer);
      if (socket?.readyState === WebSocket.OPEN) socket.close();
      if (socket?.readyState === WebSocket.CONNECTING)
        socket.onopen = () => socket.close();
    };
  }, [updateTicker]);

  useEffect(() => {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    let active = true;
    const fetchRate = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v2/rate/USD/INR",
        );
        if (!response.ok) throw new Error("Currency rate request failed");
        const data = await response.json();
        if (active && Number(data.rate) > 0) setUsdToInr(Number(data.rate));
      } catch {
        // Keep the last safe fallback rate when the reference-rate service is unavailable.
      }
    };
    fetchRate();
    const rateTimer = window.setInterval(fetchRate, 6 * 60 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(rateTimer);
    };
  }, []);

  const convertUsd = useCallback(
    (value) => Number(value || 0) * (currency === "INR" ? usdToInr : 1),
    [currency, usdToInr],
  );
  const convertToUsd = useCallback(
    (value) => Number(value || 0) / (currency === "INR" ? usdToInr : 1),
    [currency, usdToInr],
  );
  const formatMoney = useCallback(
    (value) => formatCurrency(convertUsd(value), currency),
    [convertUsd, currency],
  );

  const coins = useMemo(
    () => COINS.map((coin) => ({ ...coin, ...tickers[coin.symbol] })),
    [tickers],
  );

  const holdings = useMemo(() => {
    const values = wallet.holdings.map((holding) => {
      const coin = coins.find((item) => item.symbol === holding.symbol);
      const price = coin?.price || holding.averageCost;
      const value = holding.amount * price;
      const profitLoss = (price - holding.averageCost) * holding.amount;
      const profitLossPercent = holding.averageCost
        ? ((price - holding.averageCost) / holding.averageCost) * 100
        : 0;
      return {
        ...holding,
        ...coin,
        price,
        value,
        profitLoss,
        profitLossPercent,
      };
    });
    const holdingsValue = values.reduce((sum, item) => sum + item.value, 0);
    return values.map((item) => ({
      ...item,
      allocation: holdingsValue ? (item.value / holdingsValue) * 100 : 0,
    }));
  }, [coins, wallet.holdings]);

  const holdingsValue = holdings.reduce((sum, item) => sum + item.value, 0);
  const totalBalance = wallet.cash + holdingsValue;
  const unrealizedPnl = holdings.reduce(
    (sum, item) => sum + item.profitLoss,
    0,
  );
  const realizedPnl = wallet.transactions.reduce(
    (sum, item) => sum + (item.realizedPnl || 0),
    0,
  );
  const totalPnl = unrealizedPnl + realizedPnl;

  const addFunds = useCallback(() => {
    setWallet((current) => ({ ...current, cash: current.cash + 1000 }));
  }, []);

  const executeTrade = useCallback(
    ({ side, symbol, amount, orderType, limitPriceUsd }) => {
      const coin = coins.find((item) => item.symbol === symbol);
      const quantity = Number(amount);
      const executionPrice =
        orderType === "limit" ? Number(limitPriceUsd) : coin?.price;

      if (!coin || !executionPrice || !quantity || quantity <= 0) {
        return { ok: false, message: "Enter a valid amount and price." };
      }

      const currentHolding = wallet.holdings.find(
        (item) => item.symbol === symbol,
      );
      const gross = quantity * executionPrice;
      const fee = gross * 0.001;

      if (side === "buy" && gross + fee > wallet.cash) {
        return {
          ok: false,
          message: `Not enough ${currency} balance for this paper trade.`,
        };
      }

      if (
        side === "sell" &&
        (!currentHolding || quantity > currentHolding.amount + 1e-10)
      ) {
        return {
          ok: false,
          message: `You do not hold enough ${symbol} to sell that amount.`,
        };
      }

      let nextHoldings;
      let realizedTradePnl = 0;

      if (side === "buy") {
        const oldAmount = currentHolding?.amount || 0;
        const oldCost = currentHolding?.averageCost || 0;
        const newAmount = oldAmount + quantity;
        const averageCost =
          (oldAmount * oldCost + quantity * executionPrice + fee) / newAmount;
        const updated = { symbol, amount: newAmount, averageCost };
        nextHoldings = currentHolding
          ? wallet.holdings.map((item) =>
              item.symbol === symbol ? updated : item,
            )
          : [...wallet.holdings, updated];
      } else {
        realizedTradePnl =
          (executionPrice - currentHolding.averageCost) * quantity - fee;
        const remaining = currentHolding.amount - quantity;
        nextHoldings =
          remaining > 1e-10
            ? wallet.holdings.map((item) =>
                item.symbol === symbol ? { ...item, amount: remaining } : item,
              )
            : wallet.holdings.filter((item) => item.symbol !== symbol);
      }

      const nextCash =
        side === "buy" ? wallet.cash - gross - fee : wallet.cash + gross - fee;
      const now = new Date();
      const transaction = {
        id: `QTX-${now.getTime().toString().slice(-8)}`,
        symbol,
        crypto: coin.name,
        icon: coin.icon,
        type: side === "buy" ? "Buy" : "Sell",
        amount: quantity,
        price: executionPrice,
        total: gross,
        fee,
        realizedPnl: realizedTradePnl,
        averageCostAtTrade: currentHolding?.averageCost || executionPrice,
        status: "Completed",
        timestamp: now.toISOString(),
      };

      const nextHoldingsValue = nextHoldings.reduce((sum, item) => {
        const livePrice =
          coins.find((coinItem) => coinItem.symbol === item.symbol)?.price ||
          item.averageCost;
        return sum + item.amount * livePrice;
      }, 0);

      setWallet({
        cash: nextCash,
        holdings: nextHoldings,
        transactions: [transaction, ...wallet.transactions],
        history: [
          ...wallet.history,
          { timestamp: now.toISOString(), value: nextCash + nextHoldingsValue },
        ].slice(-30),
      });

      return {
        ok: true,
        message: `Successfully ${side === "buy" ? "bought" : "sold"} ${quantity.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${symbol} at ${formatMoney(executionPrice)}.`,
      };
    },
    [coins, currency, formatMoney, wallet],
  );

  const value = {
    coins,
    tickers,
    sparklines,
    marketStatus,
    lastUpdated,
    selectedSymbol,
    setSelectedSymbol,
    wallet,
    holdings,
    holdingsValue,
    totalBalance,
    unrealizedPnl,
    realizedPnl,
    totalPnl,
    addFunds,
    executeTrade,
    currency,
    setCurrency,
    usdToInr,
    convertUsd,
    convertToUsd,
    formatMoney,
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export default ExchangeProvider;
