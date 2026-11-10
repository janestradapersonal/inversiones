// Dibujos sencillos para acompañar cada concepto de «Aprende» (nada de solo texto)
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const COLORES = {
  menta: "#9E85FF",
  oro: "#F5C542",
  rojo: "#FF5C7A",
  azul: "#6CB4FF",
  indigo: "#8B66FF",
  gris: "#9A96B8",
};
const color = (c) => COLORES[c] || c || COLORES.menta;

// Barras horizontales: [{t, v, rotulo?, color?}]
function Barras({ filas }) {
  const max = Math.max(...filas.map((f) => f.v));
  return (
    <div className="space-y-2.5">
      {filas.map((f) => (
        <div key={f.t}>
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>{f.t}</span>
            <span className="font-semibold text-white tabular-nums">{f.rotulo ?? f.v}</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color(f.color) }}
              initial={{ width: 0 }}
              animate={{ width: `${(f.v / max) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Tarta (dónut): [{t, v, color?}]; los valores son porcentajes
export function Tarta({ partes, tam = 120, centro }) {
  const r = 40;
  const C = 2 * Math.PI * r;
  let acumulado = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: tam, height: tam }}>
      {centro && (
        <span className="absolute inset-0 flex items-center justify-center font-display text-white text-xl">{centro}</span>
      )}
      <svg viewBox="0 0 100 100" width={tam} height={tam} className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
        {partes.map((p) => {
          const largo = (p.v / 100) * C;
          const trozo = (
            <motion.circle
              key={p.t}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={color(p.color)}
              strokeWidth="16"
              strokeDasharray={`${Math.max(0, largo - 1.5)} ${C}`}
              strokeDashoffset={-acumulado}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
          acumulado += largo;
          return trozo;
        })}
      </svg>
      </div>
      <ul className="space-y-1.5 text-xs text-white/80">
        {partes.map((p) => (
          <li key={p.t} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color(p.color) }} />
            <span className="font-semibold text-white tabular-nums">{p.v} %</span> {p.t}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Diapositivas: [{e, t, x}] con flechas y puntos
function Pasos({ pasos }) {
  const [i, setI] = useState(0);
  const p = pasos[i];
  return (
    <div>
      <div className="relative min-h-[118px] rounded-xl bg-white/[0.04] border border-white/10 p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-3xl mb-2">{p.e}</p>
            <p className="font-semibold text-white text-sm">{p.t}</p>
            {p.x && <p className="text-white/70 text-sm mt-1 leading-snug">{p.x}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setI((i - 1 + pasos.length) % pasos.length)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          disabled={i === 0}
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {pasos.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Paso ${k + 1}`}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-brand-mint" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
        <button
          onClick={() => setI(i + 1)}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
          disabled={i === pasos.length - 1}
          aria-label="Siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Esquema A → B → C: [{e, t}]
function Flujo({ nodos }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {nodos.map((n, k) => (
        <div key={n.t} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: k * 0.15 }}
            className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2 text-center min-w-[84px]"
          >
            <p className="text-2xl">{n.e}</p>
            <p className="text-[11px] text-white/80 leading-tight mt-1 max-w-[110px]">{n.t}</p>
          </motion.div>
          {k < nodos.length - 1 && <ArrowRight className="w-4 h-4 text-brand-mint shrink-0" />}
        </div>
      ))}
    </div>
  );
}

// Dos columnas enfrentadas: a/b = {t, e, puntos[], color?}
function Comparar({ a, b }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[a, b].map((lado) => (
        <div key={lado.t} className="rounded-xl bg-white/[0.04] border-t-2 p-3" style={{ borderColor: color(lado.color) }}>
          <p className="text-sm font-semibold text-white mb-2">{lado.e} {lado.t}</p>
          <ul className="space-y-1 text-xs text-white/75">
            {lado.puntos.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Líneas pequeñas: series = [{t, color, y:[...]}], x = etiquetas de los extremos
function Lineas({ series, x }) {
  const todos = series.flatMap((s) => s.y);
  const min = Math.min(...todos);
  const max = Math.max(...todos);
  const W = 260;
  const H = 110;
  const camino = (y) =>
    y.map((v, k) => `${k ? "L" : "M"}${(k / (y.length - 1)) * W},${H - 6 - ((v - min) / (max - min || 1)) * (H - 12)}`).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {series.map((s) => (
          <motion.path key={s.t} d={camino(s.y)} fill="none" stroke={color(s.color)} strokeWidth="2.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-white/45 mt-1">
        <span>{x?.[0]}</span>
        <span>{x?.[1]}</span>
      </div>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/75">
          {series.map((s) => (
            <span key={s.t} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: color(s.color) }} /> {s.t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Medidor de riesgo de 1 a 5 (riesgo) y de liquidez/rentabilidad si se dan
export function Riesgo({ nivel, texto }) {
  const tonos = ["#88F9C0", "#C6F27A", "#F5C542", "#FF9E5C", "#FF5C7A"];
  return (
    <div>
      <div className="flex gap-1">
        {tonos.map((c, k) => (
          <div key={c} className="h-2.5 flex-1 rounded-full" style={{ background: k < nivel ? c : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <p className="text-xs text-white/60 mt-1.5">
        Riesgo <span className="text-white font-semibold">{nivel}/5</span>
        {texto ? ` · ${texto}` : ""}
      </p>
    </div>
  );
}

// Cifra grande con explicación
function Cifra({ valor, texto, color: c }) {
  return (
    <div className="text-center py-2">
      <p className="font-display text-5xl tabular-nums" style={{ color: color(c) }}>{valor}</p>
      <p className="text-xs text-white/65 mt-1">{texto}</p>
    </div>
  );
}

const TIPOS = { barras: Barras, tarta: Tarta, pasos: Pasos, flujo: Flujo, comparar: Comparar, lineas: Lineas, riesgo: Riesgo, cifra: Cifra };

export default function Visual({ v }) {
  if (!v) return null;
  const C = TIPOS[v.tipo];
  return C ? <C {...v} /> : null;
}
