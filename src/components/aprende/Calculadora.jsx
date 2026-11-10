// Calculadoras con deslizadores para probar los conceptos con tus propios números
import { useState } from "react";

const eur = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";
const pct = (n, d = 1) => n.toLocaleString("es-ES", { maximumFractionDigits: d }) + " %";

function Deslizador({ etiqueta, valor, min, max, paso = 1, formato, onChange }) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs text-white/70 mb-1">
        {etiqueta}
        <span className="font-semibold text-white tabular-nums">{formato(valor)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-mint"
      />
    </label>
  );
}

function Resultado({ filas }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {filas.map(([t, v, c]) => (
        <div key={t} className="rounded-xl bg-white/[0.05] p-3">
          <p className="text-[11px] text-white/55">{t}</p>
          <p className="font-display text-xl tabular-nums" style={{ color: c || "#fff" }}>{v}</p>
        </div>
      ))}
    </div>
  );
}

function Compuesto() {
  const [mes, setMes] = useState(100);
  const [anos, setAnos] = useState(25);
  const [r, setR] = useState(6);
  const m = (1 + r / 100) ** (1 / 12) - 1;
  const n = anos * 12;
  const total = m ? mes * (((1 + m) ** n - 1) / m) : mes * n;
  const puesto = mes * n;
  return (
    <div className="space-y-3">
      <Deslizador etiqueta="Cada mes" valor={mes} min={10} max={1000} paso={10} formato={eur} onChange={setMes} />
      <Deslizador etiqueta="Años" valor={anos} min={1} max={40} formato={(v) => `${v} años`} onChange={setAnos} />
      <Deslizador etiqueta="Rentabilidad anual (supuesta)" valor={r} min={0} max={10} paso={0.5} formato={pct} onChange={setR} />
      <Resultado filas={[["Has puesto", eur(puesto), "#F5C542"], ["Tendrías", eur(total), "rgb(var(--p-acento))"]]} />
      <p className="text-[11px] text-white/45">Simulación con una rentabilidad fija, sin comisiones ni impuestos. Ninguna inversión la garantiza.</p>
    </div>
  );
}

function Inflacion() {
  const [cant, setCant] = useState(10000);
  const [anos, setAnos] = useState(10);
  const [i, setI] = useState(3);
  const compra = cant / (1 + i / 100) ** anos;
  return (
    <div className="space-y-3">
      <Deslizador etiqueta="Dinero guardado" valor={cant} min={1000} max={100000} paso={1000} formato={eur} onChange={setCant} />
      <Deslizador etiqueta="Años" valor={anos} min={1} max={40} formato={(v) => `${v} años`} onChange={setAnos} />
      <Deslizador etiqueta="Inflación anual" valor={i} min={0} max={10} paso={0.5} formato={pct} onChange={setI} />
      <Resultado filas={[["En la cuenta pone", eur(cant)], ["Pero compra como", eur(compra), "#FF5C7A"]]} />
    </div>
  );
}

function Comisiones() {
  const [com, setCom] = useState(1.5);
  const [anos, setAnos] = useState(30);
  const base = 10000;
  const barato = base * (1 + 0.07 - 0.002) ** anos;
  const tuyo = base * (1 + 0.07 - com / 100) ** anos;
  return (
    <div className="space-y-3">
      <Deslizador etiqueta="Comisión anual de tu fondo" valor={com} min={0.1} max={2.5} paso={0.1} formato={(v) => pct(v)} onChange={setCom} />
      <Deslizador etiqueta="Años" valor={anos} min={5} max={40} formato={(v) => `${v} años`} onChange={setAnos} />
      <Resultado filas={[["Indexado al 0,2 %", eur(barato), "rgb(var(--p-acento))"], [`Tu fondo al ${pct(com)}`, eur(tuyo), "#F5C542"]]} />
      <p className="text-xs text-white/70">Te cuesta <strong className="text-[#FF5C7A]">{eur(Math.max(0, barato - tuyo))}</strong> en {anos} años.</p>
      <p className="text-[11px] text-white/45">10.000 € con una rentabilidad bruta supuesta del 7 % anual.</p>
    </div>
  );
}

function Regla72() {
  const [r, setR] = useState(6);
  const exacto = Math.log(2) / Math.log(1 + r / 100);
  return (
    <div className="space-y-3">
      <Deslizador etiqueta="Rentabilidad (o inflación) anual" valor={r} min={1} max={12} paso={0.5} formato={pct} onChange={setR} />
      <Resultado filas={[["Regla del 72", `${(72 / r).toLocaleString("es-ES", { maximumFractionDigits: 1 })} años`, "rgb(var(--p-acento))"], ["Cálculo exacto", `${exacto.toLocaleString("es-ES", { maximumFractionDigits: 1 })} años`]]} />
    </div>
  );
}

function Apalancamiento() {
  const [x, setX] = useState(5);
  const [mov, setMov] = useState(-10);
  const res = Math.max(-100, x * mov);
  return (
    <div className="space-y-3">
      <Deslizador etiqueta="Apalancamiento" valor={x} min={1} max={20} formato={(v) => `x${v}`} onChange={setX} />
      <Deslizador etiqueta="Lo que se mueve el precio" valor={mov} min={-30} max={30} formato={(v) => (v > 0 ? "+" : "") + pct(v, 0)} onChange={setMov} />
      <Resultado filas={[["Sin apalancar", (mov > 0 ? "+" : "") + pct(mov, 0)], ["Con x" + x, (res > 0 ? "+" : "") + pct(res, 0), res < 0 ? "#FF5C7A" : "rgb(var(--p-acento))"]]} />
      {res <= -100 && <p className="text-xs text-[#FF5C7A] font-semibold">Has perdido todo lo que pusiste.</p>}
    </div>
  );
}

const CALCULADORAS = { compuesto: Compuesto, inflacion: Inflacion, comisiones: Comisiones, regla72: Regla72, apalancamiento: Apalancamiento };

export default function Calculadora({ tipo }) {
  const C = CALCULADORAS[tipo];
  if (!C) return null;
  return (
    <div className="rounded-2xl border border-brand-mint/30 bg-brand-mint/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-mint mb-3">Pruébalo tú</p>
      <C />
    </div>
  );
}
