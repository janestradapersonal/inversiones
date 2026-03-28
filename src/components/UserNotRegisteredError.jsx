import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw, Clock, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

// Tickers para Yahoo Finance
const ASSETS = [
{ key: "sp500", label: "S&P 500", emoji: "🇺🇸", ticker: "%5EGSPC", color: "#0E64D2" },
{ key: "msci", label: "MSCI World ETF", emoji: "🌍", ticker: "URTH", color: "#22C55E" },
{ key: "gold", label: "Oro", emoji: "🥇", ticker: "GC%3DF", color: "#9333EA" },
{ key: "btc", label: "Bitcoin", emoji: "₿", ticker: "BTC-USD", color: "#8B5CF6" }];


const PERIODS = [
{ key: "1mo", label: "1 mes", interval: "1d", icon: <Clock className="w-3.5 h-3.5" /> },
{ key: "10y", label: "10 años", interval: "1mo", icon: <Calendar className="w-3.5 h-3.5" /> }];


function formatPrice(val) {
  if (!val && val !== 0) return "—";
  if (val > 10000) return val.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " $";
  if (val > 100) return val.toLocaleString("es-ES", { maximumFractionDigits: 2 }) + " $";
  return val.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
}

async function fetchYahoo(ticker, period, interval) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=${interval}&range=${period}&includePrePost=false`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxy);
  const json = await res.json();
  const data = JSON.parse(json.contents);
  const result = data?.chart?.result?.[0];
  if (!result) return null;

  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  const meta = result.meta;

  const history = timestamps.map((ts, i) => {
    const d = new Date(ts * 1000);
    const label = interval === "1mo" ?
    d.getFullYear().toString() :
    `${d.getDate()} ${d.toLocaleString("es-ES", { month: "short" })}`;
    return { label, price: closes[i] ? parseFloat(closes[i].toFixed(2)) : null };
  }).filter((p) => p.price !== null);

  const price = meta?.regularMarketPrice ?? closes[closes.length - 1];
  const prevClose = meta?.chartPreviousClose ?? closes[0];
  const changePct = prevClose ? (price - prevClose) / prevClose * 100 : 0;
  const firstPrice = closes.find((v) => v != null);
  const lastPrice = closes[closes.length - 1];
  const periodChangePct = firstPrice ? (lastPrice - firstPrice) / firstPrice * 100 : 0;

  return { price, changePct, change: price - prevClose, periodChangePct, history };
}

function AssetChart({ asset, data, period, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-muted rounded-xl" />
          <div className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-2 w-12 bg-muted rounded" />
          </div>
        </div>
        <div className="h-6 w-24 bg-muted rounded mb-1" />
        <div className="h-3 w-16 bg-muted rounded mb-3" />
        <div className="h-24 bg-muted rounded-xl" />
      </div>);

  }

  const isUp = (data?.changePct ?? 0) >= 0;
  const periodUp = (data?.periodChangePct ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{asset.emoji}</span>
          <p className="font-sora font-bold text-sm">{asset.label}</p>
        </div>
        {data &&
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${periodUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {periodUp ? "+" : ""}{data.periodChangePct?.toFixed(1)}%
          </span>
        }
      </div>

      {data ?
      <>
          <p className="font-sora text-xl font-extrabold mb-0.5">{formatPrice(data.price)}</p>
          <p className={`text-xs mb-3 ${isUp ? "text-green-600" : "text-red-500"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.changePct)?.toFixed(2)}% hoy
          </p>
          {data.history?.length > 1 ?
        <ResponsiveContainer width="100%" height={100}>
              <LineChart data={data.history}>
                <Line type="monotone" dataKey="price" stroke={asset.color} strokeWidth={2.5} dot={false} />
                <XAxis dataKey="label" hide />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip
              formatter={(v) => [formatPrice(v), asset.label]}
              contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "11px" }}
              labelStyle={{ fontSize: "11px", color: "#666" }} />
            
              </LineChart>
            </ResponsiveContainer> :

        <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">Sin datos</div>
        }
        </> :

      <div className="h-24 flex items-center justify-center text-xs text-red-400">Error al cargar</div>
      }
    </motion.div>);

}

export default function MarketCharts() {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1mo");
  const [lastUpdate, setLastUpdate] = useState(null);

  const activePeriod = PERIODS.find((p) => p.key === period);

  const fetchAll = async () => {
    setLoading(true);
    const results = await Promise.all(
      ASSETS.map((a) => fetchYahoo(a.ticker, activePeriod.key, activePeriod.interval).catch(() => null))
    );
    const mapped = {};
    ASSETS.forEach((a, i) => {mapped[a.key] = results[i];});
    setMarketData(mapped);
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {fetchAll();}, [period]);

  return (
    <section className="bg-[#7dd0e3] mx-auto px-4 py-16 max-w-6xl sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-3">
            📊 Mercados reales
          </span>
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold">
            Rentabilidad{" "}
            <span className="bg-gradient-to-r from-blue-600 to-brand-green bg-clip-text text-transparent">
              histórica
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-950 p-1 rounded-2xl flex gap-1">
            {PERIODS.map((p) =>
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              period === p.key ? "bg-white shadow text-blue-700" : "text-muted-foreground hover:text-foreground"}`
              }>
              
                {p.icon} {p.label}
              </button>
            )}
          </div>
          <button
            onClick={fetchAll}
            disabled={loading} className="bg-blue-950 text-muted-foreground p-2 rounded-xl hover:bg-border transition-colors">
            
            
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Educational message */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-6 flex items-start gap-3 ${
        period === "1mo" ?
        "bg-blue-50 border border-blue-200" :
        "bg-green-50 border border-green-200"}`
        }>
        
        {period === "1mo" ?
        <>
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 text-sm">⚠️ A corto plazo: volatilidad normal</p>
              <p className="text-blue-700 text-sm mt-0.5">
                En un mes puedes ver subidas y bajadas. Eso es completamente <strong>normal</strong>. La clave es{" "}
                <strong>no dejarse llevar por el pánico</strong>. Nadie que haya aguantado 10 años en el S&P 500 ha perdido dinero.
              </p>
            </div>
          </> :

        <>
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">✅ A largo plazo: la tendencia alcista es clara</p>
              <p className="text-green-700 text-sm mt-0.5">
                En 10 años los mercados han multiplicado su valor a pesar de crisis y pandemias.{" "}
                <strong>Interés compuesto + tiempo = libertad financiera.</strong>
              </p>
            </div>
          </>
        }
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSETS.map((asset) =>
        <AssetChart
          key={asset.key}
          asset={asset}
          data={marketData[asset.key]}
          period={period}
          loading={loading} />

        )}
      </div>

      {lastUpdate &&
      <p className="text-xs text-muted-foreground mt-4 text-center">
          Datos de Yahoo Finance · Actualizado: {lastUpdate.getHours()}:{String(lastUpdate.getMinutes()).padStart(2, "0")} · No son asesoramiento financiero.
        </p>
      }
    </section>);

}