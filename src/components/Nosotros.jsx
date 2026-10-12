import { motion } from "framer-motion";
import { FaBullseye, FaRocket, FaCheckCircle } from "react-icons/fa";

const beneficios = [
  "Aprendizaje gamificado con avances medibles",
  "Retos interactivos que se adaptan a tu nivel",
  "Recompensas y logros desbloqueables",
  "Progreso constante para mantener la motivación",
];

function Nosotros() {
  return (
    <section className="bg-slate-950 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">¿Quiénes Somos?</h2>
          <p className="text-slate-400 max-w-3xl mx-auto">
            MatPlay es una plataforma educativa diseñada para transformar el
            aprendizaje de las matemáticas en una aventura divertida.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Misión: pieza grande y destacada */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-white/5 to-transparent p-10 flex flex-col justify-between"
          >
            {/* Marca de agua decorativa */}
            <FaBullseye className="absolute -right-8 -bottom-8 text-emerald-400/10 text-[220px] pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8 text-emerald-400 bg-emerald-400/10">
                <FaBullseye />
              </div>

              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
                Nuestra misión
              </span>

              <p className="mt-4 text-2xl md:text-3xl font-bold leading-snug max-w-lg">
                Ayudar a los niños a fortalecer sus habilidades matemáticas
                mediante experiencias interactivas, dinámicas y divertidas.
              </p>
            </div>
          </motion.div>

          {/* Columna derecha: Visión (card) + Beneficios (lista) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 text-sky-400 bg-sky-400/10">
                <FaRocket />
              </div>

              <h3 className="text-2xl font-bold mb-3">Visión</h3>

              <p className="text-slate-300">
                Convertirnos en una plataforma líder de aprendizaje digital
                donde estudiar matemáticas sea tan emocionante como jugar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 flex-1"
            >
              <h3 className="text-2xl font-bold mb-5">Beneficios</h3>

              <ul className="space-y-4">
                {beneficios.map((texto, index) => (
                  <li key={texto} className="flex items-start gap-3">
                    <FaCheckCircle className="text-amber-400 mt-1 shrink-0" />
                    <span className="text-slate-300">{texto}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Nosotros;