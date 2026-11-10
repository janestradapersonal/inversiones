import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw, Search, X } from "lucide-react";
import Visual, { Tarta } from "@/components/aprende/Visuales";
import Calculadora from "@/components/aprende/Calculadora";
import { CARTERAS, CATEGORIAS, CONCEPTOS, MYINVESTOR, NIVELES, ORDEN_PRODUCTOS, PRODUCTOS, TEST } from "@/data/aprende";

const SECCIONES = [
  { id: "productos", titulo: "Productos financieros", sub: `${PRODUCTOS.length} productos, de menos a más rentabilidad`, items: PRODUCTOS },
  { id: "conceptos", titulo: "Conceptos clave", sub: `${CONCEPTOS.length} ideas para entender lo que haces`, items: CONCEPTOS },
  { id: "carteras", titulo: "Carteras", sub: "Haz el test de tu perfil y mira ejemplos" },
];
const TODOS = [...PRODUCTOS.map((x) => ({ ...x, tipo: "Producto" })), ...CONCEPTOS.map((x) => ({ ...x, tipo: "Concepto" }))];

// Busca sin tener en cuenta mayúsculas ni tildes
const normal = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function Nivel({ n }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ color: NIVELES[n].color }}>
      <span className="flex gap-0.5">
        {[1, 2, 3].map((k) => (
          <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: k <= n ? NIVELES[n].color : "rgba(255,255,255,0.15)" }} />
        ))}
      </span>
      {NIVELES[n].nombre}
    </span>
  );
}

const CAT_COLOR = { fija: "#6CB4FF", variable: "#9E85FF" };

function Categoria({ id }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wider text-right" style={{ color: CAT_COLOR[id] }}>
      {id === "fija" ? "Renta fija" : "Renta variable"}
    </span>
  );
}

function Rentabilidad({ texto }) {
  return (
    <p className="mt-3 text-xs rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-white/80">
      <span className="text-white/50">Rentabilidad aprox.: </span>
      <span className="font-semibold">{texto}</span>
    </p>
  );
}

function Tarjeta({ item, onAbrir }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onAbrir}
      className="group text-left rounded-2xl bg-brand-surface border border-white/10 p-5 hover:border-brand-mint/60 hover:-translate-y-0.5 transition-all flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-3xl">{item.e}</span>
        {item.rent ? <Categoria id={item.cat} /> : <Nivel n={item.nivel} />}
      </div>
      <h3 className="font-sora font-bold text-white leading-snug mb-1">{item.titulo}</h3>
      <p className="text-sm text-white/65 leading-snug flex-1">{item.resumen}</p>
      {item.rent && <Rentabilidad texto={item.rent} />}
      <span className="mt-3 text-xs font-semibold text-brand-mint inline-flex items-center gap-1">
        {item.calc ? "Ver y probar" : "Ver explicación"} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </span>
    </motion.button>
  );
}

// Ficha abierta: explicación + dibujo + ejemplo (+ calculadora), con anterior/siguiente como diapositivas
function Ficha({ lista, indice, onCambiar, onCerrar }) {
  const item = lista[indice];
  useEffect(() => {
    const tecla = (e) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight" && indice < lista.length - 1) onCambiar(indice + 1);
      if (e.key === "ArrowLeft" && indice > 0) onCambiar(indice - 1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [indice, lista.length, onCambiar, onCerrar]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={onCerrar}>
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8"
      >
        <button onClick={onCerrar} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4 pr-10">
          <span className="text-4xl">{item.e}</span>
          <div>
            {item.rent ? <Categoria id={item.cat} /> : <Nivel n={item.nivel} />}
            <h2 className="font-display uppercase text-3xl md:text-4xl leading-none mt-1">{item.titulo}</h2>
          </div>
        </div>
        <p className="text-brand-mint font-semibold mb-3">{item.resumen}</p>
        {item.rent && (
          <div className="mb-4">
            <Rentabilidad texto={item.rent} />
            <p className="text-[11px] text-white/45 mt-1">Aproximada e histórica, solo para orientarte. No es una promesa: puede ser mayor, menor o negativa.</p>
          </div>
        )}
        <p className="text-white/85 leading-relaxed mb-5">{item.texto}</p>

        <div className="rounded-2xl bg-brand-onyx/60 border border-white/10 p-4 mb-4">
          <Visual v={item.visual} />
        </div>
        <div className="rounded-2xl bg-[#F5C542]/10 border-l-4 border-[#F5C542] p-4 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5C542] mb-1">Ejemplo</p>
          <p className="text-white/90 text-sm leading-relaxed">{item.ejemplo}</p>
        </div>
        {item.calc && <Calculadora tipo={item.calc} />}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => onCambiar(indice - 1)}
            disabled={indice === 0}
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <span className="text-xs text-white/45 tabular-nums">{indice + 1} / {lista.length}</span>
          <button
            onClick={() => onCambiar(indice + 1)}
            disabled={indice === lista.length - 1}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-mint disabled:opacity-30"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Grupo({ cabecera, sub, color, items, onAbrir }) {
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <span className="font-display uppercase text-2xl md:text-3xl" style={{ color }}>{cabecera}</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>
        {sub && <p className="text-sm text-white/60 mt-1">{sub}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(([x, i]) => <Tarjeta key={x.id} item={x} onAbrir={() => onAbrir(i)} />)}
      </div>
    </div>
  );
}

function Rejilla({ lista, onAbrir, agrupar }) {
  if (!lista.length) return <p className="text-center text-white/60 py-16">No hay nada con esa búsqueda. Prueba con otra palabra.</p>;
  if (!agrupar) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {lista.map((x, i) => <Tarjeta key={x.id} item={x} onAbrir={() => onAbrir(i)} />)}
      </div>
    );
  }
  const indexados = lista.map((x, i) => [x, i]);
  if (agrupar === "categoria") {
    return (
      <div className="space-y-12">
        {CATEGORIAS.map((c) => {
          const items = indexados.filter(([x]) => x.cat === c.id);
          return items.length ? <Grupo key={c.id} cabecera={c.titulo} sub={c.sub} color={CAT_COLOR[c.id]} items={items} onAbrir={onAbrir} /> : null;
        })}
      </div>
    );
  }
  return (
    <div className="space-y-10">
      {[1, 2, 3].map((n) => {
        const items = indexados.filter(([x]) => x.nivel === n);
        return items.length ? <Grupo key={n} cabecera={`Nivel ${n} · ${NIVELES[n].nombre}`} color={NIVELES[n].color} items={items} onAbrir={onAbrir} /> : null;
      })}
    </div>
  );
}

// Línea de ejemplo: la fija sube poco a poco; la variable sube más pero dando saltos
const LINEA_FIJA = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
const LINEA_VARIABLE = [0, 14, 4, 26, 12, 38, 22, 52, 40, 66, 78];

function MiniLinea({ y, color }) {
  const d = y.map((v, k) => `${k ? "L" : "M"}${k * 26},${88 - v}`).join(" ");
  return (
    <svg viewBox="0 0 260 92" className="w-full h-24" aria-hidden>
      <line x1="0" y1="88" x2="260" y2="88" stroke="rgba(255,255,255,0.12)" />
      <motion.path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
    </svg>
  );
}

function IntroProductos() {
  const lados = [
    {
      id: "fija", titulo: "Renta fija", frase: "sabes lo que vas a ganar",
      texto: "Prestas tu dinero y te dicen de antemano cuánto te pagarán. Por eso se llama fija. Aquí va también tu colchón de emergencia.",
      rent: "≈ 0-5 % al año", sustos: "Pocos", linea: LINEA_FIJA,
    },
    {
      id: "variable", titulo: "Renta variable", frase: "no sabes lo que vas a ganar",
      texto: "Eres dueño de empresas (o de algo cuyo precio cambia). Varía: hay más incertidumbre y años de caídas, pero históricamente ha dado más.",
      rent: "≈ 6-9 % a largo plazo en bolsa", sustos: "Muchos", linea: LINEA_VARIABLE,
    },
  ];
  return (
    <div className="mb-12">
      <div className="grid md:grid-cols-2 gap-4">
        {lados.map((l) => (
          <div key={l.id} className="rounded-3xl bg-brand-surface border-2 p-6 md:p-8" style={{ borderColor: `${CAT_COLOR[l.id]}66` }}>
            <h2 className="font-display uppercase text-5xl md:text-6xl leading-none" style={{ color: CAT_COLOR[l.id] }}>{l.titulo}</h2>
            <p className="font-serif italic text-2xl md:text-3xl text-white mt-1">{l.frase}</p>
            <MiniLinea y={l.linea} color={CAT_COLOR[l.id]} />
            <p className="text-white/75 leading-relaxed mb-4">{l.texto}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-brand-onyx/60 p-3">
                <p className="text-[11px] text-white/50">Rentabilidad aprox.</p>
                <p className="font-semibold text-white text-sm">{l.rent}</p>
              </div>
              <div className="rounded-xl bg-brand-onyx/60 p-3">
                <p className="text-[11px] text-white/50">Sustos por el camino</p>
                <p className="font-semibold text-white text-sm">{l.sustos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-3xl bg-brand-indigo p-6 md:p-8 text-center">
        <p className="font-display uppercase text-2xl md:text-4xl leading-tight">
          La volatilidad y la incertidumbre son <span className="font-serif italic normal-case text-brand-mint">el precio a pagar</span> por la rentabilidad
        </p>
        <p className="mt-3 text-xs text-white/65 max-w-3xl mx-auto">
          Todas las rentabilidades de esta sección son aproximadas, solo para orientarte. No son una promesa: pueden ser mayores, menores o
          negativas, y lo que pasó en el pasado no garantiza el futuro.
        </p>
      </div>
    </div>
  );
}

// ---------- Test y carteras ----------
function perfilDe(puntos) {
  return [...CARTERAS].filter((c) => puntos >= c.desde).pop();
}

const AVISOS = {
  horizonte: "Este dinero lo necesitas pronto: mejor que no vaya a bolsa. Para menos de 2 años encajan una cuenta remunerada, un depósito, Letras del Tesoro o un fondo monetario.",
  colchon: "Antes de invertir, aparta tu fondo de emergencia (3 a 6 meses de gastos en una cuenta remunerada). Así nunca tendrás que vender en mal momento.",
};

function Test({ onResultado }) {
  const [paso, setPaso] = useState(0);
  const [resp, setResp] = useState([]);
  const elegir = (r) => {
    const nuevas = [...resp.slice(0, paso), r];
    setResp(nuevas);
    if (paso < TEST.length - 1) setPaso(paso + 1);
    else {
      const total = nuevas.reduce((s, x) => s + x.v, 0);
      onResultado({ puntos: Math.round((total / (TEST.length * 4)) * 100), avisos: nuevas.filter((x) => x.stop).map((x) => x.stop) });
    }
  };
  const q = TEST[paso];
  return (
    <div className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8">
      <div className="flex items-center justify-between mb-2 text-xs text-white/55">
        <span>Pregunta {paso + 1} de {TEST.length}</span>
        {paso > 0 && (
          <button onClick={() => setPaso(paso - 1)} className="inline-flex items-center gap-1 hover:text-white">
            <ChevronLeft className="w-3.5 h-3.5" /> Atrás
          </button>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-white/10 mb-6 overflow-hidden">
        <motion.div className="h-full bg-brand-mint" animate={{ width: `${(paso / TEST.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={paso} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <h3 className="font-sora font-bold text-xl md:text-2xl mb-5">{q.p}</h3>
          <div className="grid gap-2">
            {q.r.map((r) => (
              <button
                key={r.t}
                onClick={() => elegir(r)}
                className={`text-left px-5 py-4 rounded-2xl border transition-colors ${resp[paso]?.t === r.t ? "border-brand-mint bg-brand-mint/10" : "border-white/10 bg-brand-onyx/50 hover:border-brand-mint/60"}`}
              >
                {r.t}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Resultado({ res, onRepetir }) {
  const perfil = perfilDe(res.puntos);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-brand-indigo p-6 md:p-10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15 blur-[70px] pointer-events-none" />
      <div className="relative grid md:grid-cols-[auto,1fr] gap-8 items-center">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-white/70">Tu perfil inversor</p>
          <p className="font-display text-8xl text-brand-mint leading-none tabular-nums">{res.puntos}%</p>
          <p className="text-sm text-white/75 mt-1">de tolerancia al riesgo</p>
        </div>
        <div>
          <h3 className="font-display uppercase text-4xl md:text-5xl leading-none mb-3">
            {perfil.nombre}
          </h3>
          <p className="text-white/85 mb-4">
            {perfil.para} Se parece a la cartera <strong>{perfil.nombre}</strong> de MyInvestor: {perfil.rv} % renta variable y{" "}
            {100 - perfil.rv} % renta fija. Y antes, tu colchón: {perfil.colchon}.
          </p>
          {res.avisos.length > 0 && (
            <div className="rounded-2xl bg-brand-onyx/60 border border-[#FF5C7A]/60 p-4 mb-4 space-y-2">
              <p className="text-[#FF5C7A] text-xs font-bold uppercase tracking-wider">Antes de nada</p>
              {res.avisos.map((a) => <p key={a} className="text-sm text-white/90">{AVISOS[a]}</p>)}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <a href={`#cartera-${perfil.id}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand-mint text-brand-onyx font-bold text-sm">
              Ver esa cartera <ArrowRight className="w-4 h-4" />
            </a>
            <button onClick={onRepetir} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/50 text-sm font-semibold hover:bg-white/10">
              <RotateCcw className="w-4 h-4" /> Repetir el test
            </button>
          </div>
        </div>
      </div>
      <p className="relative mt-6 text-[11px] text-white/55">
        Orientativo y educativo. No tiene en cuenta toda tu situación y no es asesoramiento financiero.
      </p>
    </motion.div>
  );
}

// Mezcla tú mismo: cuánto en bolsa y cuánto en renta fija
function Mezclador() {
  const [bolsa, setBolsa] = useState(60);
  return (
    <div className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-mint mb-1">Prueba tu mezcla</p>
      <h3 className="font-display uppercase text-3xl mb-5">¿Cuánto en bolsa?</h3>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <input type="range" min={0} max={100} step={5} value={bolsa} onChange={(e) => setBolsa(Number(e.target.value))} className="w-full accent-brand-mint" />
          <div className="flex justify-between text-xs text-white/55 mt-1">
            <span>Todo renta fija</span>
            <span>Todo bolsa</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <div className="rounded-xl bg-white/[0.05] p-3">
              <p className="text-[11px] text-white/55">En una crisis como 2008</p>
              <p className="font-display text-2xl text-[#FF5C7A] tabular-nums">≈ −{Math.round(bolsa * 0.5)} %</p>
            </div>
            <div className="rounded-xl bg-white/[0.05] p-3">
              <p className="text-[11px] text-white/55">Crecimiento a largo plazo</p>
              <p className="font-display text-2xl text-brand-mint">{bolsa >= 70 ? "Alto" : bolsa >= 40 ? "Medio" : "Bajo"}</p>
            </div>
          </div>
          <p className="text-[11px] text-white/45 mt-3">
            Aproximación: en 2008 las bolsas mundiales llegaron a caer alrededor de la mitad y la renta fija de calidad aguantó. Otras crisis pueden ser distintas (en 2022 cayeron las dos).
          </p>
        </div>
        <Tarta tam={150} centro={`${bolsa}/${100 - bolsa}`} partes={[{ t: "Bolsa mundial", v: bolsa, color: "menta" }, { t: "Renta fija", v: 100 - bolsa, color: "azul" }].filter((p) => p.v > 0)} />
      </div>
    </div>
  );
}

function Carteras() {
  const [res, setRes] = useState(null);
  const perfil = res && perfilDe(res.puntos);
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display uppercase text-4xl md:text-5xl leading-none mb-2">
          1. Descubre tu <span className="font-serif italic normal-case text-brand-mint">perfil</span>
        </h2>
        <p className="text-white/70 mb-6 max-w-2xl">
          Antes de elegir una cartera hay que saber cuánto riesgo puedes asumir: cuándo necesitarás el dinero, tu edad, tus ingresos y cómo
          llevas las caídas. Cinco preguntas.
        </p>
        {res ? <Resultado res={res} onRepetir={() => setRes(null)} /> : <Test onResultado={setRes} />}
      </div>

      <Mezclador />

      <div>
        <h2 className="font-display uppercase text-4xl md:text-5xl leading-none mb-2">
          2. Ejemplos: las carteras de <span className="font-serif italic normal-case text-brand-mint">MyInvestor</span>
        </h2>
        <p className="text-white/70 mb-6 max-w-3xl">
          Hay dos formas de tener una cartera: montarla tú eligiendo tus fondos o acciones, o coger una ya hecha. Las dos sirven para ir
          ahorrando para tu futuro y tu jubilación.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-3xl bg-brand-surface border border-white/10 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#F5C542] mb-2">Sin mínimo</p>
            <h3 className="font-display uppercase text-3xl leading-none mb-3">Tu propia cartera</h3>
            <p className="text-sm text-white/75 leading-relaxed">
              Compras tú los fondos indexados, ETF o acciones que quieras. Muchos fondos indexados de MyInvestor no tienen importe mínimo, y
              en Trade Republic compras acciones y ETF desde 1 €. Si 150 € te parece mucho para empezar, empieza así, con poco, y ve
              avanzando.
            </p>
          </div>
          <div className="rounded-3xl bg-brand-surface border-2 border-brand-mint/50 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-mint mb-2">Desde {MYINVESTOR.minimo} · la que uso yo</p>
            <h3 className="font-display uppercase text-3xl leading-none mb-3">Cartera automática</h3>
            <p className="text-sm text-white/75 leading-relaxed">
              Lo mejor de las carteras de MyInvestor: se rebalancean solas, están muy diversificadas (miles de empresas y bonos de todo el
              mundo) y tienen comisiones muy bajas. Yo las uso. Lo único: el mínimo para empezar es de {MYINVESTOR.minimo}. Y si tienes
              dudas, puedes llamar a su atención al cliente.
            </p>
          </div>
        </div>

        {/* Lo primero en todas: el colchón */}
        <div className="flex items-start gap-3 rounded-2xl bg-[#6CB4FF]/10 border border-[#6CB4FF]/40 p-4 mb-4">
          <p className="text-sm text-white/85">
            <strong className="text-white">En todas, primero el colchón de emergencia</strong>: unos meses de gastos en una cuenta remunerada o
            un fondo monetario, aparte de la cartera. Así nunca tendrás que vender en plena caída.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARTERAS.map((c) => (
            <div
              key={c.id}
              id={`cartera-${c.id}`}
              className={`scroll-mt-28 flex flex-col rounded-3xl bg-brand-surface p-6 border-2 transition-colors ${perfil?.id === c.id ? "border-brand-mint" : "border-white/10"}`}
            >
              <div className="flex items-center justify-between mb-1 gap-2">
                <h3 className="font-display uppercase text-3xl">{c.nombre}</h3>
                {perfil?.id === c.id && <span className="px-3 py-1 rounded-full bg-brand-mint text-brand-onyx text-[11px] font-bold uppercase whitespace-nowrap">Tu perfil</span>}
              </div>
              <p className="text-sm text-white/70 mb-4 flex-1">{c.para}</p>
              <p className="text-xs rounded-lg bg-[#6CB4FF]/10 text-white/85 px-3 py-2 mb-4">
                <span className="text-white/55">Colchón aparte:</span> {c.colchon}
              </p>
              <Tarta
                partes={[{ t: "Renta variable", v: c.rv, color: "menta" }, { t: "Renta fija", v: 100 - c.rv, color: "azul" }].filter((x) => x.v > 0)}
              />
              <p className="mt-4 text-xs text-white/60">En una crisis como la de 2008 podría caer ≈ {Math.max(5, Math.round(c.rv * 0.5))} % o más.</p>
            </div>
          ))}
          <div className="rounded-3xl bg-brand-indigo p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Empieza ya</p>
              <ul className="space-y-2 text-sm text-white/90 list-disc pl-4">
                <li>Desde <strong>{MYINVESTOR.minimo}</strong></li>
                <li>Coste: {MYINVESTOR.coste}</li>
                <li>Sin comisión por comprar, traspasar o retirar</li>
              </ul>
            </div>
            <a
              href={MYINVESTOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-mint text-brand-onyx font-bold text-sm hover:scale-105 transition-transform"
            >
              Ver las carteras en MyInvestor <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/45">
          Repartos y condiciones de la web de MyInvestor consultados en {MYINVESTOR.fecha}; pueden cambiar, compruébalos antes de contratar. Ejemplos
          educativos, no recomendaciones personales. Las caídas son aproximadas y las rentabilidades pasadas no garantizan las futuras.
        </p>
      </div>
    </div>
  );
}

export default function Aprende() {
  const [params, setParams] = useSearchParams();
  const seccion = SECCIONES.find((s) => s.id === params.get("s")) || SECCIONES[0];
  const [busca, setBusca] = useState("");
  const [nivel, setNivel] = useState(0);
  const [abierta, setAbierta] = useState(null);

  const buscando = busca.trim().length > 0;
  const lista = useMemo(() => {
    const base = buscando ? TODOS : seccion.items || [];
    const q = normal(busca.trim());
    const filtrados = base
      .filter((x) => !q || normal([x.titulo, x.resumen, x.texto, ...(x.tags || [])].join(" ")).includes(q))
      .filter((x) => !nivel || x.rent || x.nivel === nivel);
    // Productos: por tipo y de menos a más rentabilidad; conceptos: de fácil a difícil
    const productos = filtrados.filter((x) => x.rent).sort((a, b) =>
      CATEGORIAS.findIndex((c) => c.id === a.cat) - CATEGORIAS.findIndex((c) => c.id === b.cat) ||
      ORDEN_PRODUCTOS.indexOf(a.id) - ORDEN_PRODUCTOS.indexOf(b.id));
    const conceptos = filtrados.filter((x) => !x.rent).sort((a, b) => a.nivel - b.nivel);
    return [...productos, ...conceptos];
  }, [busca, buscando, nivel, seccion]);

  const elegir = (id) => {
    setBusca("");
    setNivel(0);
    setParams({ s: id }, { replace: true });
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface text-brand-mint font-semibold text-sm mb-5">Paso 2 · Aprende</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.92] tracking-tight mb-5">
            Aprende <span className="font-serif italic normal-case text-brand-mint">a tu ritmo</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            De lo más fácil a lo más avanzado, con ejemplos y dibujos. Busca lo que quieras o empieza por el nivel básico.
          </p>
        </motion.div>

        {/* Las tres secciones, visibles desde el principio */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8">
          {SECCIONES.map((s) => {
            const activa = !buscando && s.id === seccion.id;
            return (
              <button
                key={s.id}
                onClick={() => elegir(s.id)}
                className={`text-left rounded-2xl md:rounded-3xl p-3 md:p-6 border-2 transition-all ${activa ? "bg-brand-indigo border-brand-indigo" : "bg-brand-surface border-white/10 hover:border-white/30"}`}
              >
                <h2 className="font-display uppercase text-base sm:text-xl md:text-3xl leading-none">{s.titulo}</h2>
                <p className={`hidden md:block text-sm mt-2 ${activa ? "text-white/85" : "text-white/60"}`}>{s.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Buscador de productos y conceptos */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Busca un producto o concepto: ETF, inflación, impuestos…"
              className="w-full pl-12 pr-10 py-4 rounded-full bg-brand-surface border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-mint/50"
            />
            {buscando && (
              <button onClick={() => setBusca("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white" aria-label="Borrar búsqueda">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {!buscando && seccion.id === "conceptos" && (
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${nivel === n ? "bg-brand-mint text-brand-onyx border-brand-mint" : "bg-brand-surface text-white/70 border-white/10 hover:text-white"}`}
                >
                  {n ? NIVELES[n].nombre : "Todos los niveles"}
                </button>
              ))}
            </div>
          )}
        </div>

        {buscando ? (
          <>
            <p className="text-sm text-white/60 mb-4">{lista.length} resultado{lista.length === 1 ? "" : "s"} para «{busca.trim()}»</p>
            <Rejilla lista={lista} onAbrir={setAbierta} />
          </>
        ) : seccion.items ? (
          <>
            {seccion.id === "productos" && <IntroProductos />}
            <Rejilla lista={lista} onAbrir={setAbierta} agrupar={seccion.id === "productos" ? "categoria" : "nivel"} />
          </>
        ) : (
          <Carteras />
        )}

        <div className="mt-20 text-center">
          <p className="text-white/70 mb-5 text-lg">¿Ya tienes lo básico? Es hora de pasar a la acción.</p>
          <Link to="/empieza" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold text-lg hover:scale-105 transition-transform">
            Empieza ya <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-xs text-white/40">Contenido educativo. Esto no es asesoramiento financiero.</p>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {abierta !== null && lista[abierta] && (
            <Ficha lista={lista} indice={abierta} onCambiar={setAbierta} onCerrar={() => setAbierta(null)} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
