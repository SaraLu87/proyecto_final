// src/pages/temas/TemaLayout.jsx
// Vista principal del tema.
// Muestra nombre + descripción desde BD,
// y los 3 accesos: Info, Datos, Preguntas.

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CirculoReto from "./components/CirculoReto";

import api from "../../services/api"; // ← conexión al backend
import "./temas.css";

const TemaLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tema, setTema] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // Cargar tema desde BD
  // ----------------------------------------------------
  useEffect(() => {
    const fetchTema = async () => {
      try {
        // CAMBIAR cuando tengas el endpoint real:
        // ejemplo → /temas/{id}/
        const res = await api.get(`/temas/${id}`);

        setTema(res.data); // BD devuelve: id_tema, nombre, descripcion, precio
      } catch (error) {
        console.error("Error al cargar tema:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTema();
  }, [id]);

  if (loading) {
    return <p className="cargando-texto">Cargando tema...</p>;
  }

  if (!tema) {
    return <p className="error-texto">No existe este tema.</p>;
  }

  return (
    <>
      <Header />

      <div className="contenedor-layout">

        <h1 className="titulo-tema">{tema.nombre}</h1>

        {/* DESCRIPCIÓN PRINCIPAL DEL TEMA (desde BD) */}
        <p className="tema-descripcion">
          {tema.descripcion}
        </p>

        {/* CÍRCULOS DE ACCESO */}
        <div className="contenedor-circulos">
          <CirculoReto
            titulo="Lo que debes saber"
            color="azul"
            onClick={() => navigate(`/tema/${id}/info`)}
          />

          <CirculoReto
            titulo="Datos curiosos"
            color="verde"
            onClick={() => navigate(`/tema/${id}/datos`)}
          />

          <CirculoReto
            titulo="Preguntas"
            color="morado"
            onClick={() => navigate(`/tema/${id}/preguntas`)}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TemaLayout;
