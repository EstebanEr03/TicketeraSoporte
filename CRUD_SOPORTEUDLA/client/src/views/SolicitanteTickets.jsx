import React, { useEffect, useState } from "react";
import { getMyTickets } from "../Controllers/ticketController"; // Asegúrate de tener esta función en el controlador
import { useNavigate } from "react-router-dom";

const SolicitanteTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets(); // Llama al backend para obtener los tickets
        setTickets(data);
      } catch (err) {
        console.error("Error al obtener los tickets:", err.message);
        setError("No se pudieron cargar los tickets. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = () => {
    navigate("/crear-ticket"); // Redirige a la vista de creación de tickets
  };

  if (loading) return <div>Cargando tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Mis Tickets Solicitados</h2>
      <button onClick={handleCreateTicket} style={{ marginBottom: "10px" }}>
        Crear Nuevo Ticket
      </button>
      {tickets.length === 0 ? (
        <p>No has solicitado ningún ticket aún.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Solicitud</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Estado</th>
              <th>Agente Asignado</th>
              <th>Prioridad</th>
              <th>Urgencia</th>
              <th>Fecha de Creación</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.tipo_solicitud}</td>
                <td>{ticket.categoria_rel?.nombre || "Sin categoría"}</td>
                <td>{ticket.subcategoria_rel?.nombre || "Sin subcategoría"}</td>
                <td>{ticket.estado}</td>
                <td>{ticket.agente?.nombre || "No asignado"}</td>
                <td>{ticket.prioridad}</td>
                <td>{ticket.urgencia}</td>
                <td>{new Date(ticket.hora_solicitud).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SolicitanteTickets;
