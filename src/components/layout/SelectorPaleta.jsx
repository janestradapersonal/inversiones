import { useEffect, useState } from "react";

// Selector temporal para comparar paletas en toda la web. Se quita al elegir una.
export const PALETAS = [
  { id: "indigo-lila", nombre: "Índigo y lila (actual)", c: ["#01010D", "#6331FB", "#9E85FF"] },
  { id: "indigo-menta", nombre: "Índigo y menta", c: ["#01010D", "#6331FB", "#88F9C0"] },
  { id: "cobalto-lima", nombre: "Cobalto y lima", c: ["#030716", "#2563FF", "#C6FF3D"] },
  { id: "esmeralda-oro", nombre: "Esmeralda y oro", c: ["#020E0B", "#059669", "#F5C542"] },
  { id: "carbon-coral", nombre: "Carbón y coral", c: ["#0C0B0B", "#FF5A36", "#FFD6AA"] },
  { id: "ciruela-melocoton", nombre: "Ciruela y melocotón", c: ["#100416", "#D6247F", "#FFB38A"] },
  { id: "petroleo-sol", nombre: "Petróleo y sol", c: ["#021216", "#0E969B", "#FFD166"] },
];

const leer = () => {
  try { return localStorage.getItem("paleta") || PALETAS[0].id; } catch { return PALETAS[0].id; }
};

export default function SelectorPaleta() {
  const [actual, setActual] = useState(leer);
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.paleta = actual;
    try { localStorage.setItem("paleta", actual); } catch { /* sin almacenamiento */ }
  }, [actual]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] font-inter text-sm">
      {abierto ? (
        <div className="w-64 rounded-2xl bg-black/85 backdrop-blur border border-white/15 p-3 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white">Paleta de colores</span>
            <button onClick={() => setAbierto(false)} className="text-white/60 hover:text-white px-1" aria-label="Cerrar">✕</button>
          </div>
          <ul className="space-y-1">
            {PALETAS.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => setActual(p.id)}
                  className={`w-full flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${actual === p.id ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10"}`}
                >
                  <span className="flex -space-x-1">
                    {p.c.map((c) => <span key={c} className="w-4 h-4 rounded-full border border-white/40" style={{ background: c }} />)}
                  </span>
                  <span>{i + 1}. {p.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={() => setAbierto(true)} className="rounded-full bg-black/85 border border-white/20 text-white px-4 py-2 font-bold shadow-xl">
          🎨 Paletas
        </button>
      )}
    </div>
  );
}
