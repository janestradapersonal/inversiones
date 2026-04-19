import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Euro, Shield, Smile } from "lucide-react";
import MarketCharts from "@/components/MarketCharts";
import Scroll3D from "./Scroll3D.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "70%", label: "de españoles no invierte su dinero,(mucha gente piensa que es apostar)", icon: "😴" },
  { value: "3%", label: "es lo que pierde tu dinero al año por la inflación ", icon: "📉" },
  { value: "7%", label: "rentabilidad media anual de un índice global", icon: "🚀" },
  { value: "1€", label: "necesitas para empezar a invertir hoy", icon: "🎯" }
];

const features = [
  {
    icon: <Smile className="w-7 h-7" />,
    title: "Es más fácil de lo que crees",
    desc: "No necesitas ser economista. Con 10 minutos y 1€ puedes empezar hoy mismo.",
    color: "from-brand-orange to-brand-pink",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    title: "El tiempo es tu mayor aliado",
    desc: "Gracias al interés compuesto, cuanto antes empieces, más crece tu dinero sin hacer nada.",
    color: "from-brand-purple to-brand-yellow",
  },
  {
    icon: <Euro className="w-7 h-7" />,
    title: "Pequeñas cantidades, grandes resultados",
    desc: "Con 50€ al mes durante 20 años puedes acumular más de 40.000€. ¿A qué esperas?",
    color: "from-brand-green to-brand-yellow",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Diversifica y reduce el riesgo",
    desc: "Un fondo indexado global invierte en miles de empresas. Si una cae, las demás te protegen.",
    color: "from-brand-purple to-brand-orange",
  }
];

export default function Home() {
  const cardsSectionRef = useRef(null);
  const cardRefs = useRef([]);
  const videoStartRef = useRef(null);
  const videoEndRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroInnerRef = useRef(null);
  const scrollHintRef = useRef(null);

  const cards = useMemo(() => features, []);

  useEffect(() => {
    const section = cardsSectionRef.current;
    const elements = cardRefs.current.filter(Boolean);
    if (!section || elements.length === 0) return;

    const ctx = gsap.context(() => {
      elements.forEach((el, idx) => {
        const isLeft = idx === 0 || idx === 3;
        gsap.set(el, { autoAlpha: 0, x: isLeft ? -60 : 60, y: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Un panel a la vez (aparece -> se va -> siguiente).
      const count = elements.length;
      const seg = 1 / Math.max(1, count);
      const fade = 0.18 * seg;

      elements.forEach((el, idx) => {
        const isLeft = idx === 0 || idx === 3;
        const start = idx * seg;
        const enter = start + fade;
        const exit = (idx + 1) * seg - fade;

        tl.to(
          el,
          {
            autoAlpha: 1,
            x: 0,
            duration: fade,
            ease: "power1.out",
          },
          start
        );

        // Mantener visible sin cambios
        tl.to(
          el,
          {
            autoAlpha: 1,
            x: 0,
            duration: Math.max(0, exit - enter),
            ease: "none",
          },
          enter
        );

        tl.to(
          el,
          {
            autoAlpha: 0,
            x: isLeft ? -60 : 60,
            duration: fade,
            ease: "power1.in",
          },
          exit
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const heroInner = heroInnerRef.current;
    const heroSection = heroSectionRef.current;
    if (!heroInner || !heroSection) return;

    const ctx = gsap.context(() => {
      gsap.set(heroInner, { yPercent: 0, opacity: 1 });

      gsap.fromTo(
        heroInner,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -35,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top+=20",
            end: "+=420",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, heroSection);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const hint = scrollHintRef.current;
    if (!hint) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        hint,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hint,
            start: "top top+=40",
            end: "+=120",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, hint);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-20">
      {/* Punto de inicio del rango del vídeo */}
      <div ref={videoStartRef} className="h-px" />

      {/* Vídeo como fondo (controlado por scroll real de la página) */}
      <Scroll3D
        behavior="sticky"
        layout="none"
        rangeStartRef={videoStartRef}
        rangeEndRef={videoEndRef}
        manifestUrl="/frames/diners_plovent/manifest.json"
        initiallyVisible
        posterFrameUrl="/frames/diners_plovent/frame_0001.webp"
      />

      {/* Contenido por encima del vídeo */}
      <div className="relative z-10">
        {/* Hero */}
        <section ref={heroSectionRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Background gradient blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-brand-orange/20 blur-3xl" />
            <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-brand-purple/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/2 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl" />
          </div>

          <div className="mx-auto px-4 py-20 text-center relative max-w-6xl sm:px-6">
            <motion.div
              ref={heroInnerRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold text-blue-950 mb-6">
                💡 Educación financiera para todos
              </p>

              <h1 className="font-sora text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.98] text-blue-950">
                Haz que tu dinero <span className="text-blue-950">trabaje</span>
                <br />
                por ti
                <br />
                mientras duermes
              </h1>

              <p className="mt-6 mb-10 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed font-medium text-blue-950">
                Millones de personas guardan su dinero en el banco perdiendo valor cada año. Tú no tienes que ser una de ellas. Invertir es fácil, accesible y necesario. Te lo explicamos todo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/por-que-invertir"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold text-lg shadow-2xl shadow-blue-200 hover:scale-105 transition-all duration-200"
                >
                  Quiero aprender <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/empieza"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-border text-foreground font-bold text-lg hover:border-brand-orange hover:text-brand-orange transition-all duration-200 shadow-md"
                >
                  ¡Empieza ahora! 🚀
                </Link>
              </div>
            </motion.div>

            {/* Indicador para que la gente deslice */}
            <motion.div
              ref={scrollHintRef}
              className="absolute inset-x-0 bottom-6 w-full flex flex-col items-center gap-2 text-blue-950/90 text-center pointer-events-none"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-sm font-semibold">Desliza para empezar</p>
              <ChevronDown className="w-7 h-7" />
            </motion.div>
          </div>
        </section>

        {/* Spacer: aquí solo avanza el vídeo (sin bloquear el scroll) */}
        <section aria-hidden className="min-h-[220vh]" />

        {/* Fin del vídeo: al llegar aquí se apaga el vídeo y vuelve el fondo azul */}
        <div ref={videoEndRef} className="h-px" />

        {/* Pantalla azul + stats + ¿Cuánto tiempo invertir? */}
        <section className="bg-[#7dd0e3]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-blue-950 text-center">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-4xl mb-2">{s.icon}</p>
                  <p className="font-sora text-3xl font-extrabold">{s.value}</p>
                  <p className="text-blue-950/80 text-sm mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <MarketCharts />
        </section>

      </div>

      {/* Why invest section (tarjetas encima, caja de fondo por scroll) */}
      <section ref={cardsSectionRef} className="relative">
        <Scroll3D behavior="sticky" scrollVh={500}>
          <div className="h-full w-full flex items-center justify-center px-6">
            <div className="relative w-full h-full">
              {cards.map((f, idx) => (
                <div
                  key={f.title}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  style={{ opacity: 0, visibility: "hidden" }}
                  className={
                    idx === 0
                      ? "absolute inset-0 flex items-start justify-start p-8"
                      : idx === 1
                        ? "absolute inset-0 flex items-start justify-end p-8"
                        : idx === 2
                          ? "absolute inset-0 flex items-end justify-end p-8"
                          : "absolute inset-0 flex items-end justify-start p-8"
                  }
                >
                  <div className="bg-[#7dd0e3] rounded-3xl p-7 border border-primary/20 w-full max-w-sm">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5`}
                    >
                      {f.icon}
                    </div>
                    <h3 className="font-sora text-xl font-bold mb-2 text-foreground">{f.title}</h3>
                    <p className="text-foreground/80 text-base leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Scroll3D>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange via-pink-500 to-brand-purple p-12 text-white text-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <p className="text-5xl mb-4">🚀</p>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold mb-4">¿Listo para que tu dinero trabaje?</h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Con MyInvestor y Trade Republic puedes empezar a invertir hoy, sin comisiones y desde 1€.
            </p>
            <Link
              to="/empieza"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-orange font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Ver cómo empezar <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}