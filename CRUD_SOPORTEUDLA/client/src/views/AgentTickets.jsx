import React, { useEffect, useState } from 'react';
import { getAssignedTickets, updateTicketStatus } from '../Controllers/ticketController'; // Asegúrate de implementar estas funciones
const AgentTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const data = await getAssignedTickets(); // Llama al controlador en el backend
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
  
    const handleStatusChange = async (ticketId, newStatus, solucion) => {
        try {
          // Ajusta la llamada para enviar los datos correctamente
          await updateTicketStatus(ticketId, newStatus, solucion); // Pasa "estado" como string
          alert("Estado y solución del ticket actualizados exitosamente");
          const updatedTickets = await getAssignedTickets(); // Refrescar tickets
          setTickets(updatedTickets);
        } catch (err) {
          console.error("Error al cambiar el estado o solución del ticket:", err.message);
          alert("Error al cambiar el estado o solución del ticket.");
        }
      };
  
    if (loading) {
      return <div>Cargando tickets...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
      <div>
        <h2>Mis Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tienes tickets asignados actualmente.</p>
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
                <th>Prioridad</th>
                <th>Urgencia</th>
                <th>Solución</th>
                <th>Acciones</th>
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
                  <td>{ticket.solicitante?.nombre || "Sin solicitante"}</td>
                  <td>{ticket.prioridad}</td>
                  <td>{ticket.urgencia}</td>
                  <td>
                    <textarea
                      placeholder="Ingresa la solución..."
                      value={ticket.solucion || ""}
                      onChange={(e) => {
                        const solucion = e.target.value;
                        setTickets((prevTickets) =>
                          prevTickets.map((t) =>
                            t.id === ticket.id ? { ...t, solucion } : t
                          )
                        );
                      }}
                    ></textarea>
                  </td>
                  <td>
                  <select
                    value={ticket.estado}
                    onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value, ticket.solucion)
                    }
                    >
                    <option value="Abierto">Abierto</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Resuelto">Resuelto</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };
  
  export default AgentTickets;