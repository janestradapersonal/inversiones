import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  CalendarSync,
  CheckCircle,
  Coins,
  ExternalLink,
  Gift,
  GraduationCap,
  LifeBuoy,
  MessageCircle,
  MousePointerClick,
  PieChart,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

// Condiciones consultadas en noviembre de 2026 (webs oficiales y bases de los planes amigo)
const FECHA = "noviembre de 2026";

const pasos = [
  {
    icon: <MousePointerClick className="w-6 h-6" />,
    titulo: "Elige una plataforma",
    texto: "Abajo tienes las dos que uso yo. Las dos son gratis de abrir y están reguladas.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    titulo: "Regístrate en 10 minutos",
    texto: "Desde el móvil: DNI, unos datos y un selfie. Sin ir a ninguna oficina.",
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    titulo: "Ingresa dinero",
    texto: "Una transferencia desde tu banco de siempre. Empieza con poco: lo importante es empezar.",
  },
  {
    icon: <PieChart className="w-6 h-6" />,
    titulo: "Elige tu inversión",
    texto: "Una cartera como las que hemos visto, un fondo indexado mundial… o una empresa que te guste, sabiendo que es más arriesgado.",
    enlace: { to: "/aprende?s=carteras", t: "Ver carteras y hacer el test" },
  },
  {
    icon: <CalendarSync className="w-6 h-6" />,
    titulo: "Pon aportaciones mensuales",
    texto: "Una cantidad fija cada mes, automática. Así no tienes que adivinar el momento y lo haces sin pensar.",
    destacado: "Mi recomendación",
  },
];

const razones = [
  { icon: <Coins className="w-6 h-6" />, t: "No hace falta tener dinero", x: "Se puede empezar con muy poco. Ya irás poniendo más cuando le cojas el truco." },
  { icon: <GraduationCap className="w-6 h-6" />, t: "Cuanto antes, antes aprendes", x: "Se aprende con práctica. Y cuanto antes empieces, más tiempo tendrá tu dinero para crecer." },
  { icon: <LifeBuoy className="w-6 h-6" />, t: "Si te equivocas ahora, no pasa nada", x: "Mejor equivocarte con 10 € que con 10.000 €. Que todo sea por aprender." },
  { icon: <Timer className="w-6 h-6" />, t: "Solo necesitas 10 minutos", x: "Para darte de alta y poner tus primeros euros. A partir de ahí, se aprende haciendo." },
];

const plataformas = [
  {
    nombre: "MyInvestor",
    pais: "Española",
    uso: "Aquí tengo mis inversiones, repartidas en varias carteras indexadas.",
    enlace: "https://newapp.myinvestor.es/do/signup?promotionalCode=IYZED",
    codigo: "IYZED",
    regalo: "25 € de regalo",
    regaloDetalle: "Abriendo tu cuenta con este enlace (o el código IYZED), te dan 25 € brutos (unos 20 € netos) cuando tengas 100 € invertidos.",
    condiciones:
      "Tienes 3 meses desde que abres la cuenta para invertir 100 € (o tener 1.000 € en la cuenta, o un depósito). El código se pone al abrir la cuenta: después no se puede añadir.",
    puntos: [
      "Banco español supervisado por el Banco de España y la CNMV",
      "Más de un millón de clientes",
      "Carteras indexadas ya hechas desde 150 €",
      "Fondos indexados y planes de pensiones con comisiones muy bajas",
      "App en español, muy fácil de usar",
    ],
    color: "#6CB4FF",
  },
  {
    nombre: "Trade Republic",
    pais: "Alemana, con IBAN español",
    uso: "Mi cuenta del día a día: el dinero que tengo ahí, en vez de no darme nada, me da intereses.",
    enlace: "https://refnocode.trade.re/znw9qk74",
    regalo: "Acción de regalo",
    regaloDetalle: "Abriendo tu cuenta con este enlace, te regalan una acción o un ETF de entre 5 € y 200 €.",
    condiciones: "En los 21 días siguientes a darte de alta tienes que ingresar 100 € y hacer 3 inversiones (los planes de inversión no cuentan).",
    puntos: [
      "Paga intereses por el dinero de la cuenta, en torno al tipo del BCE (2,50 % ahora mismo)",
      "IBAN español: sirve para domiciliar la nómina y los recibos",
      "Banco alemán con sucursal en España, registrada en el Banco de España y la CNMV",
      "Más de un millón de clientes en España",
      "Acciones y ETF desde 1 € y planes de inversión mensuales",
    ],
    color: "#88F9C0",
  },
];

function Plataforma({ p, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col rounded-3xl bg-brand-surface border border-white/10 p-6 md:p-8"
      style={{ borderTopColor: p.color, borderTopWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display uppercase text-4xl leading-none">{p.nombre}</h3>
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold whitespace-nowrap">{p.pais}</span>
      </div>
      <p className="text-white/75 mb-5">{p.uso}</p>

      <ul className="space-y-2.5 mb-6">
        {p.puntos.map((x) => (
          <li key={x} className="flex items-start gap-2.5 text-sm text-white/90">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
            {x}
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-2xl bg-brand-onyx/60 border border-white/10 p-4 mb-4">
        <p className="flex items-center gap-2 font-bold text-white mb-1">
          <Gift className="w-4 h-4 text-[#F5C542]" /> {p.regalo}
        </p>
        <p className="text-sm text-white/85">{p.regaloDetalle}</p>
        <p className="text-xs text-white/50 mt-2">{p.condiciones}</p>
      </div>

      <a
        href={p.enlace}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-brand-onyx hover:scale-[1.02] transition-transform"
        style={{ background: p.color }}
      >
        Abrir cuenta en {p.nombre} <ExternalLink className="w-4 h-4" />
      </a>
      <p className="text-[11px] text-white/45 text-center mt-2">Enlace de invitación (plan amigo){p.codigo ? ` · código ${p.codigo}` : ""}</p>
    </motion.div>
  );
}

export default function Empieza() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface text-brand-mint font-semibold text-sm mb-5">Paso 3 · Empieza ya</span>
          <h1 className="font-display uppercase text-5xl md:text-8xl leading-[0.9] tracking-tight mb-6">
            Nunca fue tan <span className="font-serif italic normal-case text-brand-mint">fácil</span>
          </h1>
          <p className="text-white/85 mx-auto text-lg md:text-xl leading-relaxed max-w-2xl">
            Antes invertir era difícil: hacía falta mucho dinero, ir al banco y pagar comisiones altísimas. Hoy es extremadamente fácil.
            <strong className="text-white"> Lo importante es empezar.</strong>
          </p>
        </motion.div>

        {/* Por qué ya */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-20">
          {razones.map((r, i) => (
            <motion.div
              key={r.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-brand-surface border border-white/10 p-4 md:p-6"
            >
              <div className="w-11 h-11 rounded-2xl bg-brand-indigo text-white flex items-center justify-center mb-3">{r.icon}</div>
              <h3 className="font-sora font-bold text-base md:text-lg leading-snug mb-1.5">{r.t}</h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">{r.x}</p>
            </motion.div>
          ))}
        </div>

        {/* Los 5 pasos */}
        <section className="mb-20">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-center leading-none mb-3">
            5 pasos y <span className="font-serif italic normal-case text-brand-mint">listo</span>
          </h2>
          <p className="text-center text-white/60 mb-10">Menos de lo que tardas en pedir comida a domicilio.</p>
          <div className="relative">
            {/* Línea que une los pasos */}
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-indigo via-brand-mint to-brand-indigo" />
            <div className="grid lg:grid-cols-5 gap-4">
              {pasos.map((p, i) => (
                <motion.div
                  key={p.titulo}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  viewport={{ once: true }}
                  className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:text-center"
                >
                  <div className="relative z-10 shrink-0 w-16 h-16 rounded-2xl bg-brand-mint text-brand-onyx flex items-center justify-center shadow-[0_0_30px_rgba(136,249,192,0.35)]">
                    {p.icon}
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-indigo text-white font-display text-base flex items-center justify-center border-2 border-brand-onyx">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 rounded-2xl bg-brand-surface border border-white/10 p-4 lg:w-full">
                    {p.destacado && (
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-[#F5C542] text-brand-onyx text-[10px] font-bold uppercase tracking-wider">
                        {p.destacado}
                      </span>
                    )}
                    <h3 className="font-sora font-bold text-white mb-1">{p.titulo}</h3>
                    <p className="text-sm text-white/70 leading-snug">{p.texto}</p>
                    {p.enlace && (
                      <Link to={p.enlace.to} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-mint">
                        {p.enlace.t} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lo que uso yo */}
        <section className="mb-12">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-center leading-none mb-3">
            Lo que uso <span className="font-serif italic normal-case text-brand-mint">yo</span>
          </h2>
          <p className="text-center text-white/70 max-w-2xl mx-auto mb-10">
            Me gusta tener dos bancos: uno para el dinero del día a día, que me da intereses en vez de nada, y otro para las inversiones.
            Los dos tienen muy pocas comisiones (nada que ver con los bancos de siempre) y son muy fáciles de usar.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {plataformas.map((p, i) => (
              <Plataforma key={p.nombre} p={p} i={i} />
            ))}
          </div>
        </section>

        {/* Con cabeza + foro */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="flex gap-4 rounded-3xl bg-brand-surface border border-white/10 p-6">
            <ShieldCheck className="w-8 h-8 text-brand-mint shrink-0" />
            <div>
              <h3 className="font-sora font-bold text-lg mb-1">Hazlo con cabeza</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Primero tu colchón de emergencia. Invierte solo dinero que no vayas a necesitar pronto, reparte (no todo en una empresa) y no
                vendas por miedo cuando la bolsa caiga.
              </p>
            </div>
          </div>
          <Link to="/foro" className="group flex gap-4 rounded-3xl bg-brand-indigo p-6">
            <MessageCircle className="w-8 h-8 text-brand-mint shrink-0" />
            <div>
              <h3 className="font-sora font-bold text-lg mb-1">¿Alguna duda?</h3>
              <p className="text-sm text-white/85 leading-relaxed">
                Pregunta en el foro: no hay preguntas tontas.{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-brand-mint">
                  Ir al foro <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </p>
            </div>
          </Link>
        </div>

        <p className="text-center text-xs text-white/45 max-w-3xl mx-auto">
          Condiciones, regalos e intereses consultados en {FECHA} en las webs de cada entidad; pueden cambiar, compruébalos antes de abrir la
          cuenta. El regalo de bienvenida tributa. Contenido educativo: esto no es asesoramiento financiero. Toda inversión tiene riesgo.
        </p>
      </div>
    </div>
  );
}
