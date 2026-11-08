import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Gráfico que crece con el scroll, con dos ejemplos teóricos a elegir.
// Cálculo común: 7 % anual (interés mensual equivalente), aportación a final de mes, empezando a los 20 años,
// sin comisiones ni impuestos.
const R = Math.pow(1.07, 1 / 12) - 1;
const EDAD = 20;

// Punto de miles siempre (toLocaleString no lo pone en números de 4 cifras)
const euros = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

function escenario({ aportacion, meta, ...resto }) {
  const valor = (meses) => (aportacion * (Math.pow(1 + R, meses) - 1)) / R;
  const mesesMeta = Math.ceil(Math.log((meta * R) / aportacion + 1) / Math.log(1 + R));
  const anosMeta = mesesMeta / 12;
  return {
    ...resto,
    aportacion,
    meta,
    valor,
    mesesMeta,
    anosMeta,
    barras: Math.ceil(anosMeta),
    maximo: valor(mesesMeta),
    puestoMeta: aportacion * mesesMeta,
    edadMeta: EDAD + Math.floor(anosMeta),
  };
}

// Sueldo de referencia: unos 1.500 € netos al mes (18.000 € al año). Es una cifra redondeada a partir del
// salario mediano del INE (Encuesta de Estructura Salarial 2023: 23.349 € brutos al año ≈ 1.550 € netos al mes).
const SUELDO_MES = 1500;
const SUELDO_ANO = SUELDO_MES * 12;

const ESCENARIOS = {
  sueldo: escenario({
    etiqueta: "Ejemplo 1",
    nombre: "Un segundo sueldo",
    aportacion: 100,
    meta: SUELDO_ANO / 0.07, // 257.143 €: su 7 % son 18.000 € al año
    eje: 275000,
    lineas: [50000, 100000, 150000, 200000, 250000],
    rotuloMeta: "1.500 €/mes",
  }),
  millon: escenario({
    etiqueta: "Ejemplo 2",
    nombre: "1 millón",
    aportacion: 300,
    meta: 1000000,
    eje: 1050000,
    lineas: [250000, 500000, 750000, 1000000],
    rotuloMeta: "1 millón",
  }),
};

// Visibilidad (0→1) de un texto entre dos puntos del recorrido, con fundido corto
const tramo = (x, entra, sale) => {
  const dentro = entra <= 0 ? 1 : Math.min(1, Math.max(0, (x - entra) / 0.06));
  const fuera = sale >= 1 ? 1 : Math.min(1, Math.max(0, (sale - x) / 0.06));
  return Math.min(dentro, fuera);
};
const estilo = (o, desplazamiento = (1 - o) * 30) => ({
  opacity: o,
  transform: `translateY(${desplazamiento}px)`,
  pointerEvents: o > 0.5 ? "auto" : "none",
});

function Textos({ id, e }) {
  if (id === "sueldo") {
    return {
      entrada: (
        <>
          <h2 className="font-display uppercase text-white text-4xl sm:text-6xl md:text-[5.5rem] leading-[0.9] tracking-tight">
            Tu segundo sueldo
            <span className="block font-serif italic normal-case text-brand-mint text-3xl sm:text-5xl md:text-7xl leading-[1] mt-1">
              o tu futura pensión
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-sm md:text-lg leading-relaxed text-white/75">
            El sueldo más habitual en España ronda los <b className="text-white">1.500 € netos al mes</b>:{" "}
            {euros(SUELDO_ANO)} al año. Para sacar eso cada año solo con un 7 % de rentabilidad, necesitas tener invertidos{" "}
            <b className="text-white">{euros(e.meta)}</b> (18.000 ÷ 0,07). ¿Y si llegas metiendo solo 100 € al mes desde los
            20 años?
          </p>
          <p className="mt-2 max-w-xl text-[11px] md:text-xs text-white/45">
            Sueldo redondeado a partir del salario mediano del INE (Encuesta de Estructura Salarial 2023).
          </p>
        </>
      ),
      mitad: {
        titulo: "100 € al mes",
        texto: "Lo que casi cualquiera puede apartar. Los primeros años casi no se nota; luego los intereses generan sus propios intereses.",
      },
      final: {
        titulo: `Tu sueldo extra a los ${e.edadMeta}`,
        sub: `habiendo puesto ${euros(e.puestoMeta)}`,
        texto: `Con ${euros(e.meta)} invertidos, un 7 % son unos 18.000 € al año: 1.500 € al mes sin tocar lo ahorrado, si la rentabilidad se mantuviera.`,
      },
    };
  }
  return {
    entrada: (
      <>
        <h2 className="font-display uppercase text-white text-4xl sm:text-6xl md:text-[5.5rem] leading-[0.9] tracking-tight">
          ¿Cuánto tardas en
          <span className="block font-serif italic normal-case text-brand-mint text-3xl sm:text-5xl md:text-7xl leading-[1] mt-1">
            tener 1 millón?
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-sm md:text-lg leading-relaxed text-white/75">
          Para que veas la magnitud de la constancia y del interés compuesto (del que hablaremos más adelante): 300 € al mes
          desde los 20 años.
        </p>
      </>
    ),
    mitad: {
      titulo: "300 € al mes",
      texto: "Los primeros años casi no se nota. Luego los intereses empiezan a generar sus propios intereses y la curva se dispara.",
    },
    final: {
      titulo: `1 millón a los ${e.edadMeta}`,
      sub: `habiendo puesto ${euros(e.puestoMeta)}`,
      texto: `Unos ${euros(e.maximo - e.puestoMeta)} los ha puesto el interés compuesto, no tú. Lo que más pesa es empezar pronto y no parar.`,
    },
  };
}

export default function HeroCrecimiento() {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  const [id, setId] = useState("sueldo");
  const e = ESCENARIOS[id];
  const textos = Textos({ id, e });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  useMotionValueEvent(suave, "change", (x) => setV(Math.min(1, Math.max(0, x))));

  // Los años acaban al 80 % del recorrido; el resto, el resultado se queda en pantalla
  const p = Math.min(1, v / 0.8);
  const anos = p * e.anosMeta;
  const meses = anos * 12;
  const total = e.valor(meses);
  const puesto = e.aportacion * meses;
  const actual = Math.min(e.barras, Math.floor(anos) + 1);
  const edad = EDAD + Math.floor(anos);
  const alto = (x) => `${(x / e.eje) * 100}%`;
  const panel = Math.min(1, p * 12);
  const kilos = (l) => `${l / 1000}k €`;

  return (
    <section ref={ref} className="relative h-[380vh]">
      {/* Fondo fijo mientras dura la sección */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-brand-onyx">
        <div className="absolute -top-1/3 left-1/4 w-[70vw] h-[70vw] rounded-full bg-brand-indigo/25 blur-[140px]" />

        {/* Cabecera fija: aviso y selector de ejemplo */}
        <div className="absolute z-20 top-20 md:top-24 left-0 right-0 flex flex-col items-center gap-3 px-4">
          <span className="px-4 py-1.5 rounded-full border border-[#F5C542]/50 bg-brand-onyx/70 text-[#F5C542] font-semibold text-xs md:text-sm">
            Ejemplo con rentabilidades teóricas
          </span>
          <div className="flex gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
            {Object.entries(ESCENARIOS).map(([k, x]) => (
              <button
                key={k}
                type="button"
                onClick={() => setId(k)}
                className={`px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-colors ${
                  id === k ? "bg-brand-mint text-brand-onyx" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="opacity-60 mr-1.5">{x.etiqueta}</span>
                {x.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico de barras de fondo */}
        <div className="absolute left-[4vw] right-[4vw] bottom-[5.5rem] h-[40dvh] md:bottom-[6vh] md:h-[58vh]">
          {e.lineas.map((l) => (
            <div key={l} className="absolute left-0 right-0 border-t border-white/[0.07]" style={{ bottom: alto(l) }}>
              <span className="absolute -top-2.5 left-0 text-[9px] md:text-[11px] text-white/35 tabular-nums">
                {l === 1000000 ? "1 millón" : kilos(l)}
              </span>
            </div>
          ))}
          {/* Meta */}
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-[#F5C542]/60" style={{ bottom: alto(e.meta) }}>
            <span className="absolute -top-6 right-0 text-[10px] md:text-xs font-bold text-[#F5C542] tabular-nums">
              Meta: {euros(e.meta)} → {e.rotuloMeta}
            </span>
          </div>
          <div className="absolute inset-0 left-8 md:left-12 flex items-end gap-[2px] md:gap-[0.4vw]">
            {Array.from({ length: e.barras }, (_, i) => {
              const crece = Math.min(1, Math.max(0, anos - i), e.anosMeta - i); // 0→1 mientras transcurre ese año
              const m = (i + crece) * 12;
              const tot = crece > 0 ? e.valor(m) : 0;
              const pue = crece > 0 ? e.aportacion * m : 0;
              const enCurso = i + 1 === actual && p > 0 && p < 1;
              return (
                <div key={`${id}-${i}`} className="relative flex-1 h-full flex flex-col justify-end">
                  {/* Silueta de cómo acabará la barra */}
                  <div
                    className="absolute left-0 right-0 bottom-0 rounded-t-[3px] bg-white/[0.06] border border-b-0 border-white/10"
                    style={{ height: alto(e.valor(Math.min((i + 1) * 12, e.mesesMeta))) }}
                  />
                  {/* Monedas cayendo en la barra del año en curso */}
                  {enCurso &&
                    [0, 1, 2].map((k) => {
                      const fase = (anos * 4 + k / 3) % 1;
                      return (
                        <span
                          key={k}
                          className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 md:w-5 md:h-5 rounded-full bg-[#F5C542] border border-[#B8860B] text-[7px] md:text-[10px] font-bold text-[#7A5A00] flex items-center justify-center"
                          style={{
                            bottom: `calc(${alto(tot)} + ${(1 - fase) * 60 + 6}px)`,
                            opacity: fase < 0.15 ? fase / 0.15 : 1 - Math.max(0, fase - 0.85) / 0.15,
                          }}
                        >
                          €
                        </span>
                      );
                    })}
                  <div
                    className="relative rounded-t-[3px] bg-brand-mint"
                    style={{
                      height: alto(tot - pue),
                      boxShadow: enCurso ? "0 0 18px rgba(136,249,192,0.8)" : undefined,
                    }}
                  />
                  {/* Dorado = lo que pones (como las monedas); línea oscura que separa de lo ganado */}
                  <div className="relative bg-[#F5C542] border-t-2 border-brand-onyx/70" style={{ height: alto(pue) }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Números: franja compacta abajo en móvil, tarjeta abajo a la derecha en escritorio */}
        <div
          className="absolute z-10 left-[4vw] right-[4vw] bottom-3 md:left-auto md:bottom-[8vh] md:w-[22rem] rounded-2xl md:rounded-3xl bg-brand-onyx/75 backdrop-blur-md border border-white/10 px-3 py-2 md:p-5"
          style={{ opacity: panel, transform: `translateY(${(1 - panel) * 20}px)` }}
        >
          {/* Móvil */}
          <div className="md:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-xl text-white tabular-nums leading-none">{edad} AÑOS</p>
              <p className="text-[10px] leading-tight text-white/60 tabular-nums">
                Puesto <span className="text-[#F5C542] font-semibold">{euros(puesto)}</span>
                <br />
                Crecido <span className="text-brand-mint font-semibold">+{euros(total - puesto)}</span>
              </p>
              <p className="font-display text-2xl text-brand-mint tabular-nums leading-none">{euros(total)}</p>
            </div>
            <p className="mt-1 text-[8px] leading-tight text-white/40">
              Ejemplo teórico: {e.aportacion} €/mes al 7% anual fijo desde los 20, sin comisiones ni impuestos. Ninguna
              inversión lo garantiza.
            </p>
          </div>

          {/* Escritorio */}
          <div className="hidden md:block">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-wider text-white/60">{e.aportacion} € al mes al 7%</p>
              <p className="font-display text-3xl text-white tabular-nums">{edad} AÑOS</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/55 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#F5C542]" /> Has puesto
                </p>
                <p className="font-display text-2xl text-[#F5C542] tabular-nums">{euros(puesto)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/55 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-brand-mint" /> Ha crecido
                </p>
                <p className="font-display text-2xl text-brand-mint tabular-nums">+{euros(total - puesto)}</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-brand-mint text-brand-onyx px-4 py-2 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Tienes</span>
              <span className="font-display text-4xl tabular-nums">{euros(total)}</span>
            </div>
            <p className="mt-2 text-[10px] leading-snug text-white/45">
              Ejemplo teórico con un 7% anual fijo desde los 20 años, sin comisiones ni impuestos. Ninguna inversión garantiza
              una rentabilidad fija.
            </p>
          </div>
        </div>

        {/* Textos por encima del gráfico, sincronizados con él */}
        {/* 1. Entrada */}
        <div className="absolute inset-0 flex items-start" style={estilo(tramo(v, 0, 0.12), -v * 400)}>
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-48 md:pt-52">
            <div key={id} className="max-w-3xl">
              {textos.entrada}
            </div>
          </div>
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center text-white/70 text-sm font-semibold"
            style={{ opacity: Math.max(0, 1 - v * 12) }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Desliza y mira cómo crece
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>

        {/* 2. A mitad */}
        <div className="absolute inset-0 flex items-start" style={estilo(tramo(v, 0.28, 0.6))}>
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-48 md:pt-52">
            <h2 className="font-display uppercase text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] max-w-xl">
              {textos.mitad.titulo}
              <span className="block font-serif italic normal-case text-brand-mint">y paciencia</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-white/70 text-base md:text-lg">{textos.mitad.texto}</p>
          </div>
        </div>

        {/* 3. Final */}
        <div className="absolute inset-0 flex items-start" style={estilo(tramo(v, 0.8, 1))}>
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-48 md:pt-52">
            <h2 className="font-display uppercase text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] max-w-2xl">
              {textos.final.titulo}
              <span className="block font-serif italic normal-case text-brand-mint">{textos.final.sub}</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-white/70 text-base md:text-lg">{textos.final.texto}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
