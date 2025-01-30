A continuación, te presento una versión mejor estructurada y unificada de tu **README.md**. He mantenido el contenido original en español, mejorando la organización de los encabezados, los enlaces y la consistencia del formato para que se vea limpio y profesional en GitHub.

---

# CRUD_SOPORTEUDLA

![Estado del proyecto](https://img.shields.io/badge/STATUS-EN%20DESARROLLO-green)

## Descripción

**CRUD_SOPORTEUDLA** es un sistema de gestión de tickets diseñado para empresas o equipos de soporte técnico. Su objetivo es optimizar la asignación de tickets entre agentes, garantizando una distribución equitativa de las tareas y mejorando la eficiencia del equipo. Incluye funcionalidades avanzadas como reportes personalizados, filtros por fechas y roles de usuario.

---

## Índice

1. [Descripción](#descripción)  
2. [Características](#características)  
3. [Requisitos Previos](#requisitos-previos)  
4. [Instalación](#instalación)  
5. [Uso](#uso)  
6. [Arquitectura del Proyecto](#arquitectura-del-proyecto)  
7. [Capturas de Pantalla](#capturas-de-pantalla)  
8. [Implementación de Principios SOLID y Patrones de Diseño](#implementación-de-principios-solid-y-patrones-de-diseño)  
9. [Contribución](#contribución)  
10. [Licencia](#licencia)  
11. [Autor](#autor)  

---

## Características

- **Gestor de tickets:** Creación, asignación y actualización de tickets.  
- **Roles de usuario:** Permite diferenciar entre solicitantes, gestores y agentes.  
- **Asignación automática:** Distribución equitativa de tickets basada en carga de trabajo, prioridad y ubicación.  
- **Reportes personalizados:** Incluye filtros avanzados por fechas, estado y agente.  
- **Autenticación JWT:** Seguridad implementada con tokens.  
- **Frontend moderno:** Construido con React para una experiencia de usuario fluida.  
- **Backend robusto:** API RESTful con Node.js y Sequelize.  

---

## Requisitos Previos

Asegúrate de tener instalados:

- **Node.js** (v14 o superior)  
- **npm** o **yarn**  
- **MySQL** (o el sistema de base de datos configurado en tu proyecto)  

---

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/EstebanEr03/CRUD_SOPORTEUDLA.git
   cd CRUD_SOPORTEUDLA
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=tu_contraseña
     DB_NAME=nombre_base_datos
     JWT_SECRET=tu_secreto
     PORT=3001
     ```

4. **Crea y configura la base de datos:**
   - Ejecuta el script de inicialización de la base de datos (si existe).
   - Usa las migraciones de Sequelize:
     ```bash
     npx sequelize-cli db:migrate
     ```

5. **Inicia el servidor:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. **Inicia el cliente (React):**
   ```bash
   cd client
   npm start
   # o
   yarn start
   ```

---

## Uso

### Roles disponibles

1. **Solicitante:** Puede crear tickets y consultar su estado.  
2. **Gestor:** Puede asignar y gestionar tickets, así como priorizarlos.  
3. **Agente:** Puede actualizar el estado de los tickets asignados.  

### Acceso al sistema

- Visita `http://localhost:3000` después de iniciar el cliente.  
- Ingresa con las credenciales correspondientes.

---

## Arquitectura del Proyecto

```
root
├── server
│   ├── controllers     # Lógica de la API
│   ├── models          # Modelos de Sequelize
│   ├── routes          # Rutas de la API
│   ├── middleware      # Middlewares (autenticación, validaciones, etc.)
│   └── config          # Configuración de la base de datos
├── client
│   ├── src
│   │   ├── components  # Componentes reutilizables
│   │   ├── views       # Vistas principales
│   │   ├── controllers # Lógica del frontend
│   │   └── App.js      # Configuración de rutas
└── README.md           # Documentación del proyecto
```

---

## Capturas de Pantalla

### Pantalla de Inicio
![Pantalla de Inicio](https://github.com/user-attachments/assets/2629e6d9-2aa0-49eb-a3b4-9d19759386c6)

### Gestión de Tickets
![Gestión de Tickets](https://github.com/user-attachments/assets/52e58527-0b3f-4753-bdb8-dfa4580cd340)

### Crear Ticket (Normal)
![CrearTicketNormal](https://github.com/user-attachments/assets/c77c705c-ae95-401a-8569-9546fd8af16b)

### Crear Ticket (Automático)
![CrearTicketAutomatico](https://github.com/user-attachments/assets/dbad28e1-ffb1-4eb7-8924-7f81b3828019)

### Administrador de Usuarios (Solo con usuario administrador)
![AdministrarUsuarios](https://github.com/user-attachments/assets/047b1fc2-ee29-4349-aa61-23faf2becaeb)

### Interfaz del Solicitante
![Solicitar ticket](https://github.com/user-attachments/assets/eee964d7-77c8-494e-8b9e-883fbb74ca3f)

### Interfaz del Agente de Soporte
![Gestión de tickets por agentes](https://github.com/user-attachments/assets/05bc6847-85db-41cd-aa7b-a3b0e2df00ed)

---

## Implementación de Principios SOLID y Patrones de Diseño

En **CRUD_SOPORTEUDLA**, se han aplicado principios SOLID y patrones de diseño para mejorar la estructura del código, asegurando modularidad, mantenibilidad y escalabilidad en el backend.

### Principios SOLID Implementados

1. **S - Principio de Responsabilidad Única (SRP):**  
   Cada clase y función cumple una única responsabilidad, evitando dependencias innecesarias.  
   - `ticketController.js` → Maneja solo las solicitudes HTTP.  
   - `ticketService.js` → Contiene la lógica de negocio para la gestión de tickets.  
   - `ticketRepository.js` → Se encarga de las operaciones de base de datos.

2. **O - Principio de Abierto/Cerrado (OCP):**  
   El código está diseñado para permitir extensiones sin modificar la estructura existente.  
   - Se pueden agregar nuevas estrategias de asignación de agentes sin modificar la lógica del servicio.  
   - Se pueden extender tipos de tickets con el Factory Method.

3. **L - Principio de Sustitución de Liskov (LSP):**  
   Los módulos pueden ser sustituidos sin alterar el funcionamiento del código.  
   - Las estrategias de asignación de agentes (por ejemplo, `WeightedLoadStrategy`, `RoundRobinStrategy`, `LeastLoadStrategy`) se pueden intercambiar sin afectar el resto del sistema.

4. **I - Principio de Segregación de Interfaces (ISP):**  
   Cada módulo expone solo las funcionalidades necesarias.  
   - `ticketRepository.js` → Maneja solo las consultas a la base de datos.  
   - `ticketService.js` → Expone métodos relacionados únicamente con la lógica de negocio.

5. **D - Principio de Inversión de Dependencias (DIP):**  
   El código depende de abstracciones, no de implementaciones concretas.  
   - `AgentSelector` permite cambiar estrategias de asignación sin modificar la lógica principal.

### Patrones de Diseño Implementados

1. **Factory Method** (Creación de Tickets):  
   Permite crear diferentes tipos de tickets sin modificar el servicio principal.

   ```js
   // Ejemplo: ticketService.js
   import TicketFactory from '../factories/ticketFactory.js';

   export const createTicket = async (ticketData) => {
     const ticket = TicketFactory.createTicket(ticketData);
     return await ticketRepository.createTicket(ticket);
   };
   ```
   **Beneficio:** Crear tipos de tickets flexibles sin alterar la lógica central.

2. **Strategy** (Selección de Agentes):  
   Permite cambiar la forma en que se asignan agentes de soporte sin modificar el código principal.

   ```js
   // Ejemplo: ticketService.js
   import AgentSelector from './agentSelector.js';
   import {
     WeightedLoadStrategy,
     RoundRobinStrategy,
     LeastLoadStrategy
   } from '../strategies/agentSelectionStrategies.js';

   let strategy;

   if (prioridad === 'Critico') {
     strategy = new WeightedLoadStrategy();
   } else if (rotacionCiclica) {
     strategy = new RoundRobinStrategy();
   } else {
     strategy = new LeastLoadStrategy();
   }

   const selector = new AgentSelector(strategy);
   const mejorAgente = selector.select(agentes, prioridad, urgencia);
   ```
   **Beneficio:**  
   - Intercambiar estrategias de asignación fácilmente.  
   - Añadir nuevas reglas de negocio sin afectar la estructura ya existente.

---

A continuación, te dejo un **ejemplo** de cómo podrías documentar esta **nueva funcionalidad** en tu README, resaltando el nuevo pop-up y el proceso de reasignación de tickets vencidos. Ajusta los títulos, enlaces o rutas de las imágenes según tu repositorio y necesidades.

---

## Nueva Funcionalidad: Reasignación de Tickets Vencidos

Esta funcionalidad permite **reasignar de forma masiva** los tickets cuyo plazo de atención ha caducado. Al hacer clic en el botón **“Reasignar Tickets Vencidos”**, se muestra un **pop-up** (modal) con la lista de tickets vencidos. El usuario puede marcar aquellos que desee reasignar y, al confirmar, el sistema asignará automáticamente cada ticket a un nuevo agente siguiendo la lógica establecida en el backend.

### Cómo Funciona

1. **Botón “Reasignar Tickets Vencidos”:**  
   Desde la vista principal de **Gestión de Tickets**, presiona el botón para obtener la lista de tickets que se encuentran en estado de vencimiento.


2. **Visualización de Pop-up:**  
   Aparece un modal donde se listan todos los tickets vencidos con su respectivo ID, estado y prioridad.

3. **Selección de Tickets:**  
   El usuario puede marcar (o desmarcar) cada ticket que desee reasignar.

4. **Confirmación de Reasignación:**  
   Al hacer clic en “Reasignar Seleccionados”, se llamará a la función correspondiente en el backend, que:
   - Busca un agente disponible según la estrategia de asignación configurada.  
   - Actualiza el estado del ticket a “En proceso” e ingresa la reasignación en el historial de asignaciones.

5. **Actualización de la Lista:**  
   Una vez completada la reasignación, la vista se refresca, mostrando los cambios en tiempo real.

### Capturas de Pantalla

**Pop-up para Reasignar Tickets Vencidos**  
![Pop-up Reasignar Tickets Vencidos](URL_DE_TU_IMAGEN_POPUP)

**Gestión de Tickets con Nuevo Botón**  
![Gestión de Tickets con Botón para Reasignar](URL_DE_TU_IMAGEN_GESTION)

> Reemplaza `URL_DE_TU_IMAGEN_POPUP` y `URL_DE_TU_IMAGEN_GESTION` con los enlaces reales a tus capturas.

### Fragmento de Código Destacado

En el **backend**, se añadió la función `reasignarTicketsVencidos` que busca los tickets vencidos, selecciona un agente disponible (basado en la prioridad y urgencia) y reasigna el ticket. También registra la reasignación en el historial:

```js
// Reasignar Tickets Vencidos
export const reasignarTicketsVencidos = async () => {
  console.log('Buscando tickets vencidos...');
  
  // Obtener tickets vencidos
  const overdueTickets = await ticketRepository.findOverdueTickets();
  console.log('Tickets vencidos encontrados:', overdueTickets.map((t) => t.id));

  if (overdueTickets.length === 0) {
    console.log('No hay tickets vencidos para reasignar.');
    return { message: 'No hay tickets vencidos para reasignar.' };
  }

  for (const ticket of overdueTickets) {
    console.log(`Procesando ticket: ${ticket.id}`);
    console.log('Buscando agentes disponibles...');

    // Obtener agentes disponibles
    const agentes = await ticketRepository.findAvailableAgents();

    if (!agentes || agentes.length === 0) {
      console.warn('No hay agentes disponibles para reasignar el ticket:', ticket.id);
      continue;
    }

    console.log('Agentes disponibles:', agentes.map((a) => a.nombre));

    // Seleccionar el mejor agente (lógica interna)
    const mejorAgente = getBestAgent(agentes, ticket.prioridad, ticket.urgencia);

    console.log('Mejor agente seleccionado:', mejorAgente?.nombre);

    if (!mejorAgente) {
      console.warn('No se pudo seleccionar un agente para el ticket:', ticket.id);
      continue;
    }

    // Actualizar el estado y registrar en el historial
    await ticketRepository.updateTicket(ticket.id, {
      estado: 'En proceso',
      asignado_a: mejorAgente.id,
    });

    await ticketRepository.createHistoricoAsignacion({
      ticket_id: ticket.id,
      agente_id: mejorAgente.id,
      estado_inicial: ticket.estado,
      estado_final: 'En proceso',
      motivo_reasignacion: 'Vencimiento',
    });

    console.log(`Ticket ${ticket.id} reasignado exitosamente.`);
  }

  return { message: 'Tickets vencidos reasignados correctamente' };
};
```

En el **frontend**, se agregó un **modal** que consume la función `getOverdueTickets` para obtener la lista de tickets vencidos y luego llama a `ReasignarTicket(selectedTickets)` para procesar la reasignación. Un ejemplo resumido:

```jsx
// Obtener tickets vencidos y mostrar el modal
const fetchOverdueTickets = async () => {
  try {
    const data = await getOverdueTickets();
    console.log("Tickets vencidos recibidos en el frontend:", data);

    if (!Array.isArray(data)) {
      throw new Error("La API no devolvió una lista válida de tickets.");
    }

    setOverdueTickets(data);
    setShowPopup(true); // Abre el modal
  } catch (error) {
    console.error("Error al obtener tickets vencidos:", error);
    alert("Error al obtener tickets vencidos.");
    setOverdueTickets([]);
  }
};

// Al hacer clic en "Reasignar Seleccionados"
const handleReassignTickets = async () => {
  if (selectedTickets.length === 0) {
    alert("Selecciona al menos un ticket para reasignar.");
    return;
  }

  try {
    await ReasignarTicket(selectedTickets);
    alert("Tickets reasignados exitosamente.");
    setShowPopup(false);
    setSelectedTickets([]);
    
    // Refrescar la lista
    const updatedTickets = await getTickets();
    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
  } catch (error) {
    console.error("Error al reasignar tickets:", error);
    alert("Error al reasignar tickets.");
  }
};

// Lógica del modal
return (
  <div>
    {/* ...botones e interfaz... */}

    <button onClick={fetchOverdueTickets}>
      Reasignar Tickets Vencidos
    </button>

    {showPopup && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Selecciona los tickets vencidos para reasignar</h3>
          {overdueTickets.length === 0 ? (
            <p>No hay tickets vencidos disponibles.</p>
          ) : (
            <ul>
              {overdueTickets.map((ticket) => (
                <li key={ticket.id}>
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => handleSelectTicket(ticket.id)}
                  />
                  {` Ticket ID: ${ticket.id} - Estado: ${ticket.estado} - Prioridad: ${ticket.prioridad}`}
                </li>
              ))}
            </ul>
          )}

          <div className="modal-buttons">
            <button onClick={handleReassignTickets}>
              Reasignar Seleccionados
            </button>
            <button onClick={() => setShowPopup(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
```

### Beneficios

- **Eficiencia:** Permite que el equipo de soporte no pierda tiempo buscando manualmente tickets caducados.  
- **Flexibilidad:** Se pueden combinar distintas estrategias de asignación (por ejemplo, por prioridad, urgencia o carga de trabajo).  
- **Trazabilidad:** Queda un historial detallado de la reasignación en la base de datos.

Con este flujo, la reasignación masiva de tickets vencidos se convierte en un proceso ágil y centralizado, permitiendo al equipo de soporte enfocarse en las tareas prioritarias y manteniendo un registro transparente de las reasignaciones realizadas.

---

> **Nota:** Ajusta los enlaces de tus capturas de pantalla, rutas de importaciones y nombres de funciones según la estructura de tu proyecto.

## Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Haz un **fork** del proyecto.  
2. Crea una rama con tu funcionalidad o arreglo:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y confirma los *commits*:
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. Envía tus cambios al repositorio remoto:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Crea un **Pull Request** en GitHub.

---

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

## Autor

**Esteban Enríquez**  
- [Perfil de GitHub](https://github.com/EstebanEr03)

---

¡Listo! Con estos ajustes de estructura y formato, tu README se verá más consistente y profesional en GitHub. Si necesitas hacer modificaciones adicionales o tienes cualquier duda, ¡no dudes en preguntar!
