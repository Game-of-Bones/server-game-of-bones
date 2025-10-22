# 🦴 Game of Bones - API Backend

API RESTful para Game of Bones, una plataforma de blog de paleontología que permite a los usuarios compartir y explorar descubrimientos paleontológicos de todo el mundo.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Documentación de la API](#documentación-de-la-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## ✨ Características

- 🔐 Autenticación y autorización de usuarios con JWT
- 📝 Operaciones CRUD para posts paleontológicos
- 🖼️ Integración de carga de imágenes con Cloudinary
- 💬 Sistema de comentarios
- 👍 Funcionalidad de likes/unlikes
- 🔍 Filtrado y búsqueda avanzada
- 📊 Perfiles de usuario y estadísticas
- 🔒 Control de acceso basado en roles
- ✅ Cobertura de tests completa

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de Datos:** MySQL
- **ORM:** Sequelize con decoradores TypeScript
- **Autenticación:** JWT (JSON Web Tokens)
- **Hash de Contraseñas:** bcrypt
- **Carga de Archivos:** Multer + Cloudinary
- **Testing:** Jest + Supertest
- **Seguridad:** Helmet, CORS

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **MySQL** (v8 o superior)
- **Git**

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Game-of-Bones/server-game-of-bones.git
cd server-game-of-bones
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Crear archivos de entorno**

Crea un archivo `.env` en el directorio raíz:

```bash
cp .env.example .env
```

## 🔑 Variables de Entorno

Configura tu archivo `.env` con las siguientes variables:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3000

# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=game_of_bones
DB_USER=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_DIALECT='mysql'

# JWT Secret
JWT_SECRET=tu_clave_secreta_jwt_super_segura

# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# CORS
CLIENT_URL=http://localhost:5173
```

### Para Entorno de Testing

Crea un archivo `.env.test`:

```env
NODE_ENV=test
DB_NAME=game_of_bones_test
# ... otras configuraciones
```

## 🏃 Ejecutar la Aplicación

### Modo Desarrollo

Inicia el servidor con recarga automática:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Modo Entorno de Test

Ejecuta el servidor en entorno de pruebas:

```bash
npm run dev:test
```

### Build de Producción

1. Compila el código TypeScript:

```bash
npm run build
```

2. Inicia el servidor de producción:

```bash
npm start
```

## 🗄️ Base de Datos

### Inicializar Base de Datos

Crea la estructura de la base de datos:

```bash
npm run db:fresh
```

> ⚠️ **Advertencia:** Este comando eliminará todas las tablas existentes y las recreará.

### Poblar Base de Datos (Seeders)

#### Datos de Desarrollo

Puebla la base de datos con datos de ejemplo para desarrollo:

```bash
npm run seed:dev
```

#### Datos de Test

Puebla la base de datos con datos de prueba:

```bash
npm run seed:test
```

### Inicializar Base de Datos de Test

Configura la base de datos de pruebas:

```bash
npm run init:test
```

## 🧪 Testing

### Ejecutar Todos los Tests

```bash
npm test
```

### Modo Watch

Ejecuta los tests en modo watch (útil durante el desarrollo):

```bash
npm run test:watch
```

### Reporte de Cobertura

Genera un reporte de cobertura de tests:

```bash
npm run test:coverage
```

El reporte de cobertura estará disponible en el directorio `coverage/`.

## 📚 Documentación de la API

### URL Base

```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

#### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### Posts
- `GET /api/posts` - Obtener todos los posts (con filtros)
- `GET /api/posts/:id` - Obtener post por ID
- `POST /api/posts` - Crear nuevo post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post

#### Comentarios
- `GET /api/posts/:postId/comments` - Obtener comentarios del post
- `POST /api/posts/:postId/comments` - Crear comentario
- `PUT /api/comments/:id` - Actualizar comentario
- `DELETE /api/comments/:id` - Eliminar comentario

#### Likes
- `POST /api/posts/:postId/like` - Dar/quitar like a un post
- `GET /api/posts/:postId/likes` - Obtener likes del post

## 📁 Estructura del Proyecto

```
server-game-of-bones/
├── src/
│   ├── config/          # Archivos de configuración
│   ├── controllers/     # Controladores de peticiones
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Rutas de la API
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos de TypeScript
│   ├── utils/           # Funciones utilitarias
│   ├── validators/      # Validación de inputs
│   ├── seeders/         # Seeders de base de datos
│   │   ├── dev/         # Seeders de desarrollo
│   │   └── test/        # Seeders de test
│   ├── database/        # Configuración de base de datos
│   └── server.ts        # Punto de entrada de la aplicación
├── tests/               # Archivos de tests
├── dist/                # JavaScript compilado
├── .env                 # Variables de entorno
├── .env.test            # Variables de entorno de test
├── tsconfig.json        # Configuración de TypeScript
├── jest.config.js       # Configuración de Jest
└── package.json         # Dependencias del proyecto
```

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado por:

| Desarrolladora | Rol | GitHub |
|---------------|-----|--------|
| **Ana Muruzábal** | Full Stack Developer | [@ana-github](https://github.com/AnaMurbl) |
| **MariCarmen Tajuelo** | Full Stack Developer | [@maricarmen-github](https://github.com/CarmenTajuelo) |
| **Ingrid Martinez** | Full Stack Developer | [@ingrid-github](https://github.com/ingridD2707) |
| **Nicole Guevara** | Full Stack Developer | [@nicole-github](https://github.com/nicolegugu93) |
| **Esther Tapias** | Full Stack Developer | [@esther-github](https://github.com/EstherTapias) |


## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea tu rama de feature (`git checkout -b feature/nombreDeTuRama`)
3. Haz commit de tus cambios (`git commit -m 'feat: añadir característica increíble'`)
4. Sube los cambios a tu rama (`git push origin feature/nombreDeTuRama`)
5. Abre un Pull Request

### Convención de Commits

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `refactor:` Refactorización de código
- `test:` Añadir o actualizar tests
- `chore:` Tareas de mantenimiento

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia ISC - mira el archivo [LICENSE](LICENSE) para más detalles.

## 🐛 Problemas

Si encuentras algún problema, por favor [abre un issue](https://github.com/Game-of-Bones/server-game-of-bones/issues).

## 📧 Contacto

Para preguntas o sugerencias, por favor contacta al equipo de desarrollo a través del repositorio de GitHub del proyecto.

---

**Hecho con 🦴 por el Equipo de Game of Bones**
