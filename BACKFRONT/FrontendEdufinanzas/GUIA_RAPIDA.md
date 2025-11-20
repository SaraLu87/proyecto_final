# 🚀 Guía Rápida - FrontendEdufinanzas

## 📂 Estructura Completa del Proyecto

```
FrontendEdufinanzas/
│
├── 📁 public/
│   └── 📁 assets/
│       ├── logo.png                    # Logo de EduFinanzas (CREAR)
│       ├── tema-default.png            # Imagen por defecto temas (CREAR)
│       ├── reto-default.png            # Imagen por defecto retos (CREAR)
│       └── perfil-default.png          # Imagen por defecto perfil (CREAR)
│
├── 📁 src/
│   │
│   ├── 📁 components/                  # ✅ TODOS CREADOS
│   │   ├── 📁 AdminRoute/
│   │   │   └── AdminRoute.jsx          # Protección rutas admin
│   │   ├── 📁 Footer/
│   │   │   ├── Footer.jsx              # Footer reutilizable
│   │   │   └── Footer.css
│   │   ├── 📁 Header/
│   │   │   ├── Header.jsx              # Header adaptable (3 tipos)
│   │   │   └── Header.css
│   │   ├── 📁 ProgressBar/
│   │   │   ├── ProgressBar.jsx         # Barra de progreso
│   │   │   └── ProgressBar.css
│   │   ├── 📁 ProtectedRoute/
│   │   │   └── ProtectedRoute.jsx      # Protección rutas privadas
│   │   ├── 📁 RetoCard/
│   │   │   ├── RetoCard.jsx            # Tarjeta de reto
│   │   │   └── RetoCard.css
│   │   ├── 📁 TemaCard/
│   │   │   ├── TemaCard.jsx            # Tarjeta de tema
│   │   │   └── TemaCard.css
│   │   ├── 📁 TipCard/
│   │   │   ├── TipCard.jsx             # Tarjeta de tip
│   │   │   └── TipCard.css
│   │   └── 📁 TipModal/
│   │       ├── TipModal.jsx            # Modal para tips
│   │       └── TipModal.css
│   │
│   ├── 📁 context/                     # ✅ CREADO
│   │   └── AuthContext.jsx             # Contexto de autenticación
│   │
│   ├── 📁 pages/
│   │   ├── 📁 Admin/                   # ⏳ CREAR (Panel administrador)
│   │   │   ├── AdminPanel.jsx          # Componente principal admin
│   │   │   ├── AdminPanel.css
│   │   │   └── 📁 components/
│   │   │       ├── Sidebar.jsx         # Sidebar de navegación
│   │   │       ├── TemasAdmin.jsx      # CRUD Temas
│   │   │       ├── RetosAdmin.jsx      # CRUD Retos
│   │   │       ├── TipsAdmin.jsx       # CRUD Tips
│   │   │       └── UsuariosAdmin.jsx   # Gestión Usuarios
│   │   │
│   │   ├── 📁 Home/                    # ✅ CREADO
│   │   │   ├── Home.jsx                # Página de inicio
│   │   │   └── Home.css
│   │   │
│   │   ├── 📁 Login/                   # ✅ CREADO
│   │   │   ├── Login.jsx               # Inicio de sesión
│   │   │   └── Login.css
│   │   │
│   │   ├── 📁 PerfilUsuario/           # ⏳ CREAR
│   │   │   ├── PerfilUsuario.jsx       # Perfil del usuario
│   │   │   └── PerfilUsuario.css
│   │   │
│   │   ├── 📁 Register/                # ✅ CREADO
│   │   │   ├── Register.jsx            # Registro de usuarios
│   │   │   └── Register.css
│   │   │
│   │   ├── 📁 Retos/                   # ⏳ CREAR
│   │   │   ├── Retos.jsx               # Pantalla de retos (2 círculos)
│   │   │   └── Retos.css
│   │   │
│   │   ├── 📁 Temas/                   # ⏳ CREAR
│   │   │   ├── Temas.jsx               # Lista de temas
│   │   │   └── Temas.css
│   │   │
│   │   └── 📁 TemasRetos/              # ⏳ CREAR
│   │       ├── TemasRetos.jsx          # Info tema + lista retos
│   │       └── TemasRetos.css
│   │
│   ├── 📁 services/                    # ✅ CREADO
│   │   └── api.js                      # Servicios API (completo)
│   │
│   ├── 📁 styles/                      # ✅ CREADO
│   │   └── global.css                  # Estilos globales
│   │
│   ├── App.jsx                         # ✅ CREADO (Rutas principales)
│   └── main.jsx                        # ✅ CREADO (Punto de entrada)
│
├── .gitignore                          # ✅ CREADO
├── index.html                          # ✅ CREADO
├── package.json                        # ✅ CREADO
├── vite.config.js                      # ✅ CREADO
├── README.md                           # ✅ CREADO
├── ARCHIVOS_PENDIENTES.md              # ✅ CREADO
└── GUIA_RAPIDA.md                      # Este archivo

```

## 🎯 Estado del Proyecto

### ✅ Completado (70%)

1. **Estructura base del proyecto**
   - Configuración de Vite
   - Configuración de paquetes
   - Archivos de configuración

2. **Servicios y contexto**
   - Servicio completo de API (api.js)
   - Contexto de autenticación (AuthContext.jsx)
   - Interceptores de Axios
   - Manejo de JWT

3. **Componentes reutilizables (8 componentes)**
   - Header (3 variantes: public, user, admin)
   - Footer
   - TemaCard
   - TipCard
   - RetoCard
   - ProgressBar
   - TipModal
   - ProtectedRoute y AdminRoute

4. **Páginas públicas**
   - Home (inicio)
   - Login
   - Register

5. **Estilos globales**
   - Variables CSS
   - Clases utilitarias
   - Animaciones

### ⏳ Pendiente (30%)

1. **Páginas protegidas (4 páginas)**
   - Temas
   - TemasRetos
   - Retos
   - PerfilUsuario

2. **Panel de administrador**
   - AdminPanel principal
   - CRUD de Temas
   - CRUD de Retos
   - CRUD de Tips
   - Gestión de Usuarios

3. **Assets**
   - Imágenes por defecto
   - Logo

## ⚡ Comandos Rápidos

### Instalación
```bash
cd FrontendEdufinanzas
npm install
```

### Desarrollo
```bash
npm run dev
```
La app estará en: http://localhost:5173

### Producción
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## 🔗 Conexiones con Backend

### URLs del Backend
- **API Base:** `http://localhost:8000/api`
- **Media:** `http://localhost:8000/media`

### Verificar Conexión
1. Asegúrate de que el backend Django esté corriendo
2. Verifica CORS en el backend
3. Prueba los endpoints en Postman/Thunder Client

### Endpoints Principales
```
POST   /api/login_usuario/           # Login
POST   /api/usuarios/                # Registro
GET    /api/temas/                   # Listar temas
GET    /api/tips/                    # Listar tips
GET    /api/retos/?id_tema={id}      # Retos de un tema
POST   /api/solucionar_reto/         # Resolver reto
GET    /api/progresos/?id_perfil={id} # Progreso del usuario
```

## 🎨 Personalización

### Cambiar Colores
Edita `src/styles/global.css`:
```css
:root {
  --primary-color: #667eea;    /* Color principal */
  --secondary-color: #764ba2;  /* Color secundario */
}
```

### Agregar Logo
1. Coloca tu logo en `public/assets/logo.png`
2. Si el nombre es diferente, actualiza en `src/components/Header/Header.jsx`:
```jsx
<img src="/assets/tu-logo.png" alt="EduFinanzas Logo" />
```

## 📝 Flujo de Datos

### Autenticación
```
Usuario → Login → API → Token JWT → localStorage → AuthContext → Header/Rutas
```

### Progreso de Retos
```
Usuario completa reto → API solucionar_reto → Actualiza progreso → Actualiza monedas → Refresca UI
```

### Desbloqueo de Temas
```
Tema 1 (siempre desbloqueado)
  ↓ 100% completado
Tema 2 desbloqueado
  ↓ 100% completado
Tema 3 desbloqueado
  ...
```

## 🐛 Debugging

### Error: Cannot find module
```bash
npm install
```

### Error: CORS
Verifica en Django:
```python
# settings.py
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
```

### Error: 401 Unauthorized
El token expiró o no es válido. Vuelve a hacer login.

### Imágenes no cargan
1. Verifica que el backend esté sirviendo media
2. Verifica la ruta en la BD (debe ser relativa: `temas/img.png`)
3. Verifica que la imagen exista en el servidor

## 📚 Próximos Pasos

1. **Crear páginas pendientes**
   - Usar el código de ejemplo en `ARCHIVOS_PENDIENTES.md`
   - Mantener la estructura y estilos consistentes
   - Agregar comentarios explicativos

2. **Implementar panel de administrador**
   - Crear componente principal con sidebar
   - Implementar CRUDs con formularios
   - Agregar validaciones

3. **Pruebas**
   - Probar flujo completo de usuario
   - Probar flujo de administrador
   - Verificar manejo de errores

4. **Optimizaciones**
   - Lazy loading de componentes
   - Optimización de imágenes
   - Cache de datos

## 🔐 Seguridad

### Implementadas
- ✅ Validación de contraseñas seguras
- ✅ Protección de rutas
- ✅ Tokens JWT
- ✅ Validación de formularios
- ✅ Sanitización de inputs

### Por Implementar
- ⏳ Rate limiting (backend)
- ⏳ Refresh tokens
- ⏳ 2FA (opcional)

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador
2. Revisa la consola del backend
3. Verifica las conexiones de red en DevTools
4. Consulta `README.md` y `ARCHIVOS_PENDIENTES.md`

---

**¡Éxito con el desarrollo! 🚀**
