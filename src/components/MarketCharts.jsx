import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, CheckCircle } from "lucide-react";

const ASSETS = [
  { key: "sp500", label: "S&P 500", emoji: "🇺🇸", color: "#0E64D2" },
  { key: "msci", label: "MSCI World ETF", emoji: "🌍", color: "#22C55E" },
  { key: "gold", label: "Oro", emoji: "🥇", color: "#9333EA" },
  { key: "btc", label: "Bitcoin", emoji: "₿", color: "#8B5CF6" }
];

const PERIODS = [
  { key: "10y", label: "10 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "20y", label: "20 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "30y", label: "30 años", icon: <Calendar className="w-3.5 h-3.5" /> }
];

// Datos fijos históricos (valores aproximados de rentabilidad acumulada)
const STATIC_DATA = {
  "10y": {
    sp500: {
      price: 5500,
      changePct: 187.5,
      history: [
        { label: "2014", price: 1900 },
        { label: "2015", price: 2000 },
        { label: "2016", price: 2100 },
        { label: "2017", price: 2500 },
        { label: "2018", price: 2700 },
        { label: "2019", price: 2900 },
        { label: "2020", price: 3200 },
        { label: "2021", price: 4500 },
        { label: "2022", price: 3800 },
        { label: "2023", price: 4800 },
        { label: "2024", price: 5500 }
      ]
    },
    msci: {
      price: 120,
      changePct: 150,
      history: [
        { label: "2014", price: 48 },
        { label: "2015", price: 50 },
        { label: "2016", price: 52 },
        { label: "2017", price: 60 },
        { label: "2018", price: 65 },
        { label: "2019", price: 70 },
        { label: "2020", price: 75 },
        { label: "2021", price: 95 },
        { label: "2022", price: 85 },
        { label: "2023", price: 105 },
        { label: "2024", price: 120 }
      ]
    },
    gold: {
      price: 2300,
      changePct: 85,
      history: [
        { label: "2014", price: 1200 },
        { label: "2015", price: 1100 },
        { label: "2016", price: 1250 },
        { label: "2017", price: 1300 },
        { label: "2018", price: 1350 },
        { label: "2019", price: 1500 },
        { label: "2020", price: 1900 },
        { label: "2021", price: 1800 },
        { label: "2022", price: 1900 },
        { label: "2023", price: 2000 },
        { label: "2024", price: 2300 }
      ]
    },
    btc: {
      price: 65000,
      changePct: 65000,
      history: [
        { label: "2014", price: 100 },
        { label: "2015", price: 300 },
        { label: "2016", price: 800 },
        { label: "2017", price: 19000 },
        { label: "2018", price: 4000 },
        { label: "2019", price: 9000 },
        { label: "2020", price: 29000 },
        { label: "2021", price: 50000 },
        { label: "2022", price: 16000 },
        { label: "2023", price: 42000 },
        { label: "2024", price: 65000 }
      ]
    }
  },
  "20y": {
    sp500: {
      price: 5500,
      changePct: 450,
      history: [
        { label: "2004", price: 1000 },
        { label: "2006", price: 1200 },
        { label: "2008", price: 900 },
        { label: "2010", price: 1100 },
        { label: "2012", price: 1400 },
        { label: "2014", price: 1900 },
        { label: "2016", price: 2100 },
        { label: "2018", price: 2700 },
        { label: "2020", price: 3200 },
        { label: "2022", price: 3800 },
        { label: "2024", price: 5500 }
      ]
    },
    msci: {
      price: 120,
      changePct: 300,
      history: [
        { label: "2004", price: 30 },
        { label: "2006", price: 35 },
        { label: "2008", price: 25 },
        { label: "2010", price: 40 },
        { label: "2012", price: 45 },
        { label: "2014", price: 48 },
        { label: "2016", price: 52 },
        { label: "2018", price: 65 },
        { label: "2020", price: 75 },
        { label: "2022", price: 85 },
        { label: "2024", price: 120 }
      ]
    },
    gold: {
      price: 2300,
      changePct: 570,
      history: [
        { label: "2004", price: 400 },
        { label: "2006", price: 550 },
        { label: "2008", price: 800 },
        { label: "2010", price: 1200 },
        { label: "2012", price: 1700 },
        { label: "2014", price: 1200 },
        { label: "2016", price: 1250 },
        { label: "2018", price: 1350 },
        { label: "2020", price: 1900 },
        { label: "2022", price: 1900 },
        { label: "2024", price: 2300 }
      ]
    },
    btc: {
      price: 65000,
      changePct: 65000000,
      history: [
        { label: "2004", price: null },
        { label: "2006", price: null },
        { label: "2008", price: null },
        { label: "2010", price: 0.1 },
        { label: "2012", price: 10 },
        { label: "2014", price: 100 },
        { label: "2016", price: 800 },
        { label: "2018", price: 4000 },
        { label: "2020", price: 29000 },
        { label: "2022", price: 16000 },
        { label: "2024", price: 65000 }
      ]
    }
  },
  "30y": {
    sp500: {
      price: 5500,
      changePct: 1800,
      history: [
        { label: "1994", price: 280 },
        { label: "1998", price: 1100 },
        { label: "2002", price: 900 },
        { label: "2006", price: 1200 },
        { label: "2010", price: 1100 },
        { label: "2014", price: 1900 },
        { label: "2018", price: 2700 },
        { label: "2022", price: 3800 },
        { label: "2024", price: 5500 }
      ]
    },
    msci: {
      price: 120,
      changePct: 500,
      history: [
        { label: "1994", price: 20 },
        { label: "1998", price: 30 },
        { label: "2002", price: 25 },
        { label: "2006", price: 35 },
        { label: "2010", price: 40 },
        { label: "2014", price: 48 },
        { label: "2018", price: 65 },
        { label: "2022", price: 85 },
        { label: "2024", price: 120 }
      ]
    },
    gold: {
      price: 2300,
      changePct: 570,
      history: [
        { label: "1994", price: 400 },
        { label: "1998", price: 350 },
        { label: "2002", price: 400 },
        { label: "2006", price: 550 },
        { label: "2010", price: 1200 },
        { label: "2014", price: 1200 },
        { label: "2018", price: 1350 },
        { label: "2022", price: 1900 },
        { label: "2024", price: 2300 }
      ]
    },
    btc: {
      price: 65000,
      changePct: null,
      history: [
        { label: "1994", price: null },
        { label: "1998", price: null },
        { label: "2002", price: null },
        { label: "2006", price: null },
        { label: "2010", price: 0.1 },
        { label: "2014", price: 100 },
        { label: "2018", price: 4000 },
        { label: "2022", price: 16000 },
        { label: "2024", price: 65000 }
      ]
    }
  }
};

function formatPrice(val) {
  if (!val && val !== 0) return "—";
  if (val > 10000) return val.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " $";
  if (val > 100) return val.toLocaleString("es-ES", { maximumFractionDigits: 2 }) + " $";
  return val.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " $";
}

function AssetChart({ asset, data }) {
  const periodUp = (data?.changePct ?? 0) >= 0;

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
        {data && data.changePct !== null &&
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${periodUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {periodUp ? "+" : ""}{data.changePct?.toFixed(1)}%
          </span>
        }
      </div>

      {data ?
        <>
          <p className="font-sora text-xl font-extrabold mb-0.5">{formatPrice(data.price)}</p>
          <p className="text-xs text-muted-foreground mb-3">Rentabilidad acumulada</p>
          {data.history?.length > 1 ?
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={data.history.filter(h => h.price !== null)}>
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
        <div className="h-24 flex items-center justify-center text-xs text-muted-foreground">No disponible en este período</div>
      }
    </motion.div>
  );
}

export default function MarketCharts() {
  const [period, setPeriod] = useState("10y");

  return (
    <section className="bg-[#7dd0e3] mx-auto px-4 py-16 max-w-6xl sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-3">
            📊 Mercados históricos
          </span>
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold">
            Rentabilidad{" "}
            <span className="bg-gradient-to-r from-blue-600 to-brand-green bg-clip-text text-transparent">
              histórica
            </span>
          </h2>
        </div>
        <div className="bg-blue-950 p-1 rounded-2xl flex gap-1">
          {PERIODS.map((p) =>
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === p.key ? "bg-white shadow text-blue-700" : "text-muted-foreground hover:text-foreground"
              }`}>

              {p.icon} {p.label}
            </button>
          )}
        </div>
      </div>

      {/* Educational message */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3">

        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800 text-sm">✅ A largo plazo: la tendencia alcista es clara</p>
          <p className="text-green-700 text-sm mt-0.5">
            En {period.replace("y", "")} años los mercados han multiplicado su valor a pesar de crisis y pandemias.{" "}
            <strong>Interés compuesto + tiempo = libertad financiera.</strong>
          </p>
        </div>
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSETS.map((asset) =>
          <AssetChart
            key={asset.key}
            asset={asset}
            data={STATIC_DATA[period][asset.key]}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Datos históricos aproximados · No son asesoramiento financiero.
      </p>
    </section>
  );
}