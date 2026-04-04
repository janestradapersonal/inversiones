import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Globe, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Configura els frames disponibles
const TOTAL_FRAMES = 3; // Actualitzar quan hi hagi més frames del vídeo
const FRAME_PREFIX = "/frames/caixa_";
const FRAME_SUFFIX = ".png";
const FRAME_NAMES = ["caixa_forta_volant", "caixa_ordenada1", "caixa_ordenada2"];

//-assets de la caixa forta
const ASSETS = [
  { name: "Accions", emoji: "📈", color: "#FF6B6B" },
  { name: "Bons", emoji: "📊", color: "#4ECDC4" },
  { name: "ETFs", emoji: "🌍", color: "#95E1D3" },
  { name: "Cripto", emoji: "₿", color: "#F38181" },
  { name: "Or", emoji: "🥇", color: "#FFD93D" },
  { name: "Real Estate", emoji: "🏢", color: "#6C5CE7" }
];

function ScrollVault() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const imagesRef = useRef([]);
  const lenisRef = useRef(null);

  // Carregar imatges
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = FRAME_NAMES.length;

    FRAME_NAMES.forEach((name, index) => {
      const img = new Image();
      img.src = `${FRAME_PREFIX}${name}${FRAME_SUFFIX}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalToLoad) {
          setLoaded(true);
        }
      };
      imagesRef.current[index] = img;
    });
  }, []);

  // Inicialitzar Lenis (scroll suau)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Animacions GSAP
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // Animació del canvas amb scroll
      gsap.to({}, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const frameIndex = Math.min(
              Math.floor(self.progress * TOTAL_FRAMES),
              TOTAL_FRAMES - 1
            );
            setCurrentFrame(frameIndex);
          }
        }
      });

      // Hero text reveal
      gsap.from(".vault-hero-text", {
        scrollTrigger: {
          trigger: ".vault-hero-section",
          start: "top top",
          end: "+=800",
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        ease: "power3.out"
      });

      // Secció 1 - Slide from left
      gsap.from(".vault-section-1", {
        scrollTrigger: {
          trigger: ".vault-section-1",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        x: -100,
        opacity: 0,
        ease: "power3.out"
      });

      // Secció 2 - Slide from right
      gsap.from(".vault-section-2", {
        scrollTrigger: {
          trigger: ".vault-section-2",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        x: 100,
        opacity: 0,
        ease: "power3.out"
      });

      // Secció 3 - Scale up
      gsap.from(".vault-section-3", {
        scrollTrigger: {
          trigger: ".vault-section-3",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        scale: 0.8,
        opacity: 0,
        ease: "power3.out"
      });

      // Stats counters
      gsap.utils.toArray(".vault-stat-number").forEach((el) => {
        const target = parseFloat(el.getAttribute("data-target"));
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          innerText: target,
          snap: { innerText: target % 1 === 0 ? 1 : 0.1 },
          ease: "power2.out",
        });
      });

      // CTA final
      gsap.from(".vault-cta", {
        scrollTrigger: {
          trigger: ".vault-cta-section",
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        y: 50,
        opacity: 0,
        ease: "power3.out"
      });

      // Marquee text
      gsap.to(".marquee-text", {
        scrollTrigger: {
          trigger: ".vault-marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        x: -200,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [loaded]);

  // Renderitzar canvas
  useEffect(() => {
    if (!canvasRef.current || !loaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[currentFrame];

    if (img) {
      // Ajustar dimensions
      const containerWidth = canvas.offsetWidth;
      const containerHeight = canvas.offsetHeight;
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      );
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      canvas.width = containerWidth * window.devicePixelRatio;
      canvas.height = containerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Centrar imatge
      ctx.drawImage(
        img,
        (containerWidth - newWidth) / 2,
        (containerHeight - newHeight) / 2,
        newWidth,
        newHeight
      );
    }
  }, [currentFrame, loaded]);

  if (!loaded) {
    return (
      <div className="bg-[#7dd0e3] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-800 font-semibold">Carregant experiència...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-[#7dd0e3]">
      {/* Hero Section */}
      <section className="vault-hero-section min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="vault-hero-text"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-slate-800 font-semibold text-sm mb-4 border border-white/30">
              🔐 La teva cartera segura
            </span>

            <h1 className="font-sora text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-slate-900">
              Tot el que necessites<br />
              <span className="bg-gradient-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
                en un sol lloc
              </span>
            </h1>

            <p className="text-slate-800 text-xl max-w-2xl mx-auto leading-relaxed">
              Una caixa forta digital per als teus actius. Diversifica, gestiona i fes créixer el teu patrimoni amb total seguretat.
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-800 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-slate-800 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="vault-marquee py-8 overflow-hidden bg-white/10 backdrop-blur-sm">
        <div className="marquee-text whitespace-nowrap flex gap-8">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-6xl md:text-8xl font-black text-slate-900/10">
              DIVERSIFICA · INVERTEIX · CREIX ·
            </span>
          ))}
        </div>
      </section>

      {/* Secció 1 - Característiques */}
      <section className="vault-section-1 min-h-screen flex items-center py-20 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange font-semibold text-sm mb-4">
                Característiques
              </span>
              <h2 className="font-sora text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">
                Gestiona els teus<br />
                <span className="text-brand-orange">actius intel·ligentment</span>
              </h2>
              <p className="text-slate-800 text-lg leading-relaxed mb-8">
                Una interfície neta i intuïtiva per controlar totes les teves inversions.
                Accions, bons, ETFs, criptomonedes i més. Tot en un sol lloc.
              </p>

              <div className="space-y-4">
                {ASSETS.slice(0, 3).map((asset, i) => (
                  <motion.div
                    key={asset.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl backdrop-blur-sm"
                  >
                    <span className="text-3xl">{asset.emoji}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{asset.name}</p>
                      <p className="text-sm text-slate-600">Gestió professional</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-brand-orange/20 to-brand-purple/20 rounded-3xl flex items-center justify-center">
                <span className="text-9xl">📦</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secció 2 - Estadístiques */}
      <section className="vault-section-2 min-h-screen flex items-center py-20 px-4 bg-gradient-to-b from-transparent to-black/80">
        <div className="max-w-6xl mx-auto w-full text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm mb-4">
            Resultats
          </span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold mb-12 text-white">
            Números que parlen<br />per si sols
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: 6, suffix: "%", label: "Rentabilitat mitjana anual", icon: "📈" },
              { value: 10000, suffix: "+", label: "Usuaris confien en nosaltres", icon: "👥" },
              { value: 50, suffix: "M€", label: "Actius gestionats", icon: "💰" },
              { value: 99.9, suffix: "%", label: "Disponibilitat del servei", icon: "⚡" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="vault-stat-item bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
              >
                <span className="text-4xl mb-4 block">{stat.icon}</span>
                <p className="font-sora text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <span className="vault-stat-number" data-target={stat.value}>0</span>
                  {stat.suffix}
                </p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secció 3 - Beneficis */}
      <section className="vault-section-3 min-h-screen flex items-center py-20 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-purple/20 text-brand-purple font-semibold text-sm mb-4">
              Avantatges
            </span>
            <h2 className="font-sora text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">
              Per què triar<br />
              <span className="text-brand-purple">la nostra caixa forta?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Màxima seguretat",
                desc: "Xifratge de grau militar i autenticació en dos passos.",
                color: "from-blue-500 to-blue-700",
                bg: "bg-blue-50"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Accés global",
                desc: "Gestiona els teus actius des de qualsevol lloc del món.",
                color: "from-brand-purple to-purple-700",
                bg: "bg-purple-50"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Creixement constant",
                desc: "Eines professionals per maximitzar la rendibilitat.",
                color: "from-brand-orange to-orange-600",
                bg: "bg-orange-50"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Sense comissions",
                desc: "Inverteix sense comissions ocultes ni costos amagats.",
                color: "from-green-500 to-emerald-600",
                bg: "bg-green-50"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-sora text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="vault-cta-section py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="vault-cta relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange via-pink-500 to-brand-purple p-12 text-white text-center"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="relative">
              <span className="text-6xl mb-6 block">🚀</span>
              <h2 className="font-sora text-3xl md:text-5xl font-extrabold mb-6">
                Comença a protegir<br />el teu futur avui
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Uneix-te a milers d'inversors que ja estan fent créixer el seu patrimoni de manera segura i intel·ligent.
              </p>

              <Link
                to="/empieza"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-brand-orange font-bold text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Obre la teva compte <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-white/60 text-sm mt-6">
                Sense comissions · Comença des de 1€ · Cancel·la quan vulguis
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ScrollVault;