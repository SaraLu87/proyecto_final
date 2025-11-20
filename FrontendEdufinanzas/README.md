# 🏦 EduFinanzas - Panel de Administración

Panel de administración completo para la plataforma de educación financiera EduFinanzas, desarrollado con React, Vite, Bootstrap y conectado a un backend Django/MySQL.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Componentes Principales](#componentes-principales)
- [Rutas](#rutas)
- [Guía de Uso](#guía-de-uso)

---

## ✨ Características

- ✅ **Sistema de autenticación JWT** con roles de administrador
- ✅ **Dashboard interactivo** con estadísticas en tiempo real
- ✅ **CRUD completo** para todas las entidades del sistema
- ✅ **Gestión de Usuarios** (crear, editar, eliminar, cambiar roles)
- ✅ **Gestión de Temas** educativos con carga de imágenes
- ✅ **Gestión de Retos** con preguntas de opción múltiple
- ✅ **Gestión de Tips** periódicas
- ✅ **Sidebar dinámico** con navegación
- ✅ **Diseño responsivo** adaptado a móviles y tablets
- ✅ **Búsqueda y filtros** en todas las tablas
- ✅ **Modales** para formularios de creación y edición
- ✅ **Notificaciones** de éxito y error
- ✅ **Código limpio** con comentarios explicativos

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Librería de UI
- **Vite 5.4.10** - Build tool y dev server
- **React Router DOM 6.28.0** - Enrutamiento
- **Axios 1.7.7** - Cliente HTTP
- **Bootstrap 5.3.3** - Framework CSS
- **React Bootstrap 2.10.5** - Componentes React de Bootstrap

### Backend (Existente)
- **Django 5.2.7** - Framework backend
- **Django REST Framework** - API REST
- **MySQL** - Base de datos
- **JWT** - Autenticación

---

## 📁 Estructura del Proyecto

```
FrontendEdufinanzas/
├── public/                      # Archivos estáticos públicos
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Header.jsx          # Barra de navegación superior
│   │   ├── Header.css
│   │   ├── Footer.jsx          # Pie de página
│   │   ├── Footer.css
│   │   ├── Sidebar.jsx         # Menú lateral de navegación
│   │   └── Sidebar.css
│   │
│   ├── context/                 # Context API (estado global)
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   │
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── auth/
│   │   │   ├── Login.jsx       # Página de login
│   │   │   └── Login.css
│   │   │
│   │   └── admin/               # Páginas del panel admin
│   │       ├── Dashboard.jsx   # Panel principal
│   │       ├── Dashboard.css
│   │       ├── Usuarios.jsx    # CRUD de usuarios
│   │       ├── Usuarios.css    # Estilos compartidos CRUD
│   │       ├── Temas.jsx       # CRUD de temas
│   │       ├── Retos.jsx       # CRUD de retos
│   │       └── Tips.jsx        # CRUD de tips
│   │
│   ├── rutas/                   # Configuración de rutas
│   │   ├── AppRouter.jsx       # Router principal
│   │   └── AdminRoute.jsx      # Protección de rutas
│   │
│   ├── services/                # Servicios y APIs
│   │   └── api.js              # Cliente Axios configurado
│   │
│   ├── styles/                  # Estilos globales
│   │   └── global.css          # CSS global
│   │
│   ├── App.jsx                  # Componente raíz
│   └── main.jsx                 # Punto de entrada
│
├── index.html                   # HTML principal
├── vite.config.js              # Configuración de Vite
├── package.json                 # Dependencias del proyecto
├── .gitignore                  # Archivos ignorados por git
└── README.md                    # Este archivo
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 16.x
- **npm** >= 8.x
- **Backend Django** corriendo en `http://localhost:8000`
- **MySQL** con la base de datos `juego_finanzas` configurada

---

## 🚀 Instalación

1. **Clonar o descargar el proyecto**

2. **Navegar a la carpeta del proyecto**
```bash
cd FrontendEdufinanzas
```

3. **Instalar dependencias**
```bash
npm install
```

---

## ⚙️ Configuración

### Configuración del Backend

Asegúrate de que tu backend Django esté configurado correctamente:

1. El backend debe estar corriendo en: `http://localhost:8000`
2. Los endpoints de la API deben estar en: `http://localhost:8000/api/`
3. CORS debe estar habilitado para: `http://localhost:5173`

### Modificar URL de la API (Opcional)

Si tu backend está en otra URL, modifica el archivo `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor:puerto/api';
```

---

## ▶️ Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

### Preview de Producción

```bash
npm run preview
```

---

## 🎯 Funcionalidades

### 1. **Autenticación**
- Login con email y contraseña
- Validación de rol de administrador
- Persistencia de sesión con localStorage
- Token JWT en todas las peticiones
- Cierre de sesión

### 2. **Dashboard**
- Estadísticas en tiempo real:
  - Total de usuarios
  - Total de temas
  - Total de retos
  - Total de tips
- Tarjetas interactivas con enlace a cada módulo
- Acciones rápidas

### 3. **Gestión de Usuarios (CRUD)**
- ✅ Listar todos los usuarios
- ✅ Buscar usuarios por correo o rol
- ✅ Crear nuevo usuario
- ✅ Editar usuario existente
- ✅ Actualizar rol (Usuario/Administrador)
- ✅ Eliminar usuario con confirmación
- ✅ Ver fecha de registro

### 4. **Gestión de Temas (CRUD)**
- ✅ Listar todos los temas educativos
- ✅ Buscar temas por nombre o descripción
- ✅ Crear nuevo tema con:
  - Nombre
  - Descripción
  - Información completa del tema
  - Imagen (upload)
- ✅ Editar tema existente
- ✅ Actualizar imagen del tema
- ✅ Eliminar tema con confirmación
- ✅ Previsualización de imágenes

### 5. **Gestión de Retos (CRUD)**
- ✅ Listar todos los retos
- ✅ Buscar retos por nombre o descripción
- ✅ Crear nuevo reto con:
  - Título del reto
  - Tema asociado
  - Descripción
  - Pregunta principal
  - 4 opciones de respuesta
  - Respuesta correcta
  - Recompensa en monedas
  - Costo en monedas
  - Imagen (upload)
- ✅ Editar reto existente
- ✅ Eliminar reto con confirmación
- ✅ Formulario en dos secciones: Información básica y Preguntas

### 6. **Gestión de Tips (CRUD)**
- ✅ Listar todos los tips
- ✅ Buscar tips por nombre o descripción
- ✅ Crear nuevo tip con:
  - Nombre del tip
  - Descripción/contenido
  - ID de perfil asociado
- ✅ Editar tip existente
- ✅ Eliminar tip con confirmación

### 7. **Características Adicionales**
- ✅ Sidebar colapsable en dispositivos móviles
- ✅ Modales para formularios
- ✅ Validación de formularios
- ✅ Mensajes de éxito y error
- ✅ Loader durante peticiones
- ✅ Diseño responsivo
- ✅ Paleta de colores consistente (azul-verde)

---

## 🔌 API Endpoints

El frontend consume los siguientes endpoints del backend:

### Autenticación
```
POST   /api/login_usuario/          - Login de administrador
```

### Usuarios
```
GET    /api/usuarios/               - Listar usuarios
GET    /api/usuarios/{id}/          - Obtener usuario
POST   /api/usuarios/               - Crear usuario
PUT    /api/usuarios/{id}/          - Actualizar usuario
DELETE /api/usuarios/{id}/          - Eliminar usuario
```

### Temas
```
GET    /api/temas/                  - Listar temas
GET    /api/temas/{id}/             - Obtener tema
POST   /api/temas/                  - Crear tema (multipart/form-data)
PUT    /api/temas/{id}/             - Actualizar tema (multipart/form-data)
DELETE /api/temas/{id}/             - Eliminar tema
```

### Retos
```
GET    /api/retos/                  - Listar retos
GET    /api/retos/{id}/             - Obtener reto
POST   /api/retos/                  - Crear reto (multipart/form-data)
PUT    /api/retos/{id}/             - Actualizar reto (multipart/form-data)
DELETE /api/retos/{id}/             - Eliminar reto
```

### Tips
```
GET    /api/tips/                   - Listar tips
GET    /api/tips/{id}/              - Obtener tip
POST   /api/tips/                   - Crear tip
PUT    /api/tips/{id}/              - Actualizar tip
DELETE /api/tips/{id}/              - Eliminar tip
```

---

## 🧩 Componentes Principales

### AuthContext
**Ubicación:** `src/context/AuthContext.jsx`

Maneja toda la lógica de autenticación:
- Estado del usuario autenticado
- Funciones de login y logout
- Verificación de rol de administrador
- Persistencia de sesión

### Header
**Ubicación:** `src/components/Header.jsx`

Barra de navegación superior con:
- Logo de la aplicación
- Nombre del usuario
- Botón de cerrar sesión

### Sidebar
**Ubicación:** `src/components/Sidebar.jsx`

Menú lateral con navegación a:
- Dashboard
- Usuarios
- Temas
- Retos
- Tips

Incluye:
- Indicador de sección activa
- Colapsable en móviles con botón hamburguesa

### Footer
**Ubicación:** `src/components/Footer.jsx`

Pie de página con:
- Frase motivacional
- Enlaces (Sobre Nosotros, Misión, Políticas, Contacto)
- Copyright

---

## 🛣️ Rutas

### Públicas
- `/login` - Página de inicio de sesión

### Protegidas (requieren autenticación de administrador)
- `/admin` - Dashboard principal
- `/admin/usuarios` - Gestión de usuarios
- `/admin/temas` - Gestión de temas
- `/admin/retos` - Gestión de retos
- `/admin/tips` - Gestión de tips

### Redirecciones
- `/` - Redirige a `/admin` (si autenticado) o `/login`
- `*` - Cualquier ruta no encontrada redirige según autenticación

---

## 📖 Guía de Uso

### 1. Iniciar Sesión

1. Acceder a `http://localhost:5173/login`
2. Ingresar credenciales de administrador:
   - Correo: `admin@edufinanzas.com` (ejemplo)
   - Contraseña: tu contraseña de administrador
3. Hacer clic en "Iniciar Sesión"

### 2. Navegar por el Dashboard

- El dashboard muestra estadísticas de la plataforma
- Hacer clic en cualquier tarjeta para ir al módulo correspondiente
- Usar el sidebar para navegar entre módulos

### 3. Crear un Nuevo Usuario

1. Ir a "Usuarios" en el sidebar
2. Hacer clic en "➕ Crear Usuario"
3. Llenar el formulario:
   - Correo electrónico
   - Contraseña
   - Rol (Usuario o Administrador)
4. Hacer clic en "Crear"

### 4. Crear un Nuevo Tema

1. Ir a "Temas" en el sidebar
2. Hacer clic en "➕ Crear Tema"
3. Llenar el formulario:
   - Nombre del tema
   - Descripción
   - Información completa
   - Seleccionar imagen
4. Hacer clic en "Crear"

### 5. Crear un Nuevo Reto

1. Ir a "Retos" en el sidebar
2. Hacer clic en "➕ Crear Reto"
3. Llenar la información básica:
   - Título del reto
   - Tema asociado
   - Descripción
   - Recompensa y costo en monedas
   - Imagen (opcional)
4. Llenar las preguntas:
   - Pregunta principal
   - 4 opciones de respuesta
   - Seleccionar la respuesta correcta
5. Hacer clic en "Guardar Reto"

### 6. Editar o Eliminar

- En cualquier tabla, usar los botones de acción:
  - ✏️ Editar
  - 🗑️ Eliminar (con confirmación)

### 7. Buscar

- Usar la barra de búsqueda en cada módulo
- La búsqueda filtra en tiempo real por nombre, descripción, correo, etc.

---

## 🎨 Paleta de Colores

La aplicación utiliza una paleta de colores consistente:

- **Azul Primario:** `#2F7AD9`
- **Verde Secundario:** `#52E36A`
- **Texto Oscuro:** `#1C3A63`
- **Texto Medio:** `#475569`
- **Fondo Claro:** `#f5f7fa`
- **Éxito:** `#16a34a`
- **Error:** `#dc2626`

Los gradientes se aplican en:
- Header y Footer
- Botones principales
- Iconos del sidebar
- Tarjetas del dashboard

---

## 🔒 Seguridad

- ✅ Autenticación con JWT
- ✅ Tokens almacenados en localStorage
- ✅ Rutas protegidas con AdminRoute
- ✅ Validación de rol en cada petición
- ✅ Interceptores de Axios para manejo de errores
- ✅ Redirección automática si token expira

---

## 📱 Responsive Design

La aplicación es completamente responsiva:

- **Desktop** (>1024px): Layout completo con sidebar fijo
- **Tablet** (768px-1024px): Sidebar colapsable
- **Mobile** (<768px):
  - Sidebar en modo overlay
  - Botón hamburguesa para abrir menú
  - Tablas con scroll horizontal
  - Formularios adaptados

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to backend"
- Verificar que el backend Django esté corriendo en `http://localhost:8000`
- Verificar configuración de CORS en el backend

### Error: "Unauthorized" o redirección a login
- El token puede haber expirado
- Verificar que el usuario tenga rol "Administrador"

### Imágenes no se cargan
- Verificar que el backend esté configurado para servir archivos estáticos
- Verificar la ruta de `MEDIA_URL` en Django

---

## 👨‍💻 Desarrollo

### Agregar un Nuevo Módulo CRUD

1. Crear nueva página en `src/pages/admin/NuevoModulo.jsx`
2. Agregar servicios de API en `src/services/api.js`
3. Agregar ruta en `src/rutas/AppRouter.jsx`
4. Agregar enlace en `src/components/Sidebar.jsx`

### Modificar Estilos

- **Estilos globales:** `src/styles/global.css`
- **Estilos de componente:** Archivo `.css` correspondiente
- **Variables CSS:** Definidas en `:root` de `global.css`

---

## 📄 Licencia

Este proyecto es parte de EduFinanzas - Plataforma de Educación Financiera.

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Mantener la estructura de carpetas
2. Seguir la convención de nombres
3. Documentar el código con comentarios
4. Probar antes de hacer commit
5. Mantener el diseño consistente

---

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para EduFinanzas**

*Última actualización: 2024*
