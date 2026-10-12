import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaPlus, FaMinus, FaTimes, FaDivide } from "react-icons/fa";
import fondo from "../assets/fondo.webp.jpg";
import { Link } from "react-router-dom";

// Posiciones fijas y deliberadas, no aleatorias en cada render.
// Menos elementos, más grandes, con más intención de composición
// (enmarcando el título en vez de "salpicar" la pantalla).
const simbolos = [
  { icon: <FaPlus />, top: "14%", left: "8%", delay: 0, size: "text-4xl" },
  { icon: <FaTimes />, top: "72%", left: "12%", delay: 2, size: "text-3xl" },
  { icon: <FaDivide />, top: "18%", left: "88%", delay: 1, size: "text-3xl" },
  { icon: <FaMinus />, top: "68%", left: "90%", delay: 3, size: "text-4xl" },
];

// Partículas fijas generadas UNA sola vez con useMemo, no en cada render.
function useParticulas(cantidad = 18) {
  return useMemo(
    () =>
      Array.from({ length: cantidad }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 5,
      })),
    [cantidad]
  );
}

export default function Hero() {
  const particulas = useParticulas();

  return (
    <section className="relative h-screen overflow-hidden bg-slate-950">
      <img
        src={fondo}
        alt="MatPlay"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-slate-900/40 to-slate-950" />

      {/* Luz central */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-emerald-400/15 blur-[180px] left-1/2 -translate-x-1/2 top-0" />

      {/* Luces laterales (fijas, fuera del flujo de botones) */}
      <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-emerald-400/10 blur-[180px]" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full bg-amber-400/10 blur-[180px]" />

      {/* Partículas */}
      {particulas.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [-10, 15, -10], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: p.duration, repeat: Infinity }}
        />
      ))}

      {/* Símbolos matemáticos: enmarcan el título, no lo saturan */}
      {simbolos.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute text-white/15 ${item.size} hidden md:block`}
          style={{ top: item.top, left: item.left }}
          animate={{ y: [-15, 15, -15], rotate: [-4, 4, -4] }}
          transition={{ duration: 8, repeat: Infinity, delay: item.delay }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Niebla inferior */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

      {/* Viñeta */}
      <div className="absolute inset-0 shadow-[inset_0_0_250px_rgba(0,0,0,.7)] pointer-events-none" />

      {/* Contenido */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white font-black tracking-[6px] text-6xl md:text-8xl lg:text-[9rem] drop-shadow-[0_10px_25px_rgba(0,0,0,.7)]"
        >
          MATPLAY
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 180 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-1 bg-emerald-400 rounded-full mt-5 mb-8"
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white font-bold text-3xl md:text-5xl max-w-5xl leading-tight"
        >
          Aprender matemáticas nunca fue tan divertido.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-gray-200 max-w-3xl text-lg md:text-xl leading-8"
        >
          MatPlay convierte las matemáticas básicas en una aventura
          interactiva llena de juegos, desafíos, recompensas y
          aprendizaje para niños de primaria.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col md:flex-row gap-6"
        >
          <Link
            to="/registro"
            className="px-10 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg shadow-2xl hover:scale-105 hover:bg-emerald-400 transition-all duration-300 text-center"
          >
            Comenzar aventura
          </Link>

          <a
            href="#aprendizaje"
              className="px-10 py-4 rounded-full border border-white/40 backdrop-blur-md bg-white/10 text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 text-center"
            >
              Explorar contenido
          </a>
          
        </motion.div>
      </div>

      {/* Flecha de scroll — fuera del contenedor de botones */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 cursor-pointer"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <a href="#aprendizaje">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/70 text-sm tracking-widest uppercase">
              Explorar
            </span>
            <FaChevronDown className="text-white text-3xl" />
          </div>
        </a>
      </motion.div>
    </section>
  );
}