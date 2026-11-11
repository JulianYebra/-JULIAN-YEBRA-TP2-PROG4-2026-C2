# Red Social — TP2 Programación IV

**Alumno:** Julián Yebra  
**Materia:** Programación IV — UTN  
**Comisión:** 141  
**Repositorio:** [GitHub — TP2 Red Social](https://github.com/JulianYebra/-JULIAN-YEBRA-TP2-PROG4-2026-C2)

## Deploy

- **Frontend (Vercel):** [Abrir Red Social](https://julian-yebra-tp-2-prog-4-2026-c2-ec257wz34-julian-yebra.vercel.app/login)
- **Backend (Render):** [API Red Social](https://julian-yebra-tp2-prog4-2026-c2.onrender.com)

## Descripción del proyecto

Red Social es una aplicación web desarrollada con Angular, NestJS y MongoDB. Permite a los usuarios registrarse, iniciar sesión, consultar publicaciones y gestionar su perfil personal.

El proyecto está organizado en dos aplicaciones independientes: un frontend encargado de la interfaz y la navegación, y un backend responsable de la lógica de negocio, autenticación y persistencia de datos.

## Tecnologías utilizadas

### Frontend

- **Angular 22:** framework utilizado para desarrollar la interfaz de usuario.
- **TypeScript:** lenguaje utilizado para implementar la lógica de la aplicación.
- **HTML:** estructura de las páginas.
- **CSS:** estilos y diseño visual.
- **Angular Router:** navegación entre las distintas pantallas.
- **HttpClient:** comunicación con la API del backend.
- **FormsModule:** vinculación y gestión de formularios.

### Backend

- **NestJS:** framework de Node.js utilizado para desarrollar la API REST.
- **Node.js:** entorno de ejecución del backend.
- **MongoDB:** base de datos NoSQL utilizada para almacenar los usuarios y las publicaciones.
- **Mongoose:** integración entre NestJS y MongoDB mediante esquemas y modelos.
- **Bcrypt:** encriptación mediante hash de las contraseñas.
- **class-validator:** validación de los datos recibidos por la API.
- **class-transformer:** transformación de los datos recibidos.
- **Cloudinary:** almacenamiento de imágenes de perfil.

### Despliegue y herramientas

- **Git y GitHub:** control de versiones y almacenamiento del código fuente.
- **Vercel:** alojamiento del frontend.
- **Render:** alojamiento del backend.
- **MongoDB Atlas:** alojamiento de la base de datos.

## Funcionalidades por sprint

### Sprint 1 — Registro, Login y Mi Perfil

**Estado: implementado.**

- Creación de los proyectos frontend y backend.
- Pantallas de Registro, Login, Publicaciones y Mi Perfil.
- Navegación entre las pantallas.
- Favicon personalizado.
- Registro de usuarios con nombre, apellido, correo, username, contraseña, fecha de nacimiento, descripción e imagen de perfil.
- Validaciones de los datos ingresados.
- Verificación de contraseñas coincidentes.
- Comprobación de correo y username únicos.
- Contraseñas almacenadas mediante hash con Bcrypt.
- Imágenes de perfil almacenadas en Cloudinary y URL guardada en MongoDB.
- Atributo `perfil` con valor predeterminado `usuario` y posibilidad de seleccionar `administrador`.
- Inicio de sesión mediante correo electrónico o nombre de usuario.
- Visualización de los datos personales y del tipo de perfil en Mi Perfil.
- API REST desarrollada con NestJS.
- Persistencia de datos mediante MongoDB Atlas.
- Despliegue del frontend y backend.

### Sprint 2 — Publicaciones y Me gusta

**Pendiente de implementación.**

- Listado de publicaciones ordenadas por fecha o cantidad de Me gusta.
- Paginación de publicaciones.
- Creación de publicaciones con título, descripción e imagen opcional.
- Dar y quitar Me gusta.
- Eliminación de publicaciones propias.
- Visualización de las últimas tres publicaciones y sus comentarios en Mi Perfil.
- Desarrollo del controlador de publicaciones en NestJS.

### Sprint 3 — Comentarios y manejo de sesiones

**Pendiente de implementación.**

- Vista de detalle de una publicación.
- Creación y edición de comentarios propios.
- Paginación de comentarios y opción de cargar más.
- Implementación de JWT para autenticación.
- Almacenamiento y validación de tokens.
- Renovación de tokens.
- Control de duración de sesión y aviso antes del vencimiento.
- Protección de rutas mediante autenticación.

### Sprint 4 — Administración y estadísticas

**Pendiente de implementación.**

- Baja lógica de publicaciones para administradores.
- Dashboard de administración de usuarios.
- Alta, baja y rehabilitación de usuarios.
- Dashboard de estadísticas con gráficos.
- Implementación de PWA.
- Desarrollo de tres pipes y tres directivas personalizadas.

### Sprint 5 — Recuperatorio

**Pendiente de implementación.**

- Visualización de perfiles de otros usuarios.
- Scroll infinito en publicaciones.
- Estadísticas de ingresos, visitas a perfiles y Me gusta por día.

### Sprint 6 — Funcionalidades adicionales

**Pendiente de implementación.**

- Guardar y quitar publicaciones de guardados.
- Pantalla para consultar publicaciones guardadas.
- Compartir publicaciones con otros usuarios.
- Pantalla de publicaciones compartidas.
- Nuevos criterios de ordenamiento por cantidad de veces guardadas y compartidas.

## Arquitectura del proyecto

El repositorio contiene dos aplicaciones independientes:

```text
Red social/
│
├── frontend/
│   └── red-social-angular/
│       └── src/
│           └── app/
│               ├── pages/
│               ├── services/
│               └── ...
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── cloudinary/
│   │   ├── users/
│   │   ├── publicaciones/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── .env.example
│
└── README.md
```

### Frontend

La carpeta `pages` contiene las pantallas principales de la aplicación. La carpeta `services` contiene los servicios encargados de comunicarse con el backend.

### Backend

El backend está organizado en módulos, siguiendo la estructura de NestJS:

- **Auth:** registro e inicio de sesión.
- **Users:** gestión y persistencia de usuarios.
- **Publicaciones:** módulo destinado a las funcionalidades de publicaciones.

## Instalación y ejecución local

### Requisitos previos

- Node.js y npm.
- Angular CLI.
- Una cuenta y base de datos configurada en MongoDB Atlas.
- Credenciales de Cloudinary para el almacenamiento de imágenes.

### 1. Clonar el repositorio

```bash
git clone https://github.com/JulianYebra/-JULIAN-YEBRA-TP2-PROG4-2026-C2.git
cd -JULIAN-YEBRA-TP2-PROG4-2026-C2
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend` con las siguientes variables:

```env
MONGODB_URI=tu_uri_de_mongodb
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
FRONTEND_URL=http://localhost:4200
```

Iniciar el servidor:

```bash
npm run start:dev
```

El backend estará disponible en:

`http://localhost:3000`

### 3. Configurar el frontend

Abrir otra terminal:

```bash
cd frontend/red-social-angular
npm install
```

Configurar la URL de la API para que apunte al backend local:

`http://localhost:3000/auth`

Iniciar Angular:

```bash
ng serve
```

El frontend estará disponible en:

`http://localhost:4200`

## Variables de entorno y seguridad

Las credenciales de MongoDB y Cloudinary se configuran mediante variables de entorno. No deben incluirse valores reales en el repositorio ni compartirse públicamente.

El archivo `.env` debe permanecer excluido del control de versiones. Se incluye `.env.example` como referencia para conocer las variables necesarias.

## Autor

**Julián Yebra**  
Trabajo Práctico N.º 2 — Programación IV  
UTN