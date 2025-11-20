// src/pages/temas/TemaDatos.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../services/api";
import TarjetaDato from "./components/TarjetaDato";

const TemaDatos = () => {
  const { id } = useParams();
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await api.get("/retos/");

        const filtrados = res.data.filter(
          (r) =>
            r.id_tema === parseInt(id) &&
            r.tipo_pregunta === "datos"
        );

        setDatos(filtrados);
      } catch (e) {
        console.error("Error cargando datos:", e);
      }
    };

    fetchDatos();
  }, [id]);

  return (
    <>
      <Header />

      <div className="contenido-tema">
        <h1 className="titulo-seccion">Datos curiosos</h1>

        <div className="lista-datos">
          {datos.map((d) => (
            <TarjetaDato key={d.id_reto} texto={d.descripcion} />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TemaDatos;
