import { useState } from 'react';
import { motion } from 'framer-motion';

// Componentes internos básicos
const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 rounded border ${className}`}
  />
);

const Button = ({ children, onClick, className, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`p-2 rounded ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`p-4 bg-white shadow-md rounded flex flex-col justify-between ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const Modal = ({ visible, onClose, children }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 float-right">Cerrar</button>
        <div>{children}</div>
      </div>
    </div>
  );
};

const BibliotecaVirtual = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const buscarLibros = async (e) => {
    e.preventDefault();
    if (!terminoBusqueda.trim()) return;

    setCargando(true);
    try {
      const respuesta = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(terminoBusqueda)}`);
      const datos = await respuesta.json();
      const librosEnEspanol = datos.docs.filter(libro => libro.language && libro.language.includes('spa'));
      setLibros(librosEnEspanol);
    } catch (error) {
      console.error('Error al buscar libros:', error);
    }
    setCargando(false);
  };

  const verDetallesLibro = async (libro) => {
    try {
      const respuesta = await fetch(`https://openlibrary.org${libro.key}.json`);
      const detalles = await respuesta.json();
      const descripcion = typeof detalles.description === 'string' ? detalles.description : detalles.description?.value || 'No disponible';
      
      setLibroSeleccionado({
        ...libro,
        descripcion
      });
      setModalVisible(true);
    } catch (error) {
      console.error('Error al obtener detalles del libro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl font-bold mb-8 text-center text-amber-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          BookHub
        </motion.h1>
        <motion.form
          onSubmit={buscarLibros}
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex gap-2 bg-white rounded-full shadow-lg p-2">
            <Input
              type="text"
              placeholder="Introduce el libro que decee"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="flex-grow border-none focus:outline-none"
            />
            <Button type="submit" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
              Buscar
            </Button>
          </div>
        </motion.form>

        {cargando ? (
          <motion.div className="flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {libros.map((libro) => (
              <Card key={libro.key} className="flex flex-col justify-between h-full">
                <div className="flex justify-center mb-4">
                  <img
                    src={`https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`}
                    alt={`Portada de ${libro.title}`}
                    width={120}
                    height={180}
                    className="object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="text-center mb-4">
                  <CardTitle className="text-amber-800">{libro.title}</CardTitle>
                  <CardDescription>{libro.author_name ? libro.author_name.join(', ') : 'Autor Desconocido'}</CardDescription>
                </div>
                <Button onClick={() => verDetallesLibro(libro)} className="bg-amber-500 hover:bg-amber-600 text-white mt-auto">
                  Ver Detalles
                </Button>
              </Card>
            ))}
          </motion.div>
        )}

        <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
          {libroSeleccionado && (
            <>
              <h2 className="text-2xl font-bold text-amber-800 mb-4">{libroSeleccionado.title}</h2>
              <p><strong>Autor:</strong> {libroSeleccionado.author_name ? libroSeleccionado.author_name.join(', ') : 'Desconocido'}</p>
              <p><strong>Idioma:</strong> {libroSeleccionado.language ? (libroSeleccionado.language.includes('spa') ? 'Español' : 'Otro') : 'Desconocido'}</p>
              <p><strong>Año de publicación:</strong> {libroSeleccionado.first_publish_year || 'Desconocido'}</p>
              <p><strong>Descripción:</strong> {libroSeleccionado.descripcion || 'No disponible en español'}</p>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BibliotecaVirtual;
