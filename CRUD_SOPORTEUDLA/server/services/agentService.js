let ultimaAsignacion = null; // Variable global para rastrear el último agente asignado

// Seleccionar el mejor agente basado en carga de trabajo
export const getBestAgent = (agentes, prioridad, urgencia) => {
  console.log('Iniciando selección del mejor agente...');

  // Paso 1: Filtrar agentes sin carga
  const agentesSinCarga = agentes.filter(
    (agente) => !agente.assignedTickets || agente.assignedTickets.length === 0
  );

  if (agentesSinCarga.length > 0) {
    console.log('Agentes sin carga detectados:', agentesSinCarga.map((a) => a.nombre));

    // Rotación entre agentes sin carga
    if (ultimaAsignacion) {
      const indiceUltimaAsignacion = agentesSinCarga.findIndex(
        (agente) => agente.id === ultimaAsignacion
      );
      const siguienteIndice =
        (indiceUltimaAsignacion + 1) % agentesSinCarga.length;

      console.log(
        `Rotación cíclica: Última asignación a ${ultimaAsignacion}. Próximo agente: ${agentesSinCarga[siguienteIndice].nombre}`
      );

      return agentesSinCarga[siguienteIndice];
    } else {
      console.log(`Seleccionando el primer agente sin carga: ${agentesSinCarga[0].nombre}`);
      return agentesSinCarga[0];
    }
  }

  // Paso 2: Calcular carga ponderada para agentes con tickets asignados
  const agentesOrdenados = calcularCargaPonderada(agentes, prioridad, urgencia);

  console.log(
    'Agentes ordenados por carga ponderada:',
    agentesOrdenados.map((a) => a.agente.nombre)
  );

  // Selección cíclica basada en última asignación
  if (ultimaAsignacion) {
    const indiceUltimaAsignacion = agentesOrdenados.findIndex(
      (a) => a.agente.id === ultimaAsignacion
    );
    const siguienteIndice =
      (indiceUltimaAsignacion + 1) % agentesOrdenados.length;

    console.log(
      `Rotación cíclica: Última asignación a ${ultimaAsignacion}. Próximo agente: ${agentesOrdenados[siguienteIndice].agente.nombre}`
    );

    return agentesOrdenados[siguienteIndice].agente;
  } else {
    console.log(
      `Seleccionando el primer agente por carga ponderada: ${agentesOrdenados[0].agente.nombre}`
    );
    return agentesOrdenados[0].agente;
  }
};

// Calcular carga ponderada de los agentes
const calcularCargaPonderada = (agentes, prioridad, urgencia) => {
  return agentes.map((agente) => {
    const cargaActual = agente.assignedTickets.reduce(
      (acc, t) => acc + t.tiempo_estimado,
      0
    );
    const ticketsAsignados = agente.assignedTickets.length;

    // Calcular eficiencia basada en tickets resueltos
    const ticketsResueltos = agente.historial
      ? agente.historial.filter((h) => h.estado_final === 'Resuelto').length
      : 0;

    const eficiencia = ticketsResueltos || 1; // Evitar división por 0

    // Pesos basados en prioridad y urgencia
    const pesoPrioridad = prioridad === 'Critico' ? 3 : prioridad === 'Alto' ? 2 : 1;
    const pesoUrgencia = urgencia === 'Alta' ? 3 : urgencia === 'Media' ? 2 : 1;

    // Fórmula de carga ponderada
    const cargaPonderada =
      (cargaActual + ticketsAsignados * 10) / eficiencia +
      pesoPrioridad +
      pesoUrgencia;

    console.log(`Agente: ${agente.nombre}`);
    console.log(`  Carga Actual: ${cargaActual}`);
    console.log(`  Tickets Asignados: ${ticketsAsignados}`);
    console.log(`  Tickets Resueltos: ${ticketsResueltos}`);
    console.log(`  Eficiencia: ${eficiencia}`);
    console.log(`  Carga Ponderada: ${cargaPonderada}`);

    return { agente, cargaPonderada };
  }).sort((a, b) => a.cargaPonderada - b.cargaPonderada);
};
