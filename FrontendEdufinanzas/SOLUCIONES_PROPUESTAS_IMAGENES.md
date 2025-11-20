# 🖼️ Soluciones Propuestas: Upload de Imágenes en Temas y Retos

## 📊 Estado Actual del Problema

### Error 400 al crear/actualizar temas y retos CON imagen

**Síntomas:**
- ✅ Crear/actualizar SIN imagen funciona correctamente
- ❌ Crear/actualizar CON imagen retorna Error 400 Bad Request
- ❌ No se muestra el error específico en logs (necesitamos debug)

**Configuración actual:**
- ✅ Pillow 12.0.0 instalado
- ✅ Directorios mediafiles/temas/ y mediafiles/retos/ creados
- ✅ CORS configurado correctamente
- ✅ URLs de MEDIA descomentadas en urls.py
- ✅ Frontend envía FormData correctamente (sin headers manuales)
- ✅ Services tienen lógica para guardar archivos con default_storage

---

## 🔍 Diagnóstico Necesario

Antes de aplicar soluciones, **necesitamos ver los logs de debug**.

Con el logging que agregamos en `temas/views.py`, cuando intentes crear un tema con imagen, la terminal Django mostrará:

```python
DEBUG - request.data: {'nombre': '...', 'descripcion': '...', ...}
DEBUG - request.FILES: {'img_temas': <InMemoryUploadedFile...>}
DEBUG - validated_data: {...}
```

O si hay error:
```python
DEBUG - Validation errors: {'img_temas': ['...']}
ERROR en create: TypeError: ...
```

---

## 🎯 Soluciones Propuestas (Basadas en Causas Probables)

### Solución 1: Problema con el Stored Procedure

**Causa Probable:** El stored procedure `temas_crear` no acepta NULL o la ruta como VARCHAR

**Verificación:**
```sql
-- Ejecutar en MySQL para ver la definición del stored procedure
SHOW CREATE PROCEDURE temas_crear;
```

**Posibles Issues:**
- El parámetro `p_img_tema` no acepta NULL
- El tipo de dato no es VARCHAR(255)
- Hay validación en el stored procedure que rechaza ciertos valores

**Corrección A: Modificar Stored Procedure para aceptar NULL**

```sql
DROP PROCEDURE IF EXISTS temas_crear;

DELIMITER $$
CREATE PROCEDURE temas_crear(
  IN p_nombre VARCHAR(100),
  IN p_descripcion TEXT,
  IN p_img_tema VARCHAR(255),  -- Debe permitir NULL
  IN p_informacion TEXT
)
BEGIN
  INSERT INTO temas(nombre, descripcion, img_tema, informacion_tema)
  VALUES (p_nombre, p_descripcion, p_img_tema, p_informacion);

  SELECT LAST_INSERT_ID() AS id_tema;
END $$
DELIMITER ;
```

**Corrección B: Verificar que la columna img_tema acepta NULL**

```sql
-- Ver estructura de la tabla
DESCRIBE temas;

-- Si img_tema es NOT NULL, cambiarlo a NULL
ALTER TABLE temas MODIFY COLUMN img_tema VARCHAR(255) DEFAULT NULL;
```

---

### Solución 2: Problema con el Serializer

**Causa Probable:** El serializer no está procesando correctamente el archivo cuando viene en FormData

**Síntoma en logs:**
```python
DEBUG - Validation errors: {'img_temas': ['The submitted data was not a file...']}
```

**Corrección en `temas/serializers.py`:**

```python
class TemaCreateUpdateSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    img_temas = serializers.ImageField(
        required=False,     # ✅ Ya está
        allow_null=True,    # ✅ Ya está
        allow_empty_file=False,  # ✅ Agregar esto
        use_url=False  # ✅ Agregar esto - no usar URL, usar ruta relativa
    )
    informacion_tema = serializers.CharField()
```

---

### Solución 3: Problema con la Inconsistencia de Nombres (img_tema vs img_temas)

**Causa Probable:** Desajuste entre nombres de campos en DB, backend y frontend

**Estado actual:**
- **Base de Datos:** `img_tema` (singular)
- **Backend (models/serializers/services):** `img_temas` (plural)
- **Frontend:** `img_temas` (plural)
- **Stored Procedure parámetro:** `p_img_tema` (singular)
- **Stored Procedure columna:** `img_tema` (singular)

**Problema:** Los services usan `img_temas` pero el stored procedure espera `img_tema`

**Corrección RECOMENDADA - Opción A: Cambiar Backend a Singular**

Esto requiere cambios en múltiples archivos, pero es más consistente con la DB:

#### 1. temas/serializers.py
```python
class TemaCreateUpdateSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    img_tema = serializers.ImageField(  # ← Cambiar a singular
        required=False,
        allow_null=True,
        default=None
    )
    informacion_tema = serializers.CharField()
```

#### 2. temas/services.py
```python
def temas_crear(nombre: str, descripcion: str, img_tema, informacion_tema: str):  # ← img_tema
    """
    Crea un nuevo tema.
    Si img_tema es un archivo, lo guarda en mediafiles/temas/ y obtiene la ruta.
    """
    try:
        ruta_imagen = None
        if img_tema:  # ← img_tema
            if hasattr(img_tema, 'read'):
                nombre_archivo = f"temas/{img_tema.name}"
                ruta_guardada = default_storage.save(nombre_archivo, ContentFile(img_tema.read()))
                ruta_imagen = ruta_guardada
            else:
                ruta_imagen = img_tema

        with connection.cursor() as cursor:
            cursor.callproc('temas_crear', [nombre, descripcion, ruta_imagen, informacion_tema])
            row = cursor.fetchone()
            return int(row[0]) if row else None
    except DatabaseError as e:
        raise


def tema_ver(id_tema: int):
    with connection.cursor() as cursor:
        cursor.callproc('tema_ver', [id_tema])
        row = cursor.fetchone()
        if not row:
            return None
        return {
            "id_tema": row[0],
            "nombre": row[1],
            "descripcion": row[2],
            "img_tema": row[3],  # ← Cambiar a singular
            "informacion_tema": row[4],
        }


def temas_listar():
    with connection.cursor() as cursor:
        cursor.callproc('temas_listar')
        rows = cursor.fetchall()
        return [
            {
                "id_tema": r[0],
                "nombre": r[1],
                "descripcion": r[2],
                "img_tema": r[3],  # ← Cambiar a singular
                "informacion_tema": r[4],
            } for r in rows
        ]


def temas_actualizar(id_tema: int, nombre: str, descripcion: str, img_tema, informacion_tema: str) -> int:  # ← img_tema
    """
    Actualiza un tema existente.
    Si img_tema es un archivo nuevo, lo guarda. Si no se envía, mantiene la imagen anterior.
    """
    try:
        ruta_imagen = None

        if img_tema:  # ← img_tema
            if hasattr(img_tema, 'read'):
                nombre_archivo = f"temas/{img_tema.name}"
                ruta_guardada = default_storage.save(nombre_archivo, ContentFile(img_tema.read()))
                ruta_imagen = ruta_guardada
            else:
                ruta_imagen = img_tema

        with connection.cursor() as cursor:
            cursor.callproc('temas_actualizar', [
                id_tema, nombre, descripcion, ruta_imagen, informacion_tema])
            row = cursor.fetchone()
            return int(row[0]) if row else 0
    except DatabaseError as e:
        raise
```

#### 3. Frontend: Temas.jsx
```javascript
// Cambiar en el FormData
if (formData.img_tema) {  // ← Cambiar a singular
    dataToSend.append('img_tema', formData.img_tema);
}
```

**Corrección ALTERNATIVA - Opción B: Mantener Plural en Backend (Menos cambios)**

Si prefieres mantener `img_temas` en el código, NO hagas nada. La inconsistencia no debería causar el Error 400 porque los stored procedures usan los parámetros posicionales.

---

### Solución 4: Problema con el Parser de DRF

**Causa Probable:** DRF no está configurado para parsear multipart/form-data correctamente

**Verificación en `eduFinanzas/settings.py`:**

```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',  # ← Verificar que esté presente
        'rest_framework.parsers.FormParser',  # ← Verificar que esté presente
    ],
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_AUTHENTICATION_CLASSES': ["usuarios.authentication.JWTAuthentication",],
}
```

**Si faltan, agregarlos:**

```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',  # ← AGREGAR
        'rest_framework.parsers.FormParser',  # ← AGREGAR
    ],
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_AUTHENTICATION_CLASSES': ["usuarios.authentication.JWTAuthentication",],
}
```

---

### Solución 5: Problema con el Tamaño del Archivo

**Causa Probable:** Django/DRF rechaza archivos que exceden un tamaño máximo

**Verificación en `eduFinanzas/settings.py`:**

```python
# Agregar al final del archivo
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10 MB en bytes
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10 MB en bytes
```

---

## 📋 Plan de Acción Recomendado

### Fase 1: Diagnóstico (URGENTE)
1. ✅ Debug logging ya está agregado en temas/views.py
2. ⏳ **Intentar crear tema CON imagen desde el frontend**
3. ⏳ **Copiar y reportar los logs DEBUG/ERROR** de la terminal Django
4. ⏳ Identificar causa exacta basado en los logs

### Fase 2: Corrección (Depende del diagnóstico)

**Si el error es de Stored Procedure:**
- Aplicar **Solución 1**

**Si el error es de Serializer:**
- Aplicar **Solución 2**

**Si el error es de Parsers:**
- Aplicar **Solución 4**

**Si el error es de Tamaño:**
- Aplicar **Solución 5**

**Si el error es de Nombres inconsistentes:**
- Aplicar **Solución 3** (Opción A o B)

### Fase 3: Aplicar misma corrección a Retos

Una vez resuelto para Temas, aplicar la misma lógica a:
- `retos/serializers.py`
- `retos/services.py`
- `retos/views.py` (agregar debug logging)
- Frontend: `Retos.jsx`

---

## 🧪 Pruebas Post-Corrección

### Test 1: Crear Tema SIN Imagen
```
POST /api/temas/
Body: {nombre, descripcion, informacion_tema}
Expected: 201 Created
```

### Test 2: Crear Tema CON Imagen
```
POST /api/temas/
Body: FormData {nombre, descripcion, informacion_tema, img_tema: File}
Expected: 201 Created
Verify: Archivo guardado en mediafiles/temas/
```

### Test 3: Actualizar Tema SIN Cambiar Imagen
```
PUT /api/temas/{id}/
Body: {nombre, descripcion, informacion_tema}
Expected: 200 OK, imagen anterior se mantiene
```

### Test 4: Actualizar Tema CON Nueva Imagen
```
PUT /api/temas/{id}/
Body: FormData {nombre, descripcion, informacion_tema, img_tema: File}
Expected: 200 OK, nueva imagen guardada
```

### Test 5-8: Repetir para Retos

---

## 📝 Logging Adicional para Debugging

Si después de aplicar correcciones sigue fallando, agregar más debug en `temas/services.py`:

```python
def temas_crear(nombre: str, descripcion: str, img_temas, informacion_tema: str):
    """
    Crea un nuevo tema.
    Si img_temas es un archivo, lo guarda en mediafiles/temas/ y obtiene la ruta.
    """
    try:
        print(f"DEBUG services - img_temas recibido: {img_temas}")
        print(f"DEBUG services - Tipo: {type(img_temas)}")
        print(f"DEBUG services - Tiene read: {hasattr(img_temas, 'read') if img_temas else 'N/A'}")

        ruta_imagen = None
        if img_temas:
            if hasattr(img_temas, 'read'):
                nombre_archivo = f"temas/{img_temas.name}"
                print(f"DEBUG services - Guardando en: {nombre_archivo}")

                ruta_guardada = default_storage.save(nombre_archivo, ContentFile(img_temas.read()))
                ruta_imagen = ruta_guardada
                print(f"DEBUG services - Ruta guardada: {ruta_imagen}")
            else:
                ruta_imagen = img_temas
                print(f"DEBUG services - Ya es ruta: {ruta_imagen}")

        print(f"DEBUG services - Llamando stored procedure con ruta_imagen: {ruta_imagen}")

        with connection.cursor() as cursor:
            cursor.callproc('temas_crear', [nombre, descripcion, ruta_imagen, informacion_tema])
            row = cursor.fetchone()
            nuevo_id = int(row[0]) if row else None
            print(f"DEBUG services - ID retornado: {nuevo_id}")
            return nuevo_id
    except DatabaseError as e:
        print(f"ERROR services - DatabaseError: {e}")
        raise
    except Exception as e:
        print(f"ERROR services - Exception: {type(e).__name__}: {e}")
        raise
```

---

## 🚨 Errores Comunes y sus Soluciones

### Error: "Upload a valid image. The file you uploaded was either not an image or a corrupted image."
**Solución:** Pillow no está instalado o el archivo no es una imagen válida
```bash
pip install Pillow
```

### Error: "Column 'img_tema' cannot be null"
**Solución:** El stored procedure o la tabla no acepta NULL
```sql
ALTER TABLE temas MODIFY COLUMN img_tema VARCHAR(255) DEFAULT NULL;
```

### Error: "Unsupported Media Type"
**Solución:** Faltan parsers en REST_FRAMEWORK settings
```python
'DEFAULT_PARSER_CLASSES': [
    'rest_framework.parsers.JSONParser',
    'rest_framework.parsers.MultiPartParser',
    'rest_framework.parsers.FormParser',
],
```

### Error: "Permission denied" al guardar archivo
**Solución:** Django no tiene permisos de escritura
```bash
# Windows
icacls mediafiles /grant Users:F /T

# Linux/Mac
chmod -R 777 mediafiles/
```

---

## 🎯 Próximo Paso Inmediato

**ACCIÓN REQUERIDA:**

1. Ir a `http://localhost:5174/admin/temas`
2. Intentar crear un tema CON imagen
3. Observar la terminal Django
4. Copiar TODO el output que aparece (DEBUG y ERROR)
5. Reportarlo aquí

Con esa información, podremos identificar la causa exacta y aplicar la solución correcta.

---

**Última actualización:** 2025-11-20 06:32 AM
**Estado:** Esperando logs de debug para diagnóstico preciso
