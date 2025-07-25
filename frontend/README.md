# TaskManager - Aplicación de Gestión de Proyectos y Tareas

Una aplicación web moderna desarrollada con Next.js 15, React 18 y TailwindCSS para la gestión eficiente de proyectos y tareas con autenticación JWT.

## 🚀 Características

### ✅ Implementado
- **Autenticación JWT** - Login seguro con almacenamiento en localStorage y cookies
- **Dashboard interactivo** - Resumen estadístico de proyectos y tareas
- **Gestión de Proyectos** - CRUD completo (crear, leer, actualizar, eliminar)
- **Gestión de Tareas** - CRUD completo con estados y asignación de usuarios
- **Estados de Tareas** - PENDING, IN_PROGRESS, DONE
- **Filtros y Ordenamiento** - Por estado y fecha de vencimiento
- **Asignación de Tareas** - A usuarios existentes en el sistema
- **Protección de Rutas** - Middleware automático para rutas protegidas
- **Responsive Design** - Completamente adaptativo a dispositivos móviles
- **UI Moderna** - Componentes reutilizables con TailwindCSS
- **Skeleton Loaders** - Estados de carga elegantes
- **Estados Vacíos** - Mensajes informativos cuando no hay datos
- **Validaciones** - Formularios con validación client-side
- **Manejo de Estado** - Zustand para estado global eficiente

### 📱 Pantallas Implementadas
1. **Login** - Autenticación de usuarios
2. **Dashboard** - Vista general con estadísticas
3. **Lista de Proyectos** - Gestión completa de proyectos
4. **Detalle de Proyecto** - Vista individual con tareas asociadas
5. **Gestión de Tareas** - CRUD completo dentro de cada proyecto

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15 (App Router), React 18
- **Estilos:** TailwindCSS 4
- **Estado:** Zustand con persistencia
- **HTTP:** Axios con interceptores
- **Iconos:** Lucide React
- **TypeScript:** Tipado completo
- **Cookies:** js-cookie para manejo seguro

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd kmolina-prueba
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
# Crea el archivo .env.local
cp .env.example .env.local
```

Edita `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

4. **Inicia el desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración de la API

Esta aplicación consume una API REST. Asegúrate de que tu backend esté configurado con los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/me` - Obtener usuario actual

### Proyectos
- `GET /api/projects` - Listar proyectos del usuario
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto específico
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Tareas
- `GET /api/projects/:projectId/tasks` - Listar tareas del proyecto
- `POST /api/projects/:projectId/tasks` - Crear tarea
- `PUT /api/projects/:projectId/tasks/:taskId` - Actualizar tarea
- `DELETE /api/projects/:projectId/tasks/:taskId` - Eliminar tarea

### Usuarios
- `GET /api/users` - Listar usuarios (para asignación)

## 📊 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Página principal
│   ├── login/             # Página de login
│   ├── projects/          # Gestión de proyectos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── ui/               # Componentes UI reutilizables
│   ├── projects/         # Componentes de proyectos
│   ├── tasks/            # Componentes de tareas
│   └── Layout.tsx        # Layout con navegación
├── hooks/                # Custom hooks
├── services/             # Servicios API
├── store/                # Estado global (Zustand)
├── types/                # Definiciones TypeScript
└── middleware.ts         # Middleware de Next.js
```

## 🎨 Componentes UI

La aplicación incluye una biblioteca completa de componentes reutilizables:

- **Button** - Botones con variantes (primary, secondary, danger, ghost)
- **Input/Textarea** - Campos de formulario con validación
- **Select** - Selectores con opciones
- **Modal** - Modales responsivos
- **Alert** - Alertas de diferentes tipos
- **LoadingSpinner** - Indicadores de carga
- **Skeleton** - Estados de carga
- **EmptyState** - Estados vacíos informativos

## 🔐 Autenticación

La aplicación maneja la autenticación JWT de manera segura:

- **Token Storage**: localStorage y cookies seguras
- **Auto-refresh**: Verificación automática del estado de autenticación
- **Route Protection**: Middleware automático para rutas protegidas
- **Error Handling**: Manejo de errores 401 con redirección automática

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px) 
- **Mobile** (320px - 767px)

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm run start

# Linting
npm run lint
```

## 🔄 Estado de la Aplicación

El estado se maneja con Zustand dividido en stores especializados:

- **AuthStore**: Autenticación y usuario actual
- **ProjectStore**: Gestión de proyectos
- **TaskStore**: Gestión de tareas con filtros

## 📝 Validaciones

- **Formularios**: Validación client-side completa
- **Campos requeridos**: Validación de campos obligatorios
- **Formatos**: Validación de email y otros formatos
- **Longitud**: Validación de longitud mínima/máxima

## 🎯 Próximas Mejoras

- [ ] Testing con Jest y Testing Library
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] Drag & drop para tareas
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Colaboración en tiempo real

## 📄 Licencia

Este proyecto es parte de una prueba técnica.

## 👨‍💻 Desarrollado por

Katherine Molina - Prueba Técnica Krugger

---

**Nota**: Asegúrate de tener tu API backend corriendo antes de usar la aplicación. Los datos de prueba se encuentran en la página de login.
