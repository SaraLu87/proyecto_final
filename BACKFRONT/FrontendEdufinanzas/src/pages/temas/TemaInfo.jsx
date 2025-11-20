// 📌 src/pages/temas/TemaInfo.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { useProgreso } from "../../context/ProgresoContext";
import api from "../../services/api";

import TarjetaInfo from "./components/TarjetaInfo";

const TemaInfo = () => {
  const { id } = useParams();
  const { actualizarProgreso } = useProgreso();

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    actualizarProgreso(parseInt(id), "info");

    const loadInfo = async () => {
      try {
        // ⚠️ CAMBIAR CUANDO TENGAS ENDPOINT REAL:
        const res = await api.get("/retos/");

        const descripcion = res.data.find(
          (item) =>
            item.id_tema === parseInt(id) &&
            item.tipo_pregunta === "descripcion"
        );

        setInfo(descripcion || null);
      } catch (e) {
        console.error("Error cargando información:", e);
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, [id]);

  return (
    <>
      <Header />

      <div className="contenido-tema">
        <h1 className="titulo-seccion">Lo que debes saber</h1>

        {loading && <p>Cargando información...</p>}

        {!loading && !info && (
          <p>No hay información registrada para este tema.</p>
        )}

        {!loading && info && (
          <TarjetaInfo
            titulo={info.nombre_reto}
            descripcion={info.descripcion}
          />
        )}
      </div>

      <Footer />
    </>
  );
};

export default TemaInfo;
