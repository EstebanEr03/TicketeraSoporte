class AgentSelector {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    select(agents, ...args) {
      if (!this.strategy) {
        throw new Error('No se ha definido una estrategia de selección.');
      }
      return this.strategy.execute(agents, ...args);
    }
  }
  
  export default AgentSelector;
  