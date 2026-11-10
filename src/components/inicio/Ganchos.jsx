import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import mercados from "@/data/mercados.json";

// Ganchos de la portada: contador en vivo, barra de lectura y siguiente paso.
// Todas las cifras salen de src/data/mercados.json (Eurostat y S&P 500), que se actualiza solo.

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const eur = (n, d = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d }) + " €";
const fechaLarga = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return d ? `${d} de ${MESES[m - 1]} de ${a}` : `${MESES[m - 1]} de ${a}`;
};

// Inflación del último año y poder de compra desde 1999 (índice de precios de España, Eurostat)
export const INFLACION = (() => {
  const filas = mercados.dinero.filter((f) => f[2] != null);
  const ultima = filas.at(-1);
  const haceUnAño = filas.find((f) => f[0] === `${Number(ultima[0].slice(0, 4)) - 1}${ultima[0].slice(4)}`);
  return {
    anual: ultima[2] / haceUnAño[2] - 1,
    mes: ultima[0],
    desde1999: filas[0][2] / ultima[2], // 1 € de diciembre de 1999 compra hoy esto
  };
})();

/* ---------- 1. Contador en vivo ---------- */
export function ContadorPerdida() {
  const [ahorro, setAhorro] = useState(10000);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const inicio = performance.now();
    let id;
    const paso = () => {
      setSegundos((performance.now() - inicio) / 1000);
      id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, []);

  const alAño = ahorro * INFLACION.anual;
  const porSegundo = alAño / (365 * 24 * 3600);
  // Lo perdido desde el 1 de enero hasta este mismo instante
  const ahora = new Date();
  const enero = new Date(ahora.getFullYear(), 0, 1);
  const perdido = porSegundo * ((ahora - enero) / 1000);
  const desdeQueEntraste = porSegundo * segundos;
  const opciones = [1000, 10000, 50000];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      className="mt-8 max-w-2xl rounded-3xl bg-brand-onyx/55 border border-white/20 backdrop-blur p-5 md:p-7 shadow-2xl"
    >
      <p className="text-white/80 text-sm font-semibold">Si tienes ahorrados…</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {opciones.map((o) => (
          <button
            key={o}
            onClick={() => setAhorro(o)}
            className={`px-4 py-2 rounded-full font-bold transition ${ahorro === o ? "bg-brand-mint text-brand-onyx" : "bg-white/10 text-white hover:bg-white/20"}`}
          >
            {eur(o)}
          </button>
        ))}
        <label className="flex items-center gap-1 rounded-full bg-white/10 pl-4 pr-2 py-1 text-white">
          <span className="text-sm text-white/70">otra:</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            aria-label="Tus ahorros en euros"
            className="w-28 bg-transparent font-bold outline-none py-1"
            placeholder="25000"
            onChange={(e) => setAhorro(Math.max(0, Number(e.target.value) || 0))}
          />
          €
        </label>
      </div>

      <p className="mt-5 text-white/80 text-sm md:text-base">…quietos en la cuenta, en lo que va de año han perdido</p>
      <p className="font-display text-[2.3rem] sm:text-6xl leading-none text-[#FF5C7A] tabular-nums mt-1">
        −{eur(perdido, 5)}
      </p>
      <p className="mt-2 text-white/70 text-sm">
        y mientras lees esto, <span className="text-[#FF5C7A] font-bold tabular-nums">{eur(desdeQueEntraste, 5)}</span> más.
      </p>
      <p className="mt-3 text-white text-lg md:text-xl font-semibold">
        En un año: <span className="text-[#FF5C7A]">−{eur(alAño)}</span> de poder de compra.{" "}
        <span className="text-white/70 font-normal">Sin que nadie te avise.</span>
      </p>
      <p className="mt-3 text-xs text-white/50">
        Al ritmo de la inflación de los últimos 12 meses en España: {(INFLACION.anual * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
        (Eurostat, hasta {fechaLarga(INFLACION.mes)}).
      </p>
    </motion.div>
  );
}

/* ---------- 3. Barra de lectura ---------- */
export function BarraLectura() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div aria-hidden className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left bg-brand-mint" style={{ scaleX: x }} />;
}

/* ---------- 4. Siguiente paso ---------- */
export function SiguientePaso() {
  const pasos = useMemo(
    () => [
      ["1", "Por qué invertir", "Tres motivos que casi nadie te cuenta", "/por-que-invertir", "el primero"],
      ["2", "Aprende", "Lo básico, con dibujos y cifras reales", "/aprende", "a tu ritmo"],
      ["3", "Empieza", "Tu primer paso, aunque sea con poco", "/empieza", "cuando quieras"],
    ],
    []
  );
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-mint">¿Por dónde sigo?</p>
      <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.95] mt-3 mb-8">
        Tu camino, <span className="font-serif italic normal-case text-brand-mint">en 3 pasos</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {pasos.map(([n, t, d, to, min], i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={to}
              className={`group block h-full rounded-3xl p-6 md:p-8 border-2 transition hover:-translate-y-1 ${
                i === 0 ? "bg-brand-mint text-brand-onyx border-brand-mint" : "bg-brand-surface border-white/10 hover:border-brand-mint/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl leading-none">0{n}</span>
                <span className={`text-xs font-bold rounded-full px-3 py-1 ${i === 0 ? "bg-brand-onyx/15" : "bg-white/10"}`}>{min}</span>
              </div>
              <p className="mt-6 font-display uppercase text-3xl leading-none">{t}</p>
              <p className={`mt-2 ${i === 0 ? "text-brand-onyx/75" : "text-white/70"}`}>{d}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold">
                {i === 0 ? "Empieza por aquí" : "Ir"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
