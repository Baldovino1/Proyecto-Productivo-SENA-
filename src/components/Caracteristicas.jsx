import { motion } from "framer-motion";
import { FaGamepad, FaTrophy, FaChartLine, FaBolt } from "react-icons/fa";

const caracteristicas = [
  {
    Icono: FaGamepad,
    titulo: "Aprende Jugando",
    descripcion:
      "Convierte cada ejercicio matemático en una aventura divertida.",
    acento: "text-emerald-400 bg-emerald-400/10",
  },
  {
    Icono: FaTrophy,
    titulo: "Gana Recompensas",
    descripcion:
      "Obtén puntos, experiencia y desbloquea logros especiales.",
    acento: "text-amber-400 bg-amber-400/10",
  },
  {
    Icono: FaChartLine,
    titulo: "Mejora tu Nivel",
    descripcion:
      "Avanza progresivamente mientras desarrollas tus habilidades.",
    acento: "text-sky-400 bg-sky-400/10",
  },
  {
    Icono: FaBolt,
    titulo: "Desafíos Diarios",
    descripcion:
      "Completa retos para ganar recompensas adicionales.",
    acento: "text-violet-400 bg-violet-400/10",
  },
];

function Caracteristicas() {
  return (
    <section className="bg-slate-950 py-28 px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            ¿Por qué MatPlay es diferente?
          </h2>
          <p className="text-slate-400">
            Una experiencia donde aprender matemáticas se convierte en una
            aventura.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caracteristicas.map((item, index) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-3 hover:border-white/20 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${item.acento}`}
              >
                <item.Icono />
              </div>

              <h3 className="text-2xl font-bold mb-4">{item.titulo}</h3>

              <p className="text-slate-300">{item.descripcion}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Caracteristicas;