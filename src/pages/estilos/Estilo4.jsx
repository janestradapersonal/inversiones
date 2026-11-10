import { Link } from "react-router-dom";
import { NAV, OBJETIVOS, NO_HARA, TEXTO_NO, MILLON, BarrasMillon, useFuentes, Selector } from "./comun";

// Estilo 4 · «Editorial»: Soft Sand #F0E5DB, Mocha Green #474329 y Watermelon Pink #FC75B4.
// Revista: letras gigantes condensadas en verde moca, una figura en el centro que se superpone,
// una palabra manuscrita en rosa cruzando y textos pequeños justificados con rayitas rosas.
const C = { sand: "#F0E5DB", mocha: "#474329", pink: "#FC75B4" };
const script = { fontFamily: '"Great Vibes", cursive' };

// Figura central: torres de monedas que crecen cada vez más rápido (el interés compuesto)
function Torres({ className }) {
  const alturas = [3, 4, 6, 9, 14, 21, 32];
  const ancho = 46;
  const grosor = 9;
  return (
    <svg viewBox="0 0 400 360" className={className} aria-hidden>
      <ellipse cx="200" cy="352" rx="190" ry="8" fill={C.mocha} opacity="0.18" />
      {alturas.map((h, i) => {
        const x = 18 + i * 53;
        return (
          <g key={i}>
            {Array.from({ length: h }, (_, k) => {
              const y = 342 - k * grosor;
              const ultima = i === alturas.length - 1 && k === h - 1;
              return (
                <g key={k}>
                  <rect x={x} y={y - grosor / 2} width={ancho} height={grosor} fill={ultima ? C.pink : C.mocha} />
                  <ellipse cx={x + ancho / 2} cy={y + grosor / 2} rx={ancho / 2} ry="4" fill={ultima ? "#D95A96" : "#363320"} />
                  <ellipse cx={x + ancho / 2} cy={y - grosor / 2} rx={ancho / 2} ry="4" fill={ultima ? "#FFA3CF" : "#6A6544"} stroke={C.sand} strokeOpacity="0.35" strokeWidth="0.8" />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function Etiqueta({ children, className = "" }) {
  return (
    <p className={`text-[9px] md:text-[11px] font-bold uppercase leading-tight ${className}`}>
      {children}
      <span className="block w-4 h-[2px] mt-1" style={{ background: C.pink }} />
    </p>
  );
}

export default function Estilo4() {
  useFuentes();
  return (
    <div style={{ background: C.sand, color: C.mocha }} className="min-h-screen font-inter">
      {/* Navegación repartida, con la activa subrayada en rosa */}
      <header className="flex justify-between px-5 md:px-10 pt-5 text-[9px] md:text-[11px] font-bold uppercase">
        {NAV.map(([t, to], i) => (
          <Link key={t} to={to} className="relative pb-1">
            {t}
            {i === 0 && <span className="absolute left-0 bottom-0 w-5 h-[2px]" style={{ background: C.pink }} />}
          </Link>
        ))}
      </header>

      {/* Portada */}
      <section className="relative overflow-hidden px-5 md:px-10 pt-6 pb-8 min-h-[92dvh] md:min-h-[600px] md:h-[calc(100dvh-2.5rem)]">
        <div className="relative font-display uppercase leading-[0.82] text-[19vw] md:text-[14vw]">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display whitespace-nowrap">Nadie nos</h1>
            <div className="hidden md:block w-[22%] pt-4">
              <span className="block text-sm mb-2" style={{ color: C.pink }}>///</span>
              <p className="font-inter normal-case text-[10px] leading-[1.3] font-semibold text-justify uppercase">
                Esta web nace de una idea sencilla: el dinero, la inflación y la inversión nos afectan a todos, pero casi nadie nos los
                ha explicado. Aquí se cuentan con palabras normales y cifras reales, de forma completamente educativa y sin venderte nada.
              </p>
            </div>
          </div>
          <p className="text-right">Lo ha</p>
          <p>Enseñado</p>
        </div>

        {/* Figura y palabra manuscrita encima de las letras */}
        <Torres className="absolute left-1/2 -translate-x-1/2 bottom-[14%] md:bottom-[3%] w-[80vw] md:w-[46vw]" />
        <p className="absolute left-1/2 top-[46%] md:top-[44%] z-10 -translate-x-1/2 -rotate-[10deg] w-[92vw] md:w-auto text-center md:whitespace-nowrap text-[17vw] md:text-[8vw] leading-[0.9]" style={{ ...script, color: C.pink }}>
          pero nos afecta a todos
        </p>

        <div className="absolute left-5 md:left-10 bottom-[30%] md:bottom-[34%] flex gap-10 md:gap-24">
          <Etiqueta>España.<br />Est. 2026</Etiqueta>
          <Etiqueta className="hidden md:block">Educación<br />financiera</Etiqueta>
        </div>
        <Etiqueta className="absolute right-5 md:right-10 bottom-[12%]">Sin vender<br />nada</Etiqueta>
        <p className="absolute left-5 md:left-10 bottom-4 text-[10px] font-bold flex items-center gap-3">
          01 / 03
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full" style={{ background: C.pink }} />
            <span className="w-1 h-1 rounded-full opacity-40" style={{ background: C.pink }} />
            <span className="w-1 h-1 rounded-full opacity-40" style={{ background: C.pink }} />
          </span>
        </p>
      </section>

      {/* Objetivos en columnas de revista */}
      <section className="px-5 md:px-10 py-16 border-t" style={{ borderColor: `${C.mocha}33` }}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display uppercase text-6xl md:text-9xl leading-[0.85]">
            Tres
            <br />
            objetivos
          </h2>
          <span className="text-4xl md:text-7xl" style={{ ...script, color: C.pink }}>
            para empezar
          </span>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-10">
          {OBJETIVOS.map((o) => (
            <div key={o.n} className="border-t-2 pt-5" style={{ borderColor: C.mocha }}>
              <p className="font-display text-7xl leading-none" style={{ WebkitTextStroke: `2px ${C.mocha}`, color: "transparent" }}>
                0{o.n}
              </p>
              <h3 className="font-display uppercase text-4xl mt-3 leading-none">{o.titulo}</h3>
              <p className="text-3xl leading-tight" style={{ ...script, color: C.pink }}>
                {o.resalto}
              </p>
              <ul className="mt-4 space-y-2 text-[11px] font-bold uppercase leading-snug">
                {o.items.map((t) => (
                  <li key={t}>
                    {t}
                    <span className="block w-4 h-[2px] mt-1" style={{ background: C.pink }} />
                  </li>
                ))}
              </ul>
              <Link to={o.enlace[1]} className="inline-block mt-5 text-[11px] font-bold uppercase border-b-2" style={{ borderColor: C.pink }}>
                {o.enlace[0]}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplo */}
      <section className="px-5 md:px-10 py-16" style={{ background: C.mocha, color: C.sand }}>
        <p className="text-[11px] font-bold uppercase">Ejemplo con rentabilidades teóricas</p>
        <h2 className="font-display uppercase text-6xl md:text-8xl leading-[0.85] mt-2">
          1 millón
          <span className="ml-4 normal-case text-5xl md:text-7xl" style={{ ...script, color: C.pink }}>
            a los {MILLON.edad}
          </span>
        </h2>
        <div className="mt-8">
          <BarrasMillon puesto={C.sand} ganado={C.pink} linea="rgba(240,229,219,0.12)" redondeo={0} />
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase opacity-70">Arena: lo que pones (300 €/mes desde los 20) · Rosa: lo que pone el interés compuesto al 7 % anual · Ninguna inversión lo garantiza</p>
      </section>

      {/* Lo que no hará */}
      <section className="px-5 md:px-10 py-16 pb-24 grid md:grid-cols-[1.4fr,1fr] gap-10">
        <div>
          <p className="text-[11px] font-bold uppercase">Lo que esta web no hará</p>
          <ul className="mt-3 font-display uppercase text-5xl md:text-7xl leading-[0.9]">
            {NO_HARA.map(([a, b]) => (
              <li key={b}>
                {a}{" "}
                <span style={{ textDecoration: "line-through", textDecorationColor: C.pink, textDecorationThickness: "6px" }}>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="self-end text-[11px] font-semibold uppercase leading-[1.4] text-justify">
          <span className="block mb-2" style={{ color: C.pink }}>///</span>
          {TEXTO_NO}
        </p>
      </section>
      <Selector n={4} />
    </div>
  );
}
