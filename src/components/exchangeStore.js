import { createContext, useContext } from "react";

export const INDIAN_INDICES = [
  {
    symbol: "NIFTY 50",
    exchange: "NSE",
    basePrice: 24386.45,
    baseChange: 0.78,
    points: 188.6,
  },
  {
    symbol: "SENSEX",
    exchange: "BSE",
    basePrice: 80248.15,
    baseChange: 0.71,
    points: 564.3,
  },
  {
    symbol: "BANK NIFTY",
    exchange: "NSE",
    basePrice: 52140.8,
    baseChange: -0.34,
    points: -178.2,
  },
  {
    symbol: "NIFTY IT",
    exchange: "NSE",
    basePrice: 42690.25,
    baseChange: 1.42,
    points: 597.8,
  },
];

export const STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    exchange: "NSE",
    sector: "Energy & Retail",
    basePrice: 1294.6,
    baseChange: 1.84,
    open: 1272.0,
    prevClose: 1271.2,
    dayHigh: 1302.4,
    dayLow: 1268.5,
    week52High: 1608.8,
    week52Low: 1185.0,
    marketCapCr: 1752400,
    peRatio: 25.4,
    dividendYield: 0.39,
    volume: "1.42 Cr",
    about:
      "Reliance Industries Limited is India's largest private-sector conglomerate spanning petrochemicals, refining, Jio digital services, and Reliance Retail.",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    exchange: "NSE",
    sector: "IT Services",
    basePrice: 4148.25,
    baseChange: 1.32,
    open: 4096.0,
    prevClose: 4094.2,
    dayHigh: 4168.0,
    dayLow: 4088.1,
    week52High: 4592.25,
    week52Low: 3591.5,
    marketCapCr: 1501200,
    peRatio: 30.8,
    dividendYield: 1.38,
    volume: "31.6 L",
    about:
      "Tata Consultancy Services is a global IT services, consulting, and business solutions leader headquartered in Mumbai, part of the Tata Group.",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    basePrice: 1742.8,
    baseChange: -0.48,
    open: 1751.0,
    prevClose: 1751.2,
    dayHigh: 1758.9,
    dayLow: 1734.0,
    week52High: 1880.0,
    week52Low: 1363.55,
    marketCapCr: 1328600,
    peRatio: 19.6,
    dividendYield: 1.12,
    volume: "1.88 Cr",
    about:
      "HDFC Bank is India's largest private sector bank by assets and market capitalization, offering retail, wholesale, and treasury banking services.",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    exchange: "NSE",
    sector: "IT Services",
    basePrice: 1864.5,
    baseChange: 2.15,
    open: 1828.0,
    prevClose: 1825.25,
    dayHigh: 1872.0,
    dayLow: 1822.4,
    week52High: 2006.45,
    week52Low: 1358.35,
    marketCapCr: 774300,
    peRatio: 28.1,
    dividendYield: 2.04,
    volume: "84.2 L",
    about:
      "Infosys Limited is a leading Indian multinational corporation providing digital transformation, AI cloud, and consulting services worldwide.",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    exchange: "NSE",
    sector: "Banking",
    basePrice: 1288.4,
    baseChange: 0.92,
    open: 1277.0,
    prevClose: 1276.65,
    dayHigh: 1294.75,
    dayLow: 1271.2,
    week52High: 1362.35,
    week52Low: 985.5,
    marketCapCr: 907500,
    peRatio: 19.2,
    dividendYield: 0.78,
    volume: "1.19 Cr",
    about:
      "ICICI Bank is a premier Indian private-sector bank offering corporate, retail, and investment banking across India and international hubs.",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    exchange: "NSE",
    sector: "Automobile",
    basePrice: 814.35,
    baseChange: -1.64,
    open: 829.0,
    prevClose: 827.95,
    dayHigh: 832.5,
    dayLow: 809.1,
    week52High: 1179.0,
    week52Low: 765.2,
    marketCapCr: 299800,
    peRatio: 9.8,
    dividendYield: 0.74,
    volume: "1.64 Cr",
    about:
      "Tata Motors is India's flagship automotive manufacturer producing passenger EVs, commercial vehicles, and luxury Jaguar Land Rover models.",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: "NSE",
    sector: "Banking",
    basePrice: 842.7,
    baseChange: 0.64,
    open: 838.0,
    prevClose: 837.35,
    dayHigh: 848.4,
    dayLow: 834.15,
    week52High: 912.0,
    week52Low: 600.65,
    marketCapCr: 752100,
    peRatio: 10.9,
    dividendYield: 1.62,
    volume: "1.35 Cr",
    about:
      "State Bank of India is the country's largest public-sector bank serving over 500 million customers through an extensive domestic and global network.",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    exchange: "NSE",
    sector: "Telecom",
    basePrice: 1624.9,
    baseChange: 1.48,
    open: 1602.0,
    prevClose: 1601.2,
    dayHigh: 1634.0,
    dayLow: 1598.4,
    week52High: 1779.0,
    week52Low: 1098.0,
    marketCapCr: 926400,
    peRatio: 52.4,
    dividendYield: 0.49,
    volume: "62.8 L",
    about:
      "Bharti Airtel is a leading global telecommunications provider headquartered in New Delhi, operating 5G mobile, broadband, and enterprise networks.",
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    exchange: "NSE",
    sector: "FMCG",
    basePrice: 486.15,
    baseChange: 0.41,
    open: 484.2,
    prevClose: 484.15,
    dayHigh: 489.6,
    dayLow: 482.5,
    week52High: 528.5,
    week52Low: 399.35,
    marketCapCr: 608200,
    peRatio: 29.1,
    dividendYield: 2.83,
    volume: "1.12 Cr",
    about:
      "ITC Limited is an Indian diversified conglomerate with leadership in FMCG brands, paperboards, agribusiness, and hospitality.",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro Ltd",
    exchange: "NSE",
    sector: "Infrastructure",
    basePrice: 3618.4,
    baseChange: 2.38,
    open: 3538.0,
    prevClose: 3534.3,
    dayHigh: 3632.0,
    dayLow: 3529.5,
    week52High: 3963.5,
    week52Low: 3175.0,
    marketCapCr: 497600,
    peRatio: 36.2,
    dividendYield: 0.77,
    volume: "28.4 L",
    about:
      "Larsen & Toubro is India's premier engineering, procurement, and construction (EPC) powerhouse building metro, defense, and clean-energy infrastructure.",
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    exchange: "NSE",
    sector: "NBFC",
    basePrice: 6894.5,
    baseChange: -1.12,
    open: 6975.0,
    prevClose: 6972.6,
    dayHigh: 6990.0,
    dayLow: 6865.0,
    week52High: 7829.0,
    week52Low: 6187.8,
    marketCapCr: 426900,
    peRatio: 28.4,
    dividendYield: 0.52,
    volume: "14.1 L",
    about:
      "Bajaj Finance is India's largest consumer durable and retail NBFC lender, offering personal loans, EMI cards, and wealth management products.",
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical Ind.",
    exchange: "NSE",
    sector: "Pharma",
    basePrice: 1842.2,
    baseChange: 1.09,
    open: 1824.0,
    prevClose: 1822.35,
    dayHigh: 1851.9,
    dayLow: 1819.0,
    week52High: 1960.35,
    week52Low: 1377.2,
    marketCapCr: 441900,
    peRatio: 39.8,
    dividendYield: 0.73,
    volume: "24.6 L",
    about:
      "Sun Pharmaceutical Industries is India's largest pharmaceutical company and a global leader in specialty generics across 100+ countries.",
  },
  {
    symbol: "ADANIENT",
    name: "Adani Enterprises Ltd",
    exchange: "NSE",
    sector: "Conglomerate",
    basePrice: 2816.75,
    baseChange: -2.18,
    open: 2884.0,
    prevClose: 2879.5,
    dayHigh: 2895.0,
    dayLow: 2798.4,
    week52High: 3743.9,
    week52Low: 2142.0,
    marketCapCr: 325100,
    peRatio: 64.5,
    dividendYield: 0.05,
    volume: "48.9 L",
    about:
      "Adani Enterprises is the flagship incubator of the Adani Group, developing airports, green hydrogen, data centers, and road infrastructure.",
  },
  {
    symbol: "ETERNAL",
    name: "Eternal Ltd (Zomato)",
    exchange: "NSE",
    sector: "Consumer Tech",
    basePrice: 268.45,
    baseChange: 3.42,
    open: 260.1,
    prevClose: 259.57,
    dayHigh: 271.2,
    dayLow: 258.8,
    week52High: 304.7,
    week52Low: 146.3,
    marketCapCr: 237400,
    peRatio: 182.0,
    dividendYield: 0.0,
    volume: "4.82 Cr",
    about:
      "Eternal Limited (formerly Zomato) operates India's leading food delivery, Blinkit quick-commerce, and Hyperpure B2B supply platforms.",
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd",
    exchange: "NSE",
    sector: "IT Services",
    basePrice: 564.8,
    baseChange: -0.76,
    open: 569.5,
    prevClose: 569.1,
    dayHigh: 572.4,
    dayLow: 561.9,
    week52High: 598.0,
    week52Low: 412.2,
    marketCapCr: 295600,
    peRatio: 24.7,
    dividendYield: 0.89,
    volume: "91.3 L",
    about:
      "Wipro Limited is a global technology services and consulting firm headquartered in Bengaluru, delivering enterprise cloud and AI solutions.",
  },
  {
    symbol: "TITAN",
    name: "Titan Company Ltd",
    exchange: "NSE",
    sector: "Consumer Goods",
    basePrice: 3294.1,
    baseChange: 0.86,
    open: 3268.0,
    prevClose: 3266.0,
    dayHigh: 3312.5,
    dayLow: 3258.4,
    week52High: 3867.0,
    week52Low: 3055.65,
    marketCapCr: 292400,
    peRatio: 84.2,
    dividendYield: 0.33,
    volume: "19.7 L",
    about:
      "Titan Company is a Tata Group lifestyle giant known for Tanishq jewellery, Titan watches, and Titan Eye+ across India.",
  },
];

export const IPOS = [
  {
    id: "ipo-hexaware",
    company: "Hexaware Technologies Ltd",
    symbol: "HEXAWARE",
    sector: "IT & Digital Engineering",
    status: "Open",
    priceBand: "₹674 – ₹708",
    issuePrice: 708,
    lotSize: 21,
    issueSizeCr: 8750,
    subscription: "3.42x",
    gmpPercent: "+8.5%",
    openDate: "11 Nov 2026",
    closeDate: "13 Nov 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-ather",
    company: "Ather Energy Ltd",
    symbol: "ATHER",
    sector: "Electric Mobility",
    status: "Open",
    priceBand: "₹304 – ₹321",
    issuePrice: 321,
    lotSize: 46,
    issueSizeCr: 2980,
    subscription: "5.18x",
    gmpPercent: "+14.2%",
    openDate: "12 Nov 2026",
    closeDate: "14 Nov 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-tatacapital",
    company: "Tata Capital Ltd",
    symbol: "TATACAP",
    sector: "Financial Services",
    status: "Upcoming",
    priceBand: "₹840 – ₹885",
    issuePrice: 885,
    lotSize: 16,
    issueSizeCr: 15000,
    subscription: "TBA",
    gmpPercent: "+19.0%",
    openDate: "18 Nov 2026",
    closeDate: "20 Nov 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-zepto",
    company: "Zepto India Ltd",
    symbol: "ZEPTO",
    sector: "Quick Commerce",
    status: "Upcoming",
    priceBand: "₹410 – ₹435",
    issuePrice: 435,
    lotSize: 34,
    issueSizeCr: 6200,
    subscription: "TBA",
    gmpPercent: "+22.4%",
    openDate: "24 Nov 2026",
    closeDate: "26 Nov 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-boat",
    company: "Imagine Marketing (boAt)",
    symbol: "BOAT",
    sector: "Consumer Electronics",
    status: "Upcoming",
    priceBand: "₹265 – ₹280",
    issuePrice: 280,
    lotSize: 53,
    issueSizeCr: 2000,
    subscription: "TBA",
    gmpPercent: "+11.0%",
    openDate: "01 Dec 2026",
    closeDate: "03 Dec 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-swiggy",
    company: "Swiggy Ltd",
    symbol: "SWIGGY",
    sector: "Consumer Tech",
    status: "Listed",
    priceBand: "₹371 – ₹390",
    issuePrice: 390,
    lotSize: 38,
    issueSizeCr: 11327,
    subscription: "3.59x",
    gmpPercent: "+16.8%",
    listingPrice: 456.0,
    openDate: "06 Nov 2026",
    closeDate: "08 Nov 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-ntpcgreen",
    company: "NTPC Green Energy Ltd",
    symbol: "NTPCGREEN",
    sector: "Renewable Energy",
    status: "Listed",
    priceBand: "₹102 – ₹108",
    issuePrice: 108,
    lotSize: 138,
    issueSizeCr: 10000,
    subscription: "2.42x",
    gmpPercent: "+12.5%",
    listingPrice: 121.5,
    openDate: "28 Oct 2026",
    closeDate: "30 Oct 2026",
    exchange: "NSE / BSE",
  },
  {
    id: "ipo-vishal",
    company: "Vishal Mega Mart Ltd",
    symbol: "VMM",
    sector: "Retail",
    status: "Listed",
    priceBand: "₹74 – ₹78",
    issuePrice: 78,
    lotSize: 190,
    issueSizeCr: 8000,
    subscription: "27.28x",
    gmpPercent: "+33.3%",
    listingPrice: 104.0,
    openDate: "21 Oct 2026",
    closeDate: "23 Oct 2026",
    exchange: "NSE / BSE",
  },
];

export function formatINR(value, maximumFractionDigits = 2) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(number);
}

export function formatCompactINR(value) {
  const number = Number(value) || 0;
  const abs = Math.abs(number);
  const sign = number < 0 ? "-" : "";
  if (abs >= 1e7) {
    return `${sign}₹${(abs / 1e7).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (abs >= 1e5) {
    return `${sign}₹${(abs / 1e5).toFixed(2).replace(/\.00$/, "")} L`;
  }
  return formatINR(number);
}

export function formatNumber(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits,
  }).format(Number(value) || 0);
}

export function generateChartSeries(stock, currentPrice, timeframe = "1D") {
  const base = stock?.basePrice || currentPrice || 1000;
  const seed = (stock?.symbol || "XCH")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const configs = {
    "1D": { count: 26, volatility: 0.0045, labels: ["09:15", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "15:30"] },
    "1W": { count: 28, volatility: 0.011, labels: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    "1M": { count: 30, volatility: 0.022, labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"] },
    "1Y": { count: 36, volatility: 0.048, labels: ["Q1", "Q2", "Q3", "Q4"] },
  };

  const cfg = configs[timeframe] || configs["1D"];
  const points = [];
  let running =
    timeframe === "1D"
      ? stock?.prevClose || base * 0.992
      : base * (1 - (stock?.baseChange || 0) / 100 - cfg.volatility * 0.4);

  for (let i = 0; i < cfg.count; i += 1) {
    const wave = Math.sin((i + 1) * 0.72 + seed * 0.13) * cfg.volatility * 0.55;
    const micro = Math.cos((i + 2) * 1.37 + seed * 0.29) * cfg.volatility * 0.35;
    running = Math.max(base * 0.55, running * (1 + wave + micro));

    let label;
    if (timeframe === "1D") {
      const totalMins = 9 * 60 + 15 + Math.round((i / (cfg.count - 1)) * 375);
      const hh = String(Math.floor(totalMins / 60)).padStart(2, "0");
      const mm = String(totalMins % 60).padStart(2, "0");
      label = `${hh}:${mm}`;
    } else if (timeframe === "1W") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      label = `${days[Math.min(4, Math.floor((i / cfg.count) * 5))]} ${9 + (i % 6)}:30`;
    } else if (timeframe === "1M") {
      label = `Day ${i + 1}`;
    } else {
      const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
      label = `${months[Math.floor((i / cfg.count) * 12)]}`;
    }

    points.push({
      label,
      price: Number(running.toFixed(2)),
      volume: Math.round(120000 + Math.abs(Math.sin(i + seed)) * 480000),
    });
  }

  // Ensure last point matches live currentPrice smoothly
  if (points.length > 0 && currentPrice) {
    points[points.length - 1].price = Number(currentPrice.toFixed(2));
  }

  return points;
}

export const ExchangeContext = createContext(null);

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error("useExchange must be used inside ExchangeProvider.");
  }
  return context;
}
