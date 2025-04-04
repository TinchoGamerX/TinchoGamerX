import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import './styles.css';

const iconosCategorias = {
  "Objetos": "\u{1F9F0}",
  "Recursos": "\u{1F4E6}",
  "Trucos": "\u{1F9EA}",
  "Guías": "\u{1F4DA}"
};

const imagenesFondo = [
  "FERIA.jpg", "FONDO 5.png", "GIRL LDOE.jpg", "GUERRERO LDOE.jpg",
  "HOJA DE RUTA 2025.png", "HOJA DE RUTA.jpg", "OBS 2.jpg", "OBS 3.jpg",
  "OBS 4.jpg", "OBS 5.png", "OBS 6.jpg", "OBS 8.jpg", "OBS 9.jpg", "WALLPAPER LDOE 2.png"
];

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

  useEffect(() => {
    const imagenAleatoria = imagenesFondo[Math.floor(Math.random() * imagenesFondo.length)];
    // Cambiar la ruta de la imagen aquí para usar la correcta
    document.documentElement.style.setProperty('--background-image', `url('/${imagenAleatoria}')`);
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

  return (
    <div className="contenedor-principal">
      <h1 className="titulo">Buscador de Recursos y Trucos</h1>

      <div className="busqueda">
        <input
          type="text"
          placeholder="Buscar recurso o truco..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button onClick={manejarBusqueda}>Buscar</button>
      </div>

      <div className="respuestas">
        <h2>Resultados:</h2>

        {resultados.length > 0 ? (
          <ul>
            {resultados.map(recurso => (
              <li key={recurso.id} className="respuesta-item">
                {recurso.Imagen && (
                  <img src={`/${recurso.Imagen}`} alt={recurso.Nombre} className="imagen-recurso" />
                )}
                <div className="texto-recurso">
                  <p className="nombre-recurso">{recurso.Nombre}</p>
                  <p className="descripcion-recurso">{recurso.Descripcion}</p>

                  {/* Verifica y convierte la URL a formato "embed" si es necesario */}
                  {recurso.Video && (
                    <div className="video-container">
                      <iframe
                        src={recurso.Video.includes('youtu.be') ? recurso.Video.replace('youtu.be', 'youtube.com/embed') : recurso.Video}
                        title={`Video de ${recurso.Nombre}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}

export default App;
