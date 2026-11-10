import { useEffect } from "react";
import { Link } from "react-router-dom";

// Contenido común de la portada para las 4 pruebas de estilo (mismo texto que la portada real).

export const NAV = [
  ["Inicio", "/"],
  ["Por qué invertir", "/por-que-invertir"],
  ["Aprende", "/aprende"],
  ["Empieza", "/empieza"],
  ["Foro", "/foro"],
];

export const HERO = {
  a: "Nadie nos lo ha enseñado",
  b: "pero nos afecta a todos",
  sub: "El dinero, la inflación y la inversión explicados con palabras normales y cifras reales.",
};

export const OBJETIVOS = [
  {
    n: 1,
    titulo: "Concienciar",
    resalto: "de la necesidad de invertir",
    intro: "Tres motivos:",
    items: [
      "El euro y el dólar (dinero fiat) son la peor forma de guardar valor a futuro",
      "Las pensiones pintan cada vez peor: la pirámide de población se ha invertido",
      "Los gobiernos gastan más de lo que tienen: la deuda y sus intereses no paran de crecer",
    ],
    enlace: ["Ver por qué invertir", "/por-que-invertir"],
  },
  {
    n: 2,
    titulo: "Aprender",
    resalto: "desde tu nivel",
    intro: "Partas de donde partas, lo mínimo para entender qué haces con tu dinero:",
    items: ["Conceptos básicos", "Productos financieros", "Carteras"],
    enlace: ["Ir a aprender", "/aprende"],
  },
  {
    n: 3,
    titulo: "Primer paso",
    resalto: "aunque sea con poco",
    intro: "Lo importante es entrar en este mundo:",
    items: ["10 €", "100 €", "1.000 €", "lo que sea"],
    enlace: ["Ver cómo empezar", "/empieza"],
  },
];

export const NO_HARA = [
  ["Decirte", "dónde invertir"],
  ["Venderte", "humo"],
  ["Hablarte de", "productos ganadores"],
];

export const TEXTO_NO =
  "Es una web completamente educativa. Nadie sabe el futuro: todo se basa en lo que ha pasado en la historia. Si buscas productos concretos, contacta con gente que sabe de verdad y te puede asesorar, porque cada persona tiene una tolerancia al riesgo distinta. Mi intención no es venderte nada: lo que hago es puramente vocacional.";

// Ejemplo 2 de la portada: 300 € al mes al 7 % anual desde los 20 años hasta llegar a 1 millón
const R = Math.pow(1.07, 1 / 12) - 1;
const valor = (m) => (300 * (Math.pow(1 + R, m) - 1)) / R;
export const MILLON = (() => {
  const barras = [];
  for (let a = 1; ; a++) {
    const v = valor(a * 12);
    barras.push({ total: Math.min(v, 1000000), puesto: 300 * 12 * a });
    if (v >= 1000000) return { barras, edad: 20 + a - 1 };
  }
})();

export const euros = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

// Barras del ejemplo: abajo lo que pones, encima lo que pone el interés compuesto
export function BarrasMillon({ puesto, ganado, linea, alto = "h-64 md:h-80", redondeo = 3, separacion = "gap-[2px] md:gap-1" }) {
  const max = 1000000;
  return (
    <div className={`relative ${alto}`}>
      {[250000, 500000, 750000, 1000000].map((l) => (
        <div key={l} className="absolute left-0 right-0 border-t" style={{ bottom: `${(l / max) * 100}%`, borderColor: linea }} />
      ))}
      <div className={`absolute inset-0 flex items-end ${separacion}`}>
        {MILLON.barras.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div style={{ height: `${((b.total - b.puesto) / max) * 100}%`, background: ganado, borderTopLeftRadius: redondeo, borderTopRightRadius: redondeo }} />
            <div style={{ height: `${(b.puesto / max) * 100}%`, background: puesto }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Carga las fuentes que solo usan las pruebas
export function useFuentes() {
  useEffect(() => {
    const id = "fuentes-estilos";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Great+Vibes&display=swap";
    document.head.appendChild(l);
  }, []);
}

// Barra para saltar entre pruebas
export function Selector({ n, oscuro = true }) {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex gap-1 p-1 rounded-full bg-black/70 backdrop-blur text-white text-xs font-bold shadow-lg">
      <span className="px-3 py-1.5 opacity-60">Estilo</span>
      {[1, 2, 3, 4].map((k) => (
        <Link key={k} to={`/estilos/${k}`} className={`w-8 h-8 rounded-full flex items-center justify-center ${k === n ? "bg-white text-black" : oscuro ? "hover:bg-white/15" : ""}`}>
          {k}
        </Link>
      ))}
    </div>
  );
}
