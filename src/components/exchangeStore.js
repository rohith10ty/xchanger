import { createContext, useContext } from "react";

export const COINS = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    pair: "BTCUSDT",
    icon: "₿",
    fallback: 67842.18,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    pair: "ETHUSDT",
    icon: "Ξ",
    fallback: 3496.42,
  },
  {
    name: "Solana",
    symbol: "SOL",
    pair: "SOLUSDT",
    icon: "S",
    fallback: 172.34,
  },
  { name: "BNB", symbol: "BNB", pair: "BNBUSDT", icon: "B", fallback: 592.18 },
  { name: "XRP", symbol: "XRP", pair: "XRPUSDT", icon: "X", fallback: 0.61 },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    pair: "DOGEUSDT",
    icon: "Ð",
    fallback: 0.143,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    pair: "ADAUSDT",
    icon: "A",
    fallback: 0.44,
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    pair: "AVAXUSDT",
    icon: "A",
    fallback: 35.12,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    pair: "LINKUSDT",
    icon: "L",
    fallback: 15.96,
  },
  {
    name: "Toncoin",
    symbol: "TON",
    pair: "TONUSDT",
    icon: "T",
    fallback: 6.84,
  },
];

export const REST_API = "https://data-api.binance.vision/api/v3";

export function formatCurrency(value, currency = "USD") {
  const number = Number(value) || 0;
  const absolute = Math.abs(number);
  if (currency === "INR") {
    const sign = number < 0 ? "-" : "";
    if (absolute >= 1e7) {
      const crores = Math.floor((absolute / 1e7) * 100) / 100;
      return `${sign}₹${crores
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1")} Crore`;
    }
    if (absolute >= 1e5) {
      const lakhs = Math.floor((absolute / 1e5) * 100) / 100;
      return `${sign}₹${lakhs
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1")} Lakh`;
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: absolute < 1 ? 4 : 2,
      maximumFractionDigits: absolute < 1 ? 6 : 2,
    }).format(number);
  }
  if (absolute >= 1000) {
    const units = [
      { value: 1e12, suffix: "T" },
      { value: 1e9, suffix: "B" },
      { value: 1e6, suffix: "M" },
      { value: 1e3, suffix: "K" },
    ];
    const unit = units.find((item) => absolute >= item.value);
    const truncated = Math.floor((absolute / unit.value) * 100) / 100;
    const compactValue = truncated
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
    return `${number < 0 ? "-" : ""}${currency === "INR" ? "₹" : "$"}${compactValue}${unit.suffix}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: absolute < 1 ? 4 : 2,
    maximumFractionDigits: absolute < 1 ? 6 : 2,
  }).format(number);
}

export function formatNumber(value, maximumFractionDigits = 6) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(Number(value) || 0);
}

export const ExchangeContext = createContext(null);

export function useExchange() {
  const context = useContext(ExchangeContext);

  if (!context) {
    throw new Error("useExchange must be used inside ExchangeProvider.");
  }

  return context;
}
