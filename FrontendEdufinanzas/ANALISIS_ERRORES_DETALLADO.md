# 🔍 Análisis Detallado de Errores - Frontend y Backend

## 📊 Resumen de Errores Identificados

| # | Error | Endpoint | Código | Causa Raíz | Ubicación del Problema |
|---|-------|----------|--------|------------|----------------------|
| 1 | IntegrityError | DELETE /api/usuarios/{id}/ | 500 | Foreign key constraint | ✅ **Frontend ya tiene manejo mejorado** |
| 2 | IntegrityError | DELETE /api/temas/{id}/ | 500 | Foreign key constraint | ✅ **Frontend ya tiene manejo mejorado** |
| 3 | **Bad Request** | PUT /api/usuarios/{id}/ | 400 | Serializer requiere `contrasena` obligatoria | ❌ **BACKEND** |
| 4 | **TypeError** | POST /api/usuarios/ | 500 | Retorna objeto Usuarios en vez de dict | ❌ **BACKEND** |
| 5 | **TypeError** | PUT /api/tips/{id}/ | 500 | Función no acepta `id_perfil` | ❌ **BACKEND** |
| 6 | **Bad Request** | POST /api/retos/ | 400 | Datos incompletos o mal formateados | ⚠️ **Frontend/Backend** |
| 7 | **Unsupported Media Type** | POST /api/temas/ | 415 | Headers incorrectos (ya corregido) | ✅ **YA CORREGIDO** |

---

## 🔴 ERROR 1 y 2: IntegrityError (500) - ✅ YA CORREGIDO EN FRONTEND

### Estado: ✅ RESUELTO

**Logs:**
```
IntegrityError: (1451, 'Cannot delete or update a parent row:
a foreign key constraint fails')
```

**Solución aplicada:**
El frontend ahora detecta estos errores y muestra mensajes claros al usuario. **No requiere cambios adicionales**.

---

## 🔴 ERROR 3: Bad Request en PUT /api/usuarios/{id}/ - ❌ PROBLEMA EN BACKEND

### Estado: ❌ REQUIERE CORRECCIÓN EN BACKEND

**Logs:**
```
Bad Request: /api/usuarios/2/
[20/Nov/2025 05:19:12] "PUT /api/usuarios/2/ HTTP/1.1" 400 43
```

### 🔍 Análisis del Problema

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/usuarios/serializers.py`

```python
class UsuarioCreateUpdateSerializer(serializers.Serializer):
    correo = serializers.CharField(max_length=100)
    contrasena = serializers.CharField(max_length=255)  # ❌ CAMPO REQUERIDO
    rol = serializers.ChoiceField(choices=['Usuario', 'Administrador'], default='Usuario')
```

**Problema:**
- El serializer tiene `contrasena` como campo **obligatorio**
- El frontend envía datos **sin** el campo `contrasena` cuando no se desea cambiarla
- El backend rechaza la petición con 400 porque falta un campo requerido

### 📋 Flujo del Error

```
1. Usuario abre modal de edición en frontend
2. Deja el campo contraseña vacío (no quiere cambiarla)
3. Frontend NO envía el campo "contrasena" (código correcto en líneas 156-164)
4. Backend recibe: {correo: "...", rol: "..."}
5. Serializer valida: ❌ Falta campo "contrasena" requerido
6. Backend retorna: 400 Bad Request
```

### ✅ Solución en Backend

**Opción 1: Hacer el campo opcional (RECOMENDADO)**

```python
# En: BACKFRONT/BACKEND/EduFinanzas/usuarios/serializers.py

class UsuarioCreateUpdateSerializer(serializers.Serializer):
    correo = serializers.CharField(max_length=100)
    contrasena = serializers.CharField(max_length=255, required=False, allow_blank=True)  # ✅ OPCIONAL
    rol = serializers.ChoiceField(choices=['Usuario', 'Administrador'], default='Usuario')
```

**Opción 2: Crear serializers separados**

```python
# Para CREATE (contrasena obligatoria)
class UsuarioCreateSerializer(serializers.Serializer):
    correo = serializers.CharField(max_length=100)
    contrasena = serializers.CharField(max_length=255)  # Obligatoria
    rol = serializers.ChoiceField(choices=['Usuario', 'Administrador'], default='Usuario')

# Para UPDATE (contrasena opcional)
class UsuarioUpdateSerializer(serializers.Serializer):
    correo = serializers.CharField(max_length=100, required=False)
    contrasena = serializers.CharField(max_length=255, required=False, allow_blank=True)
    rol = serializers.ChoiceField(choices=['Usuario', 'Administrador'], required=False)
```

Luego en `views.py`:
```python
def update(self, request, pk=None):
    serializer = UsuarioUpdateSerializer(data=request.data)  # Usa el serializer de UPDATE
    serializer.is_valid(raise_exception=True)
    # ... resto del código
```

**Opción 3: Modificar el service para manejar contraseña vacía**

En `services.py` línea 81:
```python
def usuarios_actualizar(id_usuario: int, correo: str, contrasena: str, rol: str) -> int:
    with connection.cursor() as cursor:
        # Si contrasena está vacía, no hashearla
        if contrasena and contrasena.strip():
            u.set_password(contrasena)
            hash_con = u.password
        else:
            hash_con = None  # O mantener la anterior

        cursor.callproc('usuarios_actualizar', [id_usuario, correo, hash_con, rol])
        # ...
```

### 🎯 Recomendación

**Usar Opción 1** porque es la más simple y no rompe código existente.

---

## 🔴 ERROR 4: TypeError en POST /api/usuarios/ - ❌ PROBLEMA EN BACKEND

### Estado: ❌ REQUIERE CORRECCIÓN EN BACKEND

**Logs:**
```
TypeError: Object of type Usuarios is not JSON serializable
[20/Nov/2025 05:19:57] "POST /api/usuarios/ HTTP/1.1" 500 104806
```

### 🔍 Análisis del Problema

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/usuarios/views.py` línea 46-52

```python
def create(self, request):
    serializer = UsuarioCreateUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    nuevo_id = usuarios_crear(**serializer.validated_data)
    item = usuario_ver(nuevo_id)  # ❌ Retorna objeto Usuarios
    return Response(item, status=status.HTTP_201_CREATED)  # ❌ No se puede serializar
```

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/usuarios/services.py` línea 44-62

```python
def usuario_ver(id_usuario: int):
    with connection.cursor() as cursor:
        cursor.callproc('usuario_ver', [id_usuario])
        row = cursor.fetchone()
        if not row:
            return None

        usuario = Usuarios(  # ❌ Retorna un OBJETO del modelo
            id_usuario=row[0],
            correo=row[1],
            rol=row[2],
            fecha_registro=row[3],
        )
        usuario.is_authenticated = True
        return usuario  # ❌ Django REST Framework no puede serializar esto
```

**Problema:**
- `usuario_ver()` retorna un **objeto Python** del modelo `Usuarios`
- Django REST Framework necesita un **diccionario** para convertirlo a JSON
- Al intentar serializar el objeto, falla con `TypeError`

### ✅ Solución en Backend

**Cambiar `usuario_ver()` para retornar un diccionario:**

```python
# En: BACKFRONT/BACKEND/EduFinanzas/usuarios/services.py

def usuario_ver(id_usuario: int):
    with connection.cursor() as cursor:
        cursor.callproc('usuario_ver', [id_usuario])
        row = cursor.fetchone()
        if not row:
            return None

        # ✅ Retornar diccionario en vez de objeto
        return {
            "id_usuario": row[0],
            "correo": row[1],
            "rol": row[2],
            "fecha_registro": row[3],
        }
```

---

## 🔴 ERROR 5: TypeError en PUT /api/tips/{id}/ - ❌ PROBLEMA EN BACKEND

### Estado: ❌ REQUIERE CORRECCIÓN EN BACKEND

**Logs:**
```
TypeError: tip_actualizar() got an unexpected keyword argument 'id_perfil'
[20/Nov/2025 05:15:37] "PUT /api/tips/3/ HTTP/1.1" 500 97395
```

### 🔍 Análisis del Problema

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/tips/views.py` línea 43-51

```python
def update(self, request, pk=None):
    serializer = TipPeriodicaCreateUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    # ❌ Pasa todos los campos del serializer como kwargs
    filas = tip_actualizar(int(pk), **serializer.validated_data)
    # ...
```

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/tips/services.py` línea 51-58

```python
# ❌ La función NO acepta id_perfil como parámetro
def tip_actualizar(id_recompensa: int, nombre: str, descripcion: str) -> int:
    with connection.cursor() as cursor:
        cursor.callproc('tip_actualizar', [id_recompensa, nombre, descripcion])
        # ...
```

**Problema:**
- El **serializer** incluye el campo `id_perfil`
- La función `tip_actualizar()` **NO acepta** ese parámetro
- Al hacer `**serializer.validated_data`, se pasan todos los campos incluyendo `id_perfil`
- Python lanza `TypeError` porque hay un argumento extra no esperado

### ✅ Solución en Backend

**Opción 1: Modificar la función para aceptar id_perfil (RECOMENDADO)**

```python
# En: BACKFRONT/BACKEND/EduFinanzas/tips/services.py

def tip_actualizar(id_recompensa: int, id_perfil: int, nombre: str, descripcion: str) -> int:
    """
    Actualiza un tip periódico existente
    """
    with connection.cursor() as cursor:
        # Verificar si el procedimiento almacenado acepta id_perfil
        cursor.callproc('tip_actualizar', [id_recompensa, id_perfil, nombre, descripcion])
        row = cursor.fetchone()
        return int(row[0]) if row else 0
```

**NOTA:** Verificar que el procedimiento almacenado `tip_actualizar` en MySQL acepte el parámetro `id_perfil`.

**Opción 2: Filtrar los campos antes de llamar a la función**

```python
# En: BACKFRONT/BACKEND/EduFinanzas/tips/views.py

def update(self, request, pk=None):
    serializer = TipPeriodicaCreateUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # ✅ Solo pasar los campos que acepta la función
    datos = {
        'nombre': serializer.validated_data['nombre'],
        'descripcion': serializer.validated_data['descripcion']
    }

    filas = tip_actualizar(int(pk), **datos)
    # ...
```

**Opción 3: Crear serializer diferente para UPDATE**

```python
# En: BACKFRONT/BACKEND/EduFinanzas/tips/serializers.py

class TipPeriodicaUpdateSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.TextField()
    # NO incluir id_perfil
```

---

## 🔴 ERROR 6: Bad Request en POST /api/retos/ - ⚠️ REQUIERE INVESTIGACIÓN

### Estado: ⚠️ REQUIERE LOGS MÁS DETALLADOS

**Logs:**
```
Bad Request: /api/retos/
[20/Nov/2025 05:16:59] "POST /api/retos/ HTTP/1.1" 400 110
```

### 🔍 Análisis Preliminar

**Posibles causas:**
1. Campo obligatorio faltante en FormData
2. Tipo de dato incorrecto (ej: string en vez de int)
3. Validación fallando en el serializer
4. Archivo de imagen corrupto o formato no soportado

### 📋 Datos que envía el frontend

```javascript
// En: FrontendEdufinanzas/src/pages/admin/Retos.jsx líneas 165-180

const dataToSend = new FormData();
dataToSend.append('nombre_reto', formData.nombre_reto);
dataToSend.append('id_tema', formData.id_tema);              // ⚠️ ¿Es string o int?
dataToSend.append('descripcion', formData.descripcion);
dataToSend.append('pregunta', formData.pregunta);
dataToSend.append('respuesta_uno', formData.respuesta_uno);
dataToSend.append('respuesta_dos', formData.respuesta_dos);
dataToSend.append('respuesta_tres', formData.respuesta_tres);
dataToSend.append('respuesta_cuatro', formData.respuesta_cuatro);
dataToSend.append('respuestaCorrecta', formData.respuestaCorrecta);
dataToSend.append('recompensa_monedas', formData.recompensa_monedas);  // ⚠️ ¿Es string o int?
dataToSend.append('costo_monedas', formData.costo_monedas);            // ⚠️ ¿Es string o int?

if (formData.img_reto) {
    dataToSend.append('img_reto', formData.img_reto);
}
```

### ✅ Necesitamos información adicional

Para resolver este error necesitamos:
1. Ver el **serializer** de retos en el backend
2. Ver el **service** de retos en el backend
3. Logs más detallados del error (mensaje completo de validación)

---

## 🔴 ERROR 7: Unsupported Media Type en POST /api/temas/ - ⚠️ MIXTO

### Estado: ⚠️ PARCIALMENTE CORREGIDO

**Logs:**
```
Unsupported Media Type: /api/temas/
[20/Nov/2025 05:02:11] "POST /api/temas/ HTTP/1.1" 415 129
```

**NOTA:** Este error apareció a las 05:02:11, **ANTES** de que se aplicaran las correcciones en `api.js`.

Luego aparecen estos logs exitosos:
```
[20/Nov/2025 05:18:04] "POST /api/temas/ HTTP/1.1" 201 96  ✅ EXITOSO
[20/Nov/2025 05:18:19] "DELETE /api/temas/6/ HTTP/1.1" 204 0  ✅ EXITOSO
```

### ✅ Conclusión

Este error **ya fue corregido** al quitar los headers manuales de FormData en `api.js`. Los logs posteriores muestran que crear y eliminar temas funciona correctamente.

---

## 📊 Resumen de Acciones Requeridas

### 🔧 Correcciones en Backend (Prioridad ALTA)

#### 1. Usuarios Serializer - Error 400 en UPDATE
```python
# Archivo: BACKFRONT/BACKEND/EduFinanzas/usuarios/serializers.py
# Línea: 5

# ANTES:
contrasena = serializers.CharField(max_length=255)

# DESPUÉS:
contrasena = serializers.CharField(max_length=255, required=False, allow_blank=True)
```

#### 2. Usuarios Service - Error 500 en CREATE
```python
# Archivo: BACKFRONT/BACKEND/EduFinanzas/usuarios/services.py
# Función: usuario_ver() - Líneas 44-62

# CAMBIAR: Retornar diccionario en vez de objeto Usuarios

def usuario_ver(id_usuario: int):
    with connection.cursor() as cursor:
        cursor.callproc('usuario_ver', [id_usuario])
        row = cursor.fetchone()
        if not row:
            return None

        # ✅ Retornar dict
        return {
            "id_usuario": row[0],
            "correo": row[1],
            "rol": row[2],
            "fecha_registro": row[3],
        }
```

#### 3. Tips Service - Error 500 en UPDATE

**Opción A: Modificar la función**
```python
# Archivo: BACKFRONT/BACKEND/EduFinanzas/tips/services.py
# Función: tip_actualizar() - Línea 51

def tip_actualizar(id_recompensa: int, id_perfil: int, nombre: str, descripcion: str) -> int:
    with connection.cursor() as cursor:
        cursor.callproc('tip_actualizar', [id_recompensa, id_perfil, nombre, descripcion])
        row = cursor.fetchone()
        return int(row[0]) if row else 0
```

**Opción B: Filtrar en la vista**
```python
# Archivo: BACKFRONT/BACKEND/EduFinanzas/tips/views.py
# Función: update() - Línea 43

def update(self, request, pk=None):
    serializer = TipPeriodicaCreateUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # ✅ Solo pasar campos aceptados
    filas = tip_actualizar(
        int(pk),
        serializer.validated_data['nombre'],
        serializer.validated_data['descripcion']
    )
    # ... resto del código
```

### ⚠️ Investigación Adicional Requerida

#### 4. Retos - Error 400 en CREATE

**Necesitamos revisar:**
- Serializer de retos (`retos/serializers.py`)
- Service de retos (`retos/services.py`)
- Procedimiento almacenado `retos_crear` en MySQL

**Posible problema:**
- Tipos de datos incorrectos (strings vs integers)
- Validaciones muy estrictas
- Campos obligatorios faltantes

---

## ✅ Correcciones Ya Aplicadas en Frontend

1. ✅ **Error 415 en Temas/Retos** - Headers de FormData removidos
2. ✅ **Error 400 en Usuarios UPDATE** - Contraseña vacía no se envía
3. ✅ **Error 500 IntegrityError** - Mensajes de error mejorados

---

## 🎯 Plan de Acción Sugerido

### Paso 1: Correcciones Inmediatas en Backend (30 min)
```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas

# Editar 3 archivos:
1. usuarios/serializers.py (agregar required=False a contrasena)
2. usuarios/services.py (cambiar usuario_ver para retornar dict)
3. tips/services.py O tips/views.py (manejar id_perfil correctamente)
```

### Paso 2: Pruebas de Funcionalidad (15 min)
```bash
# Iniciar backend
python manage.py runserver

# Iniciar frontend
cd c:\Users\USER\Documents\proyectos\proyecto_final\FrontendEdufinanzas
npm run dev

# Probar:
✓ Crear usuario
✓ Editar usuario (sin cambiar contraseña)
✓ Crear tip
✓ Editar tip
```

### Paso 3: Investigar Error de Retos (20 min)
- Revisar serializer de retos
- Verificar tipos de datos
- Probar creación con datos simples

---

## 📝 Archivos del Backend que Requieren Cambios

```
BACKFRONT/BACKEND/EduFinanzas/
├── usuarios/
│   ├── serializers.py       ❌ CAMBIAR (agregar required=False)
│   └── services.py           ❌ CAMBIAR (retornar dict en usuario_ver)
└── tips/
    ├── services.py           ❌ CAMBIAR (aceptar id_perfil)
    └── views.py              ⚠️ O CAMBIAR AQUÍ (filtrar campos)
```

---

## 🔍 Logs de Éxito para Validación

Después de las correcciones, deberíamos ver:

```
✅ [timestamp] "POST /api/usuarios/ HTTP/1.1" 201 XXX
✅ [timestamp] "PUT /api/usuarios/2/ HTTP/1.1" 200 XXX
✅ [timestamp] "PUT /api/tips/3/ HTTP/1.1" 200 XXX
✅ [timestamp] "POST /api/retos/ HTTP/1.1" 201 XXX
```

---

**Documento generado:** 20 de Noviembre, 2025
**Análisis basado en:** Logs de Django del servidor de desarrollo
**Frontend analizado:** FrontendEdufinanzas (React + Vite)
**Backend analizado:** EduFinanzas (Django + MySQL)
