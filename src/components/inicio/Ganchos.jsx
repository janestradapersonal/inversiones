import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import mercados from "@/data/mercados.json";

// Ganchos de la portada: contador en vivo, cinta de cifras y barra de lectura.
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
      className="w-full max-w-2xl rounded-3xl bg-brand-onyx text-white p-5 md:p-7 shadow-[0_30px_60px_-20px_rgba(10,11,10,0.55)]"
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

/* ---------- 2. Cinta de cifras (todas de mercados.json) ---------- */
const coma = (n, d = 1) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });
const CIFRAS = (() => {
  const a = mercados.años;
  const [, oro0, sp0] = a[0];
  const [, oro1, sp1] = a.at(-1);
  const m3 = mercados.dinero;
  const crisis08 = mercados.crisis.find((c) => c.id === "2008");
  return [
    ["Inflación en España, último año", `${coma(INFLACION.anual * 100)} %`, "rojo"],
    ["1 € de 1999 compra hoy", `${coma(INFLACION.desde1999, 2)} €`, "rojo"],
    ["Euros en circulación desde 1999", `×${coma(m3.at(-1)[1] / m3[0][1])}`, "rojo"],
    ["S&P 500 desde 1999", `×${coma(sp1 / sp0)}`, "lima"],
    ["Oro desde 1999", `×${coma(oro1 / oro0)}`, "oro"],
    ["Caída de la bolsa en 2008", `${coma(crisis08.caida)} %`, "rojo"],
    ["Recuperada en", crisis08.recuperado.slice(0, 4), "lima"],
  ];
})();
const COLOR_CIFRA = { rojo: "text-[#FF5C7A]", lima: "text-brand-mint", oro: "text-[#F5C542]" };

export function CintaCifras() {
  const fila = (clave) =>
    CIFRAS.map(([t, v, c]) => (
      <span key={clave + t} className="flex items-center gap-3 px-6 whitespace-nowrap">
        <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">{t}</span>
        <span className={`font-display text-2xl md:text-3xl leading-none tabular-nums ${COLOR_CIFRA[c]}`}>{v}</span>
        <span className="text-brand-mint/40 pl-3">✦</span>
      </span>
    ));
  return (
    <div className="relative bg-brand-onyx border-y border-white/[0.07] py-4 overflow-hidden" aria-label="Cifras reales">
      <div className="cinta-anim flex w-max">
        {fila("a")}
        {fila("b")}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-onyx to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-onyx to-transparent" />
      <p className="sr-only">Fuentes: Eurostat, BCE y cotizaciones históricas; actualizado {mercados.actualizado}.</p>
    </div>
  );
}

/* ---------- 3. Barra de lectura ---------- */
export function BarraLectura() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div aria-hidden className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left bg-brand-mint" style={{ scaleX: x }} />;
}
