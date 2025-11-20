# 📌 Notas Importantes - Frontend Admin EduFinanzas

## ⚠️ Antes de Ejecutar el Proyecto

### 1. Verificar Backend Django

**CRÍTICO:** El backend Django debe estar corriendo antes de iniciar el frontend.

```bash
# En la terminal del backend:
cd BACKFRONT/BACKEND/EduFinanzas
python manage.py runserver
```

**Verificar que esté corriendo:**
```bash
curl http://localhost:8000/api/usuarios/
```

### 2. Verificar Configuración de CORS

En el archivo `settings.py` del backend Django, asegúrate de tener:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### 3. Verificar Base de Datos MySQL

La base de datos `juego_finanzas` debe existir y tener las siguientes tablas:
- ✅ usuarios
- ✅ temas
- ✅ retos
- ✅ tips_periodicas
- ✅ perfiles
- ✅ progreso

---

## 🔐 Credenciales de Administrador

Para acceder al panel, necesitas un usuario con rol "Administrador" en la base de datos.

### Crear Usuario Administrador (si no existe)

**Opción 1: Desde Django Admin**
```bash
python manage.py createsuperuser
```

**Opción 2: Desde MySQL**
```sql
INSERT INTO usuarios (correo, contrasena, rol)
VALUES ('admin@edufinanzas.com', 'tu_password_hash', 'Administrador');
```

**Opción 3: Desde la API**
```bash
curl -X POST http://localhost:8000/api/usuarios/ \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@edufinanzas.com",
    "contrasena": "tu_password",
    "rol": "Administrador"
  }'
```

---

## 📝 Configuraciones Importantes

### Modificar URL del Backend

Si tu backend NO está en `http://localhost:8000`, edita:

**Archivo:** `src/services/api.js`

```javascript
// Línea 18
const API_BASE_URL = 'http://TU_SERVIDOR:PUERTO/api';
```

### Modificar Puerto del Frontend

Si el puerto 5173 está ocupado, edita:

**Archivo:** `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Cambia a otro puerto
    open: true
  }
})
```

---

## 🗂️ Gestión de Archivos/Imágenes

### Configuración de Media Files en Django

Asegúrate de que el backend tenga configurado:

**En `settings.py`:**
```python
MEDIA_ROOT = BASE_DIR / 'mediafiles'
MEDIA_URL = 'media/'
```

**En `urls.py`:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... tus urls
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Subir Imágenes

Al subir imágenes desde el frontend:
- Se envían como `FormData` (multipart/form-data)
- El backend las guarda en `mediafiles/`
- Las URLs se construyen como: `http://localhost:8000/media/nombre_archivo.jpg`

---

## 🐛 Problemas Comunes y Soluciones

### 1. Error: "Network Error" al hacer login

**Causa:** Backend no está corriendo o CORS no configurado

**Solución:**
```bash
# Verificar backend
curl http://localhost:8000/api/usuarios/

# Verificar CORS en settings.py
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

### 2. Error: "Unauthorized" después de login

**Causa:** Token JWT no válido o usuario no es administrador

**Solución:**
- Verificar en localStorage que el token exista
- Verificar en la BD que el usuario tenga `rol = 'Administrador'`

### 3. Imágenes no se cargan

**Causa:** Rutas de media files no configuradas en Django

**Solución:**
- Verificar `MEDIA_ROOT` y `MEDIA_URL` en Django
- Verificar que las imágenes existan en `mediafiles/`

### 4. Error 404 en rutas del frontend

**Causa:** React Router no encuentra la ruta

**Solución:**
- Todas las rutas están en `src/rutas/AppRouter.jsx`
- Verificar que la ruta exista
- Rutas protegidas requieren autenticación

### 5. Error: "Cannot read property of undefined"

**Causa:** Datos del backend no tienen la estructura esperada

**Solución:**
- Verificar la estructura de datos en la consola del navegador
- Verificar serializers en Django
- Añadir validaciones en el frontend

---

## 🔍 Debugging

### Ver Errores en el Frontend

**Consola del Navegador:**
- Abrir DevTools (F12)
- Pestaña "Console" para errores JavaScript
- Pestaña "Network" para peticiones HTTP

### Ver Peticiones HTTP

**En la pestaña Network:**
- Ver todas las peticiones a la API
- Ver status codes (200, 401, 404, 500)
- Ver request/response headers y body

### Ver Estado de React

**Instalar React DevTools:**
- Extension para Chrome/Firefox
- Ver estado de componentes
- Ver context values

---

## 📊 Estructura de Datos

### Usuario
```javascript
{
  id_usuario: 1,
  correo: "admin@edufinanzas.com",
  rol: "Administrador",  // o "Usuario"
  fecha_registro: "2024-01-01T00:00:00Z"
}
```

### Tema
```javascript
{
  id_tema: 1,
  nombre: "Ahorro",
  descripcion: "Aprende a ahorrar",
  informacion_tema: "Contenido completo...",
  img_temas: "/media/temas/imagen.jpg"
}
```

### Reto
```javascript
{
  id_reto: 1,
  nombre_reto: "Desafío de Ahorro",
  id_tema: 1,
  descripcion: "Descripción del reto",
  pregunta: "¿Cuál es la mejor forma de ahorrar?",
  respuesta_uno: "Opción 1",
  respuesta_dos: "Opción 2",
  respuesta_tres: "Opción 3",
  respuesta_cuatro: "Opción 4",
  respuestaCorrecta: "Opción 1",
  recompensa_monedas: 10,
  costo_monedas: 5,
  img_reto: "/media/retos/imagen.jpg"
}
```

### Tip
```javascript
{
  id_recompensa: 1,
  id_perfil: 1,
  nombre: "Tip de Ahorro",
  descripcion: "Ahorra el 10% de tu sueldo..."
}
```

---

## 🎯 Extensión del Proyecto

### Agregar Nuevo Módulo CRUD

1. **Crear página en** `src/pages/admin/NuevoModulo.jsx`
2. **Agregar servicios en** `src/services/api.js`
3. **Agregar ruta en** `src/rutas/AppRouter.jsx`
4. **Agregar enlace en** `src/components/Sidebar.jsx`

### Ejemplo: Agregar módulo de Perfiles

**1. Servicios (api.js):**
```javascript
export const obtenerPerfiles = async () => {
  const response = await api.get('/perfiles/');
  return response.data;
};
```

**2. Página (Perfiles.jsx):**
```javascript
// Copiar estructura de Usuarios.jsx
// Modificar endpoints y campos
```

**3. Ruta (AppRouter.jsx):**
```javascript
<Route
  path="/admin/perfiles"
  element={
    <AdminRoute>
      <AdminLayout>
        <Perfiles />
      </AdminLayout>
    </AdminRoute>
  }
/>
```

**4. Sidebar (Sidebar.jsx):**
```javascript
<NavLink to="/admin/perfiles" className="sidebar-link">
  <span className="sidebar-icon">👤</span>
  <span className="sidebar-text">Perfiles</span>
</NavLink>
```

---

## 🔒 Seguridad

### Tokens JWT

- Los tokens se almacenan en `localStorage`
- Se añaden automáticamente en headers de Axios
- Expiran según configuración del backend
- Al expirar, se redirige automáticamente a login

### Protección de Rutas

- Todas las rutas admin están protegidas con `AdminRoute`
- Verifican que el usuario esté autenticado
- Verifican que el rol sea "Administrador"

### Validaciones

- Validaciones en el frontend (UX)
- Validaciones en el backend (seguridad)
- Nunca confiar solo en validaciones del frontend

---

## 📦 Dependencias del Proyecto

### Dependencias de Producción
```json
{
  "axios": "^1.7.7",           // Cliente HTTP
  "bootstrap": "^5.3.3",       // Framework CSS
  "react": "^18.3.1",          // Librería UI
  "react-bootstrap": "^2.10.5", // Componentes React
  "react-dom": "^18.3.1",      // React DOM
  "react-router-dom": "^6.28.0" // Enrutamiento
}
```

### Dependencias de Desarrollo
```json
{
  "@vitejs/plugin-react": "^4.3.3",  // Plugin Vite
  "vite": "^5.4.10"                   // Build tool
}
```

---

## 🚀 Despliegue a Producción

### Build de Producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con archivos optimizados.

### Servir Archivos Estáticos

**Opción 1: Servidor Node.js**
```bash
npm install -g serve
serve -s dist -p 3000
```

**Opción 2: Nginx**
```nginx
server {
  listen 80;
  server_name tu-dominio.com;

  location / {
    root /ruta/a/dist;
    try_files $uri /index.html;
  }
}
```

**Opción 3: Vercel/Netlify**
- Conectar repositorio Git
- Configurar build command: `npm run build`
- Configurar output directory: `dist`

### Actualizar URL del Backend

**En producción, cambiar:**
```javascript
// src/services/api.js
const API_BASE_URL = 'https://api.tu-dominio.com/api';
```

---

## 📞 Contacto y Soporte

Si tienes dudas o problemas:

1. Revisar la documentación en `README.md`
2. Revisar esta guía de notas importantes
3. Revisar la consola del navegador
4. Verificar que el backend esté funcionando
5. Contactar al equipo de desarrollo

---

## ✅ Checklist Pre-Ejecución

Antes de ejecutar el proyecto, verifica:

- [ ] Backend Django corriendo en `http://localhost:8000`
- [ ] Base de datos MySQL configurada y con datos
- [ ] CORS configurado en Django
- [ ] Usuario administrador creado en la BD
- [ ] Node.js >= 16.x instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Puerto 5173 disponible

---

**Última actualización:** Noviembre 2024

**Notas:** Esta guía debe actualizarse si se realizan cambios importantes en la configuración del proyecto.
