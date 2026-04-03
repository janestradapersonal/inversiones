import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, TrendingUp, Clock } from "lucide-react";

const PERIODS = [
  { key: "10y", label: "10 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "20y", label: "20 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "30y", label: "30 años", icon: <Calendar className="w-3.5 h-3.5" /> }
];

const EDUCATIONAL_CONTENT = {
  "10y": {
    title: "✅ 10 años: El poder del interés compuesto",
    text: "En 10 años, una inversión de 10.000€ en el S&P 500 podría haberse convertido en aproximadamente 28.000€. A pesar de las crisis, la tendencia ha sido claramente alcista. El interés compuesto empieza a mostrar su verdadero poder.",
    highlight: "Rentabilidad media histórica: ~7-10% anual"
  },
  "20y": {
    title: "🚀 20 años: Multiplicando tu patrimonio",
    text: "En 20 años, el mismo 10.000€ podrían haberse convertido en más de 50.000€. Las crisis del 2000 y 2008 fueron superadas con creces. Quien mantuvo la calma y siguió invirtiendo vio cómo su patrimonio se multiplicaba por 5.",
    highlight: "Rentabilidad acumulada: ~400-500%"
  },
  "30y": {
    title: "🏆 30 años: La libertad financiera",
    text: "En 30 años, 10.000€ podrían haberse convertido en más de 150.000€. El S&P 500 ha generado un retorno promedio del 10% anual. Con el interés compuesto, el tiempo es tu mejor aliado. Los inversores pacientes son los que más ganan.",
    highlight: "Cada euro invertido podría haberse multiplicado por 15-20"
  }
};

export default function MarketCharts() {
  const [period, setPeriod] = useState("10y");

  const content = EDUCATIONAL_CONTENT[period];

  return (
    <section className="bg-[#7dd0e3] mx-auto px-4 py-16 max-w-6xl sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-3">
            📊 Inversión a largo plazo
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
                period === p.key ? "bg-white shadow text-blue-700" : "text-gray-50 hover:text-black"
              }`}>

              {p.icon} {p.label}
            </button>
          )}
        </div>
      </div>

      {/* Educational content */}
      <motion.div
        key={period}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">

        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800 text-lg mb-2">{content.title}</p>
            <p className="text-green-700 leading-relaxed mb-3">
              {content.text}
            </p>
            <div className="inline-block bg-green-100 px-4 py-2 rounded-xl">
              <span className="font-bold text-green-800">📈 {content.highlight}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-sm text-muted-foreground">S&P 500</span>
          </div>
          <p className="font-sora text-2xl font-bold text-green-600">+{period === "10y" ? "187%" : period === "20y" ? "450%" : "1800%"}</p>
          <p className="text-xs text-muted-foreground">Rentabilidad acumulada</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-sm text-muted-foreground">Tiempo medio</span>
          </div>
          <p className="font-sora text-2xl font-bold text-blue-600">{period === "10y" ? "10" : period === "20y" ? "20" : "30"} años</p>
          <p className="text-xs text-muted-foreground">Horizonte de inversión</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-sm text-muted-foreground">Probabilidad</span>
          </div>
          <p className="font-sora text-2xl font-bold text-green-600">~100%</p>
          <p className="text-xs text-muted-foreground">De rentabilidad positiva</p>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Datos históricos aproximados · No son asesoramiento financiero.
      </p>
    </section>
  );
}