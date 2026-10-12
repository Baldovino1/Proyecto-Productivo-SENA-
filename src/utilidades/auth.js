const CLAVE_USUARIOS = "matplay_usuarios";
const CLAVE_SESION = "matplay_sesion";

function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS);
  return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// ===== Usuarios "bot" para que el ranking no se vea vacío en la demo =====
// Esto es solo para que el proyecto se vea con actividad real durante
// la sustentación, no es nada que vaya a ir a producción.

const CLAVE_BOTS_CREADOS = "matplay_bots_creados";

const botsDePrueba = [
  { nombre_usuario: "ValeM_23", correo: "bot1@matplay.com", avatar: "avatar_2", grado: "3° Primaria", puntos: 480 },
  { nombre_usuario: "Santi_Pro", correo: "bot2@matplay.com", avatar: "avatar_4", grado: "5° Primaria", puntos: 650 },
  { nombre_usuario: "Camilo10", correo: "bot3@matplay.com", avatar: "avatar_1", grado: "4° Primaria", puntos: 210 },
];

// Crea los usuarios bot una sola vez.
export function crearUsuariosBot() {
  const yaSeCrearon = localStorage.getItem(CLAVE_BOTS_CREADOS);
  if (yaSeCrearon) return;

  const usuarios = obtenerUsuarios();

  const nuevosBots = botsDePrueba.map((bot, index) => ({
    id: `bot_${index}`,
    nombre_usuario: bot.nombre_usuario,
    correo: bot.correo,
    contrasena: "no_aplica", 
    avatar: bot.avatar,
    grado: bot.grado,
    puntos: bot.puntos,
    nivel: Math.floor(bot.puntos / 100) + 1,
  }));

  guardarUsuarios([...usuarios, ...nuevosBots]);
  localStorage.setItem(CLAVE_BOTS_CREADOS, "true");
}

export function registrarUsuario({ nombre_usuario, correo, contrasena, avatar, grado }) {
  const usuarios = obtenerUsuarios();
  const correoNormalizado = correo.trim().toLowerCase();

  if (usuarios.some((u) => u.correo === correoNormalizado)) {
    throw new Error("Ese correo ya está registrado.");
  }
  if (usuarios.some((u) => u.nombre_usuario === nombre_usuario)) {
    throw new Error("Ese nombre de usuario ya existe.");
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre_usuario,
    correo: correoNormalizado,
    contrasena, 
    avatar,
    grado,
    puntos: 0,
    nivel: 1,
  };

  guardarUsuarios([...usuarios, nuevoUsuario]);
  iniciarSesion(nuevoUsuario);
  return nuevoUsuario;
}

export function iniciarSesionConCredenciales(correo, contrasena) {
  const usuarios = obtenerUsuarios();
  const correoNormalizado = correo.trim().toLowerCase();
  const usuario = usuarios.find((u) => u.correo === correoNormalizado);

  if (!usuario || usuario.contrasena !== contrasena) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  iniciarSesion(usuario);
  return usuario;
}

function iniciarSesion(usuario) {
  const { contrasena, ...usuarioSinContrasena } = usuario;
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioSinContrasena));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

export function obtenerSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

export function actualizarUsuarioActual(cambios) {
  const sesion = obtenerSesion();
  if (!sesion) return null;

  const usuarios = obtenerUsuarios();
  const usuariosActualizados = usuarios.map((u) =>
    u.id === sesion.id ? { ...u, ...cambios } : u
  );
  guardarUsuarios(usuariosActualizados);

  const usuarioActualizado = usuariosActualizados.find((u) => u.id === sesion.id);
  iniciarSesion(usuarioActualizado);
  return usuarioActualizado;
}
// Devuelve la lista de todos los usuarios registrados, ordenados de mayor
// a menor puntaje.
export function obtenerTodosLosUsuarios() {
  const usuarios = obtenerUsuarios();

  return usuarios
    .map(({ contrasena, ...resto }) => resto)
    .sort((a, b) => b.puntos - a.puntos);
}