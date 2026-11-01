import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

// Entrada de la web: el fondo es un gráfico que crece con el scroll.
// Ejemplo: 100 €/mes al 7 % anual (interés mensual equivalente), aportación a final de mes.
const APORTACION = 100;
const ANOS = 30;
const R = Math.pow(1.07, 1 / 12) - 1;
const valor = (meses) => (APORTACION * (Math.pow(1 + R, meses) - 1)) / R;
const MAXIMO = valor(ANOS * 12);
const EJE = 125000; // tope del eje en €
const LINEAS = [25000, 50000, 75000, 100000, 125000];
// Punto de miles siempre (toLocaleString no lo pone en números de 4 cifras)
const euros = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

const ONYX = [1, 1, 13];
const INDIGO = [99, 49, 251];
const mezcla = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const ventajas = ["Explicado desde cero", "Sin jerga", "Desde 1€", "100% gratis"];

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

export default function HeroCrecimiento() {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  useMotionValueEvent(suave, "change", (x) => setV(Math.min(1, Math.max(0, x))));

  // Los 30 años acaban al 80 % del recorrido; el resto, el resultado se queda en pantalla
  const p = Math.min(1, v / 0.8);
  const anos = p * ANOS;
  const meses = anos * 12;
  const total = valor(meses);
  const puesto = APORTACION * meses;
  const actual = Math.min(ANOS, Math.floor(anos) + 1);
  const alto = (x) => `${(x / EJE) * 100}%`;
  // Negro al principio; al final se funde con el índigo del resto de la web
  const fondo = mezcla(ONYX, INDIGO, Math.min(1, Math.max(0, (v - 0.82) / 0.18)));
  const panel = Math.min(1, p * 12);

  return (
    <section ref={ref} className="relative h-[380vh]">
      {/* Fondo fijo mientras dura la sección */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden" style={{ backgroundColor: `rgb(${fondo.join(",")})` }}>
        {/* Luz índigo de ambiente y brillo del ratón */}
        <div className="absolute -top-1/3 left-1/4 w-[70vw] h-[70vw] rounded-full bg-brand-indigo/25 blur-[140px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(500px circle at var(--x, -999px) var(--y, -999px), rgba(var(--brillo, 136, 249, 192), 0.14), transparent 65%)",
          }}
        />

        {/* Gráfico de barras de fondo */}
        <div className="absolute left-[4vw] right-[4vw] bottom-[10.5rem] h-[38dvh] md:bottom-[6vh] md:h-[68vh]">
          {LINEAS.map((l) => (
            <div key={l} className="absolute left-0 right-0 border-t border-white/[0.07]" style={{ bottom: alto(l) }}>
              <span className="absolute -top-2.5 left-0 text-[9px] md:text-[11px] text-white/35 tabular-nums">{l / 1000}k €</span>
            </div>
          ))}
          <div className="absolute inset-0 left-8 md:left-12 flex items-end gap-[2px] md:gap-[0.4vw]">
            {Array.from({ length: ANOS }, (_, i) => {
              const crece = Math.min(1, Math.max(0, anos - i)); // 0→1 mientras transcurre ese año
              const m = (i + crece) * 12;
              const tot = crece > 0 ? valor(m) : 0;
              const pue = crece > 0 ? APORTACION * m : 0;
              const enCurso = i + 1 === actual && p > 0 && p < 1;
              return (
                <div key={i} className="relative flex-1 h-full flex flex-col justify-end">
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
                    className="rounded-t-[3px] bg-brand-mint"
                    style={{
                      height: alto(tot - pue),
                      boxShadow: enCurso ? "0 0 18px rgba(136,249,192,0.8)" : undefined,
                    }}
                  />
                  <div className="bg-white/80" style={{ height: alto(pue) }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Números abajo a la derecha */}
        <div
          className="absolute left-[4vw] right-[4vw] bottom-3 md:left-auto md:bottom-[8vh] md:w-[22rem] rounded-3xl bg-brand-onyx/75 backdrop-blur-md border border-white/10 p-3 md:p-5"
          style={{ opacity: panel, transform: `translateY(${(1 - panel) * 20}px)` }}
        >
          <div className="flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-wider text-white/60">100 € al mes al 7%</p>
            <p className="font-display text-2xl md:text-3xl text-white tabular-nums">AÑO {Math.floor(anos)}</p>
          </div>
          <div className="mt-1 md:mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/55 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-white/80" /> Has puesto
              </p>
              <p className="font-display text-xl md:text-2xl text-white tabular-nums">{euros(puesto)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/55 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-brand-mint" /> Ha crecido
              </p>
              <p className="font-display text-xl md:text-2xl text-brand-mint tabular-nums">+{euros(total - puesto)}</p>
            </div>
          </div>
          <div className="mt-2 md:mt-3 rounded-2xl bg-brand-mint text-brand-onyx px-4 py-1 md:py-2 flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Tienes</span>
            <span className="font-display text-3xl md:text-4xl tabular-nums">{euros(total)}</span>
          </div>
          <p className="mt-1.5 md:mt-2 text-[9px] md:text-[10px] leading-snug text-white/45">
            Ejemplo con un 7% anual fijo, sin comisiones ni impuestos. Ninguna inversión garantiza una rentabilidad fija.
          </p>
        </div>

        {/* Textos por encima del gráfico, sincronizados con él */}
        {/* 1. Entrada */}
        <div className="absolute inset-0 flex items-center" style={estilo(tramo(v, 0, 0.12), -v * 400)}>
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-brand-mint/40 text-brand-mint font-semibold text-sm mb-6">
                Educación financiera para todos
              </span>
              <h1 className="font-display uppercase text-white text-[3.4rem] sm:text-7xl md:text-[7.5rem] leading-[0.88] tracking-tight">
                Tu dinero
                <br />
                puede crecer
                <span className="block font-serif italic normal-case text-brand-mint text-[2.6rem] sm:text-6xl md:text-8xl leading-[1] mt-2">
                  mientras duermes
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/75">
                Guardar el dinero en el banco hace que pierda valor cada año. Invertir es más fácil de lo que crees, y te lo explicamos desde cero.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/por-que-invertir"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold text-base hover:scale-105 transition-transform"
                >
                  Quiero aprender <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/empieza"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border-2 border-white/70 text-white font-bold text-base hover:bg-white hover:text-brand-onyx transition-colors"
                >
                  ¡Empieza ahora!
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                {ventajas.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" /> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
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
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 md:pt-36">
            <h2 className="font-display uppercase text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] max-w-xl">
              100 € al mes
              <span className="block font-serif italic normal-case text-brand-mint">y paciencia</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-white/70 text-base md:text-lg">
              Los primeros años casi no se nota. Luego los intereses empiezan a generar sus propios intereses.
            </p>
          </div>
        </div>

        {/* 3. Final */}
        <div className="absolute inset-0 flex items-start" style={estilo(tramo(v, 0.8, 1))}>
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 md:pt-36">
            <h2 className="font-display uppercase text-white text-4xl sm:text-5xl md:text-7xl leading-[0.92] max-w-xl">
              {euros(MAXIMO)}
              <span className="block font-serif italic normal-case text-brand-mint">habiendo puesto 36.000 €</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-white/70 text-base md:text-lg">
              Más de 3 veces lo que has puesto. Eso es el interés compuesto.
            </p>
            <Link
              to="/aprende"
              className="mt-6 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold hover:scale-105 transition-transform"
            >
              Entiende cómo funciona <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
