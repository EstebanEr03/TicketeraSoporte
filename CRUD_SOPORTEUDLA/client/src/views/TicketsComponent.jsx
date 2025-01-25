import React, { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../Controllers/ticketController';
import Swal from 'sweetalert2';

function TicketComponent() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    tipo_solicitud: '',
    categoria: '',
    subcategoria: '',
    estado: '',
    prioridad: '',
    urgencia: '',
    usuario_solicitud: '',
    ubicacion: '',
    gestor_proceso: '',
    tiempo_espera: '',
    tiempo_abierto: '',
    fecha_vencimiento: ''
  });
  const [editingTicket, setEditingTicket] = useState(null);

  // Cargar tickets al cargar el componente
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getTickets();
      setTickets(response);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los tickets', 'error');
    }
  };

  const handleCreate = async () => {
    try {
      await createTicket(newTicket);
      loadTickets(); // Refrescar lista de tickets
      setNewTicket({
        tipo_solicitud: '',
        categoria: '',
        subcategoria: '',
        estado: '',
        prioridad: '',
        urgencia: '',
        usuario_solicitud: '',
        ubicacion: '',
        gestor_proceso: '',
        tiempo_espera: '',
        tiempo_abierto: '',
        fecha_vencimiento: ''
      });
      Swal.fire('Éxito', 'Ticket creado correctamente', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo crear el ticket', 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTicket(editingTicket);
      loadTickets(); // Refrescar lista de tickets
      setEditingTicket(null);
      Swal.fire('Éxito', 'Ticket actualizado correctamente', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el ticket', 'error');
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      loadTickets(); // Refrescar lista de tickets
      Swal.fire('Eliminado', 'Ticket eliminado correctamente', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar el ticket', 'error');
    }
  };

  return (
    <div>
      <h2>Gestión de Tickets</h2>
      
      {/* Formulario de creación de ticket */}
      <div>
        <h3>Crear nuevo ticket</h3>
        <form>
          <select 
            value={newTicket.tipo_solicitud} 
            onChange={(e) => setNewTicket({ ...newTicket, tipo_solicitud: e.target.value })}
          >
            <option value="">Tipo de Solicitud</option>
            <option value="Todos">Todos</option>
            <option value="Incidentes">Incidentes</option>
            <option value="Cambios">Cambios</option>
            <option value="Problemas">Problemas</option>
            <option value="Solicitudes">Solicitudes</option>
          </select>

          <select 
            value={newTicket.categoria} 
            onChange={(e) => setNewTicket({ ...newTicket, categoria: e.target.value })}
          >
            <option value="">Categoría</option>
            <option value="Eventos">Eventos</option>
            <option value="Equipos">Equipos</option>
          </select>

          <select 
            value={newTicket.subcategoria} 
            onChange={(e) => setNewTicket({ ...newTicket, subcategoria: e.target.value })}
          >
            <option value="">Subcategoría</option>
            <option value="Prestamo de activos">Préstamo de activos</option>
            <option value="Formateo">Formateo</option>
            <option value="Soporte en sitio">Soporte en sitio</option>
          </select>

          <select 
            value={newTicket.estado} 
            onChange={(e) => setNewTicket({ ...newTicket, estado: e.target.value })}
          >
            <option value="">Estado</option>
            <option value="En proceso">En proceso</option>
            <option value="En espera">En espera</option>
            <option value="Abierto">Abierto</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>

          <select 
            value={newTicket.prioridad} 
            onChange={(e) => setNewTicket({ ...newTicket, prioridad: e.target.value })}
          >
            <option value="">Prioridad</option>
            <option value="Critico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
            <option value="Muy Bajo">Muy Bajo</option>
          </select>

          <select 
            value={newTicket.urgencia} 
            onChange={(e) => setNewTicket({ ...newTicket, urgencia: e.target.value })}
          >
            <option value="">Urgencia</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            <option value="Muy Baja">Muy Baja</option>
          </select>

          <input 
            type="text" 
            placeholder="Usuario Solicitud" 
            value={newTicket.usuario_solicitud} 
            onChange={(e) => setNewTicket({ ...newTicket, usuario_solicitud: e.target.value })}
          />

          <input 
            type="text" 
            placeholder="Ubicación" 
            value={newTicket.ubicacion} 
            onChange={(e) => setNewTicket({ ...newTicket, ubicacion: e.target.value })}
          />

          <input 
            type="text" 
            placeholder="Gestor del Proceso" 
            value={newTicket.gestor_proceso} 
            onChange={(e) => setNewTicket({ ...newTicket, gestor_proceso: e.target.value })}
          />

          <input 
            type="number" 
            placeholder="Tiempo de espera" 
            value={newTicket.tiempo_espera} 
            onChange={(e) => setNewTicket({ ...newTicket, tiempo_espera: e.target.value })}
          />

          <input 
            type="number" 
            placeholder="Tiempo abierto" 
            value={newTicket.tiempo_abierto} 
            onChange={(e) => setNewTicket({ ...newTicket, tiempo_abierto: e.target.value })}
          />

          <input 
            type="date" 
            placeholder="Fecha de Vencimiento" 
            value={newTicket.fecha_vencimiento} 
            onChange={(e) => setNewTicket({ ...newTicket, fecha_vencimiento: e.target.value })}
          />

          <button type="button" onClick={handleCreate}>Crear Ticket</button>
        </form>
      </div>

      {/* Listado de tickets */}
      <div>
        <h3>Lista de Tickets</h3>
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <p>{ticket.tipo_solicitud} - {ticket.categoria} - {ticket.estado}</p>
              <button onClick={() => setEditingTicket(ticket)}>Editar</button>
              <button onClick={() => handleDelete(ticket.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edición de tickets */}
      {editingTicket && (
        <div>
          <h3>Editar ticket</h3>
          <form>
            {/* Aquí asegúrate de que los campos sean los mismos que en el formulario de creación */}
            <select 
              value={editingTicket.tipo_solicitud} 
              onChange={(e) => setEditingTicket({ ...editingTicket, tipo_solicitud: e.target.value })}
            >
              <option value="">Tipo de Solicitud</option>
              <option value="Todos">Todos</option>
              <option value="Incidentes">Incidentes</option>
              <option value="Cambios">Cambios</option>
              <option value="Problemas">Problemas</option>
              <option value="Solicitudes">Solicitudes</option>
            </select>

            {/* Repite los demás campos para la edición */}
            <button type="button" onClick={handleUpdate}>Actualizar Ticket</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TicketComponent;
