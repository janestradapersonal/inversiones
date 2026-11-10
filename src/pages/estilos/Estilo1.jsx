import { Link } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";
import { NAV, OBJETIVOS, NO_HARA, TEXTO_NO, MILLON, BarrasMillon, useFuentes, Selector } from "./comun";

// Estilo 1 · «Silent Power»: Egyptian Blue #03203D, Stone Blue #639CC5, Scarlet Red #EB2F33.
// Póster: título gigante en vertical, texto condensado en mayúsculas, salpicaduras y flechas pintadas a mano.
const C = { navy: "#03203D", stone: "#639CC5", red: "#EB2F33" };
const oswald = { fontFamily: "Oswald, Anton, sans-serif" };

function Salpicadura({ className }) {
  const gotas = [
    [120, 80, 34], [160, 120, 18], [90, 140, 22], [60, 70, 12], [190, 60, 10], [140, 40, 8], [40, 120, 7],
    [210, 150, 14], [110, 190, 9], [70, 200, 6], [175, 200, 11], [230, 100, 6], [20, 60, 5], [150, 170, 26],
  ];
  return (
    <svg viewBox="0 0 260 240" className={className} aria-hidden>
      {gotas.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={C.red} />
      ))}
      <path d="M120 80 L60 30 M150 170 L210 230 M120 80 L200 20" stroke={C.red} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Spray({ className }) {
  return (
    <svg viewBox="0 0 300 200" className={className} aria-hidden>
      <defs>
        <filter id="spray" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="14" result="d" />
          <feGaussianBlur in="d" stdDeviation="3.5" />
        </filter>
      </defs>
      <path d="M20 170 C 60 120, 120 190, 150 130 S 230 60, 200 110 S 120 150, 170 60 L 230 20" fill="none" stroke={C.stone} strokeWidth="22" strokeLinecap="round" filter="url(#spray)" opacity="0.9" />
    </svg>
  );
}

function FlechaPintada({ className }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden>
      <path d="M150 20 C 60 30, 40 110, 80 190" fill="none" stroke={C.red} strokeWidth="14" strokeLinecap="round" />
      <path d="M45 160 L 82 200 L 120 165" fill="none" stroke={C.red} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Euro grande con estela de movimiento (lo que en el ejemplo es la foto movida)
function EuroMovido() {
  return (
    <div className="relative w-[62%] aspect-square">
      {[6, 5, 4, 3, 2, 1].map((k) => (
        <div
          key={k}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ transform: `translateX(${-k * 22}px)`, background: C.navy, opacity: 0.09 * (7 - k), filter: `blur(${k * 3}px)` }}
        />
      ))}
      <div className="absolute inset-0 rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(3,32,61,0.5)]" style={{ background: `radial-gradient(circle at 35% 30%, #12406E, ${C.navy} 70%)` }}>
        <span className="font-display text-[11rem] md:text-[14rem] leading-none" style={{ color: C.stone }}>€</span>
      </div>
      {/* tachón rojo, como el de las gafas */}
      <svg viewBox="0 0 200 100" className="absolute left-[8%] top-[34%] w-[84%]" aria-hidden>
        <path d="M10 70 C 60 20, 120 90, 190 25" fill="none" stroke={C.red} strokeWidth="9" strokeLinecap="round" />
        <path d="M20 20 C 80 60, 130 40, 185 80" fill="none" stroke={C.red} strokeWidth="9" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Estilo1() {
  useFuentes();
  return (
    <div style={{ background: C.navy, ...oswald }} className="min-h-screen text-white">
      {/* Navegación */}
      <header className="h-14 flex items-center justify-between px-5 md:px-8 border-b border-white/15">
        <nav className="flex gap-5 md:gap-8 text-[11px] md:text-sm font-semibold uppercase tracking-wide overflow-x-auto">
          {NAV.slice(0, 4).map(([t, to]) => (
            <Link key={t} to={to} className="whitespace-nowrap hover:text-[#EB2F33]">
              {t}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4">
          <ShoppingBag className="w-4 h-4 hidden md:block" />
          <User className="w-4 h-4" />
        </div>
      </header>

      {/* Portada partida */}
      <section className="grid md:grid-cols-2 md:h-[calc(100dvh-3.5rem)] md:min-h-[620px]">
        {/* Izquierda */}
        <div className="relative overflow-hidden min-h-[88dvh] md:min-h-0 px-5 md:px-8 py-6">
          <p className="max-w-[9.5rem] md:max-w-[10.5rem] lg:max-w-[16rem] xl:max-w-[19rem] uppercase text-[11px] md:text-[13px] font-medium leading-[1.25]">
            Nadie nos explicó cómo funciona el dinero. Ni en el colegio ni en casa.
            <br />
            Pero cada año los precios suben, las pensiones dependen de menos gente y la deuda no para de crecer.
            <br />
            Aquí lo básico, con palabras normales y cifras reales:
            <br />
            sin venderte nada. Porque no saberlo también cuesta dinero.
          </p>
          <h1
            className="absolute top-6 right-4 md:right-6 font-display uppercase leading-[1.08] text-[9.5vh] md:text-[11.5vh]"
            style={{ writingMode: "vertical-rl", color: C.red }}
          >
            Nadie nos lo
            <br />
            ha enseñado
          </h1>
          <Spray className="absolute left-0 bottom-6 w-[70%] md:w-[60%]" />
          <Salpicadura className="absolute left-[6%] bottom-[22%] w-[42%] md:w-[38%]" />
          <Link
            to="/aprende"
            className="absolute bottom-8 right-6 md:right-[22%] px-8 py-2.5 border-2 uppercase font-semibold tracking-wide text-sm hover:bg-[#EB2F33] transition-colors"
            style={{ borderColor: C.red }}
          >
            Empieza aquí
          </Link>
        </div>

        {/* Derecha */}
        <div className="relative overflow-hidden min-h-[70dvh] md:min-h-0 flex items-center justify-center" style={{ background: C.stone }}>
          <p className="absolute top-5 left-5 uppercase font-semibold text-lg md:text-2xl" style={{ color: C.red }}>
            No te lo explicaron.
          </p>
          <p className="absolute top-5 right-5 uppercase font-semibold text-lg md:text-2xl" style={{ color: C.red }}>
            Te afecta.
          </p>
          <EuroMovido />
          <FlechaPintada className="absolute bottom-6 left-[18%] w-24 md:w-32" />
          <p className="absolute bottom-6 right-5 text-right font-display uppercase text-4xl md:text-6xl leading-[0.9]" style={{ color: C.navy }}>
            Pero nos afecta
            <br />a todos
          </p>
        </div>
      </section>

      {/* Objetivos */}
      <section className="grid md:grid-cols-3">
        {OBJETIVOS.map((o, i) => (
          <div key={o.n} className="relative p-6 md:p-10 border-t md:border-t-0 md:border-r border-white/15 min-h-[26rem]" style={{ background: i === 1 ? C.stone : C.navy, color: i === 1 ? C.navy : "#fff" }}>
            <p className="font-display text-[7rem] leading-none" style={{ color: C.red }}>
              0{o.n}
            </p>
            <h2 className="mt-2 font-display uppercase text-4xl md:text-5xl leading-[0.95]">{o.titulo}</h2>
            <p className="uppercase font-semibold text-sm mt-1" style={{ color: i === 1 ? C.navy : C.stone }}>
              {o.resalto}
            </p>
            <ul className="mt-5 space-y-2 uppercase text-[13px] leading-snug">
              {o.items.map((t) => (
                <li key={t} className="flex gap-2">
                  <span style={{ color: C.red }}>—</span>
                  {t}
                </li>
              ))}
            </ul>
            <Link to={o.enlace[1]} className="inline-block mt-6 px-5 py-2 border-2 uppercase text-xs font-semibold tracking-wide" style={{ borderColor: C.red }}>
              {o.enlace[0]}
            </Link>
          </div>
        ))}
      </section>

      {/* Lo que no hará */}
      <section className="px-5 md:px-10 py-14" style={{ background: C.red, color: C.navy }}>
        <p className="uppercase font-semibold tracking-[0.2em] text-sm text-white">Lo que esta web no hará</p>
        <ul className="mt-4 font-display uppercase text-5xl md:text-8xl leading-[0.95]">
          {NO_HARA.map(([a, b]) => (
            <li key={b}>
              {a} <span className="relative text-white">{b}<span className="absolute left-0 right-0 top-1/2 h-[6px] -rotate-2 bg-[#03203D]" /></span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl uppercase text-sm md:text-base font-medium leading-snug text-white">{TEXTO_NO}</p>
      </section>

      {/* Ejemplo */}
      <section className="px-5 md:px-10 py-14">
        <p className="uppercase text-sm font-semibold" style={{ color: C.stone }}>
          Ejemplo con rentabilidades teóricas
        </p>
        <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] mt-2">
          300 € al mes → <span style={{ color: C.red }}>1 millón a los {MILLON.edad}</span>
        </h2>
        <div className="mt-8">
          <BarrasMillon puesto={C.stone} ganado={C.red} linea="rgba(255,255,255,0.12)" redondeo={0} />
        </div>
        <p className="mt-3 uppercase text-[11px] text-white/60">
          <span style={{ color: C.stone }}>■</span> Lo que pones · <span style={{ color: C.red }}>■</span> Lo que pone el interés compuesto · 7 % anual fijo desde los 20, sin comisiones ni impuestos. Ninguna inversión lo garantiza.
        </p>
      </section>
      <Selector n={1} />
    </div>
  );
}
