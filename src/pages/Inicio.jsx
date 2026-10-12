import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Nosotros from "../components/Nosotros";
import Aprendizaje from "../components/Aprendizaje";
import Footer from "../components/Footer";
import Caracteristicas from "../components/Caracteristicas";

function Inicio() {
  return (
    <>
      <Navbar />
      <Hero />
      <Caracteristicas />
      <Nosotros />
      <Aprendizaje />
      <Footer />
    </>
  );
}

export default Inicio;