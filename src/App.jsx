import { Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/login";
import Registro from "./pages/registro";
import Juego from "./pages/Juego";
import Perfil from "./pages/Perfil";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/juego" element={<Juego />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/ranking" element={<Ranking />} />
    </Routes>
  );
}

export default App;