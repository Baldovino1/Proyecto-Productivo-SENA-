import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTimes, FaDivide, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const temas = [
  {
    Icono: FaPlus,
    titulo: "Sumas",
    descripcion: "Aprende a combinar cantidades de forma sencilla, paso a paso, con ejercicios pensados para tu ritmo.",
    color: "emerald",
    nivel: "Nivel 1",
  },
  {
    Icono: FaMinus,
    titulo: "Restas",
    descripcion: "Descubre cómo encontrar diferencias y resultados con retos que se vuelven más divertidos en cada intento.",
    color: "amber",
    nivel: "Nivel 2",
  },
  {
    Icono: FaTimes,
    titulo: "Multiplicaciones",
    descripcion: "Domina las tablas y los métodos rápidos con juegos que hacen que memorizar deje de sentirse como tarea.",
    color: "sky",
    nivel: "Nivel 3",
  },
  {
    Icono: FaDivide,
    titulo: "Divisiones",
    descripcion: "Aprende a repartir y resolver ejercicios de división con desafíos progresivos y recompensas por avanzar.",
    color: "violet",
    nivel: "Nivel 4",
  },
];

const colores = {
  emerald: {
    texto: "text-emerald-400",
    fondo: "bg-emerald-400/10",
    borde: "border-emerald-400/30",
    boton: "bg-emerald-400 hover:bg-emerald-300",
    glow: "bg-emerald-400/20",
  },
  amber: {
    texto: "text-amber-400",
    fondo: "bg-amber-400/10",
    borde: "border-amber-400/30",
    boton: "bg-amber-400 hover:bg-amber-300",
    glow: "bg-amber-400/20",
  },
  sky: {
    texto: "text-sky-400",
    fondo: "bg-sky-400/10",
    borde: "border-sky-400/30",
    boton: "bg-sky-400 hover:bg-sky-300",
    glow: "bg-sky-400/20",
  },
  violet: {
    texto: "text-violet-400",
    fondo: "bg-violet-400/10",
    borde: "border-violet-400/30",
    boton: "bg-violet-400 hover:bg-violet-300",
    glow: "bg-violet-400/20",
  },
};

function Aprendizaje() {
  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState(1);

  const irA = (nuevoIndice) => {
    setDireccion(nuevoIndice > indice ? 1 : -1);
    setIndice((nuevoIndice + temas.length) % temas.length);
  };

  const siguiente = () => irA(indice + 1);
  const anterior = () => irA(indice - 1);

  const tema = temas[indice];
  const paleta = colores[tema.color];

  const variantes = {
    entra: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
    centro: { x: 0, opacity: 1 },
    sale: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  };

  return (
    <section id="aprendizaje" className="bg-slate-900 text-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Explora las Matemáticas</h2>
          <p className="text-slate-400">
            Elige una aventura y comienza a aprender.
          </p>
        </motion.div>

        <div className="relative">
          {/* Flechas de navegación */}
          <button
            onClick={anterior}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Tema anterior"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={siguiente}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Siguiente tema"
          >
            <FaChevronRight />
          </button>

          {/* Escenario del carrusel */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 px-10 py-14 md:px-16 min-h-[420px] flex items-center overflow-hidden">
            {/* Resplandor de fondo según el color del tema activo */}
            <div
              className={`absolute w-72 h-72 rounded-full blur-[100px] -right-10 -top-10 transition-colors duration-500 ${paleta.glow}`}
            />

            <AnimatePresence mode="wait" custom={direccion}>
              <motion.div
                key={tema.titulo}
                custom={direccion}
                variants={variantes}
                initial="entra"
                animate="centro"
                exit="sale"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) siguiente();
                  else if (info.offset.x > 80) anterior();
                }}
                className="relative z-10 w-full flex flex-col md:flex-row items-center gap-10 cursor-grab active:cursor-grabbing"
              >
                {/* Ícono protagonista */}
                <div
                  className={`shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center text-6xl border-2 ${paleta.borde} ${paleta.fondo} ${paleta.texto}`}
                >
                  <tema.Icono />
                </div>

                {/* Texto */}
                <div className="text-center md:text-left">
                  <span
                    className={`text-xs font-bold tracking-widest uppercase ${paleta.texto}`}
                  >
                    {tema.nivel}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                    {tema.titulo}
                  </h3>
                  <p className="text-slate-300 max-w-md">{tema.descripcion}</p>

                  <button
                    className={`mt-8 px-8 py-3 rounded-xl font-semibold text-slate-950 transition-colors duration-300 ${paleta.boton}`}
                  >
                    Entrar
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots de navegación */}
          <div className="flex justify-center gap-3 mt-8">
            {temas.map((t, i) => (
              <button
                key={t.titulo}
                onClick={() => irA(i)}
                aria-label={`Ir a ${t.titulo}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === indice
                    ? `w-8 ${colores[t.color].boton}`
                    : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Aprendizaje;