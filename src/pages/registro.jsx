import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import { registrarUsuario } from "../utilidades/auth";

const avatares = [
  { id: "avatar_1", emoji: "🦊" },
  { id: "avatar_2", emoji: "🐼" },
  { id: "avatar_3", emoji: "🐸" },
  { id: "avatar_4", emoji: "🦁" },
];

const grados = ["1° Primaria", "2° Primaria", "3° Primaria", "4° Primaria", "5° Primaria"];

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    contrasena: "",
    avatar: "avatar_1",
    grado: "",
  });
  const [error, setError] = useState("");

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setError("");

    if (!form.grado) {
      setError("Selecciona tu grado escolar.");
      return;
    }
    if (form.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      registrarUsuario(form);
      navigate("/perfil");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
          <p className="text-slate-400 mt-2">
            Únete a la aventura y empieza a aprender jugando.
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-6">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Nombre de usuario
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 transition-colors">
              <FaUser className="text-slate-500 shrink-0" />
              <input
                type="text"
                required
                value={form.nombre_usuario}
                onChange={(e) => actualizarCampo("nombre_usuario", e.target.value)}
                placeholder="ej. matigenio23"
                className="bg-transparent outline-none w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Correo</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 transition-colors">
              <FaEnvelope className="text-slate-500 shrink-0" />
              <input
                type="email"
                required
                value={form.correo}
                onChange={(e) => actualizarCampo("correo", e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="bg-transparent outline-none w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">Contraseña</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 transition-colors">
              <FaLock className="text-slate-500 shrink-0" />
              <input
                type="password"
                required
                minLength={6}
                value={form.contrasena}
                onChange={(e) => actualizarCampo("contrasena", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="bg-transparent outline-none w-full placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-3 block">
              Elige tu avatar
            </label>
            <div className="flex gap-3">
              {avatares.map((av) => (
                <button
                  type="button"
                  key={av.id}
                  onClick={() => actualizarCampo("avatar", av.id)}
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all duration-200 ${
                    form.avatar === av.id
                      ? "border-emerald-400 bg-emerald-400/10 scale-105"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  {av.emoji}
                  {form.avatar === av.id && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 text-xs">
                      <FaCheck />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-3 block">
              ¿En qué grado estás?
            </label>
            <div className="flex flex-wrap gap-2">
              {grados.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => actualizarCampo("grado", g)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    form.grado === g
                      ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors duration-300"
          >
            Registrarme
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Inicia sesión
          </a>
        </p>
      </motion.div>
    </section>
  );
}

export default Registro;