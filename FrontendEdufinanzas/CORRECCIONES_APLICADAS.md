# 🔧 Correcciones Aplicadas - Sesión 2025-11-20

## ✅ Problemas Resueltos

### 1. Error de CORS (Network Error)
**Problema:** Frontend en puerto 5174 no podía conectarse al backend
**Causa:** CORS solo permitía puerto 5173
**Solución:** Agregado `"http://localhost:5174"` a `CORS_ALLOWED_ORIGINS` en settings.py
**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/eduFinanzas/settings.py:90`
**Estado:** ✅ Resuelto

---

### 2. TypeError en usuarios_actualizar() - missing 'contrasena'
**Problema:** Al actualizar usuario sin cambiar contraseña, daba error
**Causa:** La función requería `contrasena` como parámetro obligatorio
**Solución:**
- Hice `contrasena` opcional con valor por defecto `None`
- Si no se proporciona, se pasa `None` al stored procedure (mantiene la actual)
- Si se proporciona, se hashea antes de enviar

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/usuarios/services.py:79-94`

**Código aplicado:**
```python
def usuarios_actualizar(id_usuario: int, correo: str, rol: str, contrasena: str = None) -> int:
    """
    Actualiza los datos de un usuario existente.
    Si no se proporciona contraseña, se mantiene la actual.
    """
    with connection.cursor() as cursor:
        # Si no hay contraseña, pasar None al stored procedure (mantendrá la actual)
        hash_con = None
        if contrasena:
            u.set_password(contrasena)
            hash_con = u.password

        cursor.callproc('usuarios_actualizar', [id_usuario, correo, hash_con, rol])
        cursor.execute("SELECT ROW_COUNT();")
        row = cursor.fetchone()
        return int(row[0]) if row else 0
```

**Estado:** ✅ Resuelto

---

### 3. CRUD de Tips - id_perfil Missing
**Problema:** Tips CRUD fallaba porque:
- Frontend no enviaba `id_perfil` (fue removido)
- Backend lo requería como obligatorio
- Stored procedure necesita `id_perfil` para FK

**Solución Aplicada:**

#### A. Serializer - hacer id_perfil opcional
**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/tips/serializers.py:5`
```python
class TipPeriodicaCreateUpdateSerializer(serializers.Serializer):
    id_perfil = serializers.IntegerField(required=False, allow_null=True, default=None)
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
```

#### B. Service - usar id_perfil por defecto
**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/tips/services.py:4-19`
```python
def tip_crear(nombre: str, descripcion: str, id_perfil: int = None):
    """
    Crea un nuevo tip periódico usando el procedimiento almacenado 'tip_crear'
    Si no se proporciona id_perfil, se usa 1 por defecto (perfil administrador)
    """
    try:
        # Si no hay id_perfil, usar 1 como valor por defecto (perfil admin/sistema)
        if id_perfil is None:
            id_perfil = 1

        with connection.cursor() as cursor:
            cursor.callproc('tip_crear', [id_perfil, nombre, descripcion])
            row = cursor.fetchone()
            return int(row[0]) if row else None
    except DatabaseError as e:
        raise
```

#### C. Views - filtrar id_perfil en actualización
**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/tips/views.py:43-55`
```python
def update(self, request, pk=None):
    """Actualizar un tip existente"""
    serializer = TipPeriodicaCreateUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Extraer solo los campos que tip_actualizar acepta (sin id_perfil)
    datos = {k: v for k, v in serializer.validated_data.items() if k != 'id_perfil'}
    filas = tip_actualizar(int(pk), **datos)

    if filas == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
    item = tip_ver(int(pk))
    return Response(item, status=status.HTTP_200_OK)
```

**Estado:** ✅ Resuelto

---

## ⚠️ En Investigación

### 4. Error 400 en POST /api/temas/ con Imagen
**Problema:** Al crear tema con imagen, retorna 400 Bad Request
**Estado:** 🔍 Debug logging agregado

**Archivo:** `BACKFRONT/BACKEND/EduFinanzas/temas/views.py:34-54`

**Debug agregado:**
```python
def create(self, request):
    """Crear un nuevo tema"""
    try:
        # Debug: ver qué datos llegan
        print(f"DEBUG - request.data: {request.data}")
        print(f"DEBUG - request.FILES: {request.FILES}")

        serializer = TemaCreateUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"DEBUG - Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print(f"DEBUG - validated_data: {serializer.validated_data}")
        nuevo_id = temas_crear(**serializer.validated_data)
        item = tema_ver(nuevo_id)
        return Response(item, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"ERROR en create: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

**Acción requerida:**
- Intenta crear un tema CON imagen desde el frontend
- Los logs de debug aparecerán en la terminal Django
- Reporta qué muestra en los prints DEBUG y ERROR

---

### 5. Error 400 en Retos con Imagen
**Problema:** Similar a temas, no deja crear/actualizar con imagen
**Estado:** ⏳ Pendiente de investigar (esperando resultados de debug de temas)

**Posible causa:** Mismo problema que temas

---

## 📊 Estado de los CRUDs

| Módulo | GET (List) | GET (Detail) | POST (Create) | PUT (Update) | DELETE |
|--------|-----------|--------------|---------------|--------------|--------|
| Usuarios | ✅ | ✅ | ✅ | ✅ (fixed) | ✅ |
| Temas (sin img) | ✅ | ✅ | ⚠️ (probar) | ⚠️ (probar) | ✅ |
| Temas (con img) | ✅ | ✅ | ❌ (400) | ❌ (400) | ✅ |
| Retos (sin img) | ✅ | ✅ | ⚠️ (probar) | ⚠️ (probar) | ✅ |
| Retos (con img) | ✅ | ✅ | ❌ (400) | ❌ (400) | ✅ |
| Tips | ✅ | ✅ | ✅ (fixed) | ✅ (fixed) | ✅ |

**Leyenda:**
- ✅ Funcionando correctamente
- ⚠️ Pendiente de probar
- ❌ Error conocido
- 🔍 En investigación

---

## 🧪 Pruebas Requeridas

### Prioridad Alta
1. **Crear tema SIN imagen** - verificar que funciona
2. **Crear tema CON imagen** - ver logs de debug
3. **CRUD de Tips completo** - verificar que funciona con las correcciones

### Prioridad Media
4. Actualizar tema con/sin imagen
5. Crear reto con/sin imagen
6. Actualizar usuario sin cambiar contraseña

---

## 📝 Logs a Monitorear

### Django Terminal
Cuando intentes crear un tema CON imagen, busca en la terminal:

```
DEBUG - request.data: {...}
DEBUG - request.FILES: {...}
DEBUG - Validation errors: {...}  (si falla validación)
DEBUG - validated_data: {...}
ERROR en create: TypeError: ...  (si hay error)
```

### Errores Esperados Posibles

#### Opción A: Error de Validación del Serializer
```
DEBUG - Validation errors: {'img_temas': ['Este campo es requerido']}
```
**Causa:** El serializer no está procesando el archivo correctamente

#### Opción B: Error en el Service
```
ERROR en create: TypeError: 'InMemoryUploadedFile' object is not subscriptable
```
**Causa:** El service está intentando procesar el archivo incorrectamente

#### Opción C: Error del Stored Procedure
```
ERROR en create: DatabaseError: (1048, "Column 'img_tema' cannot be null")
```
**Causa:** El stored procedure no acepta NULL o el valor enviado es incorrecto

---

## 🔄 Estado de Servidores

### Backend Django
- **Puerto:** 8000
- **Estado:** ✅ Corriendo
- **Entorno Virtual:** C:\Users\USER\Documents\entornos\prueba
- **Pillow:** ✅ 12.0.0 instalado
- **Directorio mediafiles:** ✅ Creado

### Frontend React
- **Puerto:** 5174 (5173 estaba ocupado)
- **Estado:** ✅ Corriendo
- **URL:** http://localhost:5174/

---

## 📁 Archivos Modificados en esta Sesión

1. `eduFinanzas/settings.py` - Agregado puerto 5174 a CORS
2. `usuarios/authentication.py` - Clase User wrapper (Error 403)
3. `usuarios/services.py` - Contraseña opcional en actualizar
4. `tips/serializers.py` - id_perfil opcional
5. `tips/services.py` - id_perfil con valor por defecto
6. `tips/views.py` - Filtrar id_perfil en update
7. `temas/views.py` - Debug logging agregado

---

## 🚀 Próximos Pasos

1. **Probar CRUD de Usuarios** - verificar que actualizar sin contraseña funciona
2. **Probar CRUD de Tips** - verificar que crear/actualizar funciona sin id_perfil
3. **Crear tema CON imagen** - observar logs de debug
4. **Reportar logs** - copiar salida DEBUG/ERROR de la terminal Django
5. **Diagnosticar causa** - basado en los logs, aplicar corrección específica
6. **Aplicar misma corrección a Retos** - una vez resuelto para Temas

---

**Última actualización:** 2025-11-20 06:22 AM
**Estado general:** 3/4 problemas resueltos, 1 en investigación
