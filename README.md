# CRUD_SOPORTEUDLA

![Estado del proyecto](https://img.shields.io/badge/STATUS-EN%20DESARROLLO-green)

## Descripción

CRUD_SOPORTEUDLA es un sistema de gestión de tickets diseñado para empresas o equipos de soporte técnico. Su objetivo es optimizar la asignación de tickets entre agentes de soporte, garantizando una distribución equitativa de tareas y mejorando la eficiencia del equipo. Este sistema incluye funcionalidades avanzadas, como reportes personalizados, filtros por fechas, y la implementación de roles de usuario.

---

## Índice

1. [Descripción](#descripción)
2. [Características](#características)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación](#instalación)
5. [Uso](#uso)
6. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
7. [Capturas de Pantalla](#capturas-de-pantalla)
8. [Contribución](#contribución)
9. [Licencia](#licencia)

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
   - Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=tu_contraseña
     DB_NAME=nombre_base_datos
     JWT_SECRET=tu_secreto
     PORT=3001
     ```
4. **Crea y configura la base de datos:**
   - Ejecuta el script de inicialización de la base de datos, si existe.
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
6. **Inicia el cliente:**
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
- Ingresa con las credenciales proporcionadas.

---

## Arquitectura del Proyecto

```
root
├── server
│   ├── controllers   # Lógica de la API
│   ├── models        # Modelos de Sequelize
│   ├── routes        # Rutas de la API
│   ├── middleware    # Middlewares como autenticación
│   └── config        # Configuración de la base de datos
├── client
│   ├── src
│   │   ├── components  # Componentes reutilizables
│   │   ├── views       # Vistas principales
│   │   ├── controllers # Lógica de frontend
│   │   └── App.js      # Configuración de rutas
└── README.md          # Documentación del proyecto
```

---

## Capturas de Pantalla

### Pantalla de Inicio

![Pantalla Inicio ](https://github.com/user-attachments/assets/2629e6d9-2aa0-49eb-a3b4-9d19759386c6)


### Gestión de Tickets

![Gestion Tickets](https://github.com/user-attachments/assets/52e58527-0b3f-4753-bdb8-dfa4580cd340)


## CrearTicket(Normal)

![CrearTicketNormal](https://github.com/user-attachments/assets/c77c705c-ae95-401a-8569-9546fd8af16b)

## CrearTicket(Automatico)

![CrearTicketAutomatico](https://github.com/user-attachments/assets/dbad28e1-ffb1-4eb7-8924-7f81b3828019)

## Administrador Usuario(solo con usuario administrador)

![AdministrarUsuariosa](https://github.com/user-attachments/assets/047b1fc2-ee29-4349-aa61-23faf2becaeb)

## Interfaz Del Solicitante

![Solicitar ticket por parte del Solicitante](https://github.com/user-attachments/assets/eee964d7-77c8-494e-8b9e-883fbb74ca3f)

## Interfaz Del Agente de Soporte

![Gestion de tickets por parte de agentes](https://github.com/user-attachments/assets/05bc6847-85db-41cd-aa7b-a3b0e2df00ed)

Si quieres contribuir:

1. Haz un fork del proyecto.
2. Crea una rama con tu característica o arreglo:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y confirma los commits:
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. Envía tus cambios al repositorio remoto:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Crea un Pull Request en GitHub.

---


Nueva Sección: Implementación de SOLID y Patrones de Diseño
📌 Ubicación en el README: Después de la sección "Arquitectura del Proyecto"
📌 Objetivo: Explicar cómo se aplicaron SOLID y los patrones de diseño Factory Method y Strategy en el backend del sistema.

📌 Implementación de Principios SOLID y Patrones de Diseño
En el desarrollo del CRUD_SOPORTEUDLA, se han aplicado principios SOLID y patrones de diseño para garantizar una arquitectura más modular, mantenible y escalable.

🔹 Principios SOLID Implementados
1️⃣ S - Principio de Responsabilidad Única (SRP)
Cada clase y función en el backend tiene una única responsabilidad.
✅ Ejemplo:

ticketController.js se encarga solo de manejar las solicitudes HTTP.
ticketService.js encapsula la lógica de negocio para la gestión de tickets.
ticketRepository.js maneja directamente las operaciones de base de datos.
2️⃣ O - Principio de Abierto/Cerrado (OCP)
El código está diseñado para permitir extensiones sin modificar la estructura existente.
✅ Ejemplo:

Se pueden agregar nuevas estrategias de selección de agentes sin modificar la lógica base del sistema, gracias al patrón Strategy.
3️⃣ L - Principio de Sustitución de Liskov (LSP)
Las estrategias de asignación de agentes pueden reemplazarse sin afectar el código base.
✅ Ejemplo:

AgentSelector acepta diferentes estrategias (WeightedLoadStrategy, RoundRobinStrategy, LeastLoadStrategy) sin alterar la implementación.
4️⃣ I - Principio de Segregación de Interfaces (ISP)
Cada módulo expone solo las funcionalidades necesarias.
✅ Ejemplo:

ticketRepository.js solo maneja acciones de base de datos.
ticketService.js solo expone métodos relacionados con la lógica de negocio.
5️⃣ D - Principio de Inversión de Dependencias (DIP)
El código no depende directamente de clases concretas, sino de abstracciones.
✅ Ejemplo:

AgentSelector permite cambiar estrategias sin modificar el código del servicio.
🔹 Patrones de Diseño Implementados
🛠 1. Factory Method - Creación de Tickets
Se ha implementado el Factory Method para la creación de tickets, asegurando una construcción más flexible y escalable.

✅ Ejemplo:

javascript
Copy
Edit
import TicketFactory from '../factories/ticketFactory.js';

// En ticketService.js
export const createTicket = async (ticketData) => {
  const ticket = TicketFactory.createTicket(ticketData);
  return await ticketRepository.createTicket(ticket);
};
📌 Beneficio: Permite crear tickets de diferentes tipos sin modificar la lógica del servicio.

🎯 2. Strategy - Selección de Agentes
El Strategy Pattern permite cambiar la forma en que se asignan los agentes sin modificar el código base.

✅ Ejemplo:

javascript
Copy
Edit
import AgentSelector from './agentSelector.js';
import { WeightedLoadStrategy, RoundRobinStrategy, LeastLoadStrategy } from '../strategies/agentSelectionStrategies.js';

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
📌 Beneficio:
✔️ Permite seleccionar diferentes estrategias sin modificar la lógica principal.
✔️ Se pueden añadir nuevas estrategias sin afectar el código existente.

🎯 Conclusión
✅ SOLID y los patrones de diseño mejoraron la escalabilidad y mantenibilidad del sistema.
✅ Se separaron responsabilidades correctamente, facilitando modificaciones futuras.
✅ Se pueden añadir nuevas reglas de negocio sin afectar la estructura actual.

¡Con esta sección, tu README documentará adecuadamente las mejoras arquitectónicas! 🚀
Si necesitas ajustes o quieres agregar ejemplos más específicos, dime y lo refinamos. 😊

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

---

## Autor

- **Esteban Enríquez** - [Perfil de GitHub](https://github.com/EstebanEr03)

