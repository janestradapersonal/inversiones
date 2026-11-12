import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Check, X } from "lucide-react";
import { ContadorPerdida, CintaCifras } from "@/components/inicio/Ganchos";

// Primera pantalla de la web: qué quiere conseguir (con acceso directo a cada parte) y qué no hará.

const objetivos = [
  ["Concienciar de la necesidad de invertir", "Por qué invertir", "/por-que-invertir"],
  ["Aprender lo básico, desde tu nivel", "Aprende", "/aprende"],
  ["Dar el primer paso, aunque sea con poco", "Empieza", "/empieza"],
];

const aparece = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.4 },
  viewport: { once: true, amount: 0.1 },
});

export default function InicioObjetivos({ trasEntrada = null }) {
  return (
    <div className="relative bg-brand-onyx overflow-hidden">
      {/* Pantalla de entrada: banda lima a sangre, texto negro (DESIGN.md) */}
      <section className="relative min-h-[100dvh] flex items-center bg-brand-mint text-brand-onyx overflow-hidden">
        {/* Rejilla muy suave, como papel milimetrado */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#0A0B0A 1px, transparent 1px), linear-gradient(90deg, #0A0B0A 1px, transparent 1px)", backgroundSize: "56px 56px" }}
        />
        <div className="relative max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-12">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-onyx text-brand-mint font-bold text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" /> Inversiones para todos
            </span>
            <h1 className="font-display uppercase text-brand-onyx text-[3.4rem] sm:text-7xl lg:text-[6.6rem] leading-[0.86] tracking-tight max-w-5xl">
              Nadie nos lo ha enseñado
              <span className="block font-serif italic normal-case text-[2.4rem] sm:text-6xl lg:text-7xl leading-[1] mt-3">
                pero nos afecta a todos
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-brand-onyx/75 font-medium">
              El dinero, la inflación y la inversión explicados con palabras normales.
            </p>
          </motion.div>

          <ContadorPerdida />
          </div>

          {/* Lo que puedes hacer aquí: cada objetivo lleva a su página */}
          <ol className="mt-12 grid md:grid-cols-3 border-t-2 border-brand-onyx/80">
            {objetivos.map(([t, pagina, to], i) => (
              <motion.li
                key={to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className={i ? "border-t md:border-t-0 md:border-l border-brand-onyx/25" : ""}
              >
                <Link
                  to={to}
                  className="group flex items-start gap-3 h-full py-5 md:px-5 rounded-b-2xl transition-colors hover:bg-brand-onyx/[0.07] focus-visible:bg-brand-onyx/[0.07] outline-none"
                >
                  <span className="font-display text-4xl text-brand-onyx leading-none">0{i + 1}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-brand-onyx/85 leading-snug">{t}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-brand-onyx underline decoration-2 underline-offset-4 decoration-brand-onyx/30 group-hover:decoration-brand-onyx">
                      {pagina} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>

          <motion.div
            className="mt-6 flex items-center gap-2 text-brand-onyx/60 text-sm font-semibold"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Sigue bajando: te enseñamos por qué <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      <CintaCifras />

      {trasEntrada}

      {/* Qué hay y qué no hay en esta web */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-mint">Para que no haya dudas</p>
        <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.95] mt-3 mb-8">
          Qué vas a <span className="font-serif italic normal-case text-brand-mint">encontrar</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["Aquí sí", Check, "text-brand-mint", "bg-brand-mint/15", "border-brand-mint/40", ["Datos reales de la historia", "Conceptos explicados fácil", "Tu primer paso"]],
            ["Aquí no", X, "text-[#FF5C7A]", "bg-[#FF5C7A]/15", "border-[#FF5C7A]/40", ["Predicciones del futuro", "Decirte dónde invertir", "Productos «ganadores»"]],
          ].map(([titulo, Icono, color, fondo, borde, items], i) => (
            <motion.div key={titulo} {...aparece(i)} className={`rounded-3xl border-2 ${borde} bg-brand-surface p-6 md:p-8`}>
              <p className={`font-display uppercase text-3xl md:text-4xl leading-none mb-6 ${color}`}>{titulo}</p>
              <ul className="space-y-4">
                {items.map((t) => (
                  <li key={t} className="flex items-center gap-4">
                    <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${fondo} ${color}`}>
                      <Icono className="w-5 h-5" strokeWidth={3} />
                    </span>
                    <span className="text-white text-lg md:text-xl font-semibold leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-white/70 text-lg">
          Para lo personal, un asesor. <span className="text-white font-semibold">Esto es solo para aprender.</span>
        </p>
        <p className="mt-2 text-xs text-white/45">Esto no es asesoramiento financiero.</p>
      </section>
    </div>
  );
}
