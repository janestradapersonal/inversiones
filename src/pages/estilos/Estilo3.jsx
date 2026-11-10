import { Link } from "react-router-dom";
import { Flame, PiggyBank, TrendingUp, PieChart, Landmark } from "lucide-react";
import { NAV, OBJETIVOS, NO_HARA, TEXTO_NO, MILLON, BarrasMillon, useFuentes, Selector } from "./comun";

// Estilo 3 · «Indigo»: Onyx Black #01010D y Electric Indigo #6331FB. Portada bañada en índigo,
// palabras gigantes condensadas en blanco con la segunda mitad en cursiva serif y una figura central iluminada.
const C = { onyx: "#01010D", indigo: "#6331FB" };

const TEMAS = [
  [<Flame key="a" className="w-4 h-4" />, "Inflación"],
  [<PiggyBank key="b" className="w-4 h-4" />, "Ahorro"],
  [<TrendingUp key="c" className="w-4 h-4" />, "Interés compuesto"],
  [<PieChart key="d" className="w-4 h-4" />, "Fondos indexados"],
  [<Landmark key="e" className="w-4 h-4" />, "Pensiones"],
];

// Figura central: una moneda de euro iluminada por el índigo desde un lado
function Moneda() {
  return (
    <div className="relative w-[15rem] h-[15rem] md:w-[27vw] md:h-[27vw]">
      <div className="absolute inset-[-25%] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(160,130,255,0.55), transparent 65%)" }} />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 70% 35%, #8C6BFF 0%, #3A1AB8 35%, ${C.onyx} 75%)`,
          boxShadow: "inset -18px -10px 40px rgba(0,0,0,0.7), inset 14px 10px 30px rgba(170,150,255,0.6), 0 40px 80px rgba(1,1,13,0.6)",
        }}
      />
      <div className="absolute inset-[9%] rounded-full border-2 border-white/15" />
      <span className="absolute inset-0 flex items-center justify-center font-serif italic text-[10rem] md:text-[18vw] leading-none text-white/90" style={{ textShadow: "6px 0 30px rgba(140,107,255,0.9)" }}>
        €
      </span>
    </div>
  );
}

export default function Estilo3() {
  useFuentes();
  return (
    <div style={{ background: C.onyx }} className="min-h-screen text-white font-inter">
      {/* Portada */}
      <section className="relative overflow-hidden md:h-[100dvh] md:min-h-[640px]" style={{ background: `radial-gradient(ellipse at 50% 45%, #7A52FF 0%, ${C.indigo} 35%, #2C129A 75%, #1A0A63 100%)` }}>
        <header className="relative z-10 flex items-center justify-between px-5 md:px-10 pt-5 text-[10px] md:text-[11px] font-semibold uppercase tracking-wider">
          <span className="text-base md:text-lg font-bold normal-case tracking-normal">
            inversionesfácil
            <span className="block text-[8px] uppercase tracking-[0.2em] opacity-70 font-medium">educación financiera gratis</span>
          </span>
          <nav className="hidden md:flex gap-7 opacity-85">
            {NAV.slice(1).map(([t, to]) => (
              <Link key={t} to={to}>
                {t}
              </Link>
            ))}
          </nav>
          <Link to="/empieza" className="opacity-85">
            Empieza
          </Link>
        </header>

        <div className="relative md:absolute md:inset-0 flex flex-col md:block items-center px-5 pt-10 md:pt-0 pb-10">
          {/* Izquierda */}
          <div className="md:absolute md:left-[6%] md:top-[18%] z-10 self-start">
            <h1 className="font-display uppercase text-[4.2rem] md:text-[8vw] leading-[0.85]">Nadie nos</h1>
            <p className="font-serif italic text-[3.2rem] md:text-[5.4vw] leading-[0.9] -mt-1">lo ha enseñado</p>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider max-w-[15rem]">El dinero, la inflación y la inversión con palabras normales</p>
            <p className="mt-2 text-[11px] leading-snug text-white/80 max-w-[15rem]">Cifras reales. Sin jerga. Para gente que parte de cero.</p>
          </div>

          {/* Centro */}
          <div className="my-6 md:my-0 md:absolute md:left-1/2 md:top-[52%] md:-translate-x-1/2 md:-translate-y-1/2">
            <Moneda />
          </div>

          {/* Derecha */}
          <div className="md:absolute md:right-[6%] md:top-[40%] z-10 self-end text-right">
            <p className="font-display uppercase text-[4.2rem] md:text-[8vw] leading-[0.85]">Pero nos</p>
            <p className="font-serif italic text-[3.2rem] md:text-[5.4vw] leading-[0.9] -mt-1">afecta a todos</p>
            <ul className="mt-5 ml-auto w-56 text-[9px] font-bold uppercase tracking-wider text-left">
              {["100 % educativo", "Sin venderte nada", "Cifras con su fuente", "Gratis para siempre"].map((t) => (
                <li key={t} className="py-1.5 border-b border-white/30">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Temas, como la fila de logotipos */}
          <div className="mt-10 md:mt-0 md:absolute md:bottom-8 md:left-0 md:right-0 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs md:text-sm font-semibold">
            {TEMAS.map(([ic, t], i) => (
              <span key={t} className={`flex items-center gap-2 ${i ? "md:pl-6 md:border-l border-white/30" : ""}`}>
                {ic} {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Objetivos */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.9]">
          Tres <span className="font-serif italic normal-case" style={{ color: "#9E85FF" }}>objetivos</span>
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {OBJETIVOS.map((o) => (
            <div key={o.n} className="rounded-3xl p-7 border border-white/10" style={{ background: "linear-gradient(160deg, rgba(99,49,251,0.28), rgba(1,1,13,0.2))" }}>
              <p className="font-display text-6xl" style={{ color: C.indigo }}>
                0{o.n}
              </p>
              <h3 className="font-display uppercase text-3xl mt-3 leading-none">{o.titulo}</h3>
              <p className="font-serif italic text-2xl text-white/85">{o.resalto}</p>
              <ul className="mt-5 text-[11px] font-bold uppercase tracking-wider">
                {o.items.map((t) => (
                  <li key={t} className="py-2 border-b border-white/15 leading-snug">
                    {t}
                  </li>
                ))}
              </ul>
              <Link to={o.enlace[1]} className="inline-block mt-6 px-5 py-2.5 rounded-full text-sm font-bold" style={{ background: C.indigo }}>
                {o.enlace[0]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplo */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">Ejemplo con rentabilidades teóricas</p>
        <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] mt-2">
          1 millón <span className="font-serif italic normal-case" style={{ color: "#9E85FF" }}>a los {MILLON.edad}</span>
        </h2>
        <p className="mt-2 text-white/70">300 € al mes desde los 20 años, al 7 % anual.</p>
        <div className="mt-8">
          <BarrasMillon puesto="#FFFFFF" ganado={C.indigo} linea="rgba(255,255,255,0.08)" />
        </div>
        <p className="mt-3 text-[11px] text-white/50">Blanco: lo que pones. Índigo: lo que pone el interés compuesto. Sin comisiones ni impuestos. Ninguna inversión lo garantiza.</p>
      </section>

      {/* Lo que no hará */}
      <section className="px-5 py-20" style={{ background: C.indigo }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider">Lo que esta web no hará</p>
          <ul className="mt-4 font-display uppercase text-5xl md:text-8xl leading-[0.92]">
            {NO_HARA.map(([a, b]) => (
              <li key={b}>
                {a} <span className="font-serif italic normal-case" style={{ color: C.onyx }}>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-white/90 text-lg leading-relaxed">{TEXTO_NO}</p>
        </div>
      </section>
      <Selector n={3} />
    </div>
  );
}
