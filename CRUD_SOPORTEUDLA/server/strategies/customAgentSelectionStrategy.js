export class CustomAgentSelectionStrategy {
    constructor(lastAssignedId) {
      this.lastAssignedId = lastAssignedId || null;
    }
  
    execute(agents, priority, urgency) {
      console.log('Usando estrategia: Selección personalizada');
  
      // Paso 1: Priorizar agentes sin carga
      const agentsWithoutLoad = agents.filter(
        (agent) => !agent.assignedTickets || agent.assignedTickets.length === 0
      );
  
      if (agentsWithoutLoad.length > 0) {
        console.log('Agentes sin carga detectados:', agentsWithoutLoad.map((a) => a.nombre));
  
        if (this.lastAssignedId) {
          const lastIndex = agentsWithoutLoad.findIndex(
            (agent) => agent.id === this.lastAssignedId
          );
          const nextIndex = (lastIndex + 1) % agentsWithoutLoad.length;
  
          console.log(
            `Rotación cíclica: Última asignación a ${this.lastAssignedId}. Próximo agente: ${agentsWithoutLoad[nextIndex].nombre}`
          );
  
          return agentsWithoutLoad[nextIndex];
        } else {
          console.log(`Seleccionando el primer agente sin carga: ${agentsWithoutLoad[0].nombre}`);
          return agentsWithoutLoad[0];
        }
      }
  
      // Paso 2: Agentes con carga ponderada
      const sortedAgents = agents.map((agent) => {
        const currentLoad = agent.assignedTickets.reduce(
          (acc, t) => acc + t.tiempo_estimado,
          0
        );
        const assignedTickets = agent.assignedTickets.length;
  
        const resolvedTickets = agent.historial
          ? agent.historial.filter((h) => h.estado_final === 'Resuelto').length
          : 0;
  
        const efficiency = resolvedTickets || 1; // Evitar división por 0
        const priorityWeight = priority === 'Critico' ? 3 : priority === 'Alto' ? 2 : 1;
        const urgencyWeight = urgency === 'Alta' ? 3 : urgency === 'Media' ? 2 : 1;
  
        const weightedLoad =
          (currentLoad + assignedTickets * 10) / efficiency +
          priorityWeight +
          urgencyWeight;
  
        console.log(`Agente: ${agent.nombre}`);
        console.log(`  Carga Actual: ${currentLoad}`);
        console.log(`  Tickets Asignados: ${assignedTickets}`);
        console.log(`  Tickets Resueltos: ${resolvedTickets}`);
        console.log(`  Eficiencia: ${efficiency}`);
        console.log(`  Carga Ponderada: ${weightedLoad}`);
  
        return { agent, weightedLoad };
      });
  
      sortedAgents.sort((a, b) => a.weightedLoad - b.weightedLoad);
  
      console.log(
        'Agentes ordenados por carga ponderada:',
        sortedAgents.map((a) => a.agent.nombre)
      );
  
      if (this.lastAssignedId) {
        const lastIndex = sortedAgents.findIndex(
          (a) => a.agent.id === this.lastAssignedId
        );
        const nextIndex = (lastIndex + 1) % sortedAgents.length;
  
        console.log(
          `Rotación cíclica: Última asignación a ${this.lastAssignedId}. Próximo agente: ${sortedAgents[nextIndex].agent.nombre}`
        );
  
        return sortedAgents[nextIndex].agent;
      } else {
        console.log(
          `Seleccionando el primer agente por carga ponderada: ${sortedAgents[0].agent.nombre}`
        );
        return sortedAgents[0].agent;
      }
    }
  
    setLastAssignedId(id) {
      this.lastAssignedId = id;
    }
  }
  