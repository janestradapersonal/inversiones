// Baja de las API los datos del gráfico «¿cuánto valen hoy?» y los deja en src/data/mercados.json.
// Se ejecuta antes de cada publicación (y cada día laborable, ver .github/workflows/deploy.yml).
// Si una API falla se conserva el dato anterior: la web nunca se queda sin gráfico.
//
// Cada fila: [fecha, oro €/onza, S&P 500 con dividendos en €, índice de vivienda, índice de precios]
//   años:   último dato de cada semana desde finales de 1999
//   año:    cada día del último año
//   crisis: caída del S&P 500 de máximo a mínimo al cierre, y subida desde ese mínimo hasta recuperar el máximo
//   dinero: [mes, euros en circulación (M3, billones), índice de precios], cada mes desde diciembre de 1999
import { readFileSync, writeFileSync } from "node:fs";

const RUTA = "src/data/mercados.json";
const AGENTE = { "User-Agent": "Mozilla/5.0" };
const unix = (s) => Math.floor(new Date(s).getTime() / 1000);
const dia = (t) => new Date(t * 1000).toISOString().slice(0, 10);
const redondea = (n) => Math.round(n * 100) / 100;
const celdas = (l) => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, ""));

// Dónde buscar el máximo y el mínimo de cada crisis
const CRISIS = [
  { id: "2008", nombre: "Crisis de 2008", desde: "2007-06-01", hasta: "2009-06-30" },
  { id: "covid", nombre: "Covid", desde: "2020-01-01", hasta: "2020-06-30" },
  { id: "aranceles", nombre: "Aranceles de Trump", desde: "2025-01-01", hasta: "2025-06-30" },
  { id: "iran", nombre: "Guerra de Irán", desde: "2026-01-01", hasta: "2026-05-31" },
];

async function pide(url) {
  for (let intento = 1; ; intento++) {
    const r = await fetch(url, { headers: AGENTE }).catch((e) => ({ ok: false, status: e.message }));
    if (r.ok) return r;
    if (intento === 3) throw new Error(`${r.status} en ${url}`);
    await new Promise((listo) => setTimeout(listo, 5000 * intento));
  }
}

// Yahoo Finance: S&P 500 con dividendos reinvertidos, en dólares
async function yahoo(simbolo, desde) {
  const u = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(simbolo)}?period1=${unix(desde)}&period2=${Math.floor(Date.now() / 1000)}&interval=1d`;
  const r = (await (await pide(u)).json()).chart.result[0];
  const cierres = r.indicators.quote[0].close;
  return r.timestamp.map((t, i) => [dia(t), cierres[i]]).filter(([, c]) => c != null);
}

// Frankfurter: precio del oro en euros y tipo de cambio del BCE
async function frankfurter(base, cotiza, desde) {
  const filas = await (await pide(`https://api.frankfurter.dev/v2/rates?from=${desde}&base=${base}&quotes=${cotiza}`)).json();
  return filas.map((f) => [f.date, f.rate]);
}

// Eurostat: índice de precios de España, mensual. Devuelve {"AAAA-MM": valor}
async function ipc() {
  const u = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?geo=ES&coicop18=TOTAL&unit=I15&format=JSON";
  const d = await (await pide(u)).json();
  const pos = d.dimension.time.category.index;
  return Object.fromEntries(Object.entries(pos).filter(([, i]) => d.value[i] != null).map(([mes, i]) => [mes, d.value[i]]));
}

// Banco de Pagos Internacionales: precio de la vivienda en España, trimestral. Devuelve [[fin de trimestre, índice], ...]
async function vivienda() {
  const texto = await (await pide("https://stats.bis.org/api/v2/data/dataflow/BIS/WS_SPP/1.0/Q.ES.N.628?format=csv")).text();
  const [cabecera, ...filas] = texto.trim().split(/\r?\n/).map((l) => l.split(","));
  const iT = cabecera.indexOf("TIME_PERIOD"), iV = cabecera.indexOf("OBS_VALUE");
  const finTrimestre = { Q1: "03-31", Q2: "06-30", Q3: "09-30", Q4: "12-31" };
  return filas.filter((f) => f[iV]).map((f) => [`${f[iT].slice(0, 4)}-${finTrimestre[f[iT].slice(5)]}`, Number(f[iV])]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

// Banco Central Europeo: M3 de la zona euro, mensual y desestacionalizado. Devuelve [[mes, billones], ...]
async function masaMonetaria() {
  const texto = await (await pide("https://data-api.ecb.europa.eu/service/data/BSI/M.U2.Y.V.M30.X.1.U2.2300.Z01.E?format=csvdata&startPeriod=1999-01")).text();
  const [cabecera, ...filas] = texto.trim().split(/\r?\n/).map(celdas);
  const iT = cabecera.indexOf("TIME_PERIOD"), iV = cabecera.indexOf("OBS_VALUE");
  return filas.filter((f) => f[iV] && f[iT] >= "1999-12").map((f) => [f[iT], Math.round(Number(f[iV]) / 1000) / 1000]);
}

// Último valor conocido en una fecha
function arrastre(serie) {
  let i = 0;
  return (fecha) => {
    while (i + 1 < serie.length && serie[i + 1][0] <= fecha) i++;
    return serie[i][1];
  };
}

// Línea recta entre dos trimestres; después del último dato no se inventa nada
function entreTrimestres(serie, fecha) {
  const j = serie.findIndex(([d]) => d >= fecha);
  if (j === -1) return null;
  if (j === 0) return serie[0][1];
  const [d0, v0] = serie[j - 1], [d1, v1] = serie[j];
  return v0 + ((v1 - v0) * (new Date(fecha) - new Date(d0))) / (new Date(d1) - new Date(d0));
}

// Mayor caída de máximo a mínimo dentro de la ventana de cada crisis, y subida hasta volver a ese máximo
function caidas(indice) {
  return CRISIS.map(({ id, nombre, desde, hasta }) => {
    const v = indice.filter(([d]) => d >= desde && d <= hasta);
    let techo = v[0], mejor = { caida: 0 };
    for (const f of v) {
      if (f[1] > techo[1]) techo = f;
      const caida = f[1] / techo[1] - 1;
      if (caida < mejor.caida) mejor = { caida, inicio: techo[0], fondo: f[0], maximo: techo[1], minimo: f[1] };
    }
    const vuelta = indice.find(([d, c]) => d > mejor.fondo && c >= mejor.maximo) ?? indice.at(-1);
    return { id, nombre, caida: Math.round(mejor.caida * 1000) / 10, inicio: mejor.inicio, fondo: mejor.fondo,
      subida: Math.round((vuelta[1] / mejor.minimo - 1) * 1000) / 10, recuperado: vuelta[0] };
  });
}

let previo = {};
try {
  previo = JSON.parse(readFileSync(RUTA, "utf8"));
} catch {
  console.warn("Primera vez: aún no hay datos anteriores.");
}

try {
  const [sp, indice, oro, cambio, precios, casa, m3] = await Promise.all([
    yahoo("^SP500TR", "1999-12-01"), yahoo("^GSPC", "1999-12-01"), frankfurter("XAU", "EUR", "1999-12-01"), frankfurter("USD", "EUR", "1999-12-01"),
    ipc(), vivienda(), masaMonetaria(),
  ]);
  const hace = (Date.now() - new Date(sp.at(-1)[0]).getTime()) / 864e5;
  if (sp.length < 6000 || oro.length < 5000 || hace > 15) throw new Error(`datos sospechosos: ${sp.length} filas, último ${sp.at(-1)[0]}`);
  if (m3.length < 300) throw new Error(`datos sospechosos: ${m3.length} meses de M3`);

  const oroEn = arrastre(oro), cambioEn = arrastre(cambio);
  const meses = Object.keys(precios).sort();
  const ipcEn = (fecha) => precios[fecha.slice(0, 7)] ?? precios[meses.filter((m) => m <= fecha.slice(0, 7)).at(-1)];
  const filas = sp.filter(([d]) => d >= "1999-12-31").map(([fecha, tr]) => {
    const v = entreTrimestres(casa, fecha);
    return [fecha, redondea(oroEn(fecha)), redondea(tr * cambioEn(fecha)), v == null ? null : redondea(v), ipcEn(fecha)];
  });

  // Último día de cotización de cada semana
  const lunes = (s) => {
    const d = new Date(s);
    return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10);
  };
  const porSemana = new Map();
  for (const f of filas) porSemana.set(lunes(f[0]), f);
  const semanas = [filas[0], ...[...porSemana.values()].filter((f) => f[0] > filas[0][0])];

  const haceUnAño = new Date(filas.at(-1)[0]);
  haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);
  const corte = haceUnAño.toISOString().slice(0, 10);

  const salida = {
    años: semanas,
    año: filas.filter((f) => f[0] >= corte),
    crisis: caidas(indice),
    dinero: m3.map(([mes, v]) => [mes, v, precios[mes] ?? null]),
    casaHasta: casa.at(-1)[0],
    ipcHasta: meses.at(-1),
    actualizado: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(RUTA, JSON.stringify(salida));
  console.log(`Filas: ${salida.años.length} semanas y ${salida.año.length} días. Última: ${salida.año.at(-1)}. Vivienda hasta ${salida.casaHasta}, precios hasta ${salida.ipcHasta}, M3 hasta ${m3.at(-1)[0]}.`);
  console.log(salida.crisis);
} catch (e) {
  console.warn("Se conservan los datos anteriores:", e.message);
  if (!previo.años) process.exitCode = 1;
}
