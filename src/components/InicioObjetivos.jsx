import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ChevronDown, Megaphone, Rocket, Ban } from "lucide-react";

// Primera pantalla de la web: qué quiere conseguir y qué no hará.
// (El fondo con efectos de "sube y baja" se añadirá más adelante.)

const motivos = [
  "El euro y el dólar (dinero fiat) son la peor forma de guardar valor a futuro",
  "Las pensiones pintan cada vez peor: la pirámide de población se ha invertido",
  "Los gobiernos gastan más de lo que tienen: la deuda y sus intereses no paran de crecer",
];

const apartadosAprende = ["Conceptos básicos", "Productos financieros", "Carteras"];

// Lista numerada dentro de un objetivo (motivos, apartados…)
function Lista({ items, color = "#FF5C7A" }) {
  return (
    <ul className="space-y-3">
      {items.map((m, k) => (
        <motion.li
          key={m}
          {...aparece(k + 1)}
          className="flex items-start gap-4 rounded-2xl bg-brand-onyx/70 border border-white/10 px-5 py-4"
        >
          <span
            className="shrink-0 w-8 h-8 rounded-full font-bold flex items-center justify-center"
            style={{ color, backgroundColor: `${color}26` }}
          >
            {k + 1}
          </span>
          <span className="text-white text-lg md:text-xl font-semibold leading-snug">{m}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function Enlace({ to, children }) {
  return (
    <Link to={to} className="mt-6 inline-flex items-center gap-2 font-bold text-brand-mint group">
      {children} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

const aparece = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.6 },
  viewport: { once: true, margin: "-60px" },
});

function Objetivo({ n, icon, titulo, resaltado, children, i }) {
  return (
    <motion.div
      {...aparece(i)}
      className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-10"
    >
      <div className="flex items-center gap-4 mb-5">
        <span className="font-display text-5xl md:text-6xl text-brand-mint leading-none">0{n}</span>
        <span className="w-11 h-11 rounded-2xl bg-brand-indigo flex items-center justify-center text-white">{icon}</span>
      </div>
      <h3 className="font-display uppercase text-3xl md:text-5xl leading-[0.95] mb-5">
        {titulo} <span className="font-serif italic normal-case text-brand-mint">{resaltado}</span>
      </h3>
      {children}
    </motion.div>
  );
}

export default function InicioObjetivos() {
  return (
    <div className="relative bg-brand-onyx overflow-hidden">
      {/* Luz de ambiente */}
      <div className="absolute -top-40 left-1/4 w-[70vw] h-[70vw] rounded-full bg-brand-indigo/20 blur-[140px] pointer-events-none" />

      {/* Pantalla de entrada */}
      <section
        className="relative min-h-[100dvh] flex items-center"
        style={{ background: "radial-gradient(ellipse at 50% 45%, #7A52FF 0%, #6331FB 35%, #2C129A 75%, #1A0A63 100%)" }}
      >
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/50 text-white font-semibold text-sm mb-6">
              Inversiones para todos
            </span>
            <h1 className="font-display uppercase text-white text-[3.2rem] sm:text-7xl md:text-[7.5rem] leading-[0.88] tracking-tight max-w-5xl">
              Nadie nos lo ha enseñado
              <span className="block font-serif italic normal-case text-white text-[2.3rem] sm:text-6xl md:text-8xl leading-[1] mt-2">
                pero nos afecta a todos
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-white/85">
              El dinero, la inflación y la inversión explicados con palabras normales. Esta web tiene tres objetivos:
            </p>
          </motion.div>

          <ol className="mt-8 grid md:grid-cols-3 gap-3">
            {["Concienciar de la necesidad de invertir", "Aprender lo básico, desde tu nivel", "Dar el primer paso, aunque sea con poco"].map(
              (t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-start gap-3 rounded-2xl bg-brand-onyx/25 border border-white/20 px-5 py-4"
                >
                  <span className="font-display text-3xl text-white leading-none">{i + 1}</span>
                  <span className="font-semibold text-white/90 leading-snug">{t}</span>
                </motion.li>
              )
            )}
          </ol>

          <motion.div
            className="mt-10 flex items-center gap-2 text-white/70 text-sm font-semibold"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Desliza <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Los tres objetivos */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-4">
        <Objetivo n={1} i={0} icon={<Megaphone className="w-5 h-5" />} titulo="Concienciar de la" resaltado="necesidad de invertir">
          <p className="text-white/70 text-lg mb-5">Tres motivos:</p>
          <Lista items={motivos} />
          <Enlace to="/por-que-invertir">Ver por qué invertir</Enlace>
        </Objetivo>

        <div className="grid md:grid-cols-2 gap-4">
          <Objetivo n={2} i={1} icon={<BookOpen className="w-5 h-5" />} titulo="Aprender" resaltado="desde tu nivel">
            <p className="text-white/75 text-lg leading-relaxed mb-5">
              Partas de donde partas, formarte lo mínimo para entender qué haces con tu dinero. Tres apartados:
            </p>
            <Lista items={apartadosAprende} color="#9E85FF" />
            <Enlace to="/aprende">Ir a aprender</Enlace>
          </Objetivo>
          <Objetivo n={3} i={2} icon={<Rocket className="w-5 h-5" />} titulo="Dar el" resaltado="primer paso">
            <p className="text-white/75 text-lg leading-relaxed">
              Cuando entiendas por qué y tengas confianza, empezar. Lo importante es entrar en este mundo, aunque sea con poco:
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["10 €", "100 €", "1.000 €", "lo que sea"].map((c) => (
                <span key={c} className="px-4 py-2 rounded-full bg-[#F5C542]/15 text-[#F5C542] font-display text-2xl leading-none">
                  {c}
                </span>
              ))}
            </div>
            <Enlace to="/empieza">Ver cómo empezar</Enlace>
          </Objetivo>
        </div>

        {/* Lo que esta web no hará */}
        <motion.div
          {...aparece()}
          className="rounded-3xl border-2 border-[#FF5C7A]/50 bg-[#FF5C7A]/[0.06] p-6 md:p-10"
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
