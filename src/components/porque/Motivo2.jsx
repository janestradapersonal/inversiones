import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Hourglass, Users, Wallet, Landmark } from "lucide-react";

// Motivo 2 (dentro de la segunda flecha): las pensiones.
// Cifras (comprobar antes de publicar):
// - Mayores de 65: 20,4 % hoy y 30,5 % hacia 2055 (INE, Proyecciones de población 2024-2074). 1975: en torno al 10 % (INE, censos).
// - Afiliados por pensionista: 2,3 (Instituto Santa Lucía, Pensiómetro, marzo 2026, con datos de la Seguridad Social).
// - Gasto público en pensiones 2025: 218.321 M€, 12,9 % del PIB (Instituto Santa Lucía).
// - Transferencias del Estado para cubrir el déficit de la Seguridad Social: 20.123 M€ (2018) → 48.259 M€ (2025) (Instituto Santa Lucía).
// - Pensión media de jubilación: 1.572,8 €/mes (Seguridad Social, junio 2026).

// Forma aproximada de la pirámide (porcentaje de población por tramos de 10 años, de 0-9 a 90+).
// La cifra de mayores de 65 que se muestra es la del INE; la silueta es orientativa.
const PIRAMIDES = [
  { año: "1975", mayores: 10, nota: "aprox.", tramos: [18, 17, 16, 14, 12, 10, 8, 4, 1.5, 0.3] },
  { año: "2024", mayores: 20.4, nota: "INE", tramos: [8, 10, 10.5, 12, 16, 16, 12.5, 9, 5, 1.5] },
  { año: "2055", mayores: 30.5, nota: "proyección INE", tramos: [7.5, 8, 8.5, 9.5, 10.5, 11.5, 13, 14, 11, 6] },
];
const EDADES = ["0-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89", "90+"];

function Piramide() {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (x) => setI(x < 0.33 ? 0 : x < 0.66 ? 1 : 2));
  const p = PIRAMIDES[i];
  const max = 20;

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 h-[100dvh] flex items-center">
        <div className="w-full grid md:grid-cols-[1fr,1.1fr] gap-6 md:gap-12 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F5C542] mb-3">La pirámide se ha dado la vuelta</p>
            <h3 className="font-display uppercase text-3xl md:text-6xl leading-[0.92]">
              Más abuelos, <span className="font-serif italic normal-case text-[#F5C542]">menos jóvenes</span>
            </h3>
            <div className="mt-3 md:mt-6 flex gap-2">
              {PIRAMIDES.map((x, k) => (
                <span
                  key={x.año}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-full font-display text-base md:text-xl transition-colors ${
                    k === i ? "bg-[#F5C542] text-brand-onyx" : "bg-white/5 text-white/50"
                  }`}
                >
                  {x.año}
                </span>
              ))}
            </div>
            <p className="mt-3 md:mt-6 text-white/60 text-xs md:text-sm uppercase tracking-wider">Personas de 65 años o más</p>
            <motion.p key={p.año} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-5xl md:text-8xl text-white tabular-nums leading-none">
              {p.mayores.toLocaleString("es-ES")}
              <span className="text-[#F5C542]">%</span>
            </motion.p>
            <p className="text-white/50 text-xs">({p.nota})</p>
            <p className="mt-2 md:mt-4 text-white/75 text-sm md:text-lg leading-snug md:leading-relaxed max-w-md">
              {i === 0 && "Hace 50 años, más o menos 1 de cada 10 españoles tenía 65 años o más. Muchos jóvenes para pocos jubilados."}
              {i === 1 && "Hoy ya es 1 de cada 5. La generación del baby boom (los nacidos entre finales de los 50 y los 70) se está jubilando ahora."}
              {i === 2 && "Hacia 2055, casi 1 de cada 3. Y cada vez vivimos más años cobrando la pensión."}
            </p>
            <p className="hidden md:block mt-4 text-white/40 text-xs">Sigue deslizando para avanzar en el tiempo ↓</p>
          </div>

          {/* Pirámide: hombres a la izquierda, mujeres a la derecha (silueta orientativa) */}
          <div className="flex flex-col-reverse gap-[3px] md:gap-1">
            {p.tramos.map((v, k) => {
              const ancho = `${(v / max) * 100}%`;
              const color = k >= 6 ? "#F5C542" : "rgba(255,255,255,0.75)";
              return (
                <div key={EDADES[k]} className="grid grid-cols-[1fr,3.2rem,1fr] items-center gap-1 h-3.5 md:h-7">
                  <div className="flex justify-end h-full">
                    <motion.div className="h-full rounded-l-md" animate={{ width: ancho }} transition={{ type: "spring", stiffness: 70, damping: 16 }} style={{ background: color }} />
                  </div>
                  <span className="text-[9px] md:text-xs text-center text-white/50 tabular-nums leading-none">{EDADES[k]}</span>
                  <div className="flex h-full">
                    <motion.div className="h-full rounded-r-md" animate={{ width: ancho }} transition={{ type: "spring", stiffness: 70, damping: 16 }} style={{ background: color }} />
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-white/40 text-center mb-2">
              Silueta orientativa por tramos de edad. En amarillo, de 60 años en adelante.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const datos = [
  {
    icon: <Users className="w-6 h-6" />,
    cifra: "2,3",
    titulo: "trabajadores por cada pensionista",
    texto: "Con cada vez menos gente cotizando por cada jubilado, las cuentas no salen solas.",
  },
  {
    icon: <Hourglass className="w-6 h-6" />,
    cifra: "+20 años",
    titulo: "cobrando la pensión",
    texto: "Por suerte vivimos más. Al cumplir 65, a un hombre le quedan de media unos 19 años de vida y a una mujer unos 23 (INE). Son muchos años de pensión.",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    cifra: "218.321 M€",
    titulo: "en pensiones en 2025",
    texto: "El 12,9 % de todo lo que produce España en un año. Es la partida más grande del gasto público.",
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    cifra: "×2,4",
    titulo: "lo que pone el Estado para tapar el agujero",
    texto: "Las cotizaciones ya no llegan. El Estado transfirió 20.123 M€ en 2018 y 48.259 M€ en 2025 para cubrir la diferencia.",
  },
];

export default function Motivo2() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Cómo funciona de verdad */}
      <section className="mb-10">
        <h3 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-6">
          Lo que te quitan de la nómina <span className="font-serif italic normal-case text-[#F5C542]">no es para ti</span>
        </h3>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-8">
          Mucha gente cree que lo que cotiza cada mes se guarda en una hucha a su nombre para cuando se jubile. No es así.
          En España las pensiones funcionan por <strong className="text-white">reparto</strong>: lo que pagas hoy sirve para
          pagar las pensiones de los jubilados de hoy. Tu pensión la pagarán los que trabajen cuando tú te jubiles.
        </p>
        <div className="grid md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-3 items-center">
          {[
            ["Tú, hoy", "cotizas cada mes de tu nómina"],
            null,
            ["Los jubilados de hoy", "cobran con ese dinero"],
            null,
            ["Tú, mañana", "dependerás de los jóvenes de entonces… que serán menos"],
          ].map((x, k) =>
            x ? (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: k * 0.12 }}
                className="rounded-2xl bg-brand-surface border border-white/10 p-5"
              >
                <p className="font-display uppercase text-2xl text-[#F5C542]">{x[0]}</p>
                <p className="text-white/75 mt-1">{x[1]}</p>
              </motion.div>
            ) : (
              <ArrowRight key={k} className="w-8 h-8 text-white/40 mx-auto rotate-90 md:rotate-0" />
            )
          )}
        </div>
      </section>

      <Piramide />

      {/* Datos */}
      <section className="grid sm:grid-cols-2 gap-4 my-10">
        {datos.map((d, k) => (
          <motion.div
            key={d.titulo}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (k % 2) * 0.1 }}
            className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#F5C542] text-brand-onyx flex items-center justify-center mb-4">{d.icon}</div>
            <p className="font-display text-5xl md:text-6xl text-white tabular-nums leading-none">{d.cifra}</p>
            <p className="font-semibold text-[#F5C542] mt-2">{d.titulo}</p>
            <p className="text-white/70 mt-3 leading-relaxed">{d.texto}</p>
          </motion.div>
        ))}
      </section>

      {/* Conclusión */}
      <section className="rounded-3xl border-2 border-[#F5C542]/60 bg-[#F5C542]/[0.07] p-6 md:p-10 mb-6">
        <h3 className="font-display uppercase text-3xl md:text-5xl leading-[0.95] mb-4">
          No lo dejes todo <span className="font-serif italic normal-case text-[#F5C542]">en manos del Estado</span>
        </h3>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
          Nadie sabe cuánto cobrarás cuando te jubiles. Lo que sí se sabe es que habrá más jubilados, durante más años, y
          menos trabajadores para pagarlos, y que las pensiones ya ocupan cada vez más parte del gasto. Hoy la pensión media
          de jubilación ronda los 1.570 € al mes. Contar solo con eso es una apuesta. Construir algo por tu cuenta, aunque
          sea poco a poco, es la manera de no depender de ella.
        </p>
      </section>
      <p className="text-[11px] leading-snug text-white/45 mb-4">
        Fuentes: INE (Proyecciones de población 2024-2074; en junio de 2026 se publicaron unas nuevas), Seguridad Social
        (pensión media de jubilación, junio de 2026) e Instituto Santa Lucía (Pensiómetro, con datos oficiales de la
        Seguridad Social y la IGAE). La silueta de la pirámide es orientativa.
      </p>
    </div>
  );
}
