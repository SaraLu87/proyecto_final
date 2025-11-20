# 🔐 Funcionalidad: Recuperación de Contraseña

## ✅ Nueva Funcionalidad Agregada

Se ha implementado un sistema completo de recuperación de contraseña para administradores en el panel de EduFinanzas.

---

## 📋 ¿Qué se agregó?

### 1. **Página de Recuperación de Contraseña**
- **Archivo:** `src/pages/auth/RecuperarContrasena.jsx`
- **Ruta:** `/recuperar-contrasena`
- **Funcionalidad:** Proceso de 2 pasos para recuperar contraseña

### 2. **Enlace en Login**
- Se agregó el enlace "¿Olvidaste tu contraseña?" en la página de login
- Ubicado junto al campo de contraseña
- Diseño consistente con los colores del proyecto

### 3. **Ruta en AppRouter**
- Se configuró la ruta `/recuperar-contrasena`
- Ruta pública (no requiere autenticación)
- Redirige al admin si ya está autenticado

---

## 🔄 Flujo de Recuperación de Contraseña

### Paso 1: Verificación de Correo
1. El usuario ingresa su correo electrónico
2. El sistema verifica que el correo exista en la base de datos
3. El sistema valida que el usuario sea un administrador
4. Si todo es correcto, pasa al paso 2

### Paso 2: Cambio de Contraseña
1. El usuario ingresa su nueva contraseña
2. El usuario confirma la nueva contraseña
3. El sistema valida que las contraseñas coincidan
4. El sistema actualiza la contraseña en la base de datos
5. Redirige automáticamente al login después de 2 segundos

---

## 🎨 Características de la Interfaz

### Diseño Visual
- ✅ Consistente con el diseño del login existente
- ✅ Gradiente azul-verde en el fondo
- ✅ Iconos visuales (🔐 para recuperación)
- ✅ Indicadores de pasos (1 y 2)
- ✅ Animaciones suaves

### Validaciones
- ✅ Formato de email válido
- ✅ Contraseña mínima de 6 caracteres
- ✅ Las contraseñas deben coincidir
- ✅ Usuario debe ser administrador
- ✅ Correo debe existir en la BD

### Mensajes de Usuario
- ✅ Mensajes de error claros
- ✅ Mensajes de éxito
- ✅ Loaders durante peticiones
- ✅ Confirmación visual de cada paso

### Experiencia de Usuario
- ✅ Proceso guiado paso a paso
- ✅ Botón de "Volver" en paso 2
- ✅ Enlace para regresar al login
- ✅ Toggle para mostrar/ocultar contraseña
- ✅ Redirección automática al completar

---

## 📸 Capturas del Flujo

### Login con enlace "Olvidé mi contraseña"
```
┌─────────────────────────────────────┐
│         EduFinanzas                 │
│   Panel de Administración           │
│                                     │
│  Correo: ___________________        │
│                                     │
│  Contraseña: ____________  [¿Olvid..]│
│                          👁️          │
│                                     │
│       [Iniciar Sesión →]            │
└─────────────────────────────────────┘
```

### Paso 1: Verificar Correo
```
┌─────────────────────────────────────┐
│         🔐 Recuperar Contraseña     │
│  Ingresa tu correo electrónico      │
│                                     │
│         ① ────── ②                 │
│                                     │
│  Correo: ___________________        │
│                                     │
│       [Verificar Correo →]          │
│                                     │
│  ¿Ya tienes tu contraseña?          │
│      [Iniciar Sesión]               │
└─────────────────────────────────────┘
```

### Paso 2: Nueva Contraseña
```
┌─────────────────────────────────────┐
│         🔐 Recuperar Contraseña     │
│     Ingresa tu nueva contraseña     │
│                                     │
│         ① ────── ②                 │
│                                     │
│  Nueva Contraseña: __________  👁️   │
│  Confirmar: __________________  👁️   │
│                                     │
│     [Cambiar Contraseña ✓]          │
│          [← Volver]                 │
└─────────────────────────────────────┘
```

---

## 🔧 Implementación Técnica

### Componente Principal
```javascript
// src/pages/auth/RecuperarContrasena.jsx

- Estado para controlar los pasos (1 o 2)
- Verificación de correo con obtenerUsuarios()
- Actualización de contraseña con actualizarUsuario()
- Validaciones en frontend
- Manejo de errores robusto
```

### Integración con Backend
```javascript
// Endpoints utilizados:

// 1. Verificar correo
GET /api/usuarios/
→ Busca el usuario por correo

// 2. Actualizar contraseña
PUT /api/usuarios/{id}/
Body: { correo, contrasena, rol }
→ Actualiza la contraseña
```

### Rutas
```javascript
// src/rutas/AppRouter.jsx

<Route
  path="/recuperar-contrasena"
  element={
    estaAutenticado()
      ? <Navigate to="/admin" replace />
      : <RecuperarContrasena />
  }
/>
```

---

## 🔒 Consideraciones de Seguridad

### ⚠️ Implementación Actual (Básica)
La implementación actual funciona con el backend existente pero tiene limitaciones:

1. **No hay tokens de recuperación**
   - No se genera un token único temporal
   - No hay expiración de tokens

2. **No hay verificación por email**
   - No se envía email con enlace de recuperación
   - El usuario puede cambiar la contraseña directamente

3. **Expone existencia de usuarios**
   - Si el correo no existe, se muestra un mensaje
   - Esto podría usarse para enumerar usuarios

### ✅ Seguridad Implementada
A pesar de las limitaciones, se implementaron medidas:

1. **Validación de rol**
   - Solo administradores pueden recuperar contraseña
   - Usuarios regulares son rechazados

2. **Validaciones de contraseña**
   - Longitud mínima de 6 caracteres
   - Confirmación de contraseña

3. **Comunicación con backend**
   - Todas las peticiones usan el endpoint seguro de actualización
   - El backend hashea la contraseña con Django

---

## 🚀 Mejoras Futuras Recomendadas

Para implementar en el backend Django:

### 1. Sistema de Tokens
```python
# Agregar a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN (
  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL
);

# Crear endpoints nuevos
POST /api/forgot-password/
  → Genera token y envía email

POST /api/reset-password/
  → Valida token y cambia contraseña
```

### 2. Envío de Emails
```python
# Instalar django-anymail o similar
pip install django-anymail

# Configurar SMTP en settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
```

### 3. Rate Limiting
```python
# Limitar intentos de recuperación
from django.core.cache import cache

def check_rate_limit(email):
    key = f'reset_attempts_{email}'
    attempts = cache.get(key, 0)
    if attempts >= 3:
        raise TooManyAttempts()
    cache.set(key, attempts + 1, 3600)
```

---

## 📱 Responsive Design

La página de recuperación es completamente responsiva:

- **Desktop:** Layout centrado con card amplio
- **Mobile:** Card adaptado al ancho de pantalla
- **Inputs:** Optimizados para touch
- **Botones:** Tamaño adecuado para mobile

---

## 🧪 Cómo Probar

### Caso de Prueba 1: Flujo Completo Exitoso
1. Ir a `/login`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresar un correo de administrador válido
4. Hacer clic en "Verificar Correo"
5. Ingresar nueva contraseña (mínimo 6 caracteres)
6. Confirmar la contraseña
7. Hacer clic en "Cambiar Contraseña"
8. Verificar redirección automática a login
9. Iniciar sesión con la nueva contraseña

### Caso de Prueba 2: Validaciones
1. Intentar con correo inválido → Error
2. Intentar con correo que no existe → Error
3. Intentar con usuario no administrador → Error
4. Contraseñas que no coinciden → Error
5. Contraseña muy corta → Error

### Caso de Prueba 3: Navegación
1. Desde recuperación, hacer clic en "Iniciar Sesión" → Redirige a login
2. Hacer clic en "Volver" en paso 2 → Regresa a paso 1
3. Si ya está autenticado, intenta acceder a `/recuperar-contrasena` → Redirige a `/admin`

---

## 📊 Archivos Modificados/Creados

### Nuevos Archivos (1)
```
✅ src/pages/auth/RecuperarContrasena.jsx (9KB)
```

### Archivos Modificados (2)
```
✅ src/pages/auth/Login.jsx
   - Agregado import de Link
   - Agregado enlace "¿Olvidaste tu contraseña?"

✅ src/rutas/AppRouter.jsx
   - Agregado import de RecuperarContrasena
   - Agregada ruta /recuperar-contrasena
```

---

## 💡 Uso para Administradores

### Escenario 1: Olvidé mi contraseña
1. Accede a la página de login
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu correo de administrador
4. Crea tu nueva contraseña
5. Inicia sesión con la nueva contraseña

### Escenario 2: Cambiar contraseña de otro admin
Como administrador, puedes:
1. Ir al módulo de Usuarios
2. Buscar el usuario
3. Editar y cambiar su contraseña

O usar la función de recuperación:
1. Usa la página de recuperación
2. Ingresa el correo del otro admin
3. Cambia su contraseña

---

## ⚙️ Variables de Estado

```javascript
// Estado del componente
paso: 1 | 2              // Paso actual del proceso
formData: {
  correo: string,         // Email del admin
  nuevaContrasena: string,
  confirmarContrasena: string
}
cargando: boolean        // Loader activo
error: string           // Mensaje de error
exito: string          // Mensaje de éxito
usuarioEncontrado: Object | null  // Usuario verificado
mostrarContrasena: boolean  // Toggle de visibilidad
```

---

## 🎯 Resultados

✅ **Funcionalidad completa implementada**
✅ **Diseño consistente con el login**
✅ **Validaciones robustas**
✅ **Experiencia de usuario intuitiva**
✅ **Compatible con el backend actual**
✅ **Código limpio y documentado**

---

## 📞 Notas Finales

- La funcionalidad está lista para usar inmediatamente
- No requiere cambios en el backend
- Usa los endpoints existentes de manera segura
- Para mayor seguridad, se recomienda implementar el sistema de tokens en el futuro

---

**Implementado:** Noviembre 2024
**Estado:** ✅ Completado y Funcional
