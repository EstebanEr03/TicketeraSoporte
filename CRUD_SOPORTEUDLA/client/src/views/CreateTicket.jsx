import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTicket,
  fetchCategories,
  fetchSubcategories,
} from "../Controllers/ticketController";
import { getUsers } from '../Controllers/empleadoController';

const CreateTicket = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id; // Decodifica el token para obtener el ID del usuario
  const [ticket, setTicket] = useState({
    tipo_solicitud: "",
    categoria_id: null,
    subcategoria_id: null,
    estado: "Abierto",
    id_solicitante: userId, // Establece el ID del usuario autenticado
    ubicacion: "",
    id_gestor: "",
    prioridad: "Medio",
    urgencia: "Media",
    fecha_vencimiento: "",
    tiempo_estimado: "",
    asignado_a: "",
  });
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await fetchCategories();
        const userList = await getUsers();

        setCategories(categoryData);
        setUsers(userList); // Cargar gestores y agentes
      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      if (!ticket.tipo_solicitud || !ticket.id_solicitante || !ticket.prioridad || !ticket.urgencia) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }
  
      if (ticket.id_gestor === ticket.asignado_a) {
        alert("El gestor y el agente asignado no pueden ser la misma persona.");
        return;
      }
  
      console.log("Datos del ticket antes de enviar:", ticket); // <-- Verifica que 'asignado_a' sea correcto aquí
  
      await createTicket(ticket); // Llama a la función que envía el ticket
      alert("Ticket creado correctamente.");
      navigate("/gestor");
    } catch (err) {
      console.error("Error al crear el ticket:", err.response?.data || err.message);
      alert(`Error al crear el ticket: ${err.response?.data?.error || "Error desconocido"}`);
    }
  };
  
  

  
  

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Crear Nuevo Ticket</h3>
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
      .filter((user) => user.rol_id === 2)
      .map((gestor) => (
        <option key={gestor.id} value={gestor.id}>
          {gestor.nombre}
        </option>
      ))}
  </select>
</label>
<small style={{ color: "red" }}>
  {ticket.id_gestor === "" ? "Debe seleccionar un gestor para continuar." : ""}
</small>


<label>
  Agente Asignado:
  <select
    value={ticket.asignado_a || ""}
    onChange={(e) => {
      const asignadoId = parseInt(e.target.value, 10);
      console.log("Asignando agente con ID:", asignadoId); // <-- Verifica este log
      setTicket({ ...ticket, asignado_a: asignadoId });
    }}
  >
    <option value="">Seleccione un agente</option>
    {users
      .filter((user) => user.rol_id === 3) // Solo agentes
      .map((agente) => (
        <option key={agente.id} value={agente.id}>
          {agente.nombre}
        </option>
      ))}
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
          type="text"
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
      <button onClick={handleSave}>Crear Ticket</button>
      <button onClick={() => navigate("/gestor")}>Cancelar</button>
    </div>
  );
};

export default CreateTicket;