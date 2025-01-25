import React, { useState, useEffect } from 'react';
import { fetchTicketsReport } from "../Controllers/ticketController";
import { getUsers } from '../Controllers/empleadoController'; // Asegúrate de que esta función esté disponible

const ReportView = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estado, setEstado] = useState('');
  const [agenteId, setAgenteId] = useState(''); // Estado para el agente asignado
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  // Obtener usuarios (agentes) al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (err) {
        setError('Error al cargar la lista de agentes.');
      }
    };

    fetchUsers();
  }, []);

  const handleFetchReport = async () => {
    try {
      setError('');
      const data = await fetchTicketsReport(startDate, endDate, estado, agenteId); // Incluye agenteId en la solicitud
      setReportData(data);
    } catch (err) {
      setError(err.error || 'Error al obtener el reporte');
    }
  };

  return (
    <div className="report-view">
      <h1>Reporte de Tickets</h1>
      <div className="filters">
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Fecha Fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          Estado:
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="Abierto">Abierto</option>
            <option value="En proceso">En proceso</option>
            <option value="En espera">En espera</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </label>
        <label>
          Agente Asignado:
          <select
            value={agenteId}
            onChange={(e) => setAgenteId(e.target.value)}
          >
            <option value="">Todos</option>
            {users
              .filter((user) => user.rol_id === 3) // Filtrar solo agentes
              .map((agente) => (
                <option key={agente.id} value={agente.id}>
                  {agente.nombre}
                </option>
              ))}
          </select>
        </label>
        <button onClick={handleFetchReport}>Generar Reporte</button>
      </div>

      {error && <p className="error">{error}</p>}

      {reportData && (
        <div className="report-results">
          <h2>Resultados</h2>
          <p>Total Tickets: {reportData.totalTickets}</p>
          <p>Tiempo Espera Promedio: {reportData.tiempoEsperaPromedio} minutos</p>
          <p>Tiempo Abierto Promedio: {reportData.tiempoAbiertoPromedio} minutos</p>

          {/* Nuevo apartado para tickets reasignados */}
          <h3>Reasignaciones</h3>
          {reportData.reasignaciones.length > 0 ? (
            <div>
              <p>
                Agente con más reasignaciones:{' '}
                {reportData.agenteConMasReasignaciones?.nombre || 'N/A'} (
                {reportData.agenteConMasReasignaciones?.total || 0} reasignaciones)
              </p>
              <ul>
                {reportData.reasignaciones.map((r, index) => (
    <li key={index}>
      {r.agente}: {r.totalReasignaciones} reasignaciones</li>
  ))}
              </ul>
            </div>
          ) : (
            <p>No hay tickets reasignados en este rango de fechas.</p>
          )}

          <h3>Tickets</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Agente</th>
                <th>Fecha Solicitud</th>
                <th>Último Cambio</th>
                <th>Tiempo en Espera</th>
                <th>Tiempo Abierto</th>
              </tr>
            </thead>
            <tbody>
              {reportData.tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.estado}</td>
                  <td>
                    {users.find((user) => user.id === ticket.asignado_a)?.nombre || 'No asignado'}
                  </td>
                  <td>{new Date(ticket.hora_solicitud).toLocaleString()}</td>
                  <td>
                    {ticket.ultimo_cambio_estado
                      ? new Date(ticket.ultimo_cambio_estado).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>{ticket.tiempo_espera || 0}</td>
                  <td>{ticket.tiempo_abierto || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportView;
