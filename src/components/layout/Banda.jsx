import { motion } from "framer-motion";

// Cabecera de página a sangre (DESIGN.md): verde bosque o lima, rejilla, grano y la palabra clave hueca de fondo.
const TONOS = {
  bosque: { fondo: "bg-brand-indigo text-white", etiqueta: "bg-brand-mint text-brand-onyx", resalto: "text-brand-mint", texto: "text-white/80", hueco: "text-brand-mint/25" },
  lima: { fondo: "bg-brand-mint text-brand-onyx", etiqueta: "bg-brand-onyx text-brand-mint", resalto: "text-brand-onyx", texto: "text-brand-onyx/75", hueco: "text-brand-onyx/20" },
};

export function CabeceraPagina({ etiqueta, titulo, resalto, texto, fondo = "bosque", children }) {
  const t = TONOS[fondo];
  return (
    <section className={`grano relative overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem] ${t.fondo}`}>
      <div aria-hidden className={`absolute inset-0 rejilla ${fondo === "lima" ? "rejilla-negra" : ""}`} />
      <p aria-hidden className={`hueco absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 whitespace-nowrap font-display uppercase leading-none text-[34vw] md:text-[20rem] select-none pointer-events-none ${t.hueco}`}>
        {resalto}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-32 md:pt-40 pb-16 md:pb-24 text-center"
      >
        <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm mb-6 ${t.etiqueta}`}>{etiqueta}</span>
        <h1 className="font-display uppercase text-6xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tight mb-6">
          {titulo} <span className={`font-serif italic normal-case ${t.resalto}`}>{resalto}</span>
        </h1>
        {texto && <p className={`mx-auto text-lg md:text-xl leading-relaxed max-w-2xl ${t.texto}`}>{texto}</p>}
        {children}
      </motion.div>
    </section>
  );
}
