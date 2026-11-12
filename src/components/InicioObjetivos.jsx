import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Ban } from "lucide-react";
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

      {/* Lo que esta web no hará */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-4">
        <motion.div
          {...aparece()}
          className="rounded-3xl border-2 border-[#FF5C7A]/60 bg-brand-onyx p-6 md:p-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Ban className="w-8 h-8 text-[#FF5C7A]" />
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FF5C7A]">Lo que esta web no hará</p>
          </div>
          <ul className="font-display uppercase text-3xl md:text-5xl leading-[1] mb-6 space-y-1">
            <li>
              Decirte <span className="font-serif italic normal-case text-[#FF5C7A]">dónde invertir</span>
            </li>
            <li>
              Venderte <span className="font-serif italic normal-case text-[#FF5C7A]">humo</span>
            </li>
            <li>
              Hablarte de <span className="font-serif italic normal-case text-[#FF5C7A]">productos ganadores</span>
            </li>
          </ul>
          <div className="space-y-4 text-white/80 text-lg leading-relaxed max-w-3xl">
            <p>
              Es una web completamente educativa. Soy una persona apasionada por este tema y he aprendido mucho, pero nadie
              sabe el futuro: todo lo que se cuenta se basa en estadísticas de lo que ha pasado en la historia.
            </p>
            <p>
              Aquí te explico los hechos. Si quieres buscar productos concretos, hoy en día hay muchísima información en
              internet, o puedes contactar con gente que sabe de verdad y te puede asesorar, porque cada persona es un mundo
              y tiene más o menos tolerancia al riesgo. Yo no doy ese asesoramiento, pero hay quien lo da.
            </p>
            <p className="text-white font-semibold">
              Mi intención no es venderte nada. Lo que hago es puramente vocacional.
            </p>
          </div>
          <p className="mt-6 text-xs text-white/45">Esto no es asesoramiento financiero.</p>
        </motion.div>
      </section>
    </div>
  );
}
