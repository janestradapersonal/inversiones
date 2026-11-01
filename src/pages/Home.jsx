import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Euro, Shield, Smile } from "lucide-react";
import MarketCharts from "@/components/MarketCharts";
import HeroCrecimiento from "@/components/HeroCrecimiento";

const stats = [
  { value: "70%", label: "de españoles no invierte su dinero (mucha gente piensa que es apostar)" },
  { value: "3%", label: "es lo que pierde tu dinero al año por la inflación" },
  { value: "7%", label: "rentabilidad media anual de un índice global" },
  { value: "1€", label: "necesitas para empezar a invertir hoy" }
];

const features = [
  {
    icon: <Smile className="w-6 h-6" />,
    title: "Es más fácil de lo que crees",
    desc: "No necesitas ser economista. Con 10 minutos y 1€ puedes empezar hoy mismo.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "El tiempo es tu mayor aliado",
    desc: "Gracias al interés compuesto, cuanto antes empieces, más crece tu dinero sin hacer nada.",
  },
  {
    icon: <Euro className="w-6 h-6" />,
    title: "Pequeñas cantidades, grandes resultados",
    desc: "Con 50€ al mes durante 20 años, al 7% anual, tendrías más de 25.000€ habiendo puesto 12.000€.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Diversifica y reduce el riesgo",
    desc: "Un fondo indexado global invierte en miles de empresas. Si una cae, las demás te protegen.",
  }
];

const temas = ["Fondos indexados", "ETF", "Interés compuesto", "Inflación", "Plan de pensiones"];

export default function Home() {
  return (
    <div>
      <HeroCrecimiento />

      {/* Temas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60 mb-4">
          — Lo que aprenderás —
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-white font-sora font-semibold">
          {temas.map((t, i) => (
            <span key={t} className="flex items-center gap-8">
              {i > 0 && <span className="hidden sm:inline w-px h-5 bg-white/30" />}
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Cifras */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-brand-onyx p-6"
            >
              <p className="font-display text-5xl md:text-6xl text-brand-mint">{s.value}</p>
              <p className="text-white/75 text-sm mt-3 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <MarketCharts />

      {/* Por qué invertir */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display uppercase text-5xl md:text-6xl text-white leading-[0.95] mb-10">
          Por qué <span className="font-serif italic normal-case text-brand-mint">empezar hoy</span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-brand-onyx p-7 border border-white/10"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-brand-mint flex items-center justify-center text-brand-onyx">
                  {f.icon}
                </div>
                <span className="font-display text-3xl text-white/20">0{i + 1}</span>
              </div>
              <h3 className="font-sora text-xl font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-white/75 text-base leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-onyx p-10 md:p-14 text-white text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-brand-indigo/40 blur-[100px] pointer-events-none" />
          <div className="relative">
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.95] mb-4">
              ¿Listo para que tu dinero
              <span className="block font-serif italic normal-case text-brand-mint">trabaje?</span>
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Con MyInvestor y Trade Republic puedes empezar a invertir hoy, sin comisiones y desde 1€.
            </p>
            <Link
              to="/empieza"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold text-lg hover:scale-105 transition-transform"
            >
              Ver cómo empezar <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
