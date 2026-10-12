import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaDivide,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { obtenerSesion, actualizarUsuarioActual } from "../utilidades/auth";

// ===== Datos de las operaciones =====
// Reutilizo los mismos colores y símbolos que ya usé en Aprendizaje.jsx
// para que se sienta parte del mismo sistema visual
const operaciones = [
  { id: "suma", Icono: FaPlus, nombre: "Sumas", simbolo: "+", color: "emerald" },
  { id: "resta", Icono: FaMinus, nombre: "Restas", simbolo: "−", color: "amber" },
  { id: "multiplicacion", Icono: FaTimes, nombre: "Multiplicaciones", simbolo: "×", color: "sky" },
  { id: "division", Icono: FaDivide, nombre: "Divisiones", simbolo: "÷", color: "violet" },
];

// ===== Datos de dificultad =====
// Cada dificultad define el rango de números, el tiempo por pregunta
// y los puntos que vale cada respuesta correcta
const dificultades = [
  { id: "facil", nombre: "Fácil", color: "emerald", rango: [1, 10], tiempo: 20, puntos: 10 },
  { id: "medio", nombre: "Medio", color: "amber", rango: [10, 30], tiempo: 15, puntos: 20 },
  { id: "extremo", nombre: "Extremo", color: "rose", rango: [30, 100], tiempo: 10, puntos: 30 },
];

// Texto de repaso que se muestra antes de jugar, según la operación elegida
const repasos = {
  suma: {
    titulo: "¿Qué es sumar?",
    texto:
      "Sumar es juntar cantidades para obtener un total. Si tienes 3 manzanas y te dan 2 más, ahora tienes 5 manzanas en total.",
    ejemplo: { a: 3, b: 2, resultado: 5 },
  },
  resta: {
    titulo: "¿Qué es restar?",
    texto:
      "Restar es quitar una cantidad de otra para saber cuánto queda. Si tienes 5 galletas y te comes 2, te quedan 3.",
    ejemplo: { a: 5, b: 2, resultado: 3 },
  },
  multiplicacion: {
    titulo: "¿Qué es multiplicar?",
    texto:
      "Multiplicar es sumar un mismo número varias veces de forma rápida. 3 × 4 es lo mismo que sumar 3 cuatro veces: 3+3+3+3 = 12.",
    ejemplo: { a: 3, b: 4, resultado: 12 },
  },
  division: {
    titulo: "¿Qué es dividir?",
    texto:
      "Dividir es repartir una cantidad en partes iguales. Si tienes 12 dulces y los repartes entre 4 amigos, cada uno recibe 3.",
    ejemplo: { a: 12, b: 4, resultado: 3 },
  },
};

const colores = {
  emerald: { texto: "text-emerald-400", fondo: "bg-emerald-400/10", borde: "border-emerald-400/30", boton: "bg-emerald-400 hover:bg-emerald-300" },
  amber: { texto: "text-amber-400", fondo: "bg-amber-400/10", borde: "border-amber-400/30", boton: "bg-amber-400 hover:bg-amber-300" },
  sky: { texto: "text-sky-400", fondo: "bg-sky-400/10", borde: "border-sky-400/30", boton: "bg-sky-400 hover:bg-sky-300" },
  violet: { texto: "text-violet-400", fondo: "bg-violet-400/10", borde: "border-violet-400/30", boton: "bg-violet-400 hover:bg-violet-300" },
  rose: { texto: "text-rose-400", fondo: "bg-rose-400/10", borde: "border-rose-400/30", boton: "bg-rose-400 hover:bg-rose-300" },
};

const TOTAL_PREGUNTAS = 10;

// Genera un número aleatorio entero entre min y max (incluidos)
function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera una pregunta según la operación y el rango de dificultad elegido.
// Cada operación tiene su propia lógica para que las preguntas tengan sentido
// (ej: en resta nunca debe dar negativo, en división siempre debe ser exacta)
function generarPregunta(operacionId, rango) {
  const [min, max] = rango;
  let a, b, resultado;

  if (operacionId === "suma") {
    a = numeroAleatorio(min, max);
    b = numeroAleatorio(min, max);
    resultado = a + b;
  }

  if (operacionId === "resta") {
    a = numeroAleatorio(min, max);
    b = numeroAleatorio(min, a); // b nunca mayor que a, así no da negativo
    resultado = a - b;
  }

  if (operacionId === "multiplicacion") {
    // Uso un multiplicador pequeño (2 a 12, como las tablas) para que
    // el resultado no se vuelva absurdamente grande en dificultad extrema
    a = numeroAleatorio(min, max);
    b = numeroAleatorio(2, 12);
    resultado = a * b;
  }

  if (operacionId === "division") {
    // Genero primero el divisor y el resultado, y a partir de ahí calculo
    // el dividendo, así la división siempre da un número exacto
    b = numeroAleatorio(2, 12);
    resultado = numeroAleatorio(min, max);
    a = b * resultado;
  }

  // Genero 3 opciones incorrectas cercanas al resultado real
  const opciones = new Set([resultado]);
  while (opciones.size < 4) {
    const variacion = numeroAleatorio(-5, 5) || 1; // evito que sea 0
    const opcionFalsa = resultado + variacion;
    if (opcionFalsa >= 0) opciones.add(opcionFalsa);
  }

  // Mezclo el orden para que la correcta no quede siempre en el mismo puesto
  const opcionesMezcladas = [...opciones].sort(() => Math.random() - 0.5);

  return { a, b, resultado, opciones: opcionesMezcladas };
}

function Juego() {
  const navigate = useNavigate();

  // "operacion" | "dificultad" | "repaso" | "jugando" | "resultado"
  const [paso, setPaso] = useState("operacion");
  const [operacionElegida, setOperacionElegida] = useState(null);
  const [dificultadElegida, setDificultadElegida] = useState(null);

  // Estado del juego en curso
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [numeroPregunta, setNumeroPregunta] = useState(1);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const intervaloRef = useRef(null);

  // Protejo la ruta: si no hay sesión, no debería estar jugando
  useEffect(() => {
    if (!obtenerSesion()) navigate("/login");
  }, [navigate]);

  //  Temporizador 
  // Cada vez que cambia la pregunta, reinicio el contador con el tiempo
  // que corresponde a la dificultad elegida
  useEffect(() => {
    if (paso !== "jugando") return;

    setTiempoRestante(dificultadElegida.tiempo);

    intervaloRef.current = setInterval(() => {
      setTiempoRestante((anterior) => {
        if (anterior <= 1) {
          clearInterval(intervaloRef.current);
          manejarRespuesta(null); // se acabó el tiempo = respuesta incorrecta
          return 0;
        }
        return anterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervaloRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroPregunta, paso]);

  const elegirOperacion = (op) => {
    setOperacionElegida(op);
    setPaso("dificultad");
  };

  const elegirDificultad = (dif) => {
    setDificultadElegida(dif);
    setPaso("repaso");
  };

  const comenzarJuego = () => {
    setPuntuacion(0);
    setRespuestasCorrectas(0);
    setNumeroPregunta(1);
    setPreguntaActual(generarPregunta(operacionElegida.id, dificultadElegida.rango));
    setRespuestaSeleccionada(null);
    setPaso("jugando");
  };

  const manejarRespuesta = (opcion) => {
    clearInterval(intervaloRef.current);
    setRespuestaSeleccionada(opcion);

    const esCorrecta = opcion === preguntaActual.resultado;
    if (esCorrecta) {
      setPuntuacion((prev) => prev + dificultadElegida.puntos);
      setRespuestasCorrectas((prev) => prev + 1);
    }

    setTimeout(() => {
      if (numeroPregunta >= TOTAL_PREGUNTAS) {
        finalizarJuego(esCorrecta ? puntuacion + dificultadElegida.puntos : puntuacion);
      } else {
        setNumeroPregunta((prev) => prev + 1);
        setPreguntaActual(generarPregunta(operacionElegida.id, dificultadElegida.rango));
        setRespuestaSeleccionada(null);
      }
    }, 1200);
  };

  const finalizarJuego = (puntosGanados) => {
    const sesion = obtenerSesion();
    const nuevosPuntos = sesion.puntos + puntosGanados;
    const nuevoNivel = Math.floor(nuevosPuntos / 100) + 1;

    actualizarUsuarioActual({ puntos: nuevosPuntos, nivel: nuevoNivel });
    setPaso("resultado");
  };

  //Render 
  return (
    <section className="min-h-screen bg-slate-950 text-white px-6 py-28">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/*  PASO 1: elegir operación  */}
          {paso === "operacion" && (
            <motion.div
              key="operacion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-center mb-2">
                ¿Qué quieres repasar?
              </h1>
              <p className="text-slate-400 text-center mb-10">
                Elige la operación con la que quieres practicar hoy.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {operaciones.map((op) => {
                  const paleta = colores[op.color];
                  return (
                    <button
                      key={op.id}
                      onClick={() => elegirOperacion(op)}
                      className={`flex items-center gap-4 rounded-3xl border ${paleta.borde} bg-white/5 p-6 hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 text-left`}
                    >
                      <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${paleta.fondo} ${paleta.texto}`}>
                        <op.Icono />
                      </div>
                      <h3 className="text-xl font-bold">{op.nombre}</h3>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/*  PASO 2: elegir dificultad */}
          {paso === "dificultad" && (
            <motion.div
              key="dificultad"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setPaso("operacion")}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <FaArrowLeft /> Cambiar operación
              </button>

              <h1 className="text-4xl font-bold text-center mb-2">
                Elige tu dificultad
              </h1>
              <p className="text-slate-400 text-center mb-10">
                Vas a repasar <strong>{operacionElegida.nombre.toLowerCase()}</strong>
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                {dificultades.map((dif) => {
                  const paleta = colores[dif.color];
                  return (
                    <button
                      key={dif.id}
                      onClick={() => elegirDificultad(dif)}
                      className={`rounded-3xl border ${paleta.borde} bg-white/5 p-6 hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 text-center`}
                    >
                      <h3 className={`text-xl font-bold mb-2 ${paleta.texto}`}>
                        {dif.nombre}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {dif.tiempo}s por pregunta · {dif.puntos} pts c/u
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* PASO 3: repaso */}
          {paso === "repaso" && (
            <motion.div
              key="repaso"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setPaso("dificultad")}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
              >
                <FaArrowLeft /> Cambiar dificultad
              </button>

              {(() => {
                const repaso = repasos[operacionElegida.id];
                const paleta = colores[operacionElegida.color];
                const { a, b, resultado } = repaso.ejemplo;

                return (
                  <div className={`rounded-3xl border ${paleta.borde} bg-white/5 p-10 text-center`}>
                    <h1 className="text-3xl font-bold mb-4">{repaso.titulo}</h1>
                    <p className="text-slate-300 max-w-lg mx-auto mb-8">
                      {repaso.texto}
                    </p>

                    {/* Ejemplo visual animado de la operación */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className={`inline-flex items-center gap-4 rounded-2xl ${paleta.fondo} px-8 py-5 text-4xl font-bold ${paleta.texto} mb-10`}
                    >
                      <span>{a}</span>
                      <span>{operacionElegida.simbolo}</span>
                      <span>{b}</span>
                      <span>=</span>
                      <span>{resultado}</span>
                    </motion.div>

                    <div>
                      <button
                        onClick={comenzarJuego}
                        className={`px-10 py-4 rounded-full font-bold text-lg text-slate-950 transition-all duration-300 ${paleta.boton}`}
                      >
                        ¡Estoy listo, comenzar!
                      </button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* PASO 4: el juego en sí  */}
          {paso === "jugando" && preguntaActual && (
            <motion.div
              key={`pregunta-${numeroPregunta}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Barra superior: progreso, puntos y tiempo */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-slate-400 font-semibold">
                  Pregunta {numeroPregunta} / {TOTAL_PREGUNTAS}
                </span>

                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <FaStar /> {puntuacion} pts
                </span>

                <span className="flex items-center gap-2 text-slate-300 font-semibold">
                  <FaClock />
                  {tiempoRestante}s
                </span>
              </div>

              {/* Barra de progreso del tiempo */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-10">
                <motion.div
                  animate={{ width: `${(tiempoRestante / dificultadElegida.tiempo) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                  className={`h-full ${colores[dificultadElegida.color].boton}`}
                />
              </div>

              {/* La pregunta */}
              <div className="text-center mb-12">
                <p className={`text-6xl font-bold ${colores[operacionElegida.color].texto}`}>
                  {preguntaActual.a} {operacionElegida.simbolo} {preguntaActual.b}
                </p>
              </div>

              {/* Opciones de respuesta */}
              <div className="grid sm:grid-cols-2 gap-5">
                {preguntaActual.opciones.map((opcion) => {
                  const esLaCorrecta = opcion === preguntaActual.resultado;
                  const fueSeleccionada = respuestaSeleccionada === opcion;
                  const yaRespondio = respuestaSeleccionada !== null;

                  // Defino el estilo del botón según el estado de la respuesta:
                  // sin responder / respondió bien / respondió mal / era otra opción
                  let estilo = "border-white/10 bg-white/5 hover:bg-white/10";
                  if (yaRespondio && esLaCorrecta) {
                    estilo = "border-emerald-400 bg-emerald-400/10";
                  } else if (yaRespondio && fueSeleccionada && !esLaCorrecta) {
                    estilo = "border-rose-400 bg-rose-400/10";
                  }

                  return (
                    <button
                      key={opcion}
                      disabled={yaRespondio}
                      onClick={() => manejarRespuesta(opcion)}
                      className={`flex items-center justify-between rounded-2xl border ${estilo} px-6 py-5 text-2xl font-bold transition-colors duration-300`}
                    >
                      {opcion}
                      {yaRespondio && esLaCorrecta && <FaCheckCircle className="text-emerald-400" />}
                      {yaRespondio && fueSeleccionada && !esLaCorrecta && <FaTimesCircle className="text-rose-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/*  PASO 5: resultado final */}
          {paso === "resultado" && (() => {
            // Defino la condición de aprobado: más de 6 correctas (osea 7 o más)
            const aprobo = respuestasCorrectas > 6;

            return (
              <motion.div
                key="resultado"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`text-center rounded-3xl border p-12 ${
                  aprobo
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-amber-400/30 bg-amber-400/10"
                }`}
              >
                {aprobo ? (
                  <>
                    <FaStar className="text-amber-400 text-6xl mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-2">¡Excelente trabajo!</h1>
                    <p className="text-slate-300 mb-2">
                      Respondiste {respuestasCorrectas} de {TOTAL_PREGUNTAS} preguntas correctamente.
                    </p>
                    <p className="text-slate-400 mb-8">
                      Dominaste {operacionElegida.nombre.toLowerCase()} en dificultad {dificultadElegida.nombre.toLowerCase()}.
                    </p>
                  </>
                ) : (
                  <>
                    <FaRedo className="text-amber-400 text-6xl mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-2">¡Casi lo logras!</h1>
                    <p className="text-slate-300 mb-2">
                      Respondiste {respuestasCorrectas} de {TOTAL_PREGUNTAS} preguntas correctamente.
                    </p>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      Necesitas al menos 7 respuestas correctas para superar el nivel.
                      Te recomendamos repasar {operacionElegida.nombre.toLowerCase()} de
                      nuevo antes de volver a intentarlo.
                    </p>
                  </>
                )}

                <p className="text-6xl font-bold mb-10" style={{ color: aprobo ? "#34d399" : "#fbbf24" }}>
                  +{puntuacion} pts
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {aprobo ? (
                    <button
                      onClick={() => setPaso("operacion")}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors duration-300"
                    >
                      <FaRedo /> Jugar de nuevo
                    </button>
                  ) : (
                    <button
                      onClick={() => setPaso("repaso")}
                      className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors duration-300"
                    >
                      <FaRedo /> Repasar de nuevo
                    </button>
                  )}

                  <button
                    onClick={() => navigate("/ranking")}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-amber-400/40 text-amber-400 font-semibold hover:bg-amber-400/10 transition-colors duration-300"
                  >
                    <FaTrophy /> Ver Ranking
                  </button>

                  <button
                    onClick={() => navigate("/perfil")}
                    className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors duration-300"
                  >
                    Volver al perfil
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Juego;