# 🔧 Solución de Errores 403 y 400

## 📅 Fecha: 2025-11-20

---

## ✅ Error 403 (Forbidden) - SOLUCIONADO

### 🔴 Problema Identificado

**Error en logs:**
```javascript
AxiosError: Request failed with status code 403
GET /api/usuarios/ HTTP/1.1 403
```

**Endpoints afectados:**
- `GET /api/usuarios/` (Dashboard y página Usuarios)

### 🔍 Causa Raíz

El error 403 se producía debido a un conflicto entre dos cambios previos:

1. **Cambio en `usuarios/services.py`**: La función `usuario_ver()` fue modificada para retornar un **diccionario** en vez de un objeto `Usuarios` (para solucionar el TypeError de serialización JSON).

2. **Autenticación JWT**: En `usuarios/authentication.py`, el método `JWTAuthentication.authenticate()` retornaba directamente el resultado de `usuario_ver()` como objeto de usuario.

3. **Verificación de permisos**: En `usuarios/permissions.py`, la clase `permisosUsuarios` intentaba acceder a `user.is_authenticated` y `user.rol` como **atributos de objeto**, pero recibía un **diccionario** que no tiene atributos.

**Flujo del error:**
```
Request con JWT token
  → JWTAuthentication.authenticate()
    → usuario_ver() retorna DICT
  → permisosUsuarios.has_permission()
    → Intenta acceder a user.is_authenticated (falla porque es dict)
    → Retorna False
  → 403 Forbidden
```

### ✅ Solución Implementada

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/usuarios/authentication.py`

Se creó una clase `User` simple que actúa como wrapper para los datos del diccionario:

```python
class User:
    """
    Clase simple para representar un usuario autenticado.
    Actúa como wrapper para los datos del usuario que vienen del servicio.
    """
    def __init__(self, user_data):
        self.id_usuario = user_data.get("id_usuario")
        self.correo = user_data.get("correo")
        self.rol = user_data.get("rol")
        self.fecha_registro = user_data.get("fecha_registro")
        self.is_authenticated = True  # Siempre es True para usuarios autenticados

    def __str__(self):
        return f"{self.correo} ({self.rol})"
```

**Cambio en `JWTAuthentication.authenticate()`:**

```python
# ANTES (causaba Error 403):
usuario = usuario_ver(payload.get("id_usuario"))
if not usuario:
    raise exceptions.AuthenticationFailed("Usuario no encontrado")
return usuario, payload  # ❌ Retornaba dict directamente

# DESPUÉS (correcto):
usuario_data = usuario_ver(payload.get("id_usuario"))
if not usuario_data:
    raise exceptions.AuthenticationFailed("Usuario no encontrado")

usuario = User(usuario_data)  # ✅ Crea objeto User wrapper
return usuario, payload
```

**Resultado:**
- ✅ El objeto User tiene los atributos `is_authenticated` y `rol`
- ✅ Los permisos pueden verificarse correctamente
- ✅ No hay conflicto con la serialización JSON (usuario_ver sigue retornando dict)

---

## ⚠️ Error 400 (Bad Request) al Crear Tema - EN INVESTIGACIÓN

### 🔴 Problema Reportado

**Error en logs:**
```javascript
AxiosError: Request failed with status code 400
POST /api/temas/ HTTP/1.1 400
```

**Contexto:** El usuario reporta: "creo que el problema está al agregarle la imagen"

### 🔍 Análisis Realizado

#### 1. Inconsistencia en Nombres de Campos

**Base de Datos (schema.sql):**
```sql
CREATE TABLE temas(
  id_tema INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  img_tema VARCHAR(255) DEFAULT 'default_tema.png',  -- ⚠️ SINGULAR
  informacion_tema TEXT
);

CREATE PROCEDURE temas_crear(
  IN p_nombre VARCHAR(100),
  IN p_descripcion TEXT,
  IN p_img_tema varchar(255),  -- ⚠️ SINGULAR
  IN p_informacion TEXT
)
```

**Backend Django (models.py, serializers.py, services.py):**
```python
# models.py
img_temas = models.ImageField(...)  # ⚠️ PLURAL

# serializers.py
img_temas = serializers.ImageField(...)  # ⚠️ PLURAL

# services.py
def temas_crear(nombre: str, descripcion: str, img_temas, informacion_tema: str):  # ⚠️ PLURAL
    # ...
    return {
        "img_temas": row[3],  # ⚠️ PLURAL (pero row[3] es img_tema en BD)
    }
```

**Frontend (Temas.jsx, api.js):**
```javascript
// Usa img_temas (plural)
dataToSend.append('img_temas', formData.img_temas);
```

#### 2. Posibles Causas del Error 400

##### Opción A: Validación del Serializer
Si el serializer está esperando un tipo de dato específico y recibe otro, rechazaría la petición con 400.

##### Opción B: Stored Procedure Error
Si el procedimiento almacenado no puede procesar los parámetros enviados (tipo incorrecto, valor NULL no permitido, etc.), Django podría retornar 400.

##### Opción C: Pillow No Instalado
Si Pillow no está instalado, Django no puede procesar el `ImageField` y rechazará la petición.

#### 3. Flujo Actual (Con Imagen)

```
Frontend (FormData)
  img_temas: File object
    ↓
Backend View (request.FILES)
  img_temas: InMemoryUploadedFile
    ↓
Serializer Validation
  img_temas: ImageField (requires Pillow)
    ↓
Service (temas_crear)
  img_temas: InMemoryUploadedFile
    ↓
File Handling (default_storage.save)
  Guarda en: mediafiles/temas/{filename}
  Retorna: "temas/{filename}"
    ↓
Stored Procedure (temas_crear)
  p_img_tema: "temas/filename.jpg" (string)
    ↓
Database Insert
  img_tema: "temas/filename.jpg"
```

### 🎯 Acciones Necesarias para Diagnosticar

Para identificar la causa exacta del Error 400, necesitamos:

1. **Ver los logs completos del backend** cuando ocurre el error
2. **Verificar que Pillow está instalado**
3. **Verificar que el directorio mediafiles/ existe**
4. **Probar crear tema SIN imagen primero**

---

## 📝 Comandos de Diagnóstico

### 1. Verificar Pillow

```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
pip list | findstr -i pillow
```

**Si no aparece:**
```bash
pip install Pillow
```

### 2. Verificar Directorio Media

```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
dir mediafiles
```

**Si no existe:**
```bash
mkdir mediafiles
mkdir mediafiles\temas
mkdir mediafiles\retos
mkdir mediafiles\perfiles
```

### 3. Iniciar Backend con Logs Detallados

```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
python manage.py runserver
```

**Al crear un tema con imagen, observar en la terminal:**
```
[timestamp] "POST /api/temas/ HTTP/1.1" 400 XXX
[timestamp] Traceback (most recent call last):
  ... (aquí aparecerá el error específico)
```

---

## 🧪 Plan de Pruebas

### Prueba 1: Crear Tema SIN Imagen

**Objetivo:** Verificar que el flujo básico funciona

**Pasos:**
1. Ir a `http://localhost:5173/admin/temas`
2. Clic en "Crear Tema"
3. Llenar:
   - Nombre: `Test Sin Imagen`
   - Descripción: `Descripción de prueba`
   - Información: `Contenido del tema`
   - **NO seleccionar imagen**
4. Clic en "Crear"

**Resultado Esperado:**
- ✅ 201 Created
- ✅ Tema aparece en la tabla

**Si falla con 400:**
- El problema NO es la imagen
- Revisar serializer y stored procedure

### Prueba 2: Crear Tema CON Imagen Pequeña

**Objetivo:** Verificar que el upload de imagen funciona

**Pasos:**
1. Preparar imagen de prueba: `test.jpg` (< 1MB)
2. Crear tema con todos los campos + imagen
3. Observar logs del backend

**Resultado Esperado:**
- ✅ 201 Created
- ✅ Archivo en `mediafiles/temas/test.jpg`

**Si falla con 400:**
- Ver el error específico en logs del backend
- Verificar que Pillow está instalado
- Verificar permisos de escritura en mediafiles/

---

## 📊 Estado de Correcciones

| Error | Endpoint | Estado | Archivo Modificado | Línea |
|-------|----------|--------|-------------------|-------|
| 403 Forbidden | GET /api/usuarios/ | ✅ SOLUCIONADO | usuarios/authentication.py | 8-21, 49-54 |
| 400 Bad Request | POST /api/temas/ | ⚠️ EN INVESTIGACIÓN | - | - |

---

## 🎯 Próximos Pasos

1. ✅ **Error 403 ya está resuelto** - reiniciar el servidor Django para aplicar cambios
2. ⏳ **Ejecutar comandos de diagnóstico** para Error 400:
   - Verificar Pillow
   - Verificar directorio mediafiles
   - Observar logs detallados al crear tema
3. ⏳ **Ejecutar plan de pruebas** (Prueba 1 y 2)
4. ⏳ **Reportar logs específicos** del Error 400 para diagnóstico preciso

---

## 🚀 Cómo Aplicar la Solución del Error 403

### Paso 1: Reiniciar el Servidor Django

```bash
# En la terminal donde corre Django, presionar Ctrl+C
# Luego reiniciar:
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
python manage.py runserver
```

### Paso 2: Verificar que Funciona

1. Ir a `http://localhost:5173/admin/usuarios`
2. Debería cargar la lista de usuarios sin Error 403
3. El Dashboard también debería cargar sin errores

**Si aún aparece Error 403:**
- Verificar que el token JWT es válido
- Verificar que el usuario tiene rol "Administrador"
- Verificar que no hay errores de sintaxis en authentication.py

---

## 📞 Información de Debugging

### Verificar que la Clase User Funciona

Puedes agregar prints temporales en `authentication.py` para debugging:

```python
def authenticate(self, request):
    # ... código existente ...

    usuario = User(usuario_data)

    # DEBUG: Verificar que el objeto User se crea correctamente
    print(f"DEBUG: Usuario autenticado: {usuario}")
    print(f"DEBUG: is_authenticated: {usuario.is_authenticated}")
    print(f"DEBUG: rol: {usuario.rol}")

    return usuario, payload
```

### Verificar Permisos

Puedes agregar prints en `permissions.py`:

```python
def has_permission(self, request, view):
    user = getattr(request, "user", None)

    # DEBUG
    print(f"DEBUG: User type: {type(user)}")
    print(f"DEBUG: User: {user}")
    print(f"DEBUG: has is_authenticated: {hasattr(user, 'is_authenticated')}")

    return bool(user and getattr(user, "is_authenticated", False))
```

---

**Última Actualización:** 2025-11-20
**Estado:** Error 403 ✅ Solucionado | Error 400 ⏳ Requiere logs detallados
