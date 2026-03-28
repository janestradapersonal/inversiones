import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

const sections = [
{
  id: "productos",
  emoji: "📦",
  title: "Productos financieros",
  color: "from-brand-orange to-pink-500",
  items: [
  {
    q: "¿Qué es una acción?",
    a: "Una acción es una pequeña parte de una empresa. Si compras una acción de Apple, eres dueño de una pequeñísima parte de Apple. Si la empresa va bien, tu acción vale más. Si va mal, vale menos. Las acciones son volátiles a corto plazo, pero históricamente las buenas empresas suben a largo plazo."
  },
  {
    q: "¿Qué es un fondo indexado (ETF)?",
    a: "Un ETF o fondo indexado es como una cesta que contiene cientos o miles de acciones. Por ejemplo, un ETF del S&P 500 tiene las 500 mayores empresas de EE.UU. En vez de apostar por una empresa, apuestas por toda la economía. Es la estrategia favorita de Warren Buffett para los pequeños inversores."
  },
  {
    q: "¿Qué es la renta fija (bonos)?",
    a: "Los bonos son préstamos que haces a gobiernos o empresas. Ellos te pagan un interés fijo a cambio. Son más estables que las acciones pero dan menos rentabilidad. Útiles para equilibrar el riesgo de tu cartera."
  },
  {
    q: "¿Qué es un fondo de inversión?",
    a: "Un fondo junta el dinero de muchos inversores y lo gestiona un equipo profesional. Hay fondos de todo tipo: de renta variable (acciones), renta fija, mixtos, sectoriales... Los fondos indexados son un tipo especial de fondo que simplemente replica un índice, sin necesidad de gestores caros."
  },
  {
    q: "¿Qué es el plan de pensiones?",
    a: "Es un producto de ahorro a largo plazo para la jubilación. Tiene ventajas fiscales (reduces lo que pagas a Hacienda), pero no puedes sacarlo hasta la jubilación (salvo casos especiales). Ideal para complementar la pensión pública."
  },
  {
    q: "¿Qué son los depósitos y cuentas remuneradas?",
    a: "Los depósitos son cuentas donde dejas tu dinero bloqueado un tiempo (6 meses, 1 año...) a cambio de un interés fijo. Las cuentas remuneradas te pagan interés sin bloquear tu dinero. Poco riesgo, pero poca rentabilidad. Útiles para el fondo de emergencia."
  }]

},
{
  id: "conceptos",
  emoji: "🧠",
  title: "Conceptos clave",
  color: "from-brand-purple to-blue-500",
  items: [
  {
    q: "¿Qué es la diversificación?",
    a: "No poner todos los huevos en la misma cesta. Si inviertes en 500 empresas diferentes, que una quiebre no te arruina. Un ETF global te da diversificación automática en miles de empresas de todo el mundo."
  },
  {
    q: "¿Qué es el interés compuesto?",
    a: "Es la magia de ganar intereses sobre tus intereses. Si tienes 1.000€ y ganas un 7%, el año siguiente tienes 1.070€. El siguiente año, el 7% se aplica sobre 1.070€, no sobre 1.000€. Con el tiempo, esto crea un efecto bola de nieve espectacular."
  },
  {
    q: "¿Qué es la aversión al riesgo?",
    a: "Es lo mucho o poco que te molesta perder dinero. Si ver caer tu cartera un 20% te haría perder el sueño, tienes alta aversión al riesgo y deberías tener una cartera más conservadora. Es importante conocerse a uno mismo para invertir bien."
  },
  {
    q: "¿Qué es el horizonte temporal?",
    a: "Es el tiempo que vas a dejar invertido tu dinero. A más tiempo, más riesgo puedes asumir porque tienes tiempo de recuperar caídas. Si necesitas el dinero en 1 año, no deberías tenerlo en bolsa. Si no lo necesitas en 20 años, puedes ser más agresivo."
  },
  {
    q: "¿Qué es el DCA (Dollar Cost Averaging)?",
    a: "Es invertir una cantidad fija cada mes, independientemente del precio del mercado. Así compras más barato cuando baja y menos cuando sube, promediando el coste. Es la estrategia más sencilla y efectiva para pequeños inversores."
  }]

},
{
  id: "carteras",
  emoji: "💼",
  title: "Ejemplos de carteras",
  color: "from-brand-green to-teal-500",
  items: [
  {
    q: "Cartera Conservadora (poco riesgo)",
    a: "20% ETF de renta variable global + 60% ETF de bonos + 20% cuenta remunerada. Ideal si tienes menos de 5 años de horizonte temporal o poca tolerancia a las caídas. Rentabilidad esperada: 3-4% anual."
  },
  {
    q: "Cartera Moderada (equilibrada)",
    a: "60% ETF de renta variable global + 30% ETF de bonos + 10% cuentas remuneradas. El equilibrio clásico. Tolera caídas de hasta el 20-30% a cambio de más rentabilidad. Rentabilidad esperada: 5-6% anual."
  },
  {
    q: "Cartera Agresiva (máxima rentabilidad)",
    a: "80-100% ETF de renta variable global (S&P 500 + Mundo desarrollado + Emergentes). Para inversores con horizonte de +10 años y estómago para ver caídas del 40-50%. Rentabilidad esperada: 7-10% anual."
  },
  {
    q: "Cartera del perezoso (la más sencilla)",
    a: "100% MSCI World o Vanguard All World. Un solo ETF que incluye miles de empresas de todo el mundo. Máxima diversificación, mínima complejidad. Haz una aportación mensual y olvídate. Así de simple."
  }]

}];


function AccordionItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)} className="bg-blue-950 p-5 text-left w-full flex items-center justify-between hover:bg-muted/50 transition-colors">
        
        
        <span className="text-gray-50 pr-4 font-semibold">{item.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden">
          
            <p className="text-slate-950 pb-5 px-5 leading-relaxed">{item.a}</p>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}

export default function Aprende() {
  return (
    <div className="bg-[#7dd0e3] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple font-semibold text-sm mb-5">
            3 - Aprende
          </span>
          <h1 className="font-sora text-4xl md:text-5xl font-extrabold mb-5">
            Todo lo que necesitas{" "}
            <span className="bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
              saber
            </span>{" "}
            para empezar
          </h1>
          <p className="text-slate-950 text-xl leading-relaxed">Sin jerga financiera innecesaria. Explicado para que lo entienda cualquier persona.

          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, si) =>
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}>
            
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl shadow-md`}>
                  {section.emoji}
                </div>
                <h2 className="font-sora text-2xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, i) =>
              <AccordionItem key={i} item={item} index={i} />
              )}
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">¿Ya tienes los conocimientos? ¡Es hora de pasar a la acción!</p>
          <Link
            to="/empieza"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold text-lg shadow-xl hover:scale-105 transition-all">
            
            ¡Empieza a invertir hoy! <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>);

}