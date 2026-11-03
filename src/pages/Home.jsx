import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MessageCircle, Rocket } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import HeroCrecimiento from "@/components/HeroCrecimiento";
import datos from "@/data/porque_invertir.json";

const ultimo = datos.serie[datos.serie.length - 1];
const real = datos.serie.map((f) => ({ año: f.año, ...f.real }));
const euros = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";

const pasos = [
  {
    n: 2,
    to: "/aprende",
    icon: <BookOpen className="w-6 h-6" />,
    titulo: "Aprende",
    texto: "Lo básico, sin jerga: inflación, interés compuesto, fondos indexados, ETF… Lo justo para entender qué haces con tu dinero.",
    boton: "Ir a aprender",
  },
  {
    n: 3,
    to: "/empieza",
    icon: <Rocket className="w-6 h-6" />,
    titulo: "Empieza ya",
    texto: "Elige una app, abre tu cuenta en unos minutos y haz tu primera inversión. Se puede empezar con 1 €.",
    boton: "Ver cómo empezar",
  },
];

const aparece = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay: i * 0.08 },
  viewport: { once: true },
});

export default function Home() {
  return (
    <div>
      <HeroCrecimiento />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60 mb-3">— Tu camino —</p>
        <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.92] mb-10">
          Tres pasos, <span className="font-serif italic normal-case text-brand-mint">en orden</span>
        </h2>

        {/* Paso 1: el imprescindible */}
        <motion.div {...aparece()}>
          <Link
            to="/por-que-invertir"
            className="group grid md:grid-cols-[1.1fr,1fr] gap-6 md:gap-10 rounded-3xl bg-brand-surface border-2 border-brand-mint/50 p-6 md:p-10 hover:border-brand-mint transition-colors"
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-5xl text-brand-mint leading-none">01</span>
                <span className="px-3 py-1 rounded-full bg-brand-mint text-brand-onyx text-xs font-bold uppercase tracking-wider">
                  Imprescindible · empieza aquí
                </span>
              </div>
              <h3 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-4">
                Por qué <span className="font-serif italic normal-case text-brand-mint">invertir</span>
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Si tienes euros, ya estás invertido, aunque no lo sepas. Y es la inversión que, a la larga, siempre pierde.
                Mira lo que ha pasado desde 1999 con el euro, el oro, la bolsa y la vivienda.
              </p>
              <span className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold group-hover:scale-105 transition-transform">
                Ver el gráfico <ArrowRight className="w-5 h-5" />
              </span>
            </div>
            <div className="rounded-2xl bg-brand-onyx/70 border border-white/10 p-5 flex flex-col">
              <p className="text-xs uppercase tracking-wider text-white/55">10.000 € guardados desde 1999</p>
              <p className="font-display text-5xl md:text-6xl text-[#FF5C7A] tabular-nums mt-1">{euros(ultimo.real.euro)}</p>
              <p className="text-sm text-white/60">es lo que pueden comprar hoy</p>
              <div className="flex-1 min-h-[140px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={real} margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
                    <Line dataKey="oro" stroke="#F5C542" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line dataKey="sp500" stroke="#88F9C0" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line dataKey="casa" stroke="#6CB4FF" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line dataKey="euro" stroke="#FF5C7A" strokeWidth={4} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                Oro, S&P 500, vivienda y euros, descontando la inflación. Datos hasta 2025.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Pasos 2 y 3 */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {pasos.map((p, i) => (
            <motion.div key={p.to} {...aparece(i + 1)}>
              <Link
                to={p.to}
                className="group flex flex-col h-full rounded-3xl bg-brand-surface border border-white/10 p-7 hover:border-white/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-indigo flex items-center justify-center text-white">{p.icon}</div>
                  <span className="font-display text-4xl text-white/25">0{p.n}</span>
                </div>
                <h3 className="font-display uppercase text-3xl md:text-4xl mb-3">{p.titulo}</h3>
                <p className="text-white/75 leading-relaxed flex-1">{p.texto}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-mint">
                  {p.boton} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Foro */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <motion.div {...aparece()}>
          <Link
            to="/foro"
            className="group relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 rounded-3xl bg-brand-indigo p-8 md:p-12"
          >
            <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/15 blur-[80px] pointer-events-none" />
            <MessageCircle className="relative w-14 h-14 text-brand-mint shrink-0" />
            <div className="relative flex-1">
              <h2 className="font-display uppercase text-3xl md:text-5xl leading-[0.95] mb-2">
                ¿Dudas? <span className="font-serif italic normal-case text-brand-mint">pregunta</span>
              </h2>
              <p className="text-white/80 text-lg">
                En el foro no hay preguntas tontas. Pregunta, responde y aprende con más gente que está empezando.
              </p>
            </div>
            <span className="relative inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold whitespace-nowrap group-hover:scale-105 transition-transform self-start md:self-auto">
              Ir al foro <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </motion.div>
        <p className="mt-6 text-center text-xs text-white/40">Contenido educativo. Esto no es asesoramiento financiero.</p>
      </section>
    </div>
  );
}
