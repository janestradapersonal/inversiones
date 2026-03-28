import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown, TrendingUp, Clock, Percent } from "lucide-react";

const reasons = [
{
  emoji: "🔥",
  title: "La inflación destruye tu ahorro",
  content: "Si guardas 10.000€ debajo del colchón (o en el banco a 0%), en 10 años ese dinero valdrá como si fueran 7.000-8.000€. La inflación media histórica en España es del 2-3% anual. El dinero parado pierde valor.",
  highlight: "-30% de poder adquisitivo en 10 años",
  color: "border-red-400 bg-red-50",
  highlight_color: "bg-red-100 text-red-700"
},
{
  emoji: "⏰",
  title: "El tiempo es mágico: el interés compuesto",
  content: "Si inviertes 100€/mes desde los 25 años al 7% anual, a los 65 tendrás más de 250.000€. Si empiezas a los 35, solo tendrás 120.000€. La diferencia es enorme... y solo por empezar 10 años antes.",
  highlight: "25 años → 250k€ vs 35 años → 120k€",
  color: "border-brand-purple bg-purple-50",
  highlight_color: "bg-purple-100 text-brand-purple"
},
{
  emoji: "🌍",
  title: "Los mercados siempre suben a largo plazo",
  content: "El S&P 500 (las 500 mayores empresas de EE.UU.) lleva más de 100 años subiendo una media del 10% anual. Sí, hay caídas, crisis... pero siempre recupera y sube más. Quien aguanta, gana.",
  highlight: "+10% de media anual histórica",
  color: "border-brand-green bg-green-50",
  highlight_color: "bg-green-100 text-green-700"
},
{
  emoji: "💼",
  title: "Ya no necesitas ser rico ni saber de bolsa",
  content: "Antes invertir era cosa de ricos con broker y comisiones altísimas. Hoy, con apps como MyInvestor o Trade Republic, inviertes desde 1€, sin comisiones, en miles de empresas a la vez.",
  highlight: "Desde 1€ y en 10 minutos",
  color: "border-brand-orange bg-orange-50",
  highlight_color: "bg-orange-100 text-brand-orange"
},
{
  emoji: "🧘",
  title: "Tu futuro yo te lo agradecerá",
  content: "La jubilación pública cada vez es menos generosa. Construir un colchón financiero propio es la mejor decisión que puedes tomar para tu independencia y tranquilidad futura.",
  highlight: "Libertad financiera = paz mental",
  color: "border-blue-400 bg-blue-50",
  highlight_color: "bg-blue-100 text-blue-700"
}];


export default function PorQueInvertir() {
  return (
    <div className="bg-[#7dd0e3] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-5">
            2 - Por qué invertir
          </span>
          <h1 className="font-sora text-4xl md:text-5xl font-extrabold mb-5">
            No invertir es el{" "}
            <span className="bg-gradient-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
              mayor riesgo
            </span>{" "}
            de todos
          </h1>
          <p className="text-slate-950 text-xl leading-relaxed">Mucha gente cree que invertir es arriesgado. Pero lo realmente arriesgado es no hacerlo. Te explicamos por qué.

          </p>
        </motion.div>

        {/* Visual comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          
          <div className="rounded-3xl p-8 bg-red-50 border-2 border-red-200 text-center">
            <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-sora text-xl font-bold text-red-700 mb-2">Tu dinero en el banco</h3>
            <p className="text-red-600 text-sm">10.000€ → 7.000€ reales en 15 años (inflación)</p>
            <p className="font-sora text-4xl font-extrabold text-red-500 mt-4">-30%</p>
          </div>
          <div className="rounded-3xl p-8 bg-green-50 border-2 border-green-200 text-center">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-sora text-xl font-bold text-green-700 mb-2">Tu dinero invertido</h3>
            <p className="text-green-700 text-sm">10.000€ → 27.000€ en 15 años al 7% anual</p>
            <p className="font-sora text-4xl font-extrabold text-green-600 mt-4">+170%</p>
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
            className={`rounded-3xl p-8 border-2 ${r.color}`}>
            
              <div className="flex items-start gap-5">
                <span className="text-4xl flex-shrink-0">{r.emoji}</span>
                <div>
                  <h3 className="font-sora text-xl font-bold mb-2">{r.title}</h3>
                  <p className="text-slate-900 mb-4 leading-relaxed">{r.content}</p>
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
            
            Aprende cómo hacerlo <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>);

}