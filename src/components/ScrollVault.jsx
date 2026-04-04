import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Globe, Zap } from "lucide-react";

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
  return (
    <section className="bg-white py-20 px-4">
      {/* Hero amb imatge */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-slate-800 font-semibold text-sm mb-4 border border-white/30">
            🔐 La teva cartera segura
          </span>

          <h2 className="font-sora text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-slate-900">
            Tot el que necessites<br />
            <span className="bg-gradient-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
              en un sol lloc
            </span>
          </h2>

          <p className="text-slate-800 text-lg max-w-2xl mx-auto leading-relaxed">
            Una caixa forta digital per als teus actius. Diversifica, gestiona i fes créixer el teu patrimoni amb total seguretat.
          </p>
        </motion.div>

        {/* Imatge principal de la caixa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/frames/caixa_forta_volant.png"
              alt="Caixa forta amb actius"
              className="w-full h-auto object-contain"
              style={{ maxHeight: "60vh" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7dd0e3]/50 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Característiques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Shield className="w-7 h-7" />,
              title: "Màxima seguretat",
              desc: "Xifratge de grau militar i autenticació en dos passos.",
              color: "from-blue-500 to-blue-700",
              bg: "bg-blue-50"
            },
            {
              icon: <Globe className="w-7 h-7" />,
              title: "Accés global",
              desc: "Gestiona els teus actius des de qualsevol lloc del món.",
              color: "from-brand-purple to-purple-700",
              bg: "bg-purple-50"
            },
            {
              icon: <TrendingUp className="w-7 h-7" />,
              title: "Creixement constant",
              desc: "Eines professionals per maximitzar la rendibilitat.",
              color: "from-brand-orange to-orange-600",
              bg: "bg-orange-50"
            },
            {
              icon: <Zap className="w-7 h-7" />,
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
              viewport={{ once: true }}
              className="group bg-white rounded-3xl p-6 border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="font-sora text-lg font-bold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Estadístiques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-orange via-pink-500 to-brand-purple rounded-3xl p-8 text-white text-center mb-16"
        >
          <h3 className="font-sora text-2xl md:text-3xl font-bold mb-8">
            Números que parlen per si sols
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "6%", label: "Rentabilitat mitjana anual", icon: "📈" },
              { value: "10K+", label: "Usuaris confien en nosaltres", icon: "👥" },
              { value: "50M€", label: "Actius gestionats", icon: "💰" },
              { value: "99.9%", label: "Disponibilitat del servei", icon: "⚡" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className="text-4xl mb-2 block">{stat.icon}</span>
                <p className="font-sora text-3xl md:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-white/80 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marquee */}
        <div className="overflow-hidden mb-16">
          <motion.div
            animate={{ x: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap flex gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-6xl md:text-8xl font-black text-slate-900/10">
                DIVERSIFICA · INVERTEIX · CREIX ·
              </span>
            ))}
          </motion.div>
        </div>

        {/* Actius disponibles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="font-sora text-2xl md:text-3xl font-bold text-center mb-8 text-slate-900">
            Actius disponibles
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ASSETS.map((asset, i) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-4 text-center border border-border hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="text-4xl mb-2 block">{asset.emoji}</span>
                <p className="font-semibold text-slate-900">{asset.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange to-brand-purple p-8 text-white">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative">
              <span className="text-5xl mb-4 block">🚀</span>
              <h3 className="font-sora text-2xl md:text-3xl font-bold mb-4">
                Comença a protegir el teu futur avui
              </h3>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Uneix-te a milers d'inversors que ja estan fent créixer el seu patrimoni.
              </p>
              <Link
                to="/empieza"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-orange font-bold text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Obre la teva compte <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ScrollVault;