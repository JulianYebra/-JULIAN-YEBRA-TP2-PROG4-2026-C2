# Red Social – TP2 Programación 4

Aplicación web de una red social desarrollada como Trabajo Práctico N.º 2 de la materia **Programación 4**, utilizando Angular para el frontend y NestJS para el backend.

El proyecto permite registrar usuarios, iniciar sesión y acceder a las secciones principales de la aplicación.

## Tecnologías utilizadas

### Frontend
- Angular 22.
- TypeScript.
- HTML5 y CSS3.
- Angular Router para la navegación.
- HttpClient para la comunicación con el backend.

### Backend
- NestJS.
- Node.js.
- TypeScript.
- MongoDB.
- Mongoose.
- Bcrypt para el cifrado de contraseñas.
- Cloudinary para el almacenamiento de imágenes de perfil.
- Class Validator para la validación de datos.

### Servicios de despliegue
- **Vercel:** alojamiento del frontend.
- **Render:** alojamiento del backend.
- **MongoDB Atlas:** base de datos en la nube.
- **Cloudinary:** almacenamiento de imágenes.

## Aplicación desplegada

- **Frontend:** https://julian-yebra-tp-2-prog-4-2026-c2-ec257wz34-julian-yebra.vercel.app/login
- **Backend:** https://julian-yebra-tp2-prog4-2026-c2.onrender.com

## Funcionalidades del Sprint 1

- Registro de nuevos usuarios.
- Validación de los datos ingresados durante el registro.
- Validación de email y nombre de usuario únicos.
- Validación de contraseña con un mínimo de 8 caracteres, una mayúscula y un número.
- Confirmación de contraseña.
- Carga de imagen de perfil.
- Almacenamiento de imágenes mediante Cloudinary.
- Almacenamiento de usuarios en MongoDB Atlas.
- Cifrado de contraseñas mediante Bcrypt.
- Inicio de sesión mediante email o nombre de usuario.
- Navegación entre las secciones principales de la aplicación.
- Interfaz adaptable y validaciones visuales de formularios.

## Arquitectura del proyecto

El proyecto está organizado en dos partes principales:

```text
Red social/
│
├── frontend/
│   └── red-social-angular/
│       └── src/
│           └── app/
│               ├── components/
│               ├── services/
│               └── ...
│
├── backend/
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── publications/
│       ├── cloudinary/
│       ├── app.module.ts
│       └── main.ts
│
├── spec.md
└── README.md
```

### Frontend

Desarrollado con Angular. Se encarga de mostrar la interfaz, gestionar los formularios y comunicarse con el backend mediante solicitudes HTTP.

### Backend

Desarrollado con NestJS y organizado mediante módulos:

- **Auth:** registro e inicio de sesión.
- **Users:** gestión y persistencia de usuarios.
- **Publications:** módulo correspondiente a las publicaciones.
- **Cloudinary:** servicio para subir y almacenar imágenes.

### Base de datos

Se utiliza MongoDB Atlas como base de datos en la nube. La colección `users` almacena la información de los usuarios registrados.

## Instalación y ejecución local

### Requisitos previos

- Node.js.
- npm.
- Angular CLI.
- Una cuenta y una base de datos configurada en MongoDB Atlas.
- Una cuenta de Cloudinary.

### 1. Clonar el repositorio

```bash
git clone https://github.com/JulianYebra/-JULIAN-YEBRA-TP2-PROG4-2026-C2.git
cd -JULIAN-YEBRA-TP2-PROG4-2026-C2
```

### 2. Configurar el backend

Ingresar a la carpeta:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` dentro de la carpeta `backend` con las siguientes variables:

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

Abrir otra terminal e ingresar a:

```bash
cd frontend/red-social-angular
```

Instalar las dependencias:

```bash
npm install
```

Para ejecutar el frontend localmente, configurar la URL de la API del servicio de autenticación para que apunte al backend local:

```text
http://localhost:3000/auth
```

Iniciar Angular:

```bash
ng serve
```

La aplicación estará disponible en:

`http://localhost:4200`

## Seguridad

- Las contraseñas se almacenan utilizando Bcrypt.
- Las credenciales y claves de servicios externos se configuran mediante variables de entorno.
- El archivo `.env` no debe subirse al repositorio.
- Las imágenes de perfil se almacenan en Cloudinary y se guarda su URL en MongoDB.

## Autor

**Julián Yebra**

Trabajo Práctico N.º 2 – Programación 4.

