import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, HeartPulse, PiggyBank, Home, Receipt, Printer, Scissors, Volume2, VolumeX } from "lucide-react";

// Motivo 3 (lo que había dentro del globo): la deuda.
// Cifras (comprobar antes de publicar; las mismas que el short-35 y el short-23):
// - Deuda de las administraciones públicas de España: 385.000 M€ a final de 2007 → 1,76 billones en junio de 2026 (×4,6), 101 % del PIB (Eurostat).
// - Por habitante: unos 35.900 € (Eurostat, población a 1 de enero de 2025).
// - Intereses pagados en 2025: 40.432 M€ → 111 M€ al día (Eurostat, D.41).
// - Transferencias del Estado a la Seguridad Social para pensiones en 2025: 48.259 M€ (Instituto Santa Lucía).
// - EE. UU.: 39,5 billones de dólares (Tesoro de EE. UU., 2026).
// - Prima de riesgo de España por encima de 600 puntos en julio de 2012.

function Contador({ hasta, decimales = 0, sufijo = "", duracion = 1.6 }) {
  const ref = useRef(null);
  const visto = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visto) return;
    let raf;
    const t0 = performance.now();
    const paso = (t) => {
      const x = Math.min(1, (t - t0) / (duracion * 1000));
      setV(hasta * (1 - Math.pow(1 - x, 3)));
      if (x < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [visto, hasta, duracion]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString("es-ES", { minimumFractionDigits: decimales, maximumFractionDigits: decimales, useGrouping: "always" })}
      {sufijo}
    </span>
  );
}

// Lo que se deja de pagar: cada euro en intereses no va a otra cosa
const partidas = [
  { icon: <HeartPulse className="w-5 h-5" />, t: "Sanidad" },
  { icon: <GraduationCap className="w-5 h-5" />, t: "Educación" },
  { icon: <PiggyBank className="w-5 h-5" />, t: "Pensiones" },
  { icon: <Home className="w-5 h-5" />, t: "Vivienda" },
];

// Las tres formas de pagar la deuda: dos se notan, la tercera no
const salidas = [
  { icon: <Scissors className="w-6 h-6" />, t: "Recortes", d: "Menos dinero para sanidad, educación… y pensiones. Sale en las noticias y hay protestas." },
  { icon: <Receipt className="w-6 h-6" />, t: "Más impuestos", d: "Te quitan más de lo que ganas para pagar lo que se debe. Lo ves en tu nómina y en tus facturas." },
];

export default function Motivo3() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
        Lo que falta cada año se pide prestado, y al año siguiente otra vez. Así la deuda se va hinchando como un globo. Y la deuda no sale gratis: <strong className="text-white">hay que pagar intereses</strong>.
      </p>

      {/* La deuda de España */}
      <section className="grid md:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8">
          <p className="text-xs uppercase tracking-wider text-white/55">Lo que debe España (todas las administraciones)</p>
          <div className="mt-4 flex items-end gap-4">
            <div>
              <p className="text-white/50 text-sm">Final de 2007</p>
              <p className="font-display text-4xl text-white/80">0,39</p>
            </div>
            <div className="flex-1 h-px bg-white/20 mb-4" />
            <div className="text-right">
              <p className="text-white/50 text-sm">Junio de 2026</p>
              <p className="font-display text-6xl md:text-7xl text-[#FF5C7A]">
                <Contador hasta={1.76} decimales={2} />
              </p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-1 text-right">billones de euros</p>
          <p className="mt-5 text-white/80 text-lg leading-relaxed">
            <strong className="text-white">4,6 veces más</strong> en menos de 20 años. Ya es más que todo lo que produce España en un año
            (101 % del PIB): unos <strong className="text-white">35.900 € por habitante</strong>, bebés incluidos.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl bg-[#FF5C7A] text-brand-onyx p-6 md:p-8 flex flex-col">
          <p className="text-xs uppercase tracking-wider font-bold opacity-70">Solo en intereses, en 2025</p>
          <p className="font-display text-6xl md:text-7xl mt-3">
            <Contador hasta={40432} sufijo=" M€" />
          </p>
          <p className="font-display text-3xl md:text-4xl mt-4">
            <Contador hasta={111} sufijo=" millones" /> <span className="font-serif italic normal-case">cada día</span>
          </p>
          <p className="mt-auto pt-5 text-lg leading-snug font-semibold">
            Casi lo mismo que pone el Estado para tapar el agujero de las pensiones (48.259 M€ en 2025).
          </p>
        </motion.div>
      </section>

      {/* Y en el mundo */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8 mb-16">
        <p className="text-xs uppercase tracking-wider text-white/55">Y no es solo España</p>
        <p className="mt-2 text-white/80 text-lg leading-relaxed">
          Estados Unidos debe <strong className="text-white">39,5 billones de dólares</strong>, 13 veces más que en 1990. Casi todos los
          países ricos están igual: endeudados y pagando cada vez más intereses.
        </p>
      </motion.section>

      {/* Lo que se come */}
      <section className="mb-16">
        <h3 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-4">
          Cada euro en intereses <span className="font-serif italic normal-case text-[#FF5C7A]">no va a otra cosa</span>
        </h3>
        <p className="text-white/75 text-lg leading-relaxed max-w-3xl mb-6">
          Cuanto más se debe, más se paga en intereses, y menos queda para todo lo demás. Una de esas cosas son tus pensiones.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {partidas.map((x, k) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 1, scale: 1 }}
              whileInView={{ opacity: 0.35, scale: 0.9 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ delay: 0.4 + k * 0.25, duration: 0.8 }}
              className="rounded-2xl bg-brand-surface border border-white/10 p-5 flex items-center gap-3"
            >
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">{x.icon}</span>
              <span className="font-semibold text-white">{x.t}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cómo se paga: dos formas que se notan y una silenciosa */}
      <section className="mb-16">
        <h3 className="font-display uppercase text-4xl md:text-6xl leading-[0.92] mb-4">
          ¿Y cómo se <span className="font-serif italic normal-case text-[#FF5C7A]">paga</span> todo esto?
        </h3>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-6">
          Hay tres formas de pagar la deuda. Y todas las acabas pagando tú.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {salidas.map((x, k) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.12 }}
              className="rounded-3xl bg-brand-surface border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-11 h-11 rounded-2xl bg-[#FF5C7A] text-brand-onyx flex items-center justify-center">{x.icon}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Volume2 className="w-3.5 h-3.5" /> Te enteras
                </span>
              </div>
              <p className="font-display uppercase text-2xl">{x.t}</p>
              <p className="text-white/70 mt-2 leading-relaxed">{x.d}</p>
            </motion.div>
          ))}
          {/* La tercera aparece muy despacio, casi sin que la veas */}
          <motion.div
            initial={{ opacity: 0.08 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ delay: 0.6, duration: 3.5, ease: "easeIn" }}
            className="rounded-3xl border-2 border-dashed border-[#FF5C7A]/60 bg-[#FF5C7A]/[0.06] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="w-11 h-11 rounded-2xl bg-[#FF5C7A] text-brand-onyx flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5C7A]/15 text-[#FF5C7A] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <VolumeX className="w-3.5 h-3.5" /> Ni te enteras
              </span>
            </div>
            <p className="font-display uppercase text-2xl">Imprimir dinero</p>
            <p className="text-white/70 mt-2 leading-relaxed">
              No sale en tu nómina ni en ninguna factura. Tu cuenta sigue marcando lo mismo… pero cada euro compra un poco menos.
              La deuda pesa menos, y tus ahorros también. Volvemos al motivo 1.
            </p>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 font-display uppercase text-3xl md:text-5xl leading-[0.95] max-w-4xl"
        >
          Te afecta igual,{" "}
          <span className="font-serif italic normal-case text-[#FF5C7A]">pero en silencio.</span>
          <span className="block text-white/60 text-xl md:text-2xl mt-2">Te quitan valor sin que te des cuenta.</span>
        </motion.p>
        <p className="mt-6 text-lg leading-relaxed max-w-3xl rounded-2xl border-l-4 border-[#FF5C7A] bg-[#FF5C7A]/10 px-5 py-4 text-white">
          De los recortes y los impuestos no te puedes librar. Pero contra la tercera <strong>sí puedes hacer algo tú</strong>:
          no dejar tus ahorros quietos en euros. Por eso, invertir.
        </p>
      </section>

      {/* La crisis */}
      <section className="rounded-3xl border-2 border-[#FF5C7A]/60 bg-[#FF5C7A]/[0.07] p-6 md:p-10 mb-6">
        <h3 className="font-display uppercase text-3xl md:text-5xl leading-[0.95] mb-4">
          Y si los intereses suben, <span className="font-serif italic normal-case text-[#FF5C7A]">el globo revienta</span>
        </h3>
        <p className="text-white/80 text-lg leading-relaxed max-w-3xl">
          La deuda que vence se paga pidiendo más deuda. Mientras los intereses están bajos, aguanta. Cuando suben, la factura
          se dispara. Ya pasó: en 2012 los inversores desconfiaron de España, la prima de riesgo superó los 600 puntos y llegaron
          los recortes. Nadie sabe si volverá a pasar ni cuándo. Pero cuanto más grande es el globo, menos margen queda.
        </p>
      </section>
      <p className="text-[11px] leading-snug text-white/45 mb-4">
        Fuentes: Eurostat (deuda pública trimestral, intereses pagados y población), Tesoro de EE. UU. (deuda total, 2026) e
        Instituto Santa Lucía (transferencias del Estado a la Seguridad Social, 2025).
      </p>
    </div>
  );
}
