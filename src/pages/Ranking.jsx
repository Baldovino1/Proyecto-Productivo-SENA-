import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaMedal, FaCrown, FaStar, FaArrowLeft } from "react-icons/fa";
import { obtenerTodosLosUsuarios, obtenerSesion, crearUsuariosBot } from "../utilidades/auth";

const avatares = {
  avatar_1: "🦊",
  avatar_2: "🐼",
  avatar_3: "🐸",
  avatar_4: "🦁",
};

const estiloPodio = {
  1: { color: "text-amber-400", borde: "border-amber-400/40", Icono: FaCrown },
  2: { color: "text-slate-300", borde: "border-slate-300/30", Icono: FaMedal },
  3: { color: "text-orange-400", borde: "border-orange-400/30", Icono: FaMedal },
};

function Ranking() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [miCorreo, setMiCorreo] = useState(null);

  useEffect(() => {
    crearUsuariosBot();
    setUsuarios(obtenerTodosLosUsuarios());

    const sesion = obtenerSesion();
    if (sesion) setMiCorreo(sesion.correo);
  }, []);

  // Calculo mi posición UNA sola vez aquí arriba, no dentro del map
  const miPosicion = usuarios.findIndex((u) => u.correo === miCorreo) + 1;
  const estaEnPodio = miPosicion > 0 && miPosicion <= 3;

  const mensajesPodio = {
    1: "¡Eres el número 1 del ranking!",
    2: "¡Estás en el 2º lugar, muy cerca de la cima!",
    3: "¡Estás en el 3er lugar, sigue así!",
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white px-6 py-28">
      <div className="max-w-3xl mx-auto">
        {/* Botón para volver al perfil: va una sola vez, antes de todo lo demás */}
        <button
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <FaArrowLeft /> Volver al perfil
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <FaTrophy className="text-amber-400 text-5xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Tabla de Clasificación</h1>
          <p className="text-slate-400">
            Los mejores estudiantes de MatPlay, ordenados por puntos.
          </p>
        </motion.div>

        {/* Banner de felicitación: fuera de la lista, se muestra una sola vez */}
        {estaEnPodio && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-6 mb-8"
          >
            <FaStar className="text-amber-400 text-3xl shrink-0" />
            <div>
              <p className="font-bold text-amber-400">
                {mensajesPodio[miPosicion]}
              </p>
              <p className="text-sm text-slate-300">
                Sigue practicando para mantener tu lugar en el podio.
              </p>
            </div>
          </motion.div>
        )}

        {usuarios.length === 0 ? (
          <p className="text-center text-slate-500">
            Aún no hay estudiantes registrados.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {usuarios.map((usuario, index) => {
              const posicion = index + 1;
              const esPodio = estiloPodio[posicion];
              const esUsuarioActual = usuario.correo === miCorreo;

              return (
                <motion.div
                  key={usuario.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex items-center gap-4 rounded-2xl border p-5 ${
                    esUsuarioActual
                      ? "border-emerald-400/40 bg-emerald-400/10"
                      : esPodio
                      ? `${esPodio.borde} bg-white/5`
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="w-10 shrink-0 text-center">
                    {esPodio ? (
                      <esPodio.Icono className={`text-2xl ${esPodio.color} mx-auto`} />
                    ) : (
                      <span className="text-lg font-bold text-slate-500">
                        {posicion}
                      </span>
                    )}
                  </div>

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    {avatares[usuario.avatar] || "🙂"}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold">
                      {usuario.nombre_usuario}
                      {esUsuarioActual && (
                        <span className="ml-2 text-xs text-emerald-400 font-semibold">
                          (Tú)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-slate-400">{usuario.grado}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-amber-400">
                      {usuario.puntos}
                    </p>
                    <p className="text-xs text-slate-500">pts</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Ranking;