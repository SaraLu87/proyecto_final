# 🚀 Guía de Instalación - FrontendEdufinanzas

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

### Obligatorios
- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **npm** v9 o superior (viene con Node.js)
- **Backend Django** corriendo en `http://localhost:8000`

### Verificar Instalación
```bash
# Verificar Node.js
node --version
# Debería mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debería mostrar: 9.x.x o superior
```

---

## 🔧 Instalación Paso a Paso

### 1. Navegar al Proyecto
```bash
cd C:\Users\USER\BACKFRONT\FrontendEdufinanzas
```

### 2. Instalar Dependencias
```bash
npm install
```

Este comando instalará:
- react (19.2.0)
- react-dom (19.2.0)
- react-router-dom (7.9.6)
- react-bootstrap (2.10.10)
- bootstrap (5.3.8)
- axios (1.13.2)
- vite (7.2.2)
- Y todas las dependencias de desarrollo

**Tiempo estimado:** 2-3 minutos

### 3. Verificar Backend

Antes de iniciar el frontend, verifica que el backend esté corriendo:

```bash
# En otra terminal, navega al backend
cd C:\Users\USER\BACKFRONT\BACKEND\EduFinanzas

# Activa el entorno virtual (si aplica)
# En Windows:
venv\Scripts\activate

# Inicia el servidor Django
python manage.py runserver
```

Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
```

### 4. Iniciar el Frontend
```bash
# En la terminal del frontend
npm run dev
```

Deberías ver:
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Abrir en el Navegador

El navegador debería abrirse automáticamente en:
```
http://localhost:5173
```

Si no se abre automáticamente, copia y pega la URL en tu navegador.

---

## ✅ Verificación de la Instalación

### Checklist

- [ ] Node.js y npm instalados
- [ ] Dependencias instaladas sin errores
- [ ] Backend Django corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 5173
- [ ] Página de inicio carga correctamente
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores de CORS

### Pruebas Básicas

1. **Probar página de inicio:**
   - Deberías ver el título "Aprende a manejar el dinero como un pro"
   - Deberían cargar los temas desde el backend
   - Deberían cargar los tips periódicos

2. **Probar navegación:**
   - Click en "Iniciar Sesión" → Debería redirigir a `/login`
   - Click en "Crear cuenta" → Debería redirigir a `/registro`
   - Click en "Volver a inicio" → Debería redirigir a `/`

3. **Probar tips:**
   - Click en cualquier tip → Debería abrir modal con descripción completa

---

## 🐛 Solución de Problemas

### Error: "npm: command not found"
**Problema:** Node.js/npm no está instalado o no está en el PATH

**Solución:**
1. Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)
2. Reinicia la terminal
3. Verifica con `node --version`

---

### Error: "Cannot find module 'vite'"
**Problema:** Las dependencias no se instalaron correctamente

**Solución:**
```bash
# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala las dependencias
npm install
```

---

### Error de CORS
**Problema:** El backend no permite peticiones desde el frontend

**Síntoma:** En la consola del navegador ves:
```
Access to XMLHttpRequest at 'http://localhost:8000/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solución:**
1. Abre `BACKEND/EduFinanzas/eduFinanzas/settings.py`
2. Verifica que tengas:
```python
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    # ...
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

3. Si no tienes `corsheaders`, instálalo:
```bash
pip install django-cors-headers
```

4. Reinicia el servidor Django

---

### Puerto 5173 ya está en uso
**Problema:** Otro proceso está usando el puerto 5173

**Solución Opción 1 - Cambiar puerto:**
```bash
npm run dev -- --port 5174
```

**Solución Opción 2 - Matar el proceso:**
```bash
# En Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# En Linux/Mac
lsof -ti:5173 | xargs kill -9
```

---

### Imágenes no cargan
**Problema:** Las imágenes del backend no se muestran

**Solución:**
1. Verifica que el backend esté sirviendo archivos media
2. Abre `BACKEND/EduFinanzas/eduFinanzas/urls.py`
3. Agrega al final:
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... tus rutas
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

4. Verifica que en `settings.py` tengas:
```python
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'
```

5. Reinicia el servidor Django

---

### Error 404 en las rutas
**Problema:** Al recargar la página en una ruta que no es `/`, obtienes 404

**Solución:**
Este es comportamiento normal en desarrollo con Vite. Las rutas funcionan correctamente al navegar desde la aplicación.

Para producción, necesitarás configurar el servidor web para redirigir todas las rutas a `index.html`.

---

### Error: "localStorage is not defined"
**Problema:** Estás ejecutando código en el servidor

**Solución:**
Esto no debería ocurrir con la configuración actual, pero si sucede:
1. Verifica que estás usando el navegador para acceder a la aplicación
2. No ejecutes el código directamente en Node.js

---

## 🔄 Comandos Útiles

### Durante el Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json && npm install

# Ver versiones instaladas
npm list --depth=0
```

### Debugging

```bash
# Ver logs detallados
npm run dev -- --debug

# Limpiar cache de Vite
rm -rf node_modules/.vite

# Verificar problemas con dependencias
npm audit

# Arreglar problemas menores automáticamente
npm audit fix
```

---

## 📦 Dependencias Instaladas

### Producción
```json
{
  "axios": "^1.13.2",          // Cliente HTTP
  "bootstrap": "^5.3.8",        // Framework CSS
  "react": "^19.2.0",           // Librería UI
  "react-bootstrap": "^2.10.10", // Componentes React
  "react-dom": "^19.2.0",       // React DOM
  "react-router-dom": "^7.9.6"  // Enrutamiento
}
```

### Desarrollo
```json
{
  "@vitejs/plugin-react": "^5.1.0",  // Plugin Vite para React
  "eslint": "^9.39.1",                // Linter
  "vite": "^7.2.2"                    // Build tool
}
```

**Tamaño total de node_modules:** ~300-400 MB

---

## 🌐 URLs del Proyecto

### Frontend
- **Desarrollo:** http://localhost:5173
- **Producción (después de build):** Depende del servidor

### Backend (requerido)
- **API:** http://localhost:8000/api
- **Admin Django:** http://localhost:8000/admin
- **Media:** http://localhost:8000/media

---

## 📁 Estructura Después de la Instalación

```
FrontendEdufinanzas/
├── node_modules/          # Dependencias (no subir a git)
├── public/
│   └── assets/            # Agregar imágenes aquí
├── src/
│   ├── components/        # ✅ Creados
│   ├── context/           # ✅ Creado
│   ├── pages/
│   │   ├── Home/          # ✅ Creada
│   │   ├── Login/         # ✅ Creada
│   │   ├── Register/      # ✅ Creada
│   │   ├── Temas/         # ⏳ Por crear
│   │   ├── TemasRetos/    # ⏳ Por crear
│   │   ├── Retos/         # ⏳ Por crear
│   │   ├── PerfilUsuario/ # ⏳ Por crear
│   │   └── Admin/         # ⏳ Por crear
│   ├── services/          # ✅ Creado
│   ├── styles/            # ✅ Creado
│   ├── App.jsx            # ✅ Creado
│   └── main.jsx           # ✅ Creado
├── .gitignore
├── index.html
├── package.json
├── package-lock.json      # Generado por npm install
├── vite.config.js
└── README.md
```

---

## 🎯 Próximos Pasos Después de la Instalación

1. **Verificar que todo funciona:**
   - Página de inicio carga
   - Login funciona
   - Registro funciona
   - Tips se pueden ver

2. **Agregar imágenes:**
   - Logo: `public/assets/logo.png`
   - Imágenes por defecto en `public/assets/`

3. **Crear páginas pendientes:**
   - Revisar `ARCHIVOS_PENDIENTES.md`
   - Crear Temas, TemasRetos, Retos, Perfil
   - Crear panel de administrador

4. **Probar con el backend:**
   - Crear usuarios
   - Completar retos
   - Ganar monedas

---

## 📞 ¿Necesitas Ayuda?

### Recursos
- 📖 [README.md](./README.md) - Documentación completa
- 📝 [ARCHIVOS_PENDIENTES.md](./ARCHIVOS_PENDIENTES.md) - Archivos por crear
- ⚡ [GUIA_RAPIDA.md](./GUIA_RAPIDA.md) - Referencia rápida
- 📊 [RESUMEN_PROYECTO.md](./RESUMEN_PROYECTO.md) - Resumen del proyecto

### Debugging
1. Revisa la consola del navegador (F12)
2. Revisa los logs del terminal del frontend
3. Revisa los logs del terminal del backend
4. Verifica que las URLs sean correctas

---

## ✅ Checklist de Instalación Completa

- [ ] Node.js instalado (v18+)
- [ ] npm instalado (v9+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Backend Django corriendo
- [ ] Frontend corriendo (`npm run dev`)
- [ ] Página de inicio accesible
- [ ] No hay errores de CORS
- [ ] Temas se cargan desde el backend
- [ ] Tips se cargan desde el backend
- [ ] Modal de tips funciona
- [ ] Navegación entre páginas funciona
- [ ] Login redirige correctamente
- [ ] Registro funciona

---

**¡Instalación completada! El proyecto está listo para desarrollo. 🎉**

**Siguiente paso:** Revisa [ARCHIVOS_PENDIENTES.md](./ARCHIVOS_PENDIENTES.md) para continuar el desarrollo.
