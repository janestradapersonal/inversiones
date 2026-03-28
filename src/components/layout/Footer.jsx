import { Link } from "react-router-dom";
import { TrendingUp, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-sora font-bold text-lg text-white">
                inversionesfacil<span className="text-brand-orange">.es</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Educación financiera para todos. Porque invertir no es cosa de ricos, es cosa de listos.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Inicio</Link></li>
              <li><Link to="/por-que-invertir" className="hover:text-brand-orange transition-colors">Por qué invertir</Link></li>
              <li><Link to="/aprende" className="hover:text-brand-orange transition-colors">Aprende</Link></li>
              <li><Link to="/empieza" className="hover:text-brand-orange transition-colors">Empieza ya</Link></li>
              <li><Link to="/foro" className="hover:text-brand-orange transition-colors">Foro</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Aviso legal</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Este sitio es solo educativo y divulgativo. No somos asesores financieros. Invertir conlleva riesgo. Consulta siempre a un profesional antes de tomar decisiones financieras.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-sm">© 2026 InversionesFáciles. Todos los derechos reservados.</p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-brand-orange" /> para tu libertad financiera
          </p>
        </div>
      </div>
    </footer>
  );
}