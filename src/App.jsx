import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import './styles.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const iconosCategorias = {
  "Objetos": "\u{1F9F0}",
  "Recursos": "\u{1F4E6}",
  "Trucos": "\u{1F9EA}",
  "Guías": "\u{1F4DA}"
};

function App() {
  console.log("🚀 App.js se está ejecutando");

  const [recursos, setRecursos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    console.log("📥 Cargando recursos desde Firebase...");
    const obtenerRecursos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Recursos"));
        const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("✅ Recursos obtenidos:", datos);
        setRecursos(datos);
      } catch (error) {
        console.error("❌ Error obteniendo los datos:", error);
      }
    };
    obtenerRecursos();
  }, []);

  const manejarBusqueda = () => {
    console.log("🔍 Buscando:", busqueda);
    if (!busqueda.trim()) {
      setResultados([]);
      return;
    }
    const textoBusqueda = busqueda.toLowerCase();
    const filtrados = recursos.filter(recurso => recurso.Nombre?.toLowerCase().includes(textoBusqueda));
    console.log("🔎 Resultados encontrados:", filtrados);
    setResultados(filtrados);
  };

  const obtenerEmbedURL = (url) => {
    try {
      console.log("🎥 Procesando URL de video:", url);
      const urlObj = new URL(url);

      if (urlObj.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${urlObj.pathname.substring(1)}`;
      }

      if (urlObj.hostname.includes("youtube.com")) {
        if (urlObj.searchParams.has("v")) {
          return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
        }
        if (urlObj.pathname.includes("/shorts/")) {
          const videoId = urlObj.pathname.split("/shorts/")[1];
          console.log("🔗 URL Convertida:", `https://www.youtube.com/embed/${videoId}`);
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch (error) {
      console.error("❌ URL de video inválida:", url);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-red-500 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Buscador de Recursos y Trucos</h1>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Buscar recurso o truco..."
          className="px-4 py-2 rounded-lg text-black"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-700 transition"
          onClick={manejarBusqueda}
        >
          Buscar
        </button>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg respuestas">
        <h2 className="text-xl font-semibold mb-2">Resultados:</h2>

        {resultados.length > 0 ? (
          <ul>
            {resultados.map(recurso => {
              const videoURL = obtenerEmbedURL(recurso.Video);
              return (
                <li key={recurso.id} className="border-b border-gray-700 py-4 flex flex-col items-center space-y-4 respuesta-item">
                  {recurso.Imagen && (
                    <img src={recurso.Imagen} alt={recurso.Nombre} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div className="text-center">
                    <p className="text-lg font-semibold">{recurso.Nombre}</p>
                    <p className="text-gray-400">{recurso.Descripcion}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No se encontraron resultados.</p>
        )}
      </div>

      {/* 🔹 SWIPER - Carrusel de Videos 🔹 */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semib
