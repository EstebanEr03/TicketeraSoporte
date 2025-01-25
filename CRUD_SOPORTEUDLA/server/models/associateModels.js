const associateModels = (models) => {
    const { User, Ticket, Category, Subcategory, HistoricoAsignaciones } = models;
  
    // Relaciones User <-> Ticket
    User.hasMany(Ticket, { as: 'assignedTickets', foreignKey: 'asignado_a' });
    User.hasMany(Ticket, { as: 'solicitados', foreignKey: 'id_solicitante' });
    User.hasMany(Ticket, { as: 'gestionados', foreignKey: 'id_gestor' });
  
    Ticket.belongsTo(User, { as: 'solicitante', foreignKey: 'id_solicitante' });
    Ticket.belongsTo(User, { as: 'gestor', foreignKey: 'id_gestor' });
    Ticket.belongsTo(User, { as: 'agente', foreignKey: 'asignado_a' });
  
    // Relaciones Ticket <-> Category/Subcategory
    Ticket.belongsTo(Category, { as: 'categoria_rel', foreignKey: 'categoria_id' });
    Ticket.belongsTo(Subcategory, { as: 'subcategoria_rel', foreignKey: 'subcategoria_id' });
  
    // Relaciones Category <-> Subcategory
    Category.hasMany(Subcategory, { foreignKey: 'categoria_id', as: 'categorySubcategories' });
    Subcategory.belongsTo(Category, { foreignKey: 'categoria_id', as: 'parentCategory' });
  
    // Relaciones HistoricoAsignaciones <-> User
    HistoricoAsignaciones.belongsTo(User, { foreignKey: 'agente_id', as: 'agente' });
    User.hasMany(HistoricoAsignaciones, { foreignKey: 'agente_id', as: 'historial' });
  
    // Relaciones HistoricoAsignaciones <-> Ticket
    HistoricoAsignaciones.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    Ticket.hasMany(HistoricoAsignaciones, { foreignKey: 'ticket_id', as: 'historico' });
  };
  
  export default associateModels;
  