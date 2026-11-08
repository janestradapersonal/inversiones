import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import HistoriaFlechas, { COLORES, useT } from "@/components/porque/HistoriaFlechas";
import Motivo1 from "@/components/porque/Motivo1";
import Motivo2 from "@/components/porque/Motivo2";
import Motivo3 from "@/components/porque/Motivo3";

// «Por qué invertir» como historia con scroll: dos flechas caen hacia el globo de la deuda.
// Las escenas ([data-escena]) son transparentes y dejan ver el 3D fijo de detrás;
// el contenido de cada motivo va encima, con fondo propio.

const MOTIVOS = [
  { n: 1, color: COLORES.euro, titulo: "El euro", resalto: "pierde valor", sub: "El euro y el dólar (el dinero fiat) son la peor forma de guardar valor a futuro." },
  { n: 2, color: COLORES.pensiones, titulo: "Las pensiones", resalto: "pintan peor", sub: "La pirámide de población se ha invertido: más jubilados, durante más años, y menos jóvenes para pagarlos." },
  { n: 3, color: COLORES.deuda, titulo: "La deuda", resalto: "no para de crecer", sub: "Los gobiernos gastan más de lo que tienen. Cada vez se pagan más intereses y queda menos para todo lo demás." },
];

const clamp = (x) => Math.min(1, Math.max(0, x));
// Visible entre a y b, con fundidos de f
const ventana = (T, a, b, f = 0.05) => Math.min(clamp((T - a) / f), clamp((b - T) / f));

function Texto({ o, className = "", children }) {
  return (
    <div
      className={`absolute inset-0 flex px-4 sm:px-6 pointer-events-none ${className}`}
      style={{ opacity: o, transform: `translateY(${(1 - o) * 24}px)`, visibility: o > 0.01 ? "visible" : "hidden" }}
    >
      {children}
    </div>
  );
}

// Rótulo grande de motivo que aparece cuando la pantalla se llena del color de la flecha
function Rotulo({ m, o }) {
  return (
    <Texto o={o} className="items-center justify-center text-center">
      <div className="text-brand-onyx">
        <p className="font-display text-[22vw] md:text-[14rem] leading-none">{m.n}</p>
        <p className="font-display uppercase text-4xl md:text-7xl leading-none -mt-2">{m.titulo}</p>
      </div>
    </Texto>
  );
}

function Escena({ idx, alto, children }) {
  return (
    <section data-escena={idx} className="relative z-10" style={{ height: alto }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">{children}</div>
    </section>
  );
}

function TextosEscena0() {
  const T = useT();
  return (
    <>
      <Texto o={ventana(T, -1, 0.22)} className="items-start pt-20 md:pt-24 justify-center">
        <div className="text-center w-full max-w-5xl">
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-brand-mint mb-2">Paso 1 · Por qué invertir</p>
          <h1 className="font-display uppercase text-6xl sm:text-7xl md:text-[7.5rem] leading-[0.86] tracking-tight">
            3 motivos
            <span className="block font-serif italic normal-case text-brand-mint text-3xl sm:text-5xl md:text-6xl mt-1">para empezar a invertir</span>
          </h1>
          <ol className="mt-5 flex flex-wrap justify-center gap-2 md:gap-3">
            {MOTIVOS.map((m) => (
              <li key={m.n} className="flex items-center gap-2 rounded-full bg-brand-onyx/70 backdrop-blur-sm border border-white/10 pl-2 pr-4 py-1.5">
                <span className="w-7 h-7 rounded-full flex items-center justify-center font-display text-lg text-brand-onyx" style={{ background: m.color }}>
                  {m.n}
                </span>
                <span className="font-semibold text-white text-xs md:text-sm">
                  {m.titulo} {m.resalto}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Texto>
      <Texto o={ventana(T, -1, 0.22)} className="items-end pb-6 justify-center">
        <motion.div
          className="flex flex-col items-center text-white font-semibold"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-sm md:text-base">Desliza para empezar</span>
          <ChevronDown className="w-7 h-7" />
        </motion.div>
      </Texto>
      <Texto o={ventana(T, 0.35, 0.8)} className="items-end pb-10 md:pb-14 justify-start bg-gradient-to-t from-brand-onyx/80 via-transparent to-transparent">
        <p className="max-w-6xl w-full mx-auto font-display uppercase text-3xl md:text-5xl leading-[0.95]">
          Primera flecha:
          <span className="block font-serif italic normal-case" style={{ color: COLORES.euro }}>
            tu dinero pierde valor
          </span>
        </p>
      </Texto>
      <Rotulo m={MOTIVOS[0]} o={ventana(T, 0.88, 1.2, 0.04)} />
    </>
  );
}

function TextosEscena1() {
  const T = useT();
  return (
    <>
      <Rotulo m={MOTIVOS[0]} o={ventana(T, 0.8, 1.06, 0.04)} />
      <Texto o={ventana(T, 1.16, 1.5)} className="items-end pb-10 md:pb-14 justify-start bg-gradient-to-t from-brand-onyx/80 via-transparent to-transparent">
        <p className="max-w-6xl w-full mx-auto font-display uppercase text-3xl md:text-5xl leading-[0.95]">
          Las flechas siguen cayendo…
          <span className="block font-serif italic normal-case" style={{ color: COLORES.pensiones }}>
            y la segunda viene detrás
          </span>
        </p>
      </Texto>
      <Rotulo m={MOTIVOS[1]} o={ventana(T, 1.88, 2.2, 0.04)} />
    </>
  );
}

function TextosEscena2() {
  const T = useT();
  return (
    <>
      <Rotulo m={MOTIVOS[1]} o={ventana(T, 1.8, 2.06, 0.04)} />
      <Texto o={ventana(T, 2.15, 2.48)} className="items-end pb-10 md:pb-14 justify-start bg-gradient-to-t from-brand-onyx/80 via-transparent to-transparent">
        <p className="max-w-6xl w-full mx-auto font-display uppercase text-3xl md:text-5xl leading-[0.95]">
          Y abajo, el globo de la deuda,
          <span className="block font-serif italic normal-case" style={{ color: COLORES.deuda }}>
            cada vez más grande
          </span>
        </p>
      </Texto>
      <Texto o={ventana(T, 2.58, 2.82, 0.03)} className="items-center justify-center">
        <p className="font-display uppercase text-[24vw] md:text-[16rem] leading-none text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]">¡Pum!</p>
      </Texto>
      <Rotulo m={MOTIVOS[2]} o={ventana(T, 2.88, 3.2, 0.04)} />
    </>
  );
}

// Contenido de cada motivo: arriba sale del color de la flecha y, si sigue otra escena, vuelve a ese color al final
function Contenido({ m, children, cierre = true }) {
  return (
    <section className="relative z-10">
      <div className="pt-[12vh] pb-16" style={{ background: `linear-gradient(${m.color} 0, ${m.color} 6vh, ${COLORES.fondo} 46vh)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-14">
          <p className="font-display uppercase text-brand-onyx text-lg md:text-2xl">Motivo {m.n}</p>
          <h2 className="font-display uppercase text-5xl md:text-8xl leading-[0.9] tracking-tight mt-2">
            {m.titulo} <span className="font-serif italic normal-case" style={{ color: m.color }}>{m.resalto}</span>
          </h2>
          <p className="mt-5 text-white/85 text-lg md:text-2xl leading-snug max-w-3xl">{m.sub}</p>
        </div>
        {children}
      </div>
      {cierre && <div className="h-[60vh]" style={{ background: `linear-gradient(${COLORES.fondo}, ${m.color})` }} />}
    </section>
  );
}

export default function PorQueInvertir() {
  return (
    <div className="relative">
      <HistoriaFlechas />

      <Escena idx={0} alto="320vh">
        <TextosEscena0 />
      </Escena>
      <Contenido m={MOTIVOS[0]}>
        <Motivo1 />
      </Contenido>

      <Escena idx={1} alto="300vh">
        <TextosEscena1 />
      </Escena>
      <Contenido m={MOTIVOS[1]}>
        <Motivo2 />
      </Contenido>

      <Escena idx={2} alto="360vh">
        <TextosEscena2 />
      </Escena>
      <Contenido m={MOTIVOS[2]} cierre={false}>
        <Motivo3 />
      </Contenido>

      {/* Final */}
      <section className="relative z-10 bg-brand-onyx pb-20 pt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-brand-surface border border-white/10 p-8 md:p-12 text-center">
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-4">
              Y ahora es <span className="font-serif italic normal-case text-brand-mint">facilísimo</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Antes necesitabas mucho dinero y un banco que te cobrara comisiones altísimas. Hoy hay brokers con los que empiezas
              con 1 €. No hace falta saber muchísimo: puedes aprender sobre la marcha, y si te equivocas con 10 €, no pasa
              absolutamente nada. Lo importante es empezar a proteger lo que tienes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/aprende" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold text-lg hover:scale-105 transition-transform">
                Aprende lo básico <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/empieza" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/70 text-white font-bold text-lg hover:bg-white hover:text-brand-onyx transition-colors">
                Empieza ya
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/45">Contenido educativo. Esto no es asesoramiento financiero.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
