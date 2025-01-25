import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  updateTicket,
  fetchCategories,
  fetchSubcategories,
} from "../Controllers/ticketController";
import { getUsers } from "../Controllers/empleadoController";

const EditTicket = () => {
  const [users, setUsers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketData = await getTicketById(id);
        const categoryData = await fetchCategories();
        const subcategoryData = ticketData.categoria_id
          ? await fetchSubcategories(ticketData.categoria_id)
          : [];
        const userList = await getUsers(); // Obtén la lista de usuarios
        
        setTicket(ticketData);
        setCategories(categoryData);
        setSubcategories(subcategoryData);
        setUsers(userList); // Establece los usuarios en el estado
      } catch (err) {
        setError("Error al cargar los datos del ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCategoryChange = async (categoryId) => {
    setTicket({ ...ticket, categoria_id: categoryId, subcategoria_id: null });
    if (categoryId) {
      const subcategoryData = await fetchSubcategories(categoryId);
      setSubcategories(subcategoryData);
    } else {
      setSubcategories([]);
    }
  };

  const handleSave = async () => {
    try {
      const updatedTicket = {
        id: ticket.id,
        tipo_solicitud: ticket.tipo_solicitud,
        categoria_id: ticket.categoria_id ? parseInt(ticket.categoria_id, 10) : null,
        subcategoria_id: ticket.subcategoria_id ? parseInt(ticket.subcategoria_id, 10) : null,
        estado: ticket.estado,
        prioridad: ticket.prioridad,
        urgencia: ticket.urgencia,
        ubicacion: ticket.ubicacion,
        fecha_vencimiento: ticket.fecha_vencimiento,
        tiempo_estimado: ticket.tiempo_estimado ? parseInt(ticket.tiempo_estimado, 10) : null,
        id_gestor: ticket.id_gestor ? parseInt(ticket.id_gestor, 10) : null,
        asignado_a: ticket.asignado_a ? parseInt(ticket.asignado_a, 10) : null, // Asegúrate de que la coma esté aquí
      };
  
      await updateTicket(updatedTicket);
      alert("Ticket actualizado correctamente.");
      navigate("/gestor");
    } catch (err) {
      console.error("Error al actualizar el ticket:", err.response?.data || err.message);
      alert(`Error al actualizar el ticket: ${err.response?.data?.error || "Error desconocido"}`);
    }
  };
  

  if (loading) return <div>Cargando ticket...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Editar Ticket</h3>
      <label>
        Tipo de Solicitud:
        <select
          value={ticket.tipo_solicitud}
          onChange={(e) => setTicket({ ...ticket, tipo_solicitud: e.target.value })}
        >
          <option value="Todos">Todos</option>
          <option value="Incidentes">Incidentes</option>
          <option value="Cambios">Cambios</option>
          <option value="Problemas">Problemas</option>
          <option value="Solicitudes">Solicitudes</option>
        </select>
      </label>
      <label>
        Categoría:
        <select
          value={ticket.categoria_id || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Sin Categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Subcategoría:
        <select
          value={ticket.subcategoria_id || ""}
          onChange={(e) => setTicket({ ...ticket, subcategoria_id: e.target.value })}
          disabled={!ticket.categoria_id}
        >
          <option value="">Sin Subcategoría</option>
          {subcategories.map((subcat) => (
            <option key={subcat.id} value={subcat.id}>
              {subcat.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
  Gestor:
  <select
    value={ticket.id_gestor || ""}
    onChange={(e) => setTicket({ ...ticket, id_gestor: e.target.value })}
  >
    <option value="">Seleccione un gestor</option>
    {users
      .filter((user) => user.rol_id === 2) // Filtra por rol_id del gestor
      .map((gestor) => (
        <option key={gestor.id} value={gestor.id}>
          {gestor.nombre}
        </option>
      ))}
  </select>
</label>
<label>
  Agente Asignado:
  <select
    value={ticket.asignado_a || ""}
    onChange={(e) => setTicket({ ...ticket, asignado_a: e.target.value })}
  >
    <option value="">Seleccione un agente</option>
    {users
      .filter((user) => user.rol_id === 3) // Filtra por rol_id del agente
      .map((agente) => (
        <option key={agente.id} value={agente.id}>
          {agente.nombre}
        </option>
      ))}
  </select>
</label>
      <label>
        Estado:
        <select
          value={ticket.estado}
          onChange={(e) => setTicket({ ...ticket, estado: e.target.value })}
        >
          <option value="En proceso">En proceso</option>
          <option value="En espera">En espera</option>
          <option value="Abierto">Abierto</option>
          <option value="Resuelto">Resuelto</option>
          <option value="Cerrado">Cerrado</option>
        </select>
      </label>
      <label>
        Prioridad:
        <select
          value={ticket.prioridad}
          onChange={(e) => setTicket({ ...ticket, prioridad: e.target.value })}
        >
          <option value="Critico">Crítico</option>
          <option value="Alto">Alto</option>
          <option value="Medio">Medio</option>
          <option value="Bajo">Bajo</option>
          <option value="Muy Bajo">Muy Bajo</option>
        </select>
      </label>
      <label>
        Urgencia:
        <select
          value={ticket.urgencia}
          onChange={(e) => setTicket({ ...ticket, urgencia: e.target.value })}
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
          <option value="Muy Baja">Muy Baja</option>
        </select>
      </label>
      <label>
        Ubicación:
        <input
          value={ticket.ubicacion || ""}
          onChange={(e) => setTicket({ ...ticket, ubicacion: e.target.value })}
        />
      </label>
      <label>
        Fecha de Vencimiento:
        <input
          type="date"
          value={ticket.fecha_vencimiento || ""}
          onChange={(e) => setTicket({ ...ticket, fecha_vencimiento: e.target.value })}
        />
      </label>
      <label>
        Tiempo Estimado:
        <input
          type="number"
          value={ticket.tiempo_estimado || ""}
          onChange={(e) => setTicket({ ...ticket, tiempo_estimado: e.target.value })}
        />
      </label>
      <button onClick={handleSave}>Guardar Cambios</button>
      <button onClick={() => navigate("/gestor")}>Cancelar</button>
    </div>
  );
};

export default EditTicket;