class LeastLoadStrategy {
    execute(agents) {
      console.log('Usando estrategia: Menor carga');
      return agents.reduce((best, agent) => {
        const currentLoad = agent.assignedTickets.reduce((acc, ticket) => acc + ticket.tiempo_estimado, 0);
        if (!best || currentLoad < best.load) {
          return { agent, load: currentLoad };
        }
        return best;
      }, null)?.agent;
    }
  }
  
  class RoundRobinStrategy {
    constructor(lastAssignedId) {
      this.lastAssignedId = lastAssignedId || null;
    }
  
    execute(agents) {
      console.log('Usando estrategia: Rotación cíclica');
      const lastIndex = agents.findIndex((agent) => agent.id === this.lastAssignedId);
      const nextIndex = (lastIndex + 1) % agents.length;
      return agents[nextIndex];
    }
  
    setLastAssignedId(id) {
      this.lastAssignedId = id;
    }
  }
  
  class WeightedLoadStrategy {
    execute(agents, priority, urgency) {
      console.log('Usando estrategia: Carga ponderada');
      return agents
        .map((agent) => {
          const load = agent.assignedTickets.reduce((acc, ticket) => acc + ticket.tiempo_estimado, 0);
          const resolvedTickets = agent.historial.filter((h) => h.estado_final === 'Resuelto').length || 1;
  
          const priorityWeight = priority === 'Critico' ? 3 : priority === 'Alto' ? 2 : 1;
          const urgencyWeight = urgency === 'Alta' ? 3 : urgency === 'Media' ? 2 : 1;
  
          const weightedLoad = load / resolvedTickets + priorityWeight + urgencyWeight;
  
          return { agent, weightedLoad };
        })
        .sort((a, b) => a.weightedLoad - b.weightedLoad)[0]?.agent;
    }
  }
  
  export { LeastLoadStrategy, RoundRobinStrategy, WeightedLoadStrategy };
  