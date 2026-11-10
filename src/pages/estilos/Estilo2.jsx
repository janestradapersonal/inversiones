import { Link } from "react-router-dom";
import { Megaphone, BookOpen, Rocket, Ban, Check } from "lucide-react";
import { NAV, OBJETIVOS, NO_HARA, TEXTO_NO, MILLON, BarrasMillon, useFuentes, Selector } from "./comun";

// Estilo 2 · «Sky»: Sky Blue #0593C6 y Polar White #FCFFFF. Limpio, tipo plataforma: degradado de cielo,
// menú en píldora, esfera de puntos luminosa con etiquetas y tarjetas de cristal.
const C = { sky: "#0593C6", white: "#FCFFFF" };
const jakarta = { fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' };

// Esfera de puntos (distribución de Fibonacci, solo la cara visible)
const PUNTOS = (() => {
  const n = 900;
  const out = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (z > -0.15) out.push([x, y, z]);
  }
  return out;
})();

const ETIQUETAS = [
  ["Inflación", -0.55, -0.45],
  ["Interés compuesto", 0.35, -0.6],
  ["Pensiones", -0.7, 0.15],
  ["Deuda pública", 0.55, 0.3],
  ["Fondos indexados", -0.15, 0.62],
];

function Esfera() {
  const R = 150;
  return (
    <svg viewBox="-200 -200 400 400" className="w-full h-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="halo">
          <stop offset="0%" stopColor="#E9FBFF" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#7FD8F5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0593C6" stopOpacity="0" />
        </radialGradient>
        <filter id="brillo">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle r={R * 1.35} fill="url(#halo)" />
      <circle r={R} fill="#0A6FA0" opacity="0.35" />
      <g filter="url(#brillo)">
        {PUNTOS.map(([x, y, z], i) => (
          <circle key={i} cx={x * R} cy={y * R} r={0.8 + z * 1.2} fill="#F2FDFF" opacity={0.25 + z * 0.7} />
        ))}
      </g>
      {/* arcos entre conceptos */}
      {ETIQUETAS.slice(0, -1).map(([, x1, y1], i) => {
        const [, x2, y2] = ETIQUETAS[i + 1];
        return (
          <path key={i} d={`M${x1 * R} ${y1 * R} Q ${((x1 + x2) / 2) * R * 1.6} ${((y1 + y2) / 2) * R * 1.6} ${x2 * R} ${y2 * R}`} fill="none" stroke="#FFFFFF" strokeOpacity="0.75" strokeWidth="1.3" />
        );
      })}
      {ETIQUETAS.map(([t, x, y]) => (
        <g key={t} transform={`translate(${x * R} ${y * R})`}>
          <circle r="4" fill="#fff" />
          <rect x="8" y="-11" rx="11" width={t.length * 6.4 + 18} height="22" fill="#fff" />
          <text x="17" y="4" fontSize="10.5" fontWeight="700" fill="#0B2A3A" style={jakarta}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Cristal({ titulo, texto, className }) {
  return (
    <div className={`rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-[0_10px_40px_rgba(5,147,198,0.25)] p-4 w-60 text-left ${className}`}>
      <p className="font-bold text-[#0B2A3A] text-sm">{titulo}</p>
      <p className="text-[#3D5866] text-xs mt-1 leading-snug">{texto}</p>
    </div>
  );
}

const ICONOS = [<Megaphone key="1" className="w-5 h-5" />, <BookOpen key="2" className="w-5 h-5" />, <Rocket key="3" className="w-5 h-5" />];

export default function Estilo2() {
  useFuentes();
  return (
    <div style={{ background: C.white, ...jakarta }} className="min-h-screen text-[#0B2A3A] [&_h1]:[font-family:inherit] [&_h2]:[font-family:inherit] [&_h3]:[font-family:inherit]">
      {/* Portada */}
      <section className="relative overflow-hidden text-white" style={{ background: `linear-gradient(180deg, ${C.sky} 0%, #2AA8D8 45%, #8FD3EE 80%, #DDF3FB 100%)` }}>
        <header className="relative z-10 flex items-center justify-between px-5 md:px-10 pt-5">
          <span className="flex items-center gap-2 font-bold text-lg">
            <span className="w-6 h-6 rounded-full border-[3px] border-white border-r-transparent rotate-45" />
            inversionesfácil
          </span>
          <nav className="hidden md:flex gap-1 p-1 rounded-full bg-white/15 border border-white/25 backdrop-blur text-sm font-medium">
            {NAV.map(([t, to], i) => (
              <Link key={t} to={to} className={`px-4 py-1.5 rounded-full ${i === 0 ? "bg-white/30" : "hover:bg-white/15"}`}>
                {t}
              </Link>
            ))}
          </nav>
          <Link to="/empieza" className="px-4 py-1.5 rounded-full border border-white text-sm font-semibold">
            Empieza ya
          </Link>
        </header>

        <div className="relative z-10 text-center px-5 pt-14 md:pt-16">
          <h1 className="font-bold text-[2.5rem] md:text-6xl leading-[1.08] tracking-tight">
            Nadie nos lo ha enseñado,
            <br />
            pero nos afecta a todos
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-white/90 md:text-lg">
            El dinero, la inflación y la inversión explicados con palabras normales y cifras reales. Sin venderte nada.
          </p>
          <Link to="/aprende" className="inline-block mt-7 px-7 py-3 rounded-full bg-white font-bold shadow-lg" style={{ color: C.sky }}>
            Empieza a aprender
          </Link>
        </div>

        <div className="relative h-[430px] md:h-[520px] mt-4 md:-mt-2">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[380px] h-[380px] md:w-[500px] md:h-[500px]">
            <Esfera />
          </div>
          <Cristal className="hidden md:block absolute left-[5%] top-[12%]" titulo="Concienciar" texto="Por qué tu dinero pierde valor si no haces nada: el euro, las pensiones y la deuda." />
          <Cristal className="hidden md:block absolute right-[4%] top-[70%]" titulo="Aprender desde cero" texto="Conceptos básicos, productos financieros y carteras, explicados paso a paso." />
        </div>
      </section>

      {/* Objetivos */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <p className="text-center font-semibold" style={{ color: C.sky }}>
          Tres objetivos
        </p>
        <h2 className="text-center text-3xl md:text-5xl font-bold tracking-tight mt-2">Lo que vas a encontrar aquí</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {OBJETIVOS.map((o, i) => (
            <div key={o.n} className="rounded-3xl border border-[#D7EEF7] bg-white p-7 shadow-[0_8px_30px_rgba(5,147,198,0.08)]">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: C.sky }}>
                {ICONOS[i]}
              </span>
              <h3 className="mt-5 text-xl font-bold">
                {o.titulo} <span style={{ color: C.sky }}>{o.resalto}</span>
              </h3>
              <p className="text-sm text-[#5A7380] mt-2">{o.intro}</p>
              <ul className="mt-4 space-y-2.5">
                {o.items.map((t) => (
                  <li key={t} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: C.sky }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link to={o.enlace[1]} className="inline-block mt-6 text-sm font-bold" style={{ color: C.sky }}>
                {o.enlace[0]} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplo */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="rounded-[2rem] p-7 md:p-12 text-white" style={{ background: `linear-gradient(135deg, ${C.sky}, #0A6FA0)` }}>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">Ejemplo con rentabilidades teóricas</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">300 € al mes, 1 millón a los {MILLON.edad}</h2>
          <p className="mt-2 text-white/85 max-w-xl">La magnitud de la constancia y del interés compuesto, empezando a los 20 años.</p>
          <div className="mt-8">
            <BarrasMillon puesto="rgba(255,255,255,0.45)" ganado="#FFFFFF" linea="rgba(255,255,255,0.18)" redondeo={6} />
          </div>
          <p className="mt-3 text-xs text-white/75">Claro: lo que pones. Blanco: lo que pone el interés compuesto. 7 % anual fijo, sin comisiones ni impuestos. Ninguna inversión lo garantiza.</p>
        </div>
      </section>

      {/* Lo que no hará */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="rounded-[2rem] border border-[#D7EEF7] bg-[#F2FAFD] p-7 md:p-12 grid md:grid-cols-2 gap-8">
          <div>
            <p className="flex items-center gap-2 font-semibold text-sm" style={{ color: C.sky }}>
              <Ban className="w-4 h-4" /> Lo que esta web no hará
            </p>
            <ul className="mt-4 space-y-2 text-2xl md:text-3xl font-bold tracking-tight">
              {NO_HARA.map(([a, b]) => (
                <li key={b}>
                  {a} <span className="line-through decoration-[3px]" style={{ textDecorationColor: C.sky }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[#3D5866] leading-relaxed self-center">{TEXTO_NO}</p>
        </div>
      </section>
      <Selector n={2} />
    </div>
  );
}
