# 🚀 Guía de Instalación Rápida - EduFinanzas Admin

## Pasos para Instalar y Ejecutar

### 1️⃣ Requisitos Previos

Verifica que tengas instalado:
```bash
node --version   # Debe ser >= 16.x
npm --version    # Debe ser >= 8.x
```

### 2️⃣ Instalar Dependencias

Abre una terminal en la carpeta `FrontendEdufinanzas` y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React 18.3.1
- Vite 5.4.10
- React Router DOM 6.28.0
- Axios 1.7.7
- Bootstrap 5.3.3
- React Bootstrap 2.10.5

### 3️⃣ Verificar Backend

Antes de iniciar el frontend, asegúrate de que el backend Django esté corriendo:

```bash
# En la carpeta del backend Django
python manage.py runserver
```

El backend debe estar disponible en: `http://localhost:8000`

### 4️⃣ Ejecutar la Aplicación

En la carpeta `FrontendEdufinanzas`, ejecuta:

```bash
npm run dev
```

La aplicación se abrirá automáticamente en: `http://localhost:5173`

### 5️⃣ Iniciar Sesión

Accede con credenciales de administrador:

- **URL:** `http://localhost:5173/login`
- **Correo:** (Tu correo de administrador en la BD)
- **Contraseña:** (Tu contraseña de administrador)

---

## 🔧 Comandos Disponibles

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "EACCES permission denied"
```bash
# Usar sudo (solo en Linux/Mac)
sudo npm install
```

### Error: "Port 5173 already in use"
```bash
# Cambiar puerto en vite.config.js
export default defineConfig({
  server: {
    port: 3000  # Cambiar a otro puerto
  }
})
```

### Backend no responde
```bash
# Verificar que Django esté corriendo
curl http://localhost:8000/api/usuarios/

# Verificar CORS en Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

---

## 📂 Estructura de Archivos Creados

```
FrontendEdufinanzas/
├── public/
├── src/
│   ├── components/          # 6 archivos (Header, Footer, Sidebar + CSS)
│   ├── context/             # 1 archivo (AuthContext)
│   ├── pages/
│   │   ├── auth/           # 2 archivos (Login + CSS)
│   │   └── admin/          # 7 archivos (Dashboard, CRUD + CSS)
│   ├── rutas/              # 2 archivos (AppRouter, AdminRoute)
│   ├── services/           # 1 archivo (api.js)
│   ├── styles/             # 1 archivo (global.css)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
├── README.md
└── INSTALACION.md (este archivo)
```

**Total: 24 archivos creados** ✅

---

## ✅ Verificación de Instalación

Una vez iniciada la aplicación, deberías ver:

1. ✅ Página de login con gradiente azul-verde
2. ✅ Dashboard con 4 tarjetas de estadísticas
3. ✅ Sidebar con navegación
4. ✅ Header con nombre de usuario
5. ✅ Footer con enlaces

---

## 🎯 Próximos Pasos

1. Crear un usuario administrador en el backend Django si no existe
2. Iniciar sesión en el panel
3. Explorar los módulos CRUD
4. Crear temas, retos y tips
5. Gestionar usuarios

---

## 📞 Soporte

Si encuentras algún problema durante la instalación:

1. Revisa que todas las dependencias estén instaladas
2. Verifica que el backend esté corriendo
3. Revisa la consola del navegador para errores
4. Revisa la terminal donde corre el frontend

---

**¡Listo para usar! 🎉**
