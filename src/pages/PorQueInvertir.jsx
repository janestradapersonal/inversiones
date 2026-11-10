import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Motivo1 from "@/components/porque/Motivo1";
import Motivo2 from "@/components/porque/Motivo2";
import Motivo3 from "@/components/porque/Motivo3";

// «Por qué invertir» como tres carteles.
// Cada motivo es un cartel de color a pantalla completa que se queda fijo; mientras se desliza, su ilustración
// se anima (el euro encoge, la pirámide se invierte, la deuda se apila) y después sube por encima una hoja oscura
// con el contenido del motivo (Motivo1/2/3, sin cambios).

const MOTIVOS = [
  { n: 1, id: "el-euro", color: "#3D8BFF", titulo: "El euro", resalto: "pierde valor", sub: "El euro y el dólar (el dinero fiat) son la peor forma de guardar valor a futuro." },
  { n: 2, id: "las-pensiones", color: "#FFC83D", titulo: "Las pensiones", resalto: "pintan peor", sub: "La pirámide de población se ha invertido: más jubilados, durante más años, y menos jóvenes para pagarlos." },
  { n: 3, id: "la-deuda", color: "#FF4D6D", titulo: "La deuda", resalto: "no para de crecer", sub: "Los gobiernos gastan más de lo que tienen. Cada vez se pagan más intereses y queda menos para todo lo demás." },
];

const ir = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

// --- Cinta que corre sin parar
function Cinta({ textos, fondo, color, giro = -2, lento = false }) {
  const linea = textos.map((t) => `${t}  ✦  `).join("");
  return (
    <div className="relative py-3 md:py-4 overflow-hidden select-none" style={{ background: fondo, color, transform: `rotate(${giro}deg) scale(1.05)` }}>
      <div className="flex w-max cinta" style={{ animationDuration: lento ? "60s" : "34s" }}>
        {[0, 1].map((k) => (
          <span key={k} aria-hidden={k === 1} className="font-display uppercase text-2xl md:text-4xl whitespace-pre pr-2">
            {linea.repeat(3)}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Ilustraciones de cada cartel (p: progreso de 0 a 1 mientras el cartel está fijo)

// 1. La moneda de euro encoge; el círculo discontinuo marca el tamaño que tenía
function Moneda({ p }) {
  const escala = useTransform(p, [0, 1], [1, 0.42]);
  const giro = useTransform(p, [0, 1], [0, -25]);
  const sombra = useTransform(p, [0, 1], [1, 0.35]);
  return (
    <div className="relative w-[min(70vw,46vh)] aspect-square">
      <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-brand-onyx/35" />
      <motion.div style={{ scale: escala, rotate: giro }} className="absolute inset-0 rounded-full bg-brand-onyx flex items-center justify-center shadow-[0_30px_60px_-20px_rgba(1,1,13,0.6)]">
        <div className="absolute inset-[7%] rounded-full border-2 border-white/15" />
        <motion.span style={{ opacity: sombra }} className="font-display text-white leading-none text-[min(38vw,26vh)]">
          €
        </motion.span>
      </motion.div>
      <p className="absolute -bottom-8 left-0 right-0 text-center text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-brand-onyx/70">
        Lo que puedes comprar con él
      </p>
    </div>
  );
}

// 2. La pirámide de población pasa de 1975 a 2055 (mismas cifras orientativas que el bloque del motivo 2)
const P1975 = [18, 17, 16, 14, 12, 10, 8, 4, 1.5, 0.3];
const P2055 = [7.5, 8, 8.5, 9.5, 10.5, 11.5, 13, 14, 11, 6];
function Barra({ p, i }) {
  const ancho = useTransform(p, [0, 1], [`${(P1975[i] / 18) * 100}%`, `${(P2055[i] / 18) * 100}%`]);
  return (
    <div className="flex justify-center h-full">
      <motion.div style={{ width: ancho }} className={`h-full rounded-full ${i >= 6 ? "bg-white" : "bg-brand-onyx"}`} />
    </div>
  );
}
function Piramide({ p }) {
  const antes = useTransform(p, [0.3, 0.5], [1, 0]);
  const despues = useTransform(p, [0.5, 0.7], [0, 1]);
  return (
    <div className="w-[min(78vw,52vh)]">
      <div className="grid grid-rows-10 gap-[0.6vh] h-[min(60vw,40vh)]">
        {P1975.map((_, k) => {
          const i = P1975.length - 1 - k; // los mayores arriba
          return <Barra key={i} p={p} i={i} />;
        })}
      </div>
      <div className="relative h-10 mt-4 font-display text-3xl md:text-4xl text-brand-onyx text-center">
        <motion.span style={{ opacity: antes }} className="absolute inset-0">1975</motion.span>
        <motion.span style={{ opacity: despues }} className="absolute inset-0">
          2055 <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-wider align-middle">proyección INE</span>
        </motion.span>
      </div>
      <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-brand-onyx/70">
        <span className="inline-block w-3 h-3 rounded-full bg-white align-middle mr-1.5" />
        60 años o más
      </p>
    </div>
  );
}

// 3. Monedas de deuda que se apilan sin parar
const N_MONEDAS = 22;
function Ficha({ p, i }) {
  const umbral = i / N_MONEDAS;
  const o = useTransform(p, [umbral * 0.95, umbral * 0.95 + 0.04], [0, 1]);
  const y = useTransform(p, [umbral * 0.95, umbral * 0.95 + 0.04], [-40, 0]);
  return (
    <motion.div
      style={{ opacity: o, y, bottom: `${i * 4.1}%`, left: `${50 + Math.sin(i * 1.7) * 3}%` }}
      className="absolute -translate-x-1/2 w-[58%] h-[7%] rounded-[50%] bg-brand-onyx border-[3px] border-white/80 shadow-[0_6px_0_#01010D]"
    />
  );
}
function Pila({ p }) {
  return (
    <div className="relative w-[min(60vw,38vh)] h-[min(90vw,58vh)]">
      {Array.from({ length: N_MONEDAS }, (_, i) => (
        <Ficha key={i} p={p} i={i} />
      ))}
      <p className="absolute -bottom-8 left-0 right-0 text-center text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-brand-onyx/70">
        Deuda sobre deuda
      </p>
    </div>
  );
}

const ILUSTRACION = { 1: Moneda, 2: Piramide, 3: Pila };

// --- Un motivo: cartel fijo + hoja con el contenido que sube por encima
function Motivo({ m, children }) {
  const tramo = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: tramo, offset: ["start end", "end end"] });
  const numeroY = useTransform(p, [0, 1], ["0%", "-12%"]);
  const Dibujo = ILUSTRACION[m.n];
  return (
    <section id={m.id} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden" style={{ background: m.color }}>
        {/* trama de puntos */}
        <div aria-hidden className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(#01010D 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }} />
        {/* número gigante */}
        <motion.span
          aria-hidden
          style={{ y: numeroY }}
          className="absolute -right-[4vw] -bottom-[8vh] font-display leading-[0.75] text-[78vw] md:text-[62vh] text-brand-onyx/[0.09] select-none"
        >
          0{m.n}
        </motion.span>

        <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-10 flex flex-col md:flex-row md:items-center gap-10 md:gap-6 text-brand-onyx">
          <div className="md:flex-1">
            <p className="inline-flex items-center gap-3 font-display uppercase text-lg md:text-2xl">
              <span className="px-3 py-0.5 rounded-full bg-brand-onyx text-white">Motivo 0{m.n}</span>
              <span className="opacity-60">/ 03</span>
            </p>
            <h2 className="font-display uppercase leading-[0.85] tracking-tight text-[17vw] md:text-[8.5rem] mt-4">{m.titulo}</h2>
            <p className="font-serif italic text-[11vw] md:text-7xl leading-[0.95] -mt-1">{m.resalto}</p>
            <p className="mt-5 md:mt-7 text-base md:text-xl font-medium leading-snug max-w-md">{m.sub}</p>
          </div>
          <div className="flex-1 flex items-center justify-center pb-6 md:pb-0">
            <Dibujo p={p} />
          </div>
        </div>
      </div>

      {/* tramo de scroll en el que el cartel está fijo y se anima */}
      <div ref={tramo} aria-hidden className="h-[90vh]" />

      {/* hoja con el contenido */}
      <div className="relative z-10 rounded-t-[2rem] md:rounded-t-[3rem] bg-brand-onyx shadow-[0_-30px_80px_-10px_rgba(1,1,13,0.7)] pt-14 md:pt-20 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 w-14 h-1.5 rounded-full" style={{ background: m.color }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xl text-brand-onyx" style={{ background: m.color }}>
            {m.n}
          </span>
          <p className="font-display uppercase text-xl md:text-2xl">
            {m.titulo} <span className="font-serif italic normal-case" style={{ color: m.color }}>{m.resalto}</span>
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function PorQueInvertir() {
  return (
    <div className="relative">
      <style>{`
        .cinta { animation: cinta linear infinite; }
        @keyframes cinta { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (prefers-reduced-motion: reduce) { .cinta { animation: none } }
      `}</style>

      {/* Portada: titular y los tres carteles en miniatura */}
      <section className="relative min-h-[100svh] flex flex-col pt-24 md:pt-32 overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-brand-mint"
          >
            Paso 1 · Por qué invertir
          </motion.p>
          <h1 className="font-display uppercase leading-[0.82] tracking-tight mt-3">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="block text-[24vw] md:text-[13rem]">
              3 motivos
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="block font-serif italic normal-case text-brand-mint text-[10vw] md:text-7xl leading-none mt-1 md:mt-0"
            >
              para empezar a invertir
            </motion.span>
          </h1>
        </div>

        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 mt-8 md:mt-12 flex flex-col md:flex-row gap-3 md:h-[38vh]">
          {MOTIVOS.map((m, i) => (
            <motion.button
              key={m.n}
              type="button"
              onClick={() => ir(m.id)}
              initial={{ opacity: 0, y: 50, rotate: (i - 1) * 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 120, damping: 16 }}
              className="group relative overflow-hidden rounded-3xl text-left text-brand-onyx p-5 md:p-7 flex md:flex-col justify-between items-end md:items-start md:flex-1 md:hover:flex-[1.6] transition-[flex-grow] duration-500"
              style={{ background: m.color }}
            >
              <span className="font-display leading-[0.8] text-6xl md:text-[9rem]">0{m.n}</span>
              <span className="flex-1 md:flex-none pl-4 md:pl-0">
                <span className="block font-display uppercase text-2xl md:text-4xl leading-none">{m.titulo}</span>
                <span className="block font-serif italic text-xl md:text-3xl leading-tight">{m.resalto}</span>
              </span>
              <ArrowDown className="absolute top-5 right-5 w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-y-1" />
            </motion.button>
          ))}
        </div>

        <div className="mt-auto pt-12 pb-6">
          <Cinta textos={MOTIVOS.map((m) => `${m.titulo} ${m.resalto}`)} fondo="#9E85FF" color="#01010D" />
        </div>
      </section>

      <Motivo m={MOTIVOS[0]}>
        <Motivo1 />
      </Motivo>
      <Motivo m={MOTIVOS[1]}>
        <Motivo2 />
      </Motivo>
      <Motivo m={MOTIVOS[2]}>
        <Motivo3 />
      </Motivo>

      {/* Final */}
      <section className="relative overflow-hidden bg-brand-mint text-brand-onyx">
        <Cinta textos={["Empieza con 1 €", "Aprende sobre la marcha", "Protege lo que tienes"]} fondo="#01010D" color="#9E85FF" giro={0} lento />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <h2 className="font-display uppercase leading-[0.85] tracking-tight text-[15vw] md:text-[9rem]">
            Y ahora es
            <span className="block font-serif italic normal-case text-white [text-shadow:0_4px_0_#01010D]">facilísimo</span>
          </h2>
          <p className="mt-8 text-lg md:text-2xl font-medium leading-snug max-w-3xl">
            Antes necesitabas mucho dinero y un banco que te cobrara comisiones altísimas. Hoy hay brokers con los que empiezas
            con 1&nbsp;€. No hace falta saber muchísimo: puedes aprender sobre la marcha, y si te equivocas con 10&nbsp;€, no pasa
            absolutamente nada. Lo importante es empezar a proteger lo que tienes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/aprende"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-onyx text-white font-bold text-lg hover:scale-105 transition-transform"
            >
              Aprende lo básico <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/empieza"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-brand-onyx font-bold text-lg hover:bg-brand-onyx hover:text-white transition-colors"
            >
              Empieza ya
            </Link>
          </div>
          <p className="mt-8 text-xs text-brand-onyx/60">Contenido educativo. Esto no es asesoramiento financiero.</p>
        </div>
      </section>
    </div>
  );
}
