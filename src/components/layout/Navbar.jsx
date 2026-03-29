import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
{ label: "Inicio", path: "/" },
{ label: "Por qué invertir", path: "/por-que-invertir" },
{ label: "Aprende", path: "/aprende" },
{ label: "Empieza ya", path: "/empieza" },
{ label: "Foro", path: "/foro" }];


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#7dd0e3]/95 backdrop-blur-md shadow-lg shadow-black/5" : "bg-transparent"}`
      }>
      
      <div className="mx-auto px-4 max-w-6xl sm:px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora font-800 text-xl text-foreground">
            inversionesfacil<span className="text-brand-orange font-bold">.es</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            location.pathname === link.path ?
            "bg-brand-orange text-white shadow-md shadow-orange-200" :
            "text-foreground/70 hover:text-foreground hover:bg-muted"}`
            }>
            
              {link.label}
            </Link>
          )}
        </nav>

        {/* CTA desktop */}
        <Link
          to="/empieza"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-orange to-brand-purple text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
          
          ¡Empieza gratis!
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)} className="bg-slate-50 text-slate-400 p-2 rounded-xl md:hidden">
          
          
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/98 backdrop-blur-md border-t border-border">
          
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === link.path ?
              "bg-brand-orange text-white" :
              "text-foreground hover:bg-muted"}`
              }>
              
                  {link.label}
                </Link>
            )}
              <Link
              to="/empieza"
              className="mt-2 text-center px-5 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-semibold">
              
                ¡Empieza gratis!
              </Link>
            </nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}