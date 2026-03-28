import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, ArrowRight, Euro, Clock, Smile } from "lucide-react";
import MarketCharts from "@/components/MarketCharts";

const stats = [
{ value: "70%", label: "de españoles no invierte su dinero", icon: "😴" },
{ value: "3%", label: "es lo que pierde tu dinero al año por la inflación", icon: "📉" },
{ value: "7%", label: "rentabilidad media anual de un índice global", icon: "🚀" },
{ value: "0€", label: "necesitas para empezar a invertir hoy", icon: "🎯" }];


const features = [
{
  icon: <Smile className="w-7 h-7" />,
  title: "Es más fácil de lo que crees",
  desc: "No necesitas ser economista. Con 10 minutos y 1€ puedes empezar hoy mismo.",
  color: "from-brand-orange to-pink-500",
  bg: "bg-orange-50"
},
{
  icon: <Clock className="w-7 h-7" />,
  title: "El tiempo es tu mayor aliado",
  desc: "Gracias al interés compuesto, cuanto antes empieces, más crece tu dinero sin hacer nada.",
  color: "from-brand-purple to-blue-500",
  bg: "bg-purple-50"
},
{
  icon: <Euro className="w-7 h-7" />,
  title: "Pequeñas cantidades, grandes resultados",
  desc: "Con 50€ al mes durante 20 años puedes acumular más de 40.000€. ¿A qué esperas?",
  color: "from-brand-green to-teal-500",
  bg: "bg-green-50"
},
{
  icon: <Shield className="w-7 h-7" />,
  title: "Diversifica y reduce el riesgo",
  desc: "Un fondo indexado global invierte en miles de empresas. Si una cae, las demás te protegen.",
  color: "from-blue-500 to-brand-purple",
  bg: "bg-blue-50"
}];


export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-brand-orange/20 blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-brand-purple/20 blur-3xl" />
          <div className="absolute bottom-10 left-1/2 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl" />
        </div>

        <div className="bg-[#7dd0e3] mx-auto px-4 py-20 text-center relative max-w-6xl sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-6 border border-brand-orange/20">
              💡 Educación financiera para todos
            </span>

            <h1 className="font-sora text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
              Tu dinero puede{" "}
              <span className="bg-gradient-to-r from-brand-orange via-brand-purple to-brand-pink bg-clip-text text-transparent">
                trabajar por ti
              </span>
              <br />
              mientras duermes
            </h1>

            <p className="text-slate-900 mb-10 mx-auto text-xl leading-relaxed max-w-2xl">Millones de personas guardan su dinero en el banco perdiendo valor cada año. Tú no tienes que ser una de ellas. Invertir es fácil, accesible y necesario. Te lo explicamos todo.



            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/por-que-invertir"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold text-lg shadow-2xl shadow-blue-200 hover:scale-105 transition-all duration-200">
                
                Quiero aprender <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/empieza"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-border text-foreground font-bold text-lg hover:border-brand-orange hover:text-brand-orange transition-all duration-200 shadow-md">
                
                ¡Empieza ahora! 🚀
              </Link>
            </div>
          </motion.div>

          {/* Floating emoji cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-8 hidden lg:block">
            
            


            
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-8 hidden lg:block">
            
            


            
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-pink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {stats.map((s, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}>
              
                <p className="text-4xl mb-2">{s.icon}</p>
                <p className="font-sora text-3xl font-extrabold">{s.value}</p>
                <p className="text-white/80 text-sm mt-1">{s.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <MarketCharts />

      {/* Why invest section */}
      <section className="bg-[#7dd0e3] mx-auto px-4 py-24 max-w-6xl sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-sm mb-4">
            ¿Por qué invertir?
          </span>
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold mb-4">
            No invertir <span className="text-brand-orange">también es una decisión</span>
          </h2>
          <p className="text-slate-50 mx-auto text-lg max-w-2xl">Cada año que pasa sin invertir, la inflación se come tu dinero. Es hora de ponerlo a trabajar.

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-3xl p-8 border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-sora text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-900 leading-relaxed">{f.desc}</p>
            </motion.div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/por-que-invertir" className="bg-foreground text-slate-50 px-8 py-4 font-bold rounded-2xl inline-flex items-center gap-2 hover:bg-brand-orange transition-all duration-200">Ver más razones para invertir



          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-orange via-pink-500 to-brand-purple p-12 text-white text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative">
            <p className="text-5xl mb-4">🚀</p>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold mb-4">
              ¿Listo para que tu dinero trabaje?
            </h2>
            <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
              Con MyInvestor y Trade Republic puedes empezar a invertir hoy, sin comisiones y desde 1€.
            </p>
            <Link
              to="/empieza"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-orange font-bold text-lg hover:scale-105 transition-transform shadow-xl">
              
              Ver cómo empezar <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>);

}