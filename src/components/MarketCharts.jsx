import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const PERIODS = [
  { key: "1d", label: "1 día", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "1m", label: "1 mes", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "1y", label: "1 año", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "5y", label: "5 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "10y", label: "10 años", icon: <Calendar className="w-3.5 h-3.5" /> },
  { key: "20y", label: "20 años", icon: <Calendar className="w-3.5 h-3.5" /> }
];

const EDUCATIONAL_CONTENT = {
  "1d": {
    icon: AlertTriangle,
    color: "red",
    title: "⚠️ 1 día: Solo ruido y estrés",
    text: "Mirar tu inversión día a día es contraproducente. En un solo día, los mercados pueden subir o bajar por razones que no significan nada a largo plazo. Una noticia, un rumor, un tweet... nada de esto importa. Solo genera estrés innecesario.",
    tip: "La clave: invierte, olvida, y sé constante y paciente. No mires tu cartera cada día."
  },
  "1m": {
    icon: TrendingUp,
    color: "yellow",
    title: "📊 1 mes: Empieza a verse algo, pero no suficiente",
    text: "En un mes, es probable que ya veas números verdes, pero depende del contexto. Puede que el mercado haya tenido un buen mes... o una corrección. Un mes sigue siendo muy poco tiempo para juzgar una inversión.",
    tip: "Un mes no define nada. Sigue aportando mensualmente y no te obsesiones con el resultado a corto plazo."
  },
  "1y": {
    icon: CheckCircle,
    color: "green",
    title: "✅ 1 año: Empezamos a ver claridad",
    text: "A un año vista, si has invertido de forma diversificada y con cabeza, lo más probable es que ya estés ganando. Históricamente, de cada 4 años, 3 son positivos en el S&P 500. Eso no garantiza nada, pero las probabilidades están de tu lado.",
    tip: "Un año negativo cada 4 es normal. Si toca uno malo, no vendas. Esa caída es temporal."
  },
  "5y": {
    icon: CheckCircle,
    color: "green",
    title: "🚀 5 años: El interés compuesto empieza a notarse",
    text: "A los 5 años, las caídas se han recuperado y el interés compuesto empieza a hacer su magia. Si has invertido cada mes, tu patrimonio ya ha crecido de forma significativa. Las crisis del camino ya son historia superada.",
    tip: "A 5 años, casi cualquier periodo histórico en el S&P 500 ha sido positivo. La paciencia empieza a pagar."
  },
  "10y": {
    icon: CheckCircle,
    color: "green",
    title: "🏆 10 años: Nadie ha perdido en el S&P 500",
    text: "Históricamente, ninguna persona que haya mantenido su inversión en el S&P 500 durante 10 años ha perdido dinero. La rentabilidad media anual ha sido de alrededor del 10%, pero esto incluye años buenos (quizás +20%) y años malos (quizás -15%). La media es lo que cuenta.",
    tip: "10 años: cada euro invertido podría haberse multiplicado por 2.5 o más. El tiempo es tu mejor aliado."
  },
  "20y": {
    icon: CheckCircle,
    color: "green",
    title: "💎 20 años: La libertad financiera al alcance",
    text: "En 20 años, incluso los peores momentos del mercado (2000, 2008, 2020) quedaron atrás como pequeños baches en una línea ascendente. Una inversión mensual constante durante 20 años puede multiplicar tu patrimonio por 4 o 5 veces.",
    tip: "El interés compuesto + tiempo + constancia = receta para la libertad financiera. Los inversores pacientes ganan."
  }
};

const STYLES = {
  red: "bg-red-50 border-red-200",
  yellow: "bg-yellow-50 border-yellow-200",
  green: "bg-green-50 border-green-200"
};

const ICON_COLORS = {
  red: "text-red-600",
  yellow: "text-yellow-600",
  green: "text-green-600"
};

export default function MarketCharts() {
  const [period, setPeriod] = useState("1d");

  const content = EDUCATIONAL_CONTENT[period];
  const IconComponent = content.icon;

  return (
    <section className="bg-[#7dd0e3] mx-auto px-4 py-16 max-w-6xl sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-3">
            📊 Temporalidad importa
          </span>
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold">
            ¿Cuánto tiempo{" "}
            <span className="bg-gradient-to-r from-blue-600 to-brand-green bg-clip-text text-transparent">
              invertir?
            </span>
          </h2>
        </div>
      </div>

      {/* Period buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-blue-950 p-1 rounded-2xl flex flex-wrap gap-1">
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
        className={`${STYLES[content.color]} border rounded-2xl p-6`}>

        <div className="flex items-start gap-3">
          <IconComponent className={`w-6 h-6 ${ICON_COLORS[content.color]} flex-shrink-0 mt-0.5`} />
          <div>
            <p className="font-semibold text-lg mb-2" style={{ color: content.color === 'red' ? '#991b1b' : content.color === 'yellow' ? '#92400e' : '#166534' }}>
              {content.title}
            </p>
            <p className="leading-relaxed mb-3" style={{ color: content.color === 'red' ? '#7f1d1d' : content.color === 'yellow' ? '#78350f' : '#15803d' }}>
              {content.text}
            </p>
            <div className="inline-block bg-white/60 px-4 py-2 rounded-xl">
              <span className="font-semibold" style={{ color: content.color === 'red' ? '#991b1b' : content.color === 'yellow' ? '#92400e' : '#166534' }}>
                💡 {content.tip}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Datos históricos aproximados · No son asesoramiento financiero.
      </p>
    </section>
  );
}