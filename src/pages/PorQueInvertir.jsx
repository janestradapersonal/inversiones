import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

const reasons = [
{
  emoji: "🔥",
  title: "La inflación destruye tu ahorro",
  content: "Si guardas 10.000€ debajo del colchón (o en el banco a 0%), en 10 años ese dinero valdrá como si fueran 7.000-8.000€. La inflación media histórica en España es del 2-3% anual. El dinero parado pierde valor.",
  highlight: "-30% de poder adquisitivo en 10 años",
  color: "border-red-400",
  highlight_color: "bg-red-400/15 text-red-300"
},
{
  emoji: "⏰",
  title: "El tiempo es mágico: el interés compuesto",
  content: "Si inviertes 100€/mes desde los 25 años al 7% anual, a los 65 tendrás casi 250.000€. Si empiezas a los 35, unos 117.000€. La diferencia es enorme... y solo por empezar 10 años antes.",
  highlight: "25 años → ~247k€ vs 35 años → ~117k€",
  color: "border-brand-mint",
  highlight_color: "bg-brand-mint/15 text-brand-mint"
},
{
  emoji: "🌍",
  title: "A largo plazo, los mercados han subido",
  content: "El S&P 500 (las 500 mayores empresas de EE.UU.) ha subido de media cerca de un 10% anual en el último siglo, contando dividendos. Sí, hay caídas y crisis... pero hasta ahora siempre ha acabado recuperándose. Rentabilidades pasadas no garantizan las futuras.",
  highlight: "+10% de media anual histórica",
  color: "border-brand-mint",
  highlight_color: "bg-brand-mint/15 text-brand-mint"
},
{
  emoji: "💼",
  title: "Ya no necesitas ser rico ni saber de bolsa",
  content: "Antes invertir era cosa de ricos con broker y comisiones altísimas. Hoy, con apps como MyInvestor o Trade Republic, inviertes desde 1€, sin comisiones, en miles de empresas a la vez.",
  highlight: "Desde 1€ y en 10 minutos",
  color: "border-brand-mint",
  highlight_color: "bg-brand-mint/15 text-brand-mint"
},
{
  emoji: "🧘",
  title: "Tu futuro yo te lo agradecerá",
  content: "La jubilación pública cada vez es menos generosa. Construir un colchón financiero propio es la mejor decisión que puedes tomar para tu independencia y tranquilidad futura.",
  highlight: "Libertad financiera = paz mental",
  color: "border-brand-mint",
  highlight_color: "bg-brand-mint/15 text-brand-mint"
}];


export default function PorQueInvertir() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-onyx text-brand-mint font-semibold text-sm mb-5">
            2 - Por qué invertir
          </span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.92] tracking-tight mb-6">
            No invertir es el{" "}
            <span className="font-serif italic normal-case text-brand-mint">
              mayor riesgo
            </span>{" "}
            de todos
          </h1>
          <p className="text-white/85 text-xl leading-relaxed">Mucha gente cree que invertir es arriesgado. Pero lo realmente arriesgado es no hacerlo. Te explicamos por qué.

          </p>
        </motion.div>

        {/* Visual comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          
          <div className="rounded-3xl p-8 bg-brand-onyx border-2 border-red-400/40 text-center">
            <TrendingDown className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="font-sora text-xl font-bold text-white mb-2">Tu dinero en el banco</h3>
            <p className="text-white/70 text-sm">10.000€ → 7.000€ reales en 15 años (inflación)</p>
            <p className="font-display text-6xl text-red-400 mt-4">-30%</p>
          </div>
          <div className="rounded-3xl p-8 bg-brand-onyx border-2 border-brand-mint/40 text-center">
            <TrendingUp className="w-12 h-12 text-brand-mint mx-auto mb-4" />
            <h3 className="font-sora text-xl font-bold text-white mb-2">Tu dinero invertido</h3>
            <p className="text-white/70 text-sm">10.000€ → 27.000€ en 15 años al 7% anual</p>
            <p className="font-display text-6xl text-brand-mint mt-4">+170%</p>
          </div>
        </motion.div>

        {/* Reasons */}
        <div className="space-y-6 mb-16">
          {reasons.map((r, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className={`rounded-3xl p-8 bg-brand-onyx border-l-4 ${r.color}`}>
            
              <div className="flex items-start gap-5">
                <span className="text-4xl flex-shrink-0">{r.emoji}</span>
                <div>
                  <h3 className="font-sora text-xl font-bold mb-2">{r.title}</h3>
                  <p className="text-white/80 mb-4 leading-relaxed">{r.content}</p>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${r.highlight_color}`}>
                    📌 {r.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/aprende"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-mint text-brand-onyx font-bold text-lg shadow-xl hover:scale-105 transition-all">
            
            Aprende cómo hacerlo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>);

}