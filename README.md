# Quantum Exchange

Quantum Exchange is a responsive cryptocurrency dashboard and paper-trading interface built with React and Vite. It combines a dark exchange-style UI with live public market information, interactive charts, portfolio tracking, transaction history, authentication-style profile screens, and USD/INR display support.

> **Educational project:** Orders are simulated in the browser. No real money, wallet, backend, or cryptocurrency order is used.

## Live links

- GitHub: [github.com/rohith10ty/quantum-exchange](https://github.com/rohith10ty/quantum-exchange)
- Live deployment: Add the Netlify deployment URL here after publishing

## Assignment coverage

| Requirement | Implementation |
| --- | --- |
| Header/dashboard | Quantum logo, navigation, crypto search, notifications, profile and responsive mobile menu |
| Market overview | Coin name, symbol, live price, 24-hour change, estimated market cap, 24-hour volume and gain/loss indicators |
| Trading | Pair selector, current price, Buy/Sell tabs, Market/Limit types, amount, price, total, percentage controls and order feedback |
| Price chart | Responsive historical chart with 1H, 1D, 1W and 1M periods, current price and movement |
| Order book | Live buy/sell rows with price, amount, total and current market-price marker |
| Transactions | Searchable/filterable history with ID, cryptocurrency, side, amount, price, status, date/time and profit/loss |
| Portfolio | Total balance, available cash, profit/loss, allocation chart, growth chart and live-valued holdings |
| React requirements | Reusable components, props, `useState`, `useEffect`, context, conditional rendering, `.map()` and event handling |
| Responsive UI | Layouts for mobile 320px+, tablet 768px+, laptop 1024px+ and desktop 1440px+ |

## Features

- Ten supported markets: BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK and TON
- Search and filter by cryptocurrency name or symbol
- Live Binance public price, 24-hour ticker, candle and order-book data
- Home-page leader charts with 1 Day, 1 Month, 1 Year and Overall choices; 1 Month is the default
- USD and INR switching across markets, trading, transactions and portfolio
- Indian lakh/crore formatting for larger INR values
- Persistent paper wallet, holdings and transaction history using `localStorage`
- Buy and sell validation, trading fee calculation and success/error messages
- Realized and unrealized profit/loss calculations
- Notification panel, responsive navigation and sign-in/sign-up profile interactions
- Dedicated JSX and CSS files for each visual component
- Animated Quantum logo and matching SVG favicon

## Data sources and fallbacks

Market prices and charts use Binance's public market-data endpoints. The USD/INR reference rate uses Frankfurter, with a safe local fallback if that service is unavailable. Estimated market cap is calculated from the live price and a static approximate circulating-supply value, so it should be treated as a UI estimate rather than financial data.

If a market request is temporarily unavailable, the interface continues rendering with fallback values. Trading remains simulated even while live prices are displayed.

## Technologies

- React 19
- Vite 8
- Tailwind CSS 4
- JavaScript (ES6+)
- React Icons
- Recharts
- Lenis
- Component-scoped CSS
- Git and GitHub

Tailwind is configured through the official Vite plugin and is used alongside dedicated component CSS. This keeps each component's detailed styling easy to find while retaining Tailwind utility support for shared layout primitives.

## Installation

```bash
git clone https://github.com/rohith10ty/quantum-exchange.git
cd quantum-exchange
npm install
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

## Available scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build
```

## Project structure

```text
quantum-exchange/
|-- public/
|   `-- quantum-favicon.svg
|-- src/
|   |-- components/
|   |   |-- ExchangeProvider.jsx
|   |   |-- exchangeStore.js
|   |   |-- Navbar.jsx / Navbar.css
|   |   |-- Home.jsx / Home.css
|   |   |-- Markets.jsx / Markets.css
|   |   |-- Trade.jsx / Trade.css
|   |   |-- Portfolio.jsx / Portfolio.css
|   |   |-- Transactions.jsx / Transactions.css
|   |   |-- Profile.jsx / Profile.css
|   |   `-- Footer.jsx / Footer.css
|   |-- App.jsx / App.css
|   |-- global.css
|   `-- main.jsx
|-- index.html
|-- netlify.toml
|-- package.json
`-- vite.config.js
```

## Screenshots

### Desktop

![Quantum Exchange home screen](docs/screenshots/home-desktop.png)

![Quantum Exchange markets screen](docs/screenshots/markets-desktop.png)

### Mobile

![Quantum Exchange mobile home screen](docs/screenshots/home-mobile.png)

## Deployment

The included `netlify.toml` sets the production build command to `npm run build` and publishes `dist`.

1. Push the latest changes to GitHub.
2. In Netlify, select **Add new site > Import an existing project**.
3. Choose the GitHub repository.
4. Confirm build command `npm run build` and publish directory `dist`.
5. Deploy, then replace the live-deployment placeholder near the top of this README.

## Disclaimer

Quantum Exchange is an educational frontend project. Live market information may be delayed or unavailable and must not be used as financial advice. All balances, trades, holdings and transactions are simulated locally in the browser.

## Author

Rohith Naidu — MERN Stack Developer
