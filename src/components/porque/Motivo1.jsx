import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Printer } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import datos from "@/data/porque_invertir.json";
import grafico from "@/data/mercados.json";

// Cada activo con su color; el euro va más grueso porque es el protagonista
const activos = [
  { id: "oro", nombre: "Oro", color: "#F5C542" },
  { id: "sp500", nombre: "S&P 500", color: "#88F9C0" },
  { id: "casa", nombre: "Vivienda en España", color: "#6CB4FF" },
  { id: "euro", nombre: "Euros guardados", color: "#FF5C7A" },
];

// Rótulo de cada crisis en el gráfico: fila y lado, para que no se pisen los que están cerca
const rotulos = {
  2008: { texto: "2008", fila: 0, lado: "end" },
  covid: { texto: "Covid", fila: 0, lado: "middle" },
  aranceles: { texto: "Aranceles", fila: 1, lado: "end" },
  iran: { texto: "Irán", fila: 2, lado: "end" },
};

const euros = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" }) + " €";
const coma = (n, d = 1) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });

// Lo que pueden comprar hoy 10.000 € invertidos en la primera fecha de la vista (ya descontada la inflación)
function valores(filas) {
  const [, oro0, sp0, casa0, ipc0] = filas[0];
  return filas.map(([fecha, oro, sp500, casa, ipc]) => {
    const k = ipc0 / ipc;
    return {
      fecha,
      oro: (10000 * oro * k) / oro0,
      sp500: (10000 * sp500 * k) / sp0,
      casa: casa == null ? null : (10000 * casa * k) / casa0,
      euro: 10000 * k,
    };
  });
}
const m3 = Object.fromEntries(grafico.dinero);
m3.ultimo = grafico.dinero.at(-1);
const covid = Math.round((m3["2021-12"] / m3["2020-02"] - 1) * 100);
const veces = (m3.ultimo[1] / m3["1999-12"]).toLocaleString("es-ES", { maximumFractionDigits: 1 });
const billones = (n) => n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaM3 = `${MESES[Number(m3.ultimo[0].slice(5)) - 1]} de ${m3.ultimo[0].slice(0, 4)}`;
const fechaLarga = (s) => `${Number(s.slice(8, 10))} de ${MESES[Number(s.slice(5, 7)) - 1]} de ${s.slice(0, 4)}`;
const mesCorto = (s) => `${MESES[Number(s.slice(5, 7)) - 1].slice(0, 3)} ${s.slice(2, 4)}`;
const diaCorto = (s) => `${Number(s.slice(8, 10))} ${MESES[Number(s.slice(5, 7)) - 1].slice(0, 3)} ${s.slice(0, 4)}`;

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
];

function Leyenda({ crisis }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
      {activos.map((a) => (
        <li key={a.id} className="flex items-center gap-2">
          <span className="w-4 rounded-full" style={{ background: a.color, height: a.id === "euro" ? 4 : 2 }} />
          {a.nombre}
        </li>
      ))}
      {crisis && (
        <>
          <li className="flex items-center gap-2">
            <span className="w-4 h-3 rounded-sm bg-[#FF5C7A]/30" />
            Caída del S&P 500
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-3 rounded-sm bg-[#88F9C0]/30" />
            Subida hasta recuperarlo
          </li>
        </>
      )}
    </ul>
  );
}

function RotuloCrisis({ viewBox, crisis }) {
  const { texto, fila, lado } = rotulos[crisis.id];
  const x = lado === "end" ? viewBox.x + viewBox.width : viewBox.x + viewBox.width / 2;
  return (
    <text x={x} y={viewBox.y - 34 + fila * 15} textAnchor={lado} fontSize={11} fontWeight={700} fill="#FF9DB0"
      stroke="#110D33" strokeWidth={3} paintOrder="stroke">
      {texto} −{coma(Math.abs(crisis.caida), 0)} %
      <tspan fill="#88F9C0"> +{coma(crisis.subida, 0)} %</tspan>
    </text>
  );
}

function Pista({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const filas = payload.filter((p) => p.value != null).sort((a, b) => b.value - a.value);
  return (
    <div className="rounded-xl bg-brand-onyx/95 border border-white/15 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{fechaLarga(label)}</p>
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

// Euros en circulación frente a lo que compra tu dinero
const VISTAS_DINERO = {
  covid: { desde: "2019-07", hasta: "2023-12", base: "2020-02", ticks: ["2020-01", "2021-01", "2022-01", "2023-01"], m3: [12, 13, 14, 15, 16, 17], valor: [800, 850, 900, 950, 1000, 1050] },
  años: { desde: "1999-12", hasta: "9999", base: "1999-12", ticks: ["2000-01", "2010-01", "2020-01"], m3: [0, 5, 10, 15, 20], valor: [0, 250, 500, 750, 1000] },
};
const mesLargo = (m) => `${MESES[Number(m.slice(5, 7)) - 1]} de ${m.slice(0, 4)}`;

function GraficoDinero() {
  const [vista, setVista] = useState("covid");
  const v = VISTAS_DINERO[vista];
  const ipc0 = grafico.dinero.find(([mes]) => mes === v.base)[2];
  const filas = grafico.dinero
    .filter(([mes]) => mes >= v.desde && mes <= v.hasta)
    .map(([mes, billonesM3, ipc]) => ({ mes, m3: billonesM3, valor: ipc == null ? null : (1000 * ipc0) / ipc }));
  return (
    <div className="rounded-3xl bg-brand-surface border border-white/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-white">Más euros, y cada uno compra menos</p>
        <div className="inline-flex rounded-full bg-brand-onyx p-1 border border-white/10 text-xs font-semibold">
          {[["covid", "Covid"], ["años", "Desde 1999"]].map(([k, txt]) => (
            <button
              key={k}
              onClick={() => setVista(k)}
              className={`px-3 py-1.5 rounded-full transition-colors ${vista === k ? "bg-brand-mint text-brand-onyx" : "text-white/70 hover:text-white"}`}
            >
              {txt}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80 mb-2">
        <li className="flex items-center gap-2"><span className="w-4 h-0.5 rounded-full bg-[#B79CFF]" /> Euros en circulación (billones)</li>
        <li className="flex items-center gap-2"><span className="w-4 h-0.5 rounded-full bg-[#FF5C7A]" /> Lo que compran 1.000 € de {mesLargo(v.base)}</li>
      </ul>
      <div className="h-[260px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filas} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="mes" ticks={v.ticks} tickFormatter={(m) => m.slice(0, 4)} stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis yAxisId="m3" domain={[v.m3[0], v.m3.at(-1)]} ticks={v.m3} interval={0} stroke="#B79CFF" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={26} />
            <YAxis yAxisId="valor" orientation="right" domain={[v.valor[0], v.valor.at(-1)]} ticks={v.valor} interval={0} stroke="#FF5C7A" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44}
              tickFormatter={(n) => `${n.toLocaleString("es-ES", { useGrouping: "always" })}\u00a0€`} />
            <Tooltip
              formatter={(n, id) => (id === "m3" ? [`${billones(n)} billones €`, "En circulación"] : [euros(n), "Compran"])}
              labelFormatter={mesLargo}
              contentStyle={{ background: "#01010D", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 12 }}
            />
            <ReferenceArea yAxisId="m3" x1="2020-02" x2="2021-12" fill="#FFFFFF" fillOpacity={0.07} stroke="none"
              label={{ value: "Covid", position: "insideTop", fill: "rgba(255,255,255,0.7)", fontSize: 11 }} />
            <Line yAxisId="m3" type="linear" dataKey="m3" stroke="#B79CFF" strokeWidth={3} dot={false} isAnimationActive={false} />
            <Line yAxisId="valor" type="linear" dataKey="valor" stroke="#FF5C7A" strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-white/45">
        {vista === "covid" && "Zoom de 2019 a 2023: los ejes no empiezan en cero para que se vea el movimiento. "}
        Fuente: {datos.fuentes.m3}, dato mensual, y Eurostat (precios en España, dato mensual).
      </p>
    </div>
  );
}

// Motivo 1 (dentro de la primera flecha): el euro y el dinero fiat pierden valor
export default function Motivo1() {
  const [vista, setVista] = useState("años");
  const [verCrisis, setVerCrisis] = useState(false);
  const filas = valores(grafico[vista]);
  const ultimaFila = filas[filas.length - 1];
  const finCasa = [...filas].reverse().find((f) => f.casa != null).casa;
  const fin = { ...ultimaFila, casa: finCasa };
  const inicio = vista === "años" ? "1999" : "hace un año";
  const soloPierdeElEuro = fin.euro < 10000 && [fin.oro, fin.sp500, fin.casa].every((v) => v >= 10000);
  const ticks = vista === "años"
    ? filas.filter((f, i) => i > 0 && f.fecha.slice(0, 4) !== filas[i - 1].fecha.slice(0, 4) && Number(f.fecha.slice(0, 4)) % 5 === 0).map((f) => f.fecha)
    : undefined;
  const fila = (d) => (filas.find((f) => f.fecha >= d) ?? ultimaFila).fecha;
  const bandas = verCrisis ? grafico.crisis.filter((c) => c.inicio >= filas[0].fecha) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <p className="mb-8 text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl">
        «Yo no invierto», dice mucha gente. Pero si tienes euros, ya estás invertido: en euros. La pregunta no es si
        invertir, sino <strong className="text-white">en qué</strong>.
      </p>
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
                {vista === "años" ? "10.000 € a finales de 1999" : "10.000 € hace un año"}
                <span className="block font-serif italic normal-case text-brand-mint">¿cuánto valen hoy?</span>
              </h2>
              <p className="mt-2 text-sm text-white/60">En lo que puedes comprar con ellos, ya descontada la inflación.</p>
            </div>
            <div className="flex flex-wrap gap-2 self-start md:self-end">
              <div className="inline-flex rounded-full bg-brand-onyx p-1 border border-white/10 text-xs md:text-sm font-semibold">
                {[["año", "Último año"], ["años", "Desde 1999"]].map(([k, txt]) => (
                  <button
                    key={k}
                    onClick={() => setVista(k)}
                    className={`px-3 md:px-4 py-2 rounded-full transition-colors ${vista === k ? "bg-brand-mint text-brand-onyx" : "text-white/70 hover:text-white"}`}
                  >
                    {txt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setVerCrisis(!verCrisis)}
                aria-pressed={verCrisis}
                className={`px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-semibold transition-colors ${verCrisis ? "bg-[#FF5C7A] border-[#FF5C7A] text-brand-onyx" : "bg-brand-onyx border-white/10 text-white/70 hover:text-white"}`}
              >
                {verCrisis ? "Ocultar crisis" : "Ver crisis"}
              </button>
            </div>
          </div>
          <Leyenda crisis={verCrisis} />
          <div className="h-[320px] md:h-[420px] mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filas} margin={{ top: verCrisis ? 48 : 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="fecha" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} ticks={ticks}
                  minTickGap={40} tickFormatter={(s) => (vista === "años" ? s.slice(0, 4) : mesCorto(s))} />
                <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48}
                  domain={vista === "año" ? ["auto", "auto"] : [0, "auto"]}
                  tickFormatter={(n) => (vista === "año" ? `${(n / 1000).toLocaleString("es-ES", { maximumFractionDigits: 1 })}k` : n >= 1000 ? `${Math.round(n / 1000)}k` : n)} />
                <Tooltip content={<Pista />} cursor={{ stroke: "rgba(255,255,255,0.3)" }} />
                {bandas.flatMap((c) => [
                  <ReferenceArea key={`${c.id}-baja`} x1={fila(c.inicio)} x2={fila(c.fondo)} fill="#FF5C7A" fillOpacity={0.25}
                    stroke="none" label={<RotuloCrisis crisis={c} />} />,
                  <ReferenceArea key={`${c.id}-sube`} x1={fila(c.fondo)} x2={fila(c.recuperado)} fill="#88F9C0" fillOpacity={0.16} stroke="none" />,
                ])}
                {activos.map((a) => (
                  <Line key={a.id} type="linear" dataKey={a.id} stroke={a.color} dot={false}
                    strokeWidth={a.id === "euro" ? 4 : 2} activeDot={{ r: 5, stroke: "#110D33", strokeWidth: 2 }}
                    isAnimationActive={false} />
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
            Descontando la inflación, los 10.000 € guardados hoy compran lo mismo que{" "}
            <strong className="text-[#FF5C7A]">{euros(fin.euro)}</strong> de {inicio}.
            {soloPierdeElEuro && " Es la única opción que ha acabado perdiendo."}
          </p>

          {/* Crisis */}
          {verCrisis && (
            <>
              <h3 className="font-display uppercase text-xl md:text-2xl mt-8 mb-3">Cuánto cayó la bolsa y cuánto subió después</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {grafico.crisis.map((c) => (
                  <div key={c.id} className="rounded-2xl p-4 border border-white/10 bg-brand-onyx/60">
                    <p className="text-sm font-semibold text-white">{c.nombre}</p>
                    <p className="font-display text-3xl text-[#FF5C7A] tabular-nums mt-1">−{coma(Math.abs(c.caida))} %</p>
                    <p className="text-xs text-white/60 mt-1">Del {diaCorto(c.inicio)} al {diaCorto(c.fondo)}</p>
                    <p className="font-display text-3xl text-brand-mint tabular-nums mt-3">+{coma(c.subida)} %</p>
                    <p className="text-xs text-white/60 mt-1">Hasta recuperarlo, el {diaCorto(c.recuperado)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="mt-3 text-[11px] leading-snug text-white/45">
            S&P 500 (con dividendos, Yahoo Finance, pasado a euros con el tipo del BCE) y oro (Frankfurter): precios reales, sin
            medias, {vista === "años" ? "con el último de cada semana" : "de cada día"}, hasta el {fechaLarga(ultimaFila.fecha)}. Vivienda: dato
            trimestral del Banco de Pagos Internacionales, sin contar alquileres, hasta {mesCorto(grafico.casaHasta)}. Inflación: índice
            mensual de Eurostat hasta {mesCorto(`${grafico.ipcHasta}-01`)}. {verCrisis && "Crisis: S&P 500 sin dividendos y en dólares, al cierre, del máximo al mínimo y del mínimo hasta volver a ese máximo. "}
            Ninguna de estas inversiones sube en línea recta (mira el
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
          <GraficoDinero />
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
        <section className="mb-4">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-8 text-center">
            Y dos cosas que <span className="font-serif italic normal-case text-brand-mint">casi nadie te cuenta</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
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

    </div>
  );
}
