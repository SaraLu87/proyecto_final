# 🔄 FLUJO COMPLETO: LOGIN DE USUARIO

## 📋 ESTADO ACTUAL DEL SISTEMA

### ✅ Archivos Configurados:

1. **App.jsx** - Tiene ambos providers:
   ```javascript
   <AuthProvider>        // Para admin
     <UserAuthProvider>  // Para usuarios
       <AppRouter />
     </UserAuthProvider>
   </AuthProvider>
   ```

2. **AppRouter.jsx** - Tiene las rutas configuradas:
   ```javascript
   /login-usuario  →  LoginUsuario.jsx
   /registro       →  Registro.jsx
   ```

3. **UserAuthContext.jsx** - Existe y está funcional

4. **LoginUsuario.jsx** - Existe y está completo

5. **Registro.jsx** - Existe y está completo

---

## 🚀 PASOS PARA VERIFICAR QUE FUNCIONA

### Paso 1: Verificar que el servidor está corriendo

El frontend debe estar en: **http://localhost:5174**

Abre tu navegador y verifica que puedes acceder a esa URL.

---

### Paso 2: Navegar a Login de Usuario

En tu navegador, ve a:
```
http://localhost:5174/login-usuario
```

**¿Qué deberías ver?**
- Un formulario de login con:
  - Campo de correo
  - Campo de contraseña
  - Botón "Iniciar Sesión"
  - Link a "Regístrate aquí"
  - Link a "Login para administradores"

**¿Qué ves realmente?**
- [ ] Pantalla en blanco
- [ ] Formulario de login
- [ ] Mensaje de error
- [ ] Otro: ________________

---

### Paso 3: Si ves pantalla en blanco

Abre la consola del navegador (F12) y busca errores:

#### Posibles Errores y Soluciones:

**Error 1: "Cannot read property 'login' of undefined"**
```
Causa: UserAuthContext no está disponible
Solución: Verificar que App.jsx tiene UserAuthProvider
```

**Error 2: "Module not found: Can't resolve './LoginUsuario.css'"**
```
Causa: Falta el archivo CSS
Solución: El CSS existe, puede ser un error de cache
```

**Error 3: "useUserAuth must be used within UserAuthProvider"**
```
Causa: LoginUsuario se está renderizando fuera del provider
Solución: Verificar que App.jsx está correctamente estructurado
```

---

### Paso 4: Verificar en la consola del navegador

1. Abre: **http://localhost:5174/login-usuario**
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. Busca mensajes de error (en rojo)

**Toma screenshot de los errores y compártelos**

---

### Paso 5: Verificar en Network

1. Con DevTools abierto (F12)
2. Ve a la pestaña **Network**
3. Recarga la página (Ctrl+R)
4. Busca peticiones que fallen (status 404 o 500)

---

## 🔍 DIAGNÓSTICO POR SÍNTOMA

### Síntoma 1: Pantalla completamente en blanco

**Causa probable**: Error de JavaScript que rompe toda la app

**Pasos**:
1. Abre consola (F12 → Console)
2. Busca el primer error en rojo
3. Probablemente dice algo sobre "cannot read" o "undefined"

**Solución**: Necesito ver el error exacto

---

### Síntoma 2: Aparece el layout de admin en lugar de LoginUsuario

**Causa probable**: La ruta está redirigiendo incorrectamente

**Solución**: Verificar que no estés autenticado como admin
- Abre: **http://localhost:5174/login-usuario**
- Si te redirige a `/admin`, es porque hay sesión de admin activa
- Solución: Cierra sesión de admin o borra localStorage

---

### Síntoma 3: El formulario aparece pero sin estilos

**Causa probable**: El CSS no se está cargando

**Solución**: Verificar que LoginUsuario.css existe
```bash
ls FrontendEdufinanzas/src/pages/auth/LoginUsuario.css
```

---

### Síntoma 4: El formulario aparece pero no hace nada al dar click

**Causa probable**: UserAuthContext no está conectado

**Solución**:
1. Abre consola (F12)
2. Escribe: `localStorage.getItem('userToken')`
3. Si retorna null, es normal (aún no has iniciado sesión)

---

## 🧪 PRUEBA MANUAL PASO A PASO

### Prueba 1: Acceder a la página

```
1. Abre navegador
2. Ve a: http://localhost:5174/login-usuario
3. ¿Aparece el formulario? → SÍ/NO
```

### Prueba 2: Verificar que los campos funcionan

```
1. Escribe en el campo de correo: test@test.com
2. ¿El texto aparece? → SÍ/NO
3. Escribe en el campo de contraseña: 123456
4. ¿Los puntos aparecen? → SÍ/NO
```

### Prueba 3: Verificar el backend

```
1. Abre una nueva terminal
2. Ve a la carpeta del backend:
   cd BACKFRONT/BACKEND/EduFinanzas
3. Ejecuta:
   python manage.py runserver
4. ¿Dice "Starting development server at http://127.0.0.1:8000/"? → SÍ/NO
```

### Prueba 4: Probar el registro primero

```
1. En lugar de login-usuario, ve a:
   http://localhost:5174/registro
2. ¿Aparece el formulario de registro? → SÍ/NO
3. Si aparece, completa:
   - Correo: test@test.com
   - Contraseña: 123456
   - Nombre: Test User
   - Edad: 25
4. Click en "Registrar"
5. ¿Qué pasa? → (describe)
```

---

## 🐛 SI NADA FUNCIONA

### Verificación completa de archivos:

```bash
# 1. Verificar que los archivos existen
ls FrontendEdufinanzas/src/pages/auth/LoginUsuario.jsx
ls FrontendEdufinanzas/src/pages/auth/LoginUsuario.css
ls FrontendEdufinanzas/src/pages/auth/Registro.jsx
ls FrontendEdufinanzas/src/context/UserAuthContext.jsx

# 2. Verificar que el frontend está corriendo
curl http://localhost:5174

# 3. Verificar que el backend está corriendo
curl http://localhost:8000/api/

# 4. Limpiar cache y reiniciar
# En la carpeta del frontend:
rm -rf node_modules/.vite
npm run dev
```

---

## 📸 SCREENSHOTS QUE NECESITO

Para ayudarte efectivamente, necesito que me compartas:

1. **Screenshot de la pantalla completa** cuando abres:
   `http://localhost:5174/login-usuario`

2. **Screenshot de la consola del navegador** (F12 → Console)
   Con todos los errores visibles

3. **Screenshot de Network** (F12 → Network)
   Después de recargar la página

4. **Output de la terminal** donde corre el frontend
   (donde se ve "VITE ready in...")

---

## ✅ CHECKLIST RÁPIDO

Marca lo que SÍ está funcionando:

- [ ] Frontend corre en http://localhost:5174
- [ ] Backend corre en http://localhost:8000
- [ ] Puedo acceder a http://localhost:5174/login (login de admin)
- [ ] Puedo acceder a http://localhost:5174/admin (si ya tengo sesión admin)
- [ ] Al abrir http://localhost:5174/login-usuario veo ALGO
- [ ] La consola del navegador NO tiene errores
- [ ] El archivo LoginUsuario.jsx existe
- [ ] El archivo UserAuthContext.jsx existe

---

## 🎯 SIGUIENTE PASO

**Por favor, házmelo saber**:

1. ¿Qué ves cuando abres `http://localhost:5174/login-usuario`?
2. ¿Hay algún error en la consola del navegador (F12)?
3. ¿Está corriendo el backend?

Con esa información podré darte una solución exacta y precisa.

---

*Documento creado: 2025-11-20 13:54*
