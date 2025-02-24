import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import './styles.css';

// Definir iconos para cada categoría
const iconosCategorias = {
  "Objetos": "\u{1F9F0}", // 🧰
  "Recursos": "\u{1F4E6}", // 📦
  "Trucos": "\u{1F9EA}", // 🧪
  "Guías": "\u{1F4DA}"  // 📚
};

function App() {
  const [recursos, setRecursos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const obtenerRecursos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Recursos"));
        const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Datos obtenidos de Firebase:", datos);
        setRecursos(datos);
      } catch (error) {
        console.error("Error obteniendo los datos:", error);
      }
    };

    obtenerRecursos();
  }, []);

  const manejarBusqueda = () => {
    if (!busqueda.trim()) {
      setResultados([]);
      return;
    }

    const textoBusqueda = busqueda.toLowerCase();

    const filtrados = recursos.filter(recurso => {
      const nombreRecurso = recurso.Nombre?.toLowerCase() || "";
      return nombreRecurso.includes(textoBusqueda) || 
             nombreRecurso.includes(textoBusqueda.replace(/s$/, "")) || 
             nombreRecurso.includes(textoBusqueda + "s");
    });

    setResultados(filtrados);
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
            {resultados.map(recurso => (
              <li key={recurso.id} className="border-b border-gray-700 py-4 flex items-center space-x-4 respuesta-item">
                {recurso.Imagen && (
                  <img src={recurso.Imagen} alt={recurso.Nombre} className="w-16 h-16 object-cover rounded-lg" />
                )}
                <div>
                  <p className="text-lg font-semibold">{recurso.Nombre}</p>
                  <p className="text-gray-400">{recurso.Descripcion}</p>
                  {recurso.Categoria && (
                    <p className="text-yellow-400 font-bold">{iconosCategorias[recurso.Categoria] || ""} {recurso.Categoria}</p>
                  )}
                  {recurso.Video && (
                    <a
                      href={recurso.Video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline"
                    >
                      Video relacionado para apoyar el canal
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No se encontraron resultados.</p>
        )}
      </div>
      
      {/* Footer con la leyenda */}
      <footer className="mt-6 text-gray-300 text-sm">
        Desarrollado por <span className="font-bold">Tincho Gamer X</span>
      </footer>
    </div>
  );
}

export default App;
