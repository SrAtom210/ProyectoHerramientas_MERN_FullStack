## Sistema de Renta de Herramientas (MERN Stack)

Sitio web para la renta de herramientas. Proyecto Fullstack desarrollado con MongoDB, Express, React y Node.js.

## Características

- **Autenticación de Usuarios:** Registro y Login con JWT y Bcrypt.
- **Gestión de Herramientas:** CRUD completo (Crear, Leer, Actualizar, Borrar).
- **Protección de Rutas:** Solo usuarios registrados pueden gestionar herramientas.
- **Interfaz Responsiva:** UI limpia y funcional.

### Instalación y Despliegue

Seguir estos pasos para correr el proyecto localmente:

## 1. Clonar el repositorio
```bash
git clone [https://github.com/SrAtom210/ProyectoHerramientas_MERN_FullStack.git](https://github.com/SrAtom210/ProyectoHerramientas_MERN_FullStack.git)
cd ProyectoHerramientas_MERN_FullStack

## 2.Instalar dependencias del Backend
npm install

# Instalar dependencias del Frontend
cd frontend
npm install
cd ..

## 3. Configurar Variables de Entorno (.env)
NODE_ENV=development
PORT=8000
MONGO_URL=mongodb://localhost/appTareas
JWT_SECRET=tu_secreto_super_seguro

## 4. Ejecutar el proyecto
npm run dev

Frontend: http://localhost:3000

Backend: http://localhost:8000

# Enpoints API
Método,Endpoint,Descripción,Acceso
POST,/,Registrar nuevo usuario,Público
POST,/login,Iniciar sesión y obtener Token,Público
GET,/actual,Obtener datos del usuario logueado,Privado (Token)

# Herramientas
Método,Endpoint,Descripción,Acceso
GET,/,Obtener todas las herramientas del usuario,Privado (Token)
POST,/,Publicar una nueva herramienta,Privado (Token)
PUT,/:id,Editar una herramienta,Privado (Token)
DELETE,/:id,Eliminar una herramienta,Privado (Token)

# Usuarios de Prueba
Puedes usar estas credenciales para probar el sistema:

    Email: admin@prueba.com

    Password: 123456

# Despliegue en OCI
El proyecto se encuentra desplegado y accesible en: URL: https://www.google.com/search?q=http://penrose512.jcarlos19.com:3000

