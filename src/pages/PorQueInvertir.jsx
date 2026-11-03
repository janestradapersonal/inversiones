import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Printer, Sprout } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import datos from "@/data/porque_invertir.json";

// Cada activo con su color; el euro va más grueso porque es el protagonista
const activos = [
  { id: "oro", nombre: "Oro", color: "#F5C542" },
  { id: "sp500", nombre: "S&P 500", color: "#88F9C0" },
  { id: "casa", nombre: "Vivienda en España", color: "#6CB4FF" },
  { id: "euro", nombre: "Euros guardados", color: "#FF5C7A" },
];

const euros = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";
const ultimo = datos.serie[datos.serie.length - 1];
const m3 = datos.m3;
const covid = Math.round((m3["2021-12"] / m3["2020-02"] - 1) * 100);
const veces = (m3.ultimo[1] / m3["1999-12"]).toLocaleString("es-ES", { maximumFractionDigits: 1 });
const billones = (n) => n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaM3 = `${MESES[Number(m3.ultimo[0].slice(5)) - 1]} de ${m3.ultimo[0].slice(0, 4)}`;

const razones = [
  {
    icon: <Landmark className="w-6 h-6" />,
    titulo: "Ya estás invertido, quieras o no",
    texto: "Si tienes euros, tu dinero está apostado a que el euro mantenga su valor. Y es la apuesta que, a la larga, siempre pierde. Ya que siempre vas a estar invirtiendo en algo, quieras o no, escapa del euro: al propio Estado le interesa que pierda valor, porque así su deuda pesa menos.",
  },
  {
    icon: <Printer className="w-6 h-6" />,
    titulo: "Tu dinero lo controla el Estado, no tú",
    texto: "Si hay una crisis, aunque sigas viendo el mismo número en el banco, el Estado (con su banco central, el BCE) estará imprimiendo e inyectando más dinero para superarla. Y si se fabrica más dinero, el que ya hay vale menos: es la ley de la oferta y la demanda, y se llama inflación. Además, no hace falta una crisis: se imprime constantemente. Por eso la gente huye a activos refugio, que son limitados y no se pueden imprimir, como el oro, o a empresas que suben de valor año tras año.",
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    titulo: "Nunca ha sido tan fácil empezar",
    texto: "Antes necesitabas mucho dinero y un banco que te cobrara comisiones altísimas. Hoy hay apps donde puedes empezar con 1 €. Equivocarte con 10 € no es perder: es aprender.",
  },
];

function Leyenda() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
      {activos.map((a) => (
        <li key={a.id} className="flex items-center gap-2">
          <span className="w-4 rounded-full" style={{ background: a.color, height: a.id === "euro" ? 4 : 2 }} />
          {a.nombre}
        </li>
      ))}
    </ul>
  );
}

function Pista({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const filas = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div className="rounded-xl bg-brand-onyx/95 border border-white/15 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{label === 1999 ? "Finales de 1999" : `Finales de ${label}`}</p>
      {filas.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-white/80 tabular-nums">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
          <span className="flex-1">{activos.find((a) => a.id === p.dataKey)?.nombre}</span>
          <span className="text-white font-semibold">{euros(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

// Bolsa con un agujero por el que se escapan monedas
function BolsaPinchada() {
  return (
    <svg viewBox="0 0 200 220" className="w-40 md:w-52 h-auto" aria-hidden>
      <path d="M70 40 Q100 20 130 40 L120 60 Q100 52 80 60 Z" fill="#2D2664" />
      <path d="M80 58 Q30 90 40 150 Q50 190 100 190 Q150 190 160 150 Q170 90 120 58 Q100 50 80 58 Z" fill="#3A2F86" stroke="#6331FB" strokeWidth="2" />
      <text x="100" y="140" textAnchor="middle" className="font-display" fontSize="44" fill="#ffffff" opacity="0.9">€</text>
      <ellipse cx="128" cy="186" rx="6" ry="3" fill="#01010D" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="128"
          r="5"
          fill="#F5C542"
          initial={{ cy: 188, opacity: 0 }}
          animate={{ cy: [188, 218], opacity: [1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

export default function PorQueInvertir() {
  const [modo, setModo] = useState("real");
  const filas = datos.serie.map((f) => ({ año: f.año, ...f[modo] }));
  const fin = ultimo[modo];

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface text-brand-mint font-semibold text-sm mb-5">
            Paso 1 · Por qué invertir
          </span>
          <h1 className="font-display uppercase text-5xl md:text-8xl leading-[0.9] tracking-tight mb-6">
            Todo el mundo <span className="font-serif italic normal-case text-brand-mint">invierte</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            «Yo no invierto», dice mucha gente. Pero si tienes euros, ya estás invertido: en euros. La pregunta no es si
            invertir, sino <strong className="text-white">en qué</strong>.
          </p>
        </motion.div>

        {/* Gráfico principal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-brand-surface border border-white/10 p-5 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
              <h2 className="font-display uppercase text-3xl md:text-5xl leading-[0.95]">
                10.000 € a finales de 1999
                <span className="block font-serif italic normal-case text-brand-mint">¿cuánto valen hoy?</span>
              </h2>
            </div>
            <div className="inline-flex self-start rounded-full bg-brand-onyx p-1 border border-white/10 text-xs md:text-sm font-semibold">
              {[["real", "Lo que puedes comprar"], ["nominal", "Euros de cada año"]].map(([k, txt]) => (
                <button
                  key={k}
                  onClick={() => setModo(k)}
                  className={`px-3 md:px-4 py-2 rounded-full transition-colors ${modo === k ? "bg-brand-mint text-brand-onyx" : "text-white/70 hover:text-white"}`}
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>
          <Leyenda />
          <div className="h-[320px] md:h-[420px] mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filas} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="año" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false}
                  ticks={[1999, 2005, 2010, 2015, 2020, 2025]} />
                <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44}
                  tickFormatter={(n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n)} />
                <Tooltip content={<Pista />} cursor={{ stroke: "rgba(255,255,255,0.3)" }} />
                {activos.map((a) => (
                  <Line key={a.id} type="monotone" dataKey={a.id} stroke={a.color} dot={false}
                    strokeWidth={a.id === "euro" ? 4 : 2} activeDot={{ r: 5, stroke: "#110D33", strokeWidth: 2 }}
                    isAnimationActive />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cifras finales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[...activos].sort((a, b) => fin[b.id] - fin[a.id]).map((a) => (
              <div key={a.id} className={`rounded-2xl p-4 border ${a.id === "euro" ? "border-[#FF5C7A]/60 bg-[#FF5C7A]/10" : "border-white/10 bg-brand-onyx/60"}`}>
                <p className="text-xs text-white/60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: a.color }} /> {a.nombre}
                </p>
                <p className="font-display text-2xl md:text-3xl text-white tabular-nums mt-1">{euros(fin[a.id])}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-white/85 leading-relaxed">
            {modo === "real" ? (
              <>
                Descontando la inflación, los 10.000 € guardados hoy compran lo mismo que{" "}
                <strong className="text-[#FF5C7A]">{euros(fin.euro)}</strong> de 1999. Es la única opción que ha acabado
                perdiendo.
              </>
            ) : (
              <>
                En la cuenta siguen poniendo 10.000 €, así que parece que no has perdido nada. Pero con ellos compras
                lo que en 1999 costaba <strong className="text-[#FF5C7A]">{euros(ultimo.real.euro)}</strong>.
              </>
            )}
          </p>
          <p className="mt-3 text-[11px] leading-snug text-white/45">
            Datos de finales de cada año hasta 2025. Oro: {datos.fuentes.oro}. S&P 500: {datos.fuentes.sp500}. Vivienda:{" "}
            {datos.fuentes.casa}. Inflación: {datos.fuentes.euro}. Ninguna de estas inversiones sube en línea recta (mira el
            S&P 500 entre 2000 y 2012) y lo que hicieron en el pasado no garantiza lo que harán en el futuro.
          </p>
        </motion.section>

        {/* Más euros = euros que valen menos */}
        <section className="grid md:grid-cols-2 gap-6 items-center my-20">
          <div>
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-5">
              El euro está hecho para{" "}
              <span className="font-serif italic normal-case text-[#FF5C7A]">perder valor</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-4">
              El Banco Central Europeo tiene como objetivo que los precios suban un 2 % cada año. Es decir: está diseñado
              para que tu euro compre un poco menos cada año.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              Y cada año hay más euros. En diciembre de 1999 había {billones(m3["1999-12"])} billones de euros en la zona
              euro; en {fechaM3}, {billones(m3.ultimo[1])} billones. <strong className="text-white">{veces} veces más.</strong>
            </p>
          </div>
          <div className="rounded-3xl bg-brand-surface border border-white/10 p-5">
            <p className="text-sm font-semibold text-white mb-1">Euros en circulación en la zona euro</p>
            <p className="text-xs text-white/50 mb-3">Billones de euros (M3)</p>
            <div className="h-[220px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={m3.anual} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6331FB" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#6331FB" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="año" type="number" domain={["dataMin", "dataMax"]} ticks={[2000, 2010, 2020]}
                    stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip
                    formatter={(v) => [`${billones(v)} billones €`, "M3"]}
                    labelFormatter={(a) => (Number.isInteger(a) ? `Diciembre de ${a}` : fechaM3)}
                    contentStyle={{ background: "#01010D", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="billones" stroke="#8B66FF" strokeWidth={2} fill="url(#m3)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-white/45">Fuente: {datos.fuentes.m3}.</p>
          </div>
        </section>

        {/* Covid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-brand-indigo p-8 md:p-12 mb-20 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-[60px] pointer-events-none" />
          <div className="relative grid md:grid-cols-[auto,1fr] gap-6 md:gap-10 items-center">
            <p className="font-display text-7xl md:text-9xl text-brand-mint leading-none">+{covid}%</p>
            <div>
              <h3 className="font-display uppercase text-2xl md:text-4xl leading-tight mb-3">Ejemplo: la COVID</h3>
              <p className="text-white/85 text-lg leading-relaxed">
                De febrero de 2020 a diciembre de 2021, los euros en circulación pasaron de {billones(m3["2020-02"])} a{" "}
                {billones(m3["2021-12"])} billones: un {covid} % más en menos de dos años. Tu cuenta seguía marcando lo
                mismo y parecía que no habías perdido nada. Pero había muchos más euros persiguiendo las mismas cosas, y
                en 2022 los precios en España subieron más de un 8 %.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Bolsa pinchada */}
        <section className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center mb-20">
          <div className="flex justify-center">
            <BolsaPinchada />
          </div>
          <div>
            <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-5">
              Una bolsa <span className="font-serif italic normal-case text-brand-mint">pinchada</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Ahorrar en euros es como ir metiendo dinero en una bolsa con un agujero. Puedes seguir metiendo más, pero
              por debajo se escapa un poco cada año. No se trata de multiplicar tu dinero por mil: se trata, como mínimo,
              de <strong className="text-white">tapar el agujero</strong> y que lo que te ha costado ganar no se vaya
              perdiendo.
            </p>
          </div>
        </section>

        {/* Razones */}
        <section className="mb-20">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-8 text-center">
            Tres razones para <span className="font-serif italic normal-case text-brand-mint">reaccionar</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {razones.map((r, i) => (
              <motion.div
                key={r.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-brand-surface border border-white/10 p-7"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-mint flex items-center justify-center text-brand-onyx">{r.icon}</div>
                  <span className="font-display text-3xl text-white/20">0{i + 1}</span>
                </div>
                <h3 className="font-sora text-xl font-bold mb-2">{r.titulo}</h3>
                <p className="text-white/75 leading-relaxed">{r.texto}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final */}
        <section className="rounded-3xl bg-brand-surface border border-white/10 p-8 md:p-12 text-center">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-4">
            Y ahora es <span className="font-serif italic normal-case text-brand-mint">facilísimo</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Hay brokers con los que empiezas con 1 €. No hace falta saber muchísimo: puedes aprender sobre la marcha, y si
            te equivocas con 10 €, no pasa absolutamente nada. Lo importante es empezar a proteger lo que tienes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/aprende" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-mint text-brand-onyx font-bold text-lg hover:scale-105 transition-transform">
              Aprende lo básico <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/empieza" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/70 text-white font-bold text-lg hover:bg-white hover:text-brand-onyx transition-colors">
              Empieza ya
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/45">Contenido educativo. Esto no es asesoramiento financiero.</p>
        </section>
      </div>
    </div>
  );
}
