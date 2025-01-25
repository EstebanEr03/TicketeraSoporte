import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getTickets, deleteTicket, ReasignarTicket, getOverdueTickets } from "../Controllers/ticketController";
import { jwtDecode } from "jwt-decode";
import "./CSS/GestorView.css";

const GestorView = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [overdueTickets, setOverdueTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [filters, setFilters] = useState({
    tipo_solicitud: "",
    estado: "",
    prioridad: "",
    urgencia: "",
  });

  // Obtener el rol del usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.is_admin);
    }
  }, []);
  useEffect(() => {
    console.log("Estado de showPopup cambiado:", showPopup);
  }, [showPopup]);
  // Cargar los tickets al inicio
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
        setFilteredTickets(data);
      } catch (err) {
        console.error("Error al obtener los tickets:", err.message);
        setError("No se pudieron cargar los tickets. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Obtener tickets vencidos
  const fetchOverdueTickets = async () => {
    try {
      const data = await getOverdueTickets();
      console.log("Tickets vencidos recibidos en el frontend:", data);
  
      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista válida de tickets.");
      }
  
      setOverdueTickets(data);
      console.log("Mostrando el modal...");
      setShowPopup(true); // Aquí se activa el modal
    } catch (error) {
      console.error("Error al obtener tickets vencidos:", error);
      alert("Error al obtener tickets vencidos.");
      setOverdueTickets([]);
    }
  };
  
  
  
  
  
  useEffect(() => {
    console.log("Estado de showPopup cambiado:", showPopup);
  }, [showPopup]);
  
  // Reasignar tickets seleccionados
  const handleReassignTickets = async () => {
    if (selectedTickets.length === 0) {
      alert("Selecciona al menos un ticket para reasignar.");
      return;
    }

    try {
      await ReasignarTicket(selectedTickets);
      alert("Tickets reasignados exitosamente.");
      setShowPopup(false);
      setSelectedTickets([]);
      const updatedTickets = await getTickets();
      setTickets(updatedTickets);
      setFilteredTickets(updatedTickets);
    } catch (error) {
      console.error("Error al reasignar tickets:", error);
      alert("Error al reasignar tickets.");
    }
  };

  // Seleccionar o deseleccionar tickets en el popup
  const handleSelectTicket = (ticketId) => {
    setSelectedTickets((prevSelected) =>
      prevSelected.includes(ticketId) ? prevSelected.filter((id) => id !== ticketId) : [...prevSelected, ticketId]
    );
  };

  // Filtrar tickets en tiempo real
  useEffect(() => {
    const filtered = tickets.filter(
      (ticket) =>
        (filters.tipo_solicitud === "" || ticket.tipo_solicitud === filters.tipo_solicitud) &&
        (filters.estado === "" || ticket.estado === filters.estado) &&
        (filters.prioridad === "" || ticket.prioridad === filters.prioridad) &&
        (filters.urgencia === "" || ticket.urgencia === filters.urgencia)
    );
    setFilteredTickets(filtered);
  }, [filters, tickets]);

  if (loading) return <div>Cargando tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Gestión de Tickets</h2>
      <button onClick={() => navigate("/crear-ticket")}>Crear Nuevo Ticket</button>
      <button onClick={() => navigate("/automatic-ticket")} style={{ marginLeft: "10px" }}>
        Automatic Ticket
      </button>
      <button onClick={fetchOverdueTickets} style={{ marginLeft: "10px" }}>
        Reasignar Tickets Vencidos
      </button>

      {isAdmin && (
        <button onClick={() => navigate("/crud-component")} style={{ marginLeft: "10px", backgroundColor: "green", color: "white" }}>
          Administrar Usuarios
        </button>
      )}
      <button onClick={() => navigate("/reportes")} style={{ marginLeft: "10px", backgroundColor: "blue", color: "white" }}>
        Ver Reportes
      </button>


      
      <div className={`modal-overlay ${showPopup ? "show" : ""}`}>
  <div className={`modal ${showPopup ? "show" : ""}`}>
    <h3>Selecciona los tickets vencidos para reasignar</h3>

    {overdueTickets.length === 0 ? (
      <p>No hay tickets vencidos disponibles.</p>
    ) : (
      <ul>
        {overdueTickets.map((ticket) => (
          <li key={ticket.id}>
            <input
              type="checkbox"
              checked={selectedTickets.includes(ticket.id)}
              onChange={() => handleSelectTicket(ticket.id)}
            />
            {` Ticket ID: ${ticket.id} - Estado: ${ticket.estado} - Prioridad: ${ticket.prioridad}`}
          </li>
        ))}
      </ul>
    )}

    <div className="modal-buttons">
      <button className="btn-reasignar" onClick={handleReassignTickets}>Reasignar Seleccionados</button>
      <button className="btn-cancelar" onClick={() => setShowPopup(false)}>Cancelar</button>
    </div>
  </div>
</div>






      <div>
        <h3>Filtros</h3>
        <form>
          <label>
            Tipo de Solicitud:
            <select name="tipo_solicitud" value={filters.tipo_solicitud} onChange={(e) => setFilters({ ...filters, tipo_solicitud: e.target.value })}>
              <option value="">Todos</option>
              <option value="Incidentes">Incidentes</option>
              <option value="Cambios">Cambios</option>
              <option value="Problemas">Problemas</option>
              <option value="Solicitudes">Solicitudes</option>
            </select>
          </label>
        </form>
      </div>

      {filteredTickets.length === 0 ? (
        <p>No hay tickets disponibles para mostrar.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Solicitud</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Estado</th>
              <th>Solicitante</th>
              <th>Gestor</th>
              <th>Prioridad</th>
              <th>Urgencia</th>
              <th>Ubicación</th>
              <th>Fecha de Solicitud</th>
              <th>Fecha de Vencimiento</th>
              <th>Agente Asignado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.tipo_solicitud}</td>
                <td>{ticket.categoria_rel?.nombre || "Sin categoría"}</td>
                <td>{ticket.subcategoria_rel?.nombre || "Sin subcategoría"}</td>
                <td>{ticket.estado}</td>
                <td>{ticket.solicitante?.nombre || "Sin solicitante"}</td>
                <td>{ticket.gestor?.nombre || "Sin gestor"}</td>
                <td>{ticket.prioridad}</td>
                <td>{ticket.urgencia}</td>
                <td>{ticket.ubicacion || "Sin ubicación"}</td>
                <td>{new Date(ticket.hora_solicitud).toLocaleDateString()}</td>
                <td>{ticket.fecha_vencimiento || "Sin fecha"}</td>
                <td>{ticket.agente?.nombre || "Sin agente asignado"}</td>
                <td>
                  <button onClick={() => navigate(`/gestor/edit/${ticket.id}`)}>Editar</button>
                  <button onClick={() => deleteTicket(ticket.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GestorView;
