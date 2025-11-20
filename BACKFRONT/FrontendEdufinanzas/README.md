# FrontendEdufinanzas

Aplicación web de educación financiera para jóvenes a partir de 14 años, construida con React, Vite, Bootstrap y conectada a un backend Django con MySQL.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Características](#características)
- [Flujo de la Aplicación](#flujo-de-la-aplicación)
- [Conexión con el Backend](#conexión-con-el-backend)

## 📖 Descripción

EduFinanzas es una plataforma interactiva de educación financiera que permite a jóvenes aprender conceptos básicos de finanzas mediante:
- Temas educativos con información estructurada
- Retos gamificados con preguntas y recompensas
- Sistema de monedas virtuales
- Tips financieros periódicos
- Seguimiento de progreso

## 🚀 Tecnologías

- **React 19.2.0** - Librería de UI
- **Vite 7.2.2** - Build tool y dev server
- **React Router DOM 7.9.6** - Enrutamiento
- **React Bootstrap 2.10.10** - Componentes UI
- **Bootstrap 5.3.8** - Framework CSS
- **Axios 1.13.2** - Cliente HTTP
- **JWT** - Autenticación basada en tokens

## 📁 Estructura del Proyecto

```
FrontendEdufinanzas/
├── public/
│   └── assets/              # Imágenes estáticas (logo, default images)
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Header/
│   │   │   ├── Header.jsx   # Header adaptable (public/user/admin)
│   │   │   └── Header.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx   # Footer reutilizable
│   │   │   └── Footer.css
│   │   ├── TemaCard/        # Tarjeta de tema
│   │   ├── TipCard/         # Tarjeta de tip
│   │   ├── RetoCard/        # Tarjeta de reto
│   │   ├── ProgressBar/     # Barra de progreso
│   │   ├── TipModal/        # Modal para tips
│   │   ├── ProtectedRoute/  # Protección de rutas privadas
│   │   └── AdminRoute/      # Protección de rutas admin
│   │
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Home/            # Página de inicio (pública)
│   │   ├── Login/           # Inicio de sesión
│   │   ├── Register/        # Registro de usuarios
│   │   ├── Temas/           # Lista de temas (protegida)
│   │   ├── TemasRetos/      # Información del tema y lista de retos
│   │   ├── Retos/           # Pantalla de retos con círculos
│   │   ├── PerfilUsuario/   # Perfil del usuario
│   │   └── Admin/           # Panel de administración (CRUD)
│   │
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto de autenticación global
│   │
│   ├── services/
│   │   └── api.js           # Servicios de conexión con backend
│   │
│   ├── styles/
│   │   └── global.css       # Estilos globales
│   │
│   ├── App.jsx              # Componente principal con rutas
│   └── main.jsx             # Punto de entrada
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 📦 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Backend Django corriendo en `http://localhost:8000`

### Pasos

1. **Instalar dependencias:**
```bash
cd FrontendEdufinanzas
npm install
```

2. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

3. **Compilar para producción:**
```bash
npm run build
```

4. **Previsualizar build de producción:**
```bash
npm run preview
```

## ⚙️ Configuración

### Configuración del Backend

El frontend está configurado para conectarse al backend en `http://localhost:8000/api`

Si necesitas cambiar la URL del backend, edita el archivo `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'
export const MEDIA_BASE_URL = 'http://localhost:8000/media'
```

### Variables de Entorno (Opcional)

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MEDIA_BASE_URL=http://localhost:8000/media
```

## ✨ Características

### Rutas Públicas

- **/** - Página de inicio
  - Presentación de EduFinanzas
  - Listado de temas disponibles
  - Tips periódicos (accesibles sin login)

- **/login** - Inicio de sesión
  - Validación de credenciales
  - Autenticación con JWT
  - Redirección según rol (admin/usuario)

- **/registro** - Registro de nuevos usuarios
  - Validación de correo único
  - Validación de contraseña segura
  - Creación de usuario y perfil

### Rutas Protegidas (Requieren Autenticación)

- **/temas** - Lista de temas
  - Muestra todos los temas
  - Indicador de progreso por tema
  - Temas bloqueados/desbloqueados

- **/temas/:idTema/retos** - Información del tema y retos
  - Información teórica del tema
  - Lista de retos del tema
  - Indicador de retos completados

- **/retos/:idReto** - Pantalla de reto
  - Círculo 1: Descripción teórica
  - Círculo 2: Preguntas con 4 opciones
  - Sistema de recompensas en monedas

- **/perfil** - Perfil del usuario
  - Ver y editar información personal
  - Actualizar foto de perfil
  - Cambiar contraseña
  - Ver estadísticas de progreso

### Rutas de Administrador

- **/admin** - Panel de administración
  - CRUD de temas
  - CRUD de retos
  - CRUD de tips periódicos
  - Gestión de usuarios
  - Estadísticas globales

## 🔄 Flujo de la Aplicación

### Usuario No Autenticado

1. Visita la página de inicio
2. Ve los temas y tips disponibles
3. Al hacer click en un tema, se redirige a Login
4. Puede registrarse o iniciar sesión

### Usuario Autenticado

1. Inicia sesión
2. Ve la pantalla de Temas
3. Selecciona un tema desbloqueado
4. Lee la información del tema
5. Accede al primer reto (costo 0 monedas)
6. Lee la teoría y responde preguntas
7. Gana monedas al completar el reto
8. Usa las monedas para desbloquear siguientes retos
9. Completa todos los retos para desbloquear el siguiente tema

### Administrador

1. Inicia sesión con cuenta de administrador
2. Accede al panel de administración
3. Gestiona temas, retos, tips y usuarios
4. Ve estadísticas de uso

## 🔌 Conexión con el Backend

### Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:

1. El usuario inicia sesión en `/api/login_usuario/`
2. El backend devuelve un token JWT
3. El token se almacena en localStorage
4. Todas las peticiones subsiguientes incluyen el token en el header `Authorization: Bearer {token}`

### Endpoints del Backend

**Autenticación:**
- `POST /api/login_usuario/` - Iniciar sesión

**Usuarios:**
- `GET /api/usuarios/` - Listar usuarios (admin)
- `GET /api/usuarios/{id}/` - Obtener usuario
- `POST /api/usuarios/` - Crear usuario
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario

**Perfiles:**
- `GET /api/perfiles/` - Listar perfiles
- `GET /api/perfiles/{id}/` - Obtener perfil
- `POST /api/perfiles/` - Crear perfil
- `PUT /api/perfiles/{id}/` - Actualizar perfil

**Temas:**
- `GET /api/temas/` - Listar temas
- `GET /api/temas/{id}/` - Obtener tema
- `POST /api/temas/` - Crear tema (admin)
- `PUT /api/temas/{id}/` - Actualizar tema (admin)
- `DELETE /api/temas/{id}/` - Eliminar tema (admin)

**Retos:**
- `GET /api/retos/` - Listar retos
- `GET /api/retos/{id}/` - Obtener reto
- `GET /api/retos/?id_tema={id}` - Retos de un tema
- `POST /api/retos/` - Crear reto (admin)
- `PUT /api/retos/{id}/` - Actualizar reto (admin)
- `DELETE /api/retos/{id}/` - Eliminar reto (admin)
- `POST /api/solucionar_reto/` - Resolver un reto

**Tips:**
- `GET /api/tips/` - Listar tips
- `GET /api/tips/{id}/` - Obtener tip
- `POST /api/tips/` - Crear tip (admin)
- `PUT /api/tips/{id}/` - Actualizar tip (admin)
- `DELETE /api/tips/{id}/` - Eliminar tip (admin)

**Progreso:**
- `GET /api/progresos/` - Listar progresos
- `GET /api/progresos/?id_perfil={id}` - Progreso de un perfil
- `GET /api/progresos/?id_perfil={id}&id_reto={id}` - Progreso específico
- `POST /api/progresos/` - Crear registro de progreso
- `PUT /api/progresos/{id}/` - Actualizar progreso

### Manejo de Imágenes

Las imágenes se sirven desde el backend:

```javascript
// URL de imagen de tema
http://localhost:8000/media/temas/nombre_imagen.png

// URL de imagen de reto
http://localhost:8000/media/retos/nombre_imagen.png

// URL de foto de perfil
http://localhost:8000/media/perfiles/nombre_imagen.png
```

**IMPORTANTE:** Asegúrate de que:
1. El backend tenga CORS configurado correctamente
2. El directorio `mediafiles/` esté configurado en el backend
3. Las rutas de imágenes en la BD sean relativas (ej: `temas/imagen.png`)

## 🎨 Personalización

### Colores

Los colores principales están definidos en `src/styles/global.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

### Logo

Coloca tu logo en `public/assets/logo.png`

### Imágenes por Defecto

- `public/assets/tema-default.png` - Imagen por defecto para temas
- `public/assets/reto-default.png` - Imagen por defecto para retos

## 📝 Notas Importantes

1. **Contraseñas Seguras:** El sistema valida que las contraseñas tengan:
   - Mínimo 8 caracteres
   - Al menos una mayúscula
   - Al menos una minúscula
   - Al menos un número
   - Al menos un carácter especial

2. **Sistema de Monedas:**
   - Los usuarios comienzan con 0 monedas
   - El primer reto de cada tema cuesta 0 monedas
   - Al completar un reto, se ganan monedas (recompensa_monedas)
   - Para acceder a retos subsiguientes, se deben tener suficientes monedas

3. **Progreso:**
   - El progreso se guarda automáticamente
   - Los usuarios pueden desconectarse y retomar donde lo dejaron
   - La barra de progreso se actualiza parcialmente

4. **Validaciones:**
   - Todos los formularios tienen validación client-side
   - Los errores del backend se muestran de forma amigable
   - Se previenen ataques comunes (XSS, SQL injection desde el backend)

## 🐛 Solución de Problemas

### Error de CORS

Si ves errores de CORS en la consola:

1. Verifica que el backend tenga configurado CORS:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### Imágenes no cargan

1. Verifica que el backend esté sirviendo archivos media
2. Verifica que la URL del MEDIA_BASE_URL sea correcta
3. Verifica que las imágenes existan en el backend

### Token expirado

Los tokens JWT tienen un tiempo de expiración. Si el token expira:
1. El usuario será redirigido automáticamente al login
2. Deberá iniciar sesión nuevamente

## 👥 Roles de Usuario

### Usuario Regular
- Ver y completar temas y retos
- Actualizar su perfil
- Ver su progreso

### Administrador
- Todas las funciones de usuario regular
- Crear, editar y eliminar temas
- Crear, editar y eliminar retos
- Crear, editar y eliminar tips
- Gestionar usuarios
- Ver estadísticas globales

## 📄 Licencia

Este proyecto es parte de un sistema educativo y está sujeto a las políticas de la institución.

---

**Desarrollado con ❤️ para EduFinanzas**
