import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaStar,
  FaTrophy,
  FaBolt,
  FaSignOutAlt,
} from "react-icons/fa";
import { obtenerSesion, cerrarSesion } from "../utilidades/auth";

// Mapa de emojis para los avatares que el usuario eligió en el registro
// (uso los mismos ids que definí en Registro.jsx para que coincidan)
const avatares = {
  avatar_1: "🦊",
  avatar_2: "🐼",
  avatar_3: "🐸",
  avatar_4: "🦁",
};

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // Al cargar la página revisamos si hay sesión activa.
  // Si no hay usuario logueado, no tiene sentido mostrar el perfil,
  // así que lo mandamos directo al login.
  useEffect(() => {
    const sesion = obtenerSesion();

    if (!sesion) {
      navigate("/login");
      return;
    }

    setUsuario(sesion);
  }, [navigate]);

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
  };

  // Mientras se verifica la sesión no renderizamos nada todavía
  // (evita el "parpadeo" de perfil vacío antes de redirigir)
  if (!usuario) return null;

  // Cálculo simple de progreso hacia el siguiente nivel.
  // Por ahora uso una regla fija: cada 100 puntos sube un nivel.
  const puntosParaSiguienteNivel = 100;
  const puntosEnNivelActual = usuario.puntos % puntosParaSiguienteNivel;
  const porcentajeProgreso = (puntosEnNivelActual / puntosParaSiguienteNivel) * 100;

  return (
    <section className="min-h-screen bg-slate-950 text-white px-6 py-28">
      <div className="max-w-5xl mx-auto">
        {/* ===== Encabezado del perfil ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-white/5 to-transparent p-8 md:p-10 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar grande */}
            <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-3xl border-2 border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center text-5xl md:text-6xl">
              {avatares[usuario.avatar] || "🙂"}
            </div>

            <div className="flex-1">
              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
                {usuario.grado}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                {usuario.nombre_usuario}
              </h1>
              <p className="text-slate-400 mt-1">{usuario.correo}</p>
            </div>

            {/* Botón para empezar a jugar: es la acción principal de la página */}
            <button
              onClick={() => navigate("/juego")}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-bold text-lg hover:bg-emerald-300 hover:scale-105 transition-all duration-300 shrink-0"
            >
              <FaPlay />
              Empezar Juego
            </button>
          </div>
        </motion.div>

        {/* ===== Tarjetas de estadísticas ===== */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 text-amber-400 bg-amber-400/10">
              <FaStar />
            </div>
            <p className="text-slate-400 text-sm">Puntos totales</p>
            <p className="text-3xl font-bold mt-1">{usuario.puntos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 text-sky-400 bg-sky-400/10">
              <FaBolt />
            </div>
            <p className="text-slate-400 text-sm">Nivel actual</p>
            <p className="text-3xl font-bold mt-1">{usuario.nivel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 text-violet-400 bg-violet-400/10">
              <FaTrophy />
            </div>
            <p className="text-slate-400 text-sm">Posición en ranking</p>
            {/* Por ahora esto es un placeholder, cuando tenga el ranking
                calculado desde todos los usuarios lo conecto aquí */}
            <p className="text-3xl font-bold mt-1">--</p>
          </motion.div>
        </div>

        {/* Barra de progreso hacia el siguiente nivel  */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Progreso al siguiente nivel</h3>
            <span className="text-sm text-slate-400">
              {puntosEnNivelActual} / {puntosParaSiguienteNivel} pts
            </span>
          </div>

          {/* Barra de fondo + barra animada de progreso */}
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeProgreso}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
            />
          </div>
        </motion.div>

        {/* Cerrar sesión */}
        <div className="flex justify-center">
          <button
            onClick={manejarCerrarSesion}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-semibold"
          >
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}

export default Perfil;