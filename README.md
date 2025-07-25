# Kfullstack 

## Backend

Este es el backend del proyecto **Kfullstack**, desarrollado con **Spring Boot**.

### Tecnologías Utilizadas

- Java 17  
- Spring Boot  
- Spring Security  
- Spring Data JPA  
- PostgreSQL  
- Maven  
- Docker y Docker Compose  
- Swagger OpenAPI

## Características

- Autenticación y autorización con JWT  
- Gestión de usuarios con roles (ADMIN / USER)  
- Gestión de proyectos y tareas  
- Swagger UI para documentación 
- Persistencia con PostgreSQL  
- Preparado para despliegue con Docker

### Configuración del Proyecto

#### Prerequisitos

- Java JDK 17 o superior  
- Maven  
- Docker y Docker Compose

## 📦 Instalación y Ejecución

### 🐳 Requisitos

- Docker  
- Docker Compose  

### 🔧 Ejecución con Docker

1. Clona el repositorio:

   ```bash
   git clone https://github.com/KathM03/Kfullstack.git
   cd Kfullstack/backend
   ```
   
2. Construye el .jar del proyecto:

   ```bash
   mvn clean install -DskipTests
   ```

 3. Ejecuta todo el entorno:

   ```bash
   docker-compose up -d
   ```

El backend se levantará automáticamente en:

http://localhost:8080/kfullstack

PostgreSQL estará disponible en localhost:5432

### Estructura del Proyecto

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── sasf/
│   │           └── kfullstack/
│   │               ├── Config/       # Configuraciones de la aplicación
│   │               ├── Constants/    # Constantes y enumeraciones
│   │               ├── Controller/   # Controladores REST
│   │               ├── DTO/          # Objetos de transferencia de datos
│   │               ├── Entity/       # Entidades JPA
│   │               ├── Exception/    # Manejo de excepciones
│   │               ├── Repository/   # Repositorios JPA
│   │               ├── Security/     # Configuración de seguridad
│   │               ├── Service/      # Lógica de negocio
│   │               ├── Util/         # Utilidades
│   │               └── Validation/   # Validaciones
│   └── resources/
│       └── application.properties    # Configuraciones de la aplicación
```

### Usuarios Predeterminados

El sistema crea automáticamente dos usuarios al iniciar:

1. Usuario Administrador:
   - Username: admin
   - Email: admin@email.com
   - Password: admin123
   - Role: ADMIN

2. Usuario Regular:
   - Username: user
   - Email: user@email.com
   - Password: user123
   - Role: USER

### Estados del Sistema

#### Estados Genéricos
- ACTIVE
- INACTIVE
- DELETE

#### Estados de Tareas
- PENDING
- IN_PROGRESS
- DONE

### Documentación API

La documentación de la API está disponible a través de Swagger UI en:
```

http://localhost:8080/kfullstack/swagger-ui/index.html#/
```

### Licencia

Este proyecto está bajo la licencia [MIT](https://choosealicense.com/licenses/mit/).
