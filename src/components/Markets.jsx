import { useMemo, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiSearch } from "react-icons/fi";
import { useExchange } from "./exchangeStore";
import "./Markets.css";

function Markets({ externalSearch = "", setExternalSearch, onNavigate }) {
  const [localSearch, setLocalSearch] = useState(externalSearch);
  const {
    coins,
    marketStatus,
    lastUpdated,
    selectedSymbol,
    setSelectedSymbol,
    currency,
    formatMoney,
  } = useExchange();
  const search = setExternalSearch ? externalSearch : localSearch;

  const filteredCoins = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return coins;
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query),
    );
  }, [coins, search]);

  const totalVolume = coins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
  const averageMove =
    coins.reduce((sum, coin) => sum + Math.abs(coin.change || 0), 0) /
    coins.length;
  const topCoin = [...coins].sort((a, b) => b.change - a.change)[0];

  const openTrade = (symbol) => {
    setSelectedSymbol(symbol);
    onNavigate?.("trade");
  };

  return (
    <main className="dashboard-container market-page" id="markets">
      <section className="market-page-header">
        <div>
          <div className="dashboard-eyebrow">
            <span></span>
            {marketStatus === "live" ? "LIVE MARKET" : "MARKET FEED CONNECTING"}
          </div>
          <h1>Market Overview</h1>
          <p>
            Live market prices shown in {currency}, with rolling 24-hour
            performance and volume.
          </p>
          {lastUpdated && (
            <small className="market-last-updated">
              Last update: {new Date(lastUpdated).toLocaleTimeString()}
            </small>
          )}
        </div>
        <div className="market-page-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by coin or symbol..."
            value={search}
            onChange={(event) => {
              setLocalSearch(event.target.value);
              setExternalSearch?.(event.target.value);
            }}
          />
        </div>
      </section>

      <section className="market-summary-grid">
        <div className="market-summary-card">
          <span>Tracked 24H Volume</span>
          <strong>{formatMoney(totalVolume)}</strong>
          <small>Live quote volume</small>
        </div>
        <div className="market-summary-card">
          <span>Average Movement</span>
          <strong>{averageMove.toFixed(2)}%</strong>
          <small>Absolute 24H change</small>
        </div>
        <div className="market-summary-card">
          <span>Top Performer</span>
          <strong>{topCoin?.symbol || "—"}</strong>
          <small className="positive">
            +{Math.max(topCoin?.change || 0, 0).toFixed(2)}%
          </small>
        </div>
        <div className="market-summary-card">
          <span>Live Markets</span>
          <strong>{coins.length}</strong>
          <small>Prices displayed in {currency}</small>
        </div>
      </section>

      <section className="market-table-card">
        <div className="market-table-heading">
          <div>
            <span className="section-kicker">LIVE ASSETS</span>
            <h2>Cryptocurrency Markets</h2>
          </div>
          <span className="market-count">{filteredCoins.length} assets</span>
        </div>
        <div className="market-table-wrapper">
          <table className="market-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price</th>
                <th>24H</th>
                <th>24H Volume</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => {
                const positive = coin.change >= 0;
                return (
                  <tr
                    key={coin.symbol}
                    className={
                      selectedSymbol === coin.symbol
                        ? "market-row selected"
                        : "market-row"
                    }
                    onClick={() => setSelectedSymbol(coin.symbol)}
                  >
                    <td data-label="Asset">
                      <div className="market-asset">
                        <div className="market-coin-icon">{coin.icon}</div>
                        <div>
                          <strong>{coin.name}</strong>
                          <span>
                            {coin.symbol} / {currency}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      data-label={`Price (${currency})`}
                      className="market-price"
                    >
                      {formatMoney(coin.price)}
                    </td>
                    <td data-label="24H Change">
                      <div
                        className={
                          positive
                            ? "market-change positive"
                            : "market-change negative"
                        }
                      >
                        {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                        {positive ? "+" : ""}
                        {coin.change.toFixed(2)}%
                      </div>
                    </td>
                    <td data-label={`24H Volume (${currency})`}>
                      {formatMoney(coin.volume)}
                    </td>
                    <td data-label="Action">
                      <button
                        className="market-trade-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openTrade(coin.symbol);
                        }}
                      >
                        Trade <FiArrowUpRight />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredCoins.length === 0 && (
          <div className="market-empty-state">
            <span className="gold-symbol">⬢</span>
            <h3>No cryptocurrencies found</h3>
            <p>Try another coin or ticker symbol.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Markets;
