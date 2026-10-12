import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const ultimoScroll = useRef(0);

  useEffect(() => {
    const manejarScroll = () => {
      const actual = window.scrollY;

      // Arriba del todo: siempre visible
      if (actual < 80) {
        setVisible(true);
      } else if (actual > ultimoScroll.current) {
        // Bajando: ocultar
        setVisible(false);
      } else {
        // Subiendo: mostrar
        setVisible(true);
      }

      ultimoScroll.current = actual;
    };

    window.addEventListener("scroll", manejarScroll, { passive: true });
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50"
      animate={{ y: visible ? 0 : "-130%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg px-6 py-4 shadow-lg">
          <motion.div
            animate={{ rotate: [-0.5, 2, -0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-2xl font-bold text-white">MATPLAY</h1>
          </motion.div>

          <ul className="hidden md:flex gap-8 text-white">
            <li className="cursor-pointer hover:text-emerald-300 transition-colors">
              Inicio
            </li>
            <li className="cursor-pointer hover:text-emerald-300 transition-colors">
              Aprende
            </li>
            <li className="cursor-pointer hover:text-emerald-300 transition-colors">
              Juegos
            </li>
            <li className="cursor-pointer hover:text-emerald-300 transition-colors">
              Ranking
            </li>
            <li className="cursor-pointer hover:text-emerald-300 transition-colors">
              Perfil
            </li>
          </ul>

          <div className="hidden md:flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              Entrar
            </Link>

            <Link
              to="/registro"
              className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-300 transition-colors"
            >
              Registro
            </Link>
          </div>

          <button className="md:hidden text-white text-2xl">
            <FaBars />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;