# 🔍 INSTRUCCIONES PARA DEBUGGEAR EL FRONTEND

## 📋 RESUMEN

He creado una página especial de DEBUG que te ayudará a identificar exactamente qué está fallando en el flujo Frontend → Backend.

---

## 🚀 PASOS PARA USAR EL DEBUG

### Paso 1: Asegúrate de que ambos servidores estén corriendo

#### Backend (Django)
```bash
cd BACKFRONT\BACKEND\EduFinanzas
python manage.py runserver
```

Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
```

#### Frontend (Vite)
```bash
cd FrontendEdufinanzas
npm run dev
```

Deberías ver:
```
Local:   http://localhost:5173/
```

---

### Paso 2: Crear un usuario de prueba

1. Abre el navegador en `http://localhost:5173/registro`
2. Completa el formulario:
   - **Correo**: `test@example.com`
   - **Contraseña**: `123456`
   - **Nombre de perfil**: `Usuario Test`
   - **Edad**: `25`
3. Haz clic en "Registrar"

---

### Paso 3: Iniciar sesión

1. Serás redirigido a `http://localhost:5173/login-usuario`
2. Ingresa:
   - **Correo**: `test@example.com`
   - **Contraseña**: `123456`
3. Haz clic en "Iniciar Sesión"
4. Si ves el mensaje "¡Inicio de sesión exitoso! Bienvenido de vuelta 🎉", el login funcionó

---

### Paso 4: Acceder a la página de DEBUG

1. **IMPORTANTE**: Una vez que hayas iniciado sesión, navega manualmente a:
   ```
   http://localhost:5173/debug
   ```

2. Verás una página blanca con información de debug en formato JSON

---

### Paso 5: Interpretar los resultados

La página de debug te mostrará 4 secciones:

#### 🔐 1. Autenticación
```json
{
  "tokenExists": true,
  "tokenValue": "eyJhbGciOiJIUzI1NiIs...",
  "usuarioExists": true,
  "perfilExists": true,
  "usuarioContexto": { ... },
  "perfilContexto": { ... },
  "estaAutenticado": true
}
```

**Qué verificar**:
- ✅ `tokenExists` debe ser `true`
- ✅ `estaAutenticado` debe ser `true`
- ❌ Si alguno es `false`, el problema está en el login

---

#### 💡 2. Tips

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id_recompensa": 1,
      "nombre": "Ahorra el 10%",
      "descripcion": "Destina al menos el 10% de tus ingresos al ahorro",
      "tipo": "Tip"
    }
  ]
}
```

**Qué verificar**:
- ✅ `success` debe ser `true`
- ✅ `count` debe ser mayor a 0
- ❌ Si `success: false`, revisa el error mostrado
- ❌ Si `count: 0`, no hay tips en la base de datos

---

#### 📚 3. Temas

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id_tema": 1,
      "nombre": "Introducción a las Finanzas",
      "descripcion": "Conceptos básicos de finanzas",
      "img_tema": null
    }
  ]
}
```

**Qué verificar**:
- ✅ `success` debe ser `true`
- ✅ `count` debe ser mayor a 0
- ❌ Si `success: false`, revisa el error mostrado
- ❌ Si `count: 0`, no hay temas en la base de datos

---

#### 📊 4. Progreso

```json
{
  "success": true,
  "data": {
    "total_retos": 5,
    "retos_completados": 0,
    "porcentaje_completado": 0.0
  }
}
```

**Qué verificar**:
- ✅ `success` debe ser `true`
- ✅ Debe retornar los 3 campos
- ❌ Si `success: false` y error 401, el token es inválido

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### Error 1: "tokenExists: false"

**Problema**: No se guardó el token en localStorage

**Solución**:
1. Cierra sesión completamente
2. Borra el localStorage: F12 → Application → Local Storage → Clear All
3. Vuelve a hacer login

---

### Error 2: Tips o Temas tienen "count: 0"

**Problema**: No hay datos en la base de datos

**Solución**: Ejecuta este SQL en MySQL:

```sql
-- Insertar tips de prueba
INSERT INTO recompensa (tipo, nombre, descripcion) VALUES
('Tip', 'Ahorra el 10%', 'Destina al menos el 10% de tus ingresos al ahorro mensual'),
('Tip', 'Fondo de emergencias', 'Ten un fondo de emergencias de 3-6 meses de gastos'),
('Tip', 'Evita deudas', 'Evita las deudas de consumo con altos intereses');

-- Insertar temas de prueba
INSERT INTO tema (nombre, descripcion, img_tema) VALUES
('Ahorro Inteligente', 'Aprende a ahorrar de manera efectiva', NULL),
('Inversiones Básicas', 'Conoce los fundamentos de la inversión', NULL);

-- Insertar retos de prueba
INSERT INTO reto (titulo, descripcion, pregunta, respuesta_correcta, opcion_a, opcion_b, opcion_c, opcion_d, costo_moneda, recompensa_moneda, id_tema)
VALUES
('¿Qué es el ahorro?', 'Concepto básico de ahorro', '¿Qué porcentaje mínimo se recomienda ahorrar?', 'A', '10%', '5%', '20%', '50%', 20, 50, 1),
('Tipos de ahorro', 'Diferentes formas de ahorrar', '¿Cuál es un ejemplo de ahorro a corto plazo?', 'B', 'Jubilación', 'Vacaciones', 'Casa', 'Auto', 15, 40, 1);
```

---

### Error 3: "success: false" con status 401

**Problema**: Token inválido o expirado

**Solución**:
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El token se renovará automáticamente

---

### Error 4: "success: false" con status 404

**Problema**: El endpoint no existe en el backend

**Solución**: Verifica que las URLs estén correctas en `eduFinanzas/urls.py`:

```python
urlpatterns = [
    # ...
    path('api/perfil/me/', PerfilMeView.as_view(), name='perfil_me'),
    path('api/perfil/me/progreso/', ProgresoMeView.as_view(), name='progreso_me'),
    # ...
]
```

---

### Error 5: "success: false" con mensaje de CORS

**Problema**: El backend no permite peticiones desde el frontend

**Solución**: Verifica en `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## 📝 TAMBIÉN REVISA LA CONSOLA DEL NAVEGADOR

1. Abre DevTools: **F12**
2. Ve a la pestaña **Console**
3. Busca estos logs:
   - 🔐 1. Verificando autenticación...
   - ✅ Auth check: {...}
   - 💡 2. Cargando tips...
   - ✅ Tips cargados: {...}
   - 📚 3. Cargando temas...
   - ✅ Temas cargados: {...}
   - 📊 4. Cargando progreso...
   - ✅ Progreso cargado: {...}

4. Si ves **❌**, expande el error y copia el mensaje completo

---

## 📞 REPORTAR PROBLEMA

Si después de revisar el debug todavía no funciona, reporta:

1. **Screenshot de la página /debug** (toda la pantalla)
2. **Screenshot de la consola del navegador** (F12 → Console)
3. **Screenshot de las peticiones HTTP** (F12 → Network → filtrar por "api")
4. **Confirmación** de que:
   - ✅ Backend está corriendo
   - ✅ Frontend está corriendo
   - ✅ Puedes hacer login exitosamente

---

## ✅ PRÓXIMO PASO

Después de usar el debug, podrás identificar exactamente qué está fallando:

- **Si todos los checks son ✅**: El Dashboard debería funcionar perfectamente
- **Si hay ❌ en Tips o Temas**: Pobla la base de datos
- **Si hay ❌ en Auth**: Revisa el flujo de login
- **Si hay ❌ en Progreso**: Revisa el endpoint y el stored procedure

Una vez identifiques el problema específico, podré ayudarte a solucionarlo de manera precisa.

---

*Creado el 2025-11-20*
