import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchSubcategories, createAutomaticTicket } from '../Controllers/ticketController';

const SolicitarTicket = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [ticketData, setTicketData] = useState({
    tipo_solicitud: 'Todos',
    categoria_id: '',
    subcategoria_id: '',
    ubicacion: '',
    prioridad: 'Medio',
    urgencia: 'Media',
    fecha_vencimiento: '',
  });

  useEffect(() => {
    // Cargar las categorías al montar el componente
    const fetchCategorias = async () => {
      try {
        const categories = await fetchCategories();
        setCategorias(categories);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoriaChange = async (e) => {
    const categoriaId = e.target.value;
    setTicketData({ ...ticketData, categoria_id: categoriaId });

    try {
      const subcategories = await fetchSubcategories(categoriaId);
      setSubcategorias(subcategories);
    } catch (error) {
      console.error('Error al obtener las subcategorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newTicket = await createAutomaticTicket(ticketData);
      alert('Solicitud de ticket enviada exitosamente.');
      console.log('Ticket solicitado:', newTicket);

      // Resetear el formulario
      setTicketData({
        tipo_solicitud: 'Todos',
        categoria_id: '',
        subcategoria_id: '',
        ubicacion: '',
        prioridad: 'Medio',
        urgencia: 'Media',
        fecha_vencimiento: '',
      });
    } catch (error) {
      console.error('Error al solicitar el ticket:', error);
      alert('Hubo un error al solicitar el ticket.');
    }
  };

  return (
    <div>
      <h2>Solicitar Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo de Solicitud:</label>
          <select name="tipo_solicitud" value={ticketData.tipo_solicitud} onChange={handleChange}>
            <option value="Todos">Todos</option>
            <option value="Incidentes">Incidentes</option>
            <option value="Cambios">Cambios</option>
            <option value="Problemas">Problemas</option>
            <option value="Solicitudes">Solicitudes</option>
          </select>
        </div>

        <div>
          <label>Categoría:</label>
          <select name="categoria_id" value={ticketData.categoria_id} onChange={handleCategoriaChange}>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Subcategoría:</label>
          <select name="subcategoria_id" value={ticketData.subcategoria_id} onChange={handleChange}>
            <option value="">Seleccione una subcategoría</option>
            {subcategorias.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={ticketData.ubicacion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Prioridad:</label>
          <select name="prioridad" value={ticketData.prioridad} onChange={handleChange}>
            <option value="Critico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
            <option value="Muy Bajo">Muy Bajo</option>
          </select>
        </div>

        <div>
          <label>Urgencia:</label>
          <select name="urgencia" value={ticketData.urgencia} onChange={handleChange}>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            <option value="Muy Baja">Muy Baja</option>
          </select>
        </div>

        <div>
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            name="fecha_vencimiento"
            value={ticketData.fecha_vencimiento}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Solicitar Ticket</button>
      </form>
    </div>
  );
};

export default SolicitarTicket;
