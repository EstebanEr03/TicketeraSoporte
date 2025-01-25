import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../Controllers/ticketController"; // Asegúrate de tener esta función en tu controlador

const SolicitanteView = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]); // Estado para tickets filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para los filtros
  const [filters, setFilters] = useState({
    tipo_solicitud: "",
    estado: "",
    prioridad: "",
    urgencia: "",
  });

  // Cargar los tickets creados por el solicitante al montar el componente
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets(); // Llama a la función para obtener tickets del solicitante
        setTickets(data);
        setFilteredTickets(data); // Inicialmente muestra todos los tickets
      } catch (err) {
        console.error("Error al obtener los tickets:", err.message);
        setError("No se pudieron cargar los tickets. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateRedirect = () => {
    navigate("/solicitar-ticket"); // Redirige al formulario de creación de tickets
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtrar los tickets basados en los filtros seleccionados
  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      return (
        (filters.tipo_solicitud === "" || ticket.tipo_solicitud === filters.tipo_solicitud) &&
        (filters.estado === "" || ticket.estado === filters.estado) &&
        (filters.prioridad === "" || ticket.prioridad === filters.prioridad) &&
        (filters.urgencia === "" || ticket.urgencia === filters.urgencia)
      );
    });
    setFilteredTickets(filtered);
  }, [filters, tickets]);

  if (loading) return <div>Cargando tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Mis Tickets Solicitados</h2>
      <button className="btn btn-primary" onClick={handleCreateRedirect}>
        Crear Nuevo Ticket
      </button>

      {/* Filtros para los tickets */}
      <div className="mt-3">
        <h4>Filtros</h4>
        <form className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Tipo de Solicitud:</label>
            <select
              name="tipo_solicitud"
              value={filters.tipo_solicitud}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="Incidentes">Incidentes</option>
              <option value="Cambios">Cambios</option>
              <option value="Problemas">Problemas</option>
              <option value="Solicitudes">Solicitudes</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Estado:</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Todos</option>
              <option value="En proceso">En proceso</option>
              <option value="En espera">En espera</option>
              <option value="Abierto">Abierto</option>
              <option value="Resuelto">Resuelto</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Prioridad:</label>
            <select
              name="prioridad"
              value={filters.prioridad}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Todas</option>
              <option value="Critico">Crítico</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo</option>
              <option value="Muy Bajo">Muy Bajo</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Urgencia:</label>
            <select
              name="urgencia"
              value={filters.urgencia}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
              <option value="Muy Baja">Muy Baja</option>
            </select>
          </div>
        </form>
      </div>

      {/* Mostrar tickets filtrados */}
      {filteredTickets.length === 0 ? (
        <p className="mt-4">No hay tickets disponibles para mostrar.</p>
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Solicitud</th>
              <th>Categoría</th>
              <th>Subcategoría</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Urgencia</th>
              <th>Solución</th> {/* Campo de la solución */}
              <th>Fecha de Solicitud</th>
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
                <td>{ticket.prioridad}</td>
                <td>{ticket.urgencia}</td>
                <td>{ticket.solucion || "Sin solución"}</td> {/* Mostrar solución o texto predeterminado */}
                <td>{new Date(ticket.hora_solicitud).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SolicitanteView;
