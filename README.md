# Kfullstack — Gestión de Proyectos y Tareas

Una aplicación web moderna para gestionar proyectos y tareas con autenticación, desarrollada con **Spring Boot 3** (backend) y **Next.js 15 + React 18 + TailwindCSS 4** (frontend).

---

## 🚀 Características Principales

### Backend (Spring Boot)

- API RESTful con autenticación y autorización  
- Roles `ADMIN` y `USER` con permisos diferenciados  
- CRUD de usuarios, proyectos y tareas  
- Estados de tareas: `PENDING`, `IN_PROGRESS`, `DONE`  
- Validaciones con anotaciones estándar  
- Documentación con Swagger UI  
- Persistencia con PostgreSQL  
- Preparado para Docker y Docker Compose  

### Frontend (Next.js + React)

- Autenticación segura 
- Dashboard interactivo con estadísticas de proyectos y tareas  
- Gestión completa de proyectos y tareas (CRUD)  
- Filtrado y ordenamiento de tareas  
- Asignación de tareas a usuarios  
- Protección automática de rutas mediante middleware  
- UI moderna y responsive con TailwindCSS  
- Manejo eficiente del estado global con Zustand  

---

## 📦 Instalación y Ejecución

### Requisitos previos

- Java 17+  
- Maven  
- Node.js 18+ y npm  
- Docker y Docker Compose  

---

### Backend

1. Clona el repositorio y navega al backend:

```bash
git clone https://github.com/KathM03/Kfullstack.git
cd Kfullstack/backend
```

2. Construye el proyecto:

```bash
mvn clean install -DskipTests
```

3. Levanta el backend y la base de datos con Docker Compose:

```bash
docker-compose up -d
```

4. Accede al backend en:

```
http://localhost:8080/kfullstack
```

5. Documentación Swagger:

```
http://localhost:8080/kfullstack/swagger-ui/index.html
```

---

### Frontend

1. Abre otra terminal y navega al frontend:

```bash
cd ../frontend
```

2. Instala dependencias:

```bash
npm install
```

3. Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

4. Accede al frontend en:

```
http://localhost:3000
```

---

## 📁 Estructura del Proyecto

### Backend (`/backend`)

```plaintext
src/
├── main/
│   ├── java/com/sasf/kfullstack/
│   │   ├── Config/
│   │   ├── Controller/
│   │   ├── DTO/
│   │   ├── Entity/
│   │   ├── Exception/
│   │   ├── Repository/
│   │   ├── Security/
│   │   ├── Service/
│   │   ├── Util/
│   │   └── Validation/
│   └── resources/
│       └── application.properties
```

### Frontend (`/frontend`)

```plaintext
src/
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── projects/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── projects/
│   ├── tasks/
│   └── Layout.tsx
├── hooks/
├── services/
├── store/
├── types/
└── middleware.ts
```

---

## 👤 Usuarios Predeterminados

| Usuario | Email           | Contraseña | Rol   |
|---------|-----------------|------------|-------|
| admin   | admin@email.com | admin123   | ADMIN |
| user    | user@email.com  | user123    | USER  |

---

## 🔐 Autenticación y Seguridad

- JWT con almacenamiento en localStorage y cookies seguras  
- Middleware automático para proteger rutas frontend  
- Roles con permisos específicos (creación de usuarios solo para ADMIN)  
- Manejo automático de expiración y refresco de token  

---

## 🎨 Diseño y UI

- UI creada con TailwindCSS v4  
- Skeleton loaders para cargas elegantes  
- Estados vacíos informativos  
- Componentes reutilizables (Botones, Inputs, Selects, Modales, Alertas, etc.)  

---

## ⚙️ Scripts Disponibles

### Backend

```bash
mvn clean install -DskipTests
docker-compose up -d
```

### Frontend

```bash
npm install
npm run dev        # Desarrollo
```

---

## 📄 Licencia

MIT License. Proyecto para prueba técnica Krugger.
