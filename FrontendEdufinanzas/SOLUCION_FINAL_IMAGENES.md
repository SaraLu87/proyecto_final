# 🎯 Solución Final: Upload de Imágenes - Problema Identificado

## 📊 Estado Actual

- ✅ **Sin imagen:** Crear/Actualizar funciona correctamente
- ❌ **Con imagen:** Error 400 Bad Request
- ✅ **Parsers agregados:** MultiPartParser y FormParser configurados
- ✅ **Pillow instalado:** v12.0.0
- ✅ **Directorios creados:** mediafiles/temas/, mediafiles/retos/

##🔍 Problema Identificado

El stored procedure y la lógica del backend esperan que el campo se llame **`img_tema`** (singular), pero el código usa **`img_temas`** (plural).

**Base de Datos:**
```sql
img_tema VARCHAR(255) DEFAULT 'default_tema.png'
```

**Backend actual (incorrecto):**
- Serializer: `img_temas`
- Services: `img_temas`
- Frontend: `img_temas`

---

## ✅ SOLUCIÓN DEFINITIVA: Unificar a Singular (`img_tema`)

Voy a cambiar todo el backend y frontend para usar `img_tema` (singular) y que coincida con la base de datos.

### Cambio 1: temas/serializers.py

```python
class TemaCreateUpdateSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    img_tema = serializers.ImageField(  # ← Cambiar a SINGULAR
        required=False,
        allow_null=True,
        default=None
    )
    informacion_tema = serializers.CharField()
```

### Cambio 2: temas/services.py

```python
def temas_crear(nombre: str, descripcion: str, img_tema, informacion_tema: str):  # ← SINGULAR
    """
    Crea un nuevo tema.
    Si img_tema es un archivo, lo guarda en mediafiles/temas/ y obtiene la ruta.
    """
    try:
        ruta_imagen = None
        if img_tema:  # ← SINGULAR
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
            "img_tema": row[3],  # ← SINGULAR
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
                "img_tema": r[3],  # ← SINGULAR
                "informacion_tema": r[4],
            } for r in rows
        ]


def temas_actualizar(id_tema: int, nombre: str, descripcion: str, img_tema, informacion_tema: str) -> int:  # ← SINGULAR
    """
    Actualiza un tema existente.
    Si img_tema es un archivo nuevo, lo guarda. Si no se envía, mantiene la imagen anterior.
    """
    try:
        ruta_imagen = None

        if img_tema:  # ← SINGULAR
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

### Cambio 3: Frontend - Temas.jsx

Buscar todas las referencias a `img_temas` y cambiarlas a `img_tema`:

```javascript
// Estado inicial
const [formData, setFormData] = useState({
  nombre: '',
  descripcion: '',
  informacion_tema: '',
  img_tema: null,  // ← SINGULAR
});

// En el input file
<input
  type="file"
  name="img_tema"  // ← SINGULAR
  accept="image/*"
  onChange={handleFileChange}
/>

// Al preparar FormData para enviar
if (formData.img_tema) {  // ← SINGULAR
  dataToSend.append('img_tema', formData.img_tema);  // ← SINGULAR
}
```

### Cambio 4: Mismo para Retos

Aplicar los mismos cambios en:
- `retos/serializers.py`: `img_reto` → mantener (ya es singular)
- `retos/services.py`: Verificar que use `img_reto` (singular)
- Frontend `Retos.jsx`: Verificar que use `img_reto` (singular)

---

## 🚀 Implementación Paso a Paso

Ya que mencionaste que funciona SIN imagen, el problema definitivamente es la inconsistencia de nombres o cómo se procesa la imagen.

**Te propongo implementar los cambios en este orden:**

1. **Backend primero** (para que coincida con la BD)
2. **Frontend después** (para que envíe el nombre correcto)
3. **Probar**

¿Quieres que implemente estos cambios ahora?

---

## 📝 Comandos para Verificar

Después de aplicar los cambios, verifica:

```bash
# Ver archivos guardados
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\temas

# Logs del servidor Django mostrarán:
DEBUG - request.FILES: {'img_tema': <InMemoryUploadedFile...>}
DEBUG - validated_data: {'nombre': '...', 'img_tema': <InMemoryUploadedFile...>}
```

---

**¿Procedo con implementar estos cambios?**
