// 📌 Página principal de preguntas gamificada

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PreguntaCard from "./components/PreguntaCard";

import api from "../../services/api";
import "./temas.css";

const TemaPreguntas = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------------
  // CARGAR PREGUNTAS DESDE BD
  // --------------------------------------------------------
  useEffect(() => {
    const loadPreguntas = async () => {
      try {
        // ⚠️ Cambiar por endpoint final cuando exista:
        const res = await api.get("/retos/");

        const filtradas = res.data.filter(
          (item) =>
            item.id_tema === parseInt(id) &&
            item.tipo_pregunta === "preguntas"
        );

        setPreguntas(filtradas);
      } catch (e) {
        console.error("Error cargando preguntas:", e);
      } finally {
        setLoading(false);
      }
    };

    loadPreguntas();
  }, [id]);

  const finalizar = () => {
    navigate(`/tema/${id}/completado`);
  };

  return (
    <>
      <Header />

      <div className="contenido-tema">
        <h1 className="titulo-seccion titulo-preguntas">
          Preguntas del Tema {id}
        </h1>

        {loading && <p>Cargando preguntas...</p>}

        {!loading && preguntas.length === 0 && (
          <p>No hay preguntas registradas para este tema.</p>
        )}

        {preguntas.map((preg) => (
          <PreguntaCard key={preg.id_reto} pregunta={preg} />
        ))}

        <button className="btn-finalizar" onClick={finalizar}>
          Finalizar Tema
        </button>
      </div>

      <Footer />
    </>
  );
};

export default TemaPreguntas;
