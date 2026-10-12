import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { iniciarSesionConCredenciales } from "../utilidades/auth";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    setError("");

    try {
      iniciarSesionConCredenciales(correo, contrasena);
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
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Bienvenido de nuevo</h1>
          <p className="text-slate-400 mt-2">
            Continúa tu aventura matemática.
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-6">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Correo</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-400/50 transition-colors">
              <FaEnvelope className="text-slate-500 shrink-0" />
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
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
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Tu contraseña"
                className="bg-transparent outline-none w-full placeholder:text-slate-600"
              />
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
            Entrar
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-emerald-400 hover:underline">
            Regístrate
          </a>
        </p>
      </motion.div>
    </section>
  );
}

export default Login;