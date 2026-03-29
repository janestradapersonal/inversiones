import { motion } from "framer-motion";
import { ExternalLink, Gift, Star, CheckCircle, ArrowRight, Zap } from "lucide-react";

const steps = [
{ num: "1", title: "Elige una plataforma", desc: "MyInvestor o Trade Republic. Las dos son gratuitas, seguras y reguladas." },
{ num: "2", title: "Regístrate en 10 minutos", desc: "Solo necesitas DNI, email y un selfie. Todo online, sin ir a ninguna oficina." },
{ num: "3", title: "Ingresa dinero", desc: "Desde 1€. Puedes hacer una transferencia gratuita desde tu banco habitual y empezar a ivertir." },
{ num: "4", title: "Elige tu inversión", desc: "Busca un ETF global (por ejemplo MSCI World o S&P 500) y compra tu primera participación." },
{ num: "5", title: "Activa aportaciones mensuales", desc: "Programa una inversión automática mensual. Así inviertes sin pensar y aprovechas el DCA." }];


const myinvestor = {
  name: "MyInvestor",
  emoji: "🇪🇸",
  color: "from-blue-600 to-blue-800",
  bg: "bg-blue-50 border-blue-200",
  badge_color: "bg-blue-100 text-blue-700",
  referralUrl: "https://newapp.myinvestor.es/do/signup?promotionalCode=IYZED",
  reward: "25€ de regalo",
  reward_condition: "si traes 1.000€, contratas un depósito o inviertes 100€",
  features: [
  "Fondos indexados sin comisión de custodia",
  "Planes de pensiones y carteras indexadas",
  "Interfaz en español muy intuitiva",
  "Regulado por CNMV (España)",
  "Ideal para fondos de inversión y planes de pensiones"],

  best_for: "Fondos indexados y planes de pensiones"
};

const traderepublic = {
  name: "Trade Republic",
  emoji: "🇩🇪",
  color: "from-emerald-500 to-teal-600",
  bg: "bg-emerald-50 border-emerald-200",
  badge_color: "bg-emerald-100 text-emerald-700",
  referralUrl: "https://refnocode.trade.re/znw9qk74",
  reward: "Recompensa de bienvenida",
  reward_condition: "al abrir cuenta con mi enlace de invitación",
  features: [
  "Compra de acciones y ETFs desde 1€",
  "Cuenta de ahorro remunerada al 2-3%",
  "Sin comisiones por compraventa",
  "App minimalista y muy fácil de usar",
  "Regulado por BaFin (Alemania)"],

  best_for: "ETFs, acciones y ahorro remunerado"
};

function PlatformCard({ platform }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-3xl border-2 ${platform.bg} p-8 relative overflow-hidden`}>
      
      {/* Reward badge */}
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${platform.badge_color}`}>
          <Gift className="w-3.5 h-3.5" />
          {platform.reward}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span className="text-4xl">{platform.emoji}</span>
        <h3 className="font-sora text-2xl font-extrabold">{platform.name}</h3>
      </div>

      <p className="text-slate-950 mb-5 text-sm leading-relaxed">
        🎁 <strong>¡Recompensa exclusiva!</strong> {platform.reward} {platform.reward_condition} si te registras con mi enlace. Me ayudas a mantener esta web gratuita.
      </p>

      <ul className="space-y-2.5 mb-6">
        {platform.features.map((f, i) =>
        <li key={i} className="flex items-start gap-2.5 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        )}
      </ul>

      <div className="mb-6 p-3 rounded-2xl bg-white/70">
        <p className="text-slate-950 text-xs">👆 Ideal para:</p>
        <p className="font-semibold text-sm">{platform.best_for}</p>
      </div>

      <a
        href={platform.referralUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-to-r ${platform.color} text-white font-bold text-base hover:scale-105 hover:shadow-xl transition-all duration-200`}>
        
        Abrir cuenta en {platform.name} <ExternalLink className="w-4 h-4" />
      </a>
      <p className="text-slate-950 mt-3 text-xs text-center">⭐ Enlace de referido — te llevas tu recompensa y me apoyas

      </p>
    </motion.div>);

}

export default function Empieza() {
  return (
    <div className="bg-[#7dd0e3] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-5">
            🚀 ¡Acción!
          </span>
          <h1 className="font-sora text-4xl md:text-5xl font-extrabold mb-5">
            Empieza a invertir{" "}
            <span className="bg-gradient-to-r from-brand-green to-teal-500 bg-clip-text text-transparent">
              hoy mismo
            </span>
          </h1>
          <p className="text-gray-950 mx-auto text-xl leading-relaxed max-w-2xl">El mejor momento para empezar era hace 10 años. El segundo mejor momento es ahora. Te recomiendo dos plataformas que uso personalmente.


          </p>
        </motion.div>

        {/* Steps */}
        <div className="mb-16">
          <h2 className="font-sora text-2xl font-bold text-center mb-8">📋 Cómo empezar en 5 pasos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {steps.map((s, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center">
              
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-purple text-white font-sora font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  {s.num}
                </div>
                <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-slate-950 text-xs">{s.desc}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-12">
          <h2 className="font-sora text-2xl font-bold text-center mb-4">🏆 Mis plataformas recomendadas</h2>
          <p className="text-slate-950 mb-8 text-center">Si usas mis enlaces de referido, obtienes una recompensa y me ayudas a mantener esta web educativa gratuita. ¡Win-win!

          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlatformCard platform={myinvestor} />
            <PlatformCard platform={traderepublic} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-green-800 p-6 text-center rounded-2xl">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Aviso:</strong> Los enlaces de arriba son de referido. Si los usas, obtienes la recompensa indicada y yo una pequeña comisión que me ayuda a mantener esta web. Esto no afecta a tu experiencia ni a las condiciones del producto. Siempre investiga por tu cuenta antes de invertir.
          </p>
        </div>
      </div>
    </div>);

}