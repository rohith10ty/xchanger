import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExchangeContext,
  INDIAN_INDICES,
  IPOS,
  STOCKS,
} from "./exchangeStore";

const WALLET_KEY = "xchangerPaperWalletV1";
const WATCHLIST_KEY = "xchangerWatchlistV1";

const initialWallet = {
  cash: 500000.0,
  holdings: [
    { symbol: "RELIANCE", quantity: 40, averageCost: 1242.5 },
    { symbol: "TCS", quantity: 14, averageCost: 4020.0 },
    { symbol: "HDFCBANK", quantity: 35, averageCost: 1715.0 },
    { symbol: "TATAMOTORS", quantity: 60, averageCost: 845.0 },
    { symbol: "INFY", quantity: 25, averageCost: 1798.0 },
  ],
  ipoApplications: [
    {
      id: "IPO-APP-9041",
      ipoId: "ipo-swiggy",
      company: "Swiggy Ltd",
      symbol: "SWIGGY",
      lots: 1,
      shares: 38,
      bidPrice: 390,
      amount: 14820,
      status: "Allotted",
      createdAt: "2026-11-08T10:15:00.000Z",
    },
  ],
  transactions: [
    {
      id: "XCH-88412",
      side: "BUY",
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      orderType: "MARKET",
      productType: "CNC",
      quantity: 40,
      price: 1242.5,
      charges: 54.67,
      total: 49754.67,
      status: "Executed",
      createdAt: "2026-11-10T09:42:00.000Z",
    },
    {
      id: "XCH-88419",
      side: "BUY",
      symbol: "TCS",
      name: "Tata Consultancy Services Ltd",
      orderType: "LIMIT",
      productType: "CNC",
      quantity: 14,
      price: 4020.0,
      charges: 61.91,
      total: 56341.91,
      status: "Executed",
      createdAt: "2026-11-11T11:18:00.000Z",
    },
    {
      id: "XCH-88425",
      side: "BUY",
      symbol: "INFY",
      name: "Infosys Ltd",
      orderType: "MARKET",
      productType: "CNC",
      quantity: 25,
      price: 1798.0,
      charges: 49.45,
      total: 44999.45,
      status: "Executed",
      createdAt: "2026-11-11T14:26:00.000Z",
    },
  ],
};

const initialWatchlist = ["RELIANCE", "TCS", "INFY", "ETERNAL", "LT"];

function loadWallet() {
  try {
    const saved = JSON.parse(localStorage.getItem(WALLET_KEY));
    if (saved && typeof saved.cash === "number" && Array.isArray(saved.holdings)) {
      return { ...initialWallet, ...saved };
    }
    return initialWallet;
  } catch {
    return initialWallet;
  }
}

function loadWatchlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(WATCHLIST_KEY));
    return Array.isArray(saved) ? saved : initialWatchlist;
  } catch {
    return initialWatchlist;
  }
}

function buildInitialTickers() {
  return Object.fromEntries(
    STOCKS.map((stock) => [
      stock.symbol,
      {
        price: stock.basePrice,
        change: stock.baseChange,
        high: stock.dayHigh,
        low: stock.dayLow,
        direction: "flat",
        tickId: 0,
      },
    ]),
  );
}

function buildInitialIndices() {
  return INDIAN_INDICES.map((idx) => ({
    ...idx,
    price: idx.basePrice,
    change: idx.baseChange,
    direction: "flat",
  }));
}

function ExchangeProvider({ children }) {
  const [tickers, setTickers] = useState(buildInitialTickers);
  const [indices, setIndices] = useState(buildInitialIndices);
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE");
  const [wallet, setWallet] = useState(loadWallet);
  const [watchlist, setWatchlist] = useState(loadWatchlist);
  const [lastUpdated, setLastUpdated] = useState(() => Date.now());

  // Simulated NSE/BSE live market tick every 2.5 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTickers((prev) => {
        const next = { ...prev };
        // Update 5-7 random stocks per tick for realistic market pulse
        STOCKS.forEach((stock) => {
          if (Math.random() > 0.45) return;
          const current = prev[stock.symbol];
          const deltaPct = (Math.random() - 0.49) * 0.0045; // +/- ~0.22%
          const nextPrice = Math.max(
            stock.prevClose * 0.85,
            Number((current.price * (1 + deltaPct)).toFixed(2)),
          );
          const changePct = Number(
            (((nextPrice - stock.prevClose) / stock.prevClose) * 100).toFixed(2),
          );
          const direction =
            nextPrice > current.price
              ? "up"
              : nextPrice < current.price
                ? "down"
                : "flat";

          next[stock.symbol] = {
            price: nextPrice,
            change: changePct,
            high: Math.max(current.high, nextPrice),
            low: Math.min(current.low, nextPrice),
            direction,
            tickId: current.tickId + 1,
          };
        });
        return next;
      });

      setIndices((prev) =>
        prev.map((idx) => {
          if (Math.random() > 0.65) return { ...idx, direction: "flat" };
          const deltaPct = (Math.random() - 0.49) * 0.0014;
          const nextPrice = Number((idx.price * (1 + deltaPct)).toFixed(2));
          const prevBase = idx.basePrice / (1 + idx.baseChange / 100);
          const nextChange = Number(
            (((nextPrice - prevBase) / prevBase) * 100).toFixed(2),
          );
          const nextPoints = Number((nextPrice - prevBase).toFixed(2));
          return {
            ...idx,
            price: nextPrice,
            change: nextChange,
            points: nextPoints,
            direction:
              nextPrice > idx.price
                ? "up"
                : nextPrice < idx.price
                  ? "down"
                  : "flat",
          };
        }),
      );

      setLastUpdated(Date.now());
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
    } catch {
      // ignore storage quota errors
    }
  }, [wallet]);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch {
      // ignore storage quota errors
    }
  }, [watchlist]);

  const toggleWatchlist = useCallback((symbol) => {
    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((item) => item !== symbol)
        : [...prev, symbol],
    );
  }, []);

  const executeOrder = useCallback(
    ({
      symbol,
      side,
      orderType = "MARKET",
      productType = "CNC",
      quantity,
      price,
    }) => {
      const stock = STOCKS.find((s) => s.symbol === symbol);
      if (!stock) {
        return { ok: false, message: "Selected stock not found." };
      }

      const qty = Math.floor(Number(quantity));
      if (!Number.isFinite(qty) || qty <= 0) {
        return { ok: false, message: "Enter a valid whole number of shares." };
      }

      const livePrice = tickers[symbol]?.price || stock.basePrice;
      const execPrice =
        orderType === "LIMIT" ? Number(price) : Number(livePrice);

      if (!Number.isFinite(execPrice) || execPrice <= 0) {
        return { ok: false, message: "Enter a valid execution price." };
      }

      const grossValue = qty * execPrice;
      // Simulated Indian statutory charges (0% brokerage + ~0.11% STT/Exchange/GST)
      const charges = Number((grossValue * 0.0011).toFixed(2));
      const totalBuyCost = grossValue + charges;
      const netSellProceeds = Math.max(0, grossValue - charges);

      if (side === "BUY") {
        if (totalBuyCost > wallet.cash) {
          return {
            ok: false,
            message: "Insufficient INR funds in your paper trading wallet.",
          };
        }

        setWallet((prev) => {
          const existing = prev.holdings.find((h) => h.symbol === symbol);
          let nextHoldings;
          if (existing) {
            const totalQty = existing.quantity + qty;
            const weightedAvg =
              (existing.quantity * existing.averageCost + grossValue) /
              totalQty;
            nextHoldings = prev.holdings.map((h) =>
              h.symbol === symbol
                ? {
                    ...h,
                    quantity: totalQty,
                    averageCost: Number(weightedAvg.toFixed(2)),
                  }
                : h,
            );
          } else {
            nextHoldings = [
              ...prev.holdings,
              {
                symbol,
                quantity: qty,
                averageCost: Number(execPrice.toFixed(2)),
              },
            ];
          }

          const newTx = {
            id: `XCH-${Math.floor(10000 + Math.random() * 90000)}`,
            side: "BUY",
            symbol,
            name: stock.name,
            orderType,
            productType,
            quantity: qty,
            price: Number(execPrice.toFixed(2)),
            charges,
            total: Number(totalBuyCost.toFixed(2)),
            status: "Executed",
            createdAt: new Date().toISOString(),
          };

          return {
            ...prev,
            cash: Number((prev.cash - totalBuyCost).toFixed(2)),
            holdings: nextHoldings,
            transactions: [newTx, ...prev.transactions],
          };
        });

        return {
          ok: true,
          message: `Bought ${qty} shares of ${symbol} @ ₹${execPrice.toFixed(2)}`,
        };
      }

      // SELL
      const existing = wallet.holdings.find((h) => h.symbol === symbol);
      if (!existing || existing.quantity < qty) {
        return {
          ok: false,
          message: `Insufficient ${symbol} shares. Available: ${existing?.quantity || 0}`,
        };
      }

      setWallet((prev) => {
        const nextHoldings = prev.holdings
          .map((h) =>
            h.symbol === symbol ? { ...h, quantity: h.quantity - qty } : h,
          )
          .filter((h) => h.quantity > 0);

        const newTx = {
          id: `XCH-${Math.floor(10000 + Math.random() * 90000)}`,
          side: "SELL",
          symbol,
          name: stock.name,
          orderType,
          productType,
          quantity: qty,
          price: Number(execPrice.toFixed(2)),
          charges,
          total: Number(netSellProceeds.toFixed(2)),
          status: "Executed",
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          cash: Number((prev.cash + netSellProceeds).toFixed(2)),
          holdings: nextHoldings,
          transactions: [newTx, ...prev.transactions],
        };
      });

      return {
        ok: true,
        message: `Sold ${qty} shares of ${symbol} @ ₹${execPrice.toFixed(2)}`,
      };
    },
    [tickers, wallet.cash, wallet.holdings],
  );

  const applyIpo = useCallback(
    (ipoId, lots = 1) => {
      const ipo = IPOS.find((item) => item.id === ipoId);
      if (!ipo) return { ok: false, message: "IPO not found." };
      if (ipo.status !== "Open") {
        return { ok: false, message: "This IPO is not currently open for bidding." };
      }
      const lotCount = Math.max(1, Math.min(10, Math.floor(Number(lots) || 1)));
      const shares = lotCount * ipo.lotSize;
      const amount = shares * ipo.issuePrice;

      if (amount > wallet.cash) {
        return {
          ok: false,
          message: `Insufficient funds. Required: ₹${amount.toLocaleString("en-IN")}`,
        };
      }

      setWallet((prev) => {
        const app = {
          id: `IPO-${Math.floor(1000 + Math.random() * 9000)}`,
          ipoId: ipo.id,
          company: ipo.company,
          symbol: ipo.symbol,
          lots: lotCount,
          shares,
          bidPrice: ipo.issuePrice,
          amount,
          status: "Bid Placed (ASBA)",
          createdAt: new Date().toISOString(),
        };

        const tx = {
          id: `XCH-${Math.floor(10000 + Math.random() * 90000)}`,
          side: "IPO",
          symbol: ipo.symbol,
          name: ipo.company,
          orderType: "CUT-OFF",
          productType: "ASBA",
          quantity: shares,
          price: ipo.issuePrice,
          charges: 0,
          total: amount,
          status: "Blocked",
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          cash: Number((prev.cash - amount).toFixed(2)),
          ipoApplications: [app, ...prev.ipoApplications],
          transactions: [tx, ...prev.transactions],
        };
      });

      return {
        ok: true,
        message: `IPO bid placed for ${lotCount} lot(s) (${shares} shares) of ${ipo.symbol}`,
      };
    },
    [wallet.cash],
  );

  const resetWallet = useCallback(() => {
    setWallet(initialWallet);
  }, []);

  const portfolioSummary = useMemo(() => {
    const detailedHoldings = wallet.holdings.map((holding) => {
      const stock = STOCKS.find((s) => s.symbol === holding.symbol);
      const ticker = tickers[holding.symbol];
      const currentPrice = ticker?.price || stock?.basePrice || holding.averageCost;
      const prevClose = stock?.prevClose || currentPrice;
      const invested = holding.quantity * holding.averageCost;
      const currentValue = holding.quantity * currentPrice;
      const pnl = currentValue - invested;
      const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
      const dayChange = holding.quantity * (currentPrice - prevClose);

      return {
        ...holding,
        name: stock?.name || holding.symbol,
        sector: stock?.sector || "Equity",
        currentPrice,
        changePct: ticker?.change ?? stock?.baseChange ?? 0,
        direction: ticker?.direction || "flat",
        invested,
        currentValue,
        pnl,
        pnlPct,
        dayChange,
      };
    });

    const investedValue = detailedHoldings.reduce((acc, h) => acc + h.invested, 0);
    const currentHoldingsValue = detailedHoldings.reduce(
      (acc, h) => acc + h.currentValue,
      0,
    );
    const dayPnL = detailedHoldings.reduce((acc, h) => acc + h.dayChange, 0);

    const totalPnL = currentHoldingsValue - investedValue;
    const totalPnLPct = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;
    const totalAccountValue = wallet.cash + currentHoldingsValue;

    return {
      cash: wallet.cash,
      investedValue,
      currentHoldingsValue,
      totalAccountValue,
      totalPnL,
      totalPnLPct,
      dayPnL,
      detailedHoldings,
    };
  }, [tickers, wallet.cash, wallet.holdings]);

  const value = useMemo(
    () => ({
      stocks: STOCKS,
      ipos: IPOS,
      indices,
      tickers,
      selectedSymbol,
      setSelectedSymbol,
      wallet,
      watchlist,
      toggleWatchlist,
      executeOrder,
      applyIpo,
      resetWallet,
      portfolioSummary,
      lastUpdated,
    }),
    [
      indices,
      tickers,
      selectedSymbol,
      wallet,
      watchlist,
      toggleWatchlist,
      executeOrder,
      applyIpo,
      resetWallet,
      portfolioSummary,
      lastUpdated,
    ],
  );

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export default ExchangeProvider;
