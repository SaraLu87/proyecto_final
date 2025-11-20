# 🧪 Guía de Pruebas: Upload de Imágenes en Temas y Retos

## ✅ Cambios Aplicados

### Backend
1. ✅ URLs de MEDIA descomentadas en `eduFinanzas/urls.py`
2. ✅ Manejo de archivos implementado en `temas/services.py`
3. ✅ Manejo de archivos implementado en `retos/services.py`

### Frontend
1. ✅ Headers de FormData corregidos (sin Content-Type manual)
2. ✅ Manejo de IntegrityError mejorado
3. ✅ Campo id_perfil eliminado de Tips

---

## 🚀 Pasos para Probar

### 1. Iniciar el Backend

```bash
# Terminal 1: Backend Django
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
python manage.py runserver
```

**Verifica que aparezca:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

---

### 2. Iniciar el Frontend

```bash
# Terminal 2: Frontend React
cd c:\Users\USER\Documents\proyectos\proyecto_final\FrontendEdufinanzas
npm run dev
```

**Verifica que aparezca:**
```
  VITE v5.4.10  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

### 3. Verificar Directorio de Media

**Antes de probar, verifica que exista el directorio:**

```bash
# En PowerShell o CMD
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
dir mediafiles
```

**Si NO existe, créalo:**
```bash
mkdir mediafiles
mkdir mediafiles\temas
mkdir mediafiles\retos
mkdir mediafiles\perfiles
```

---

## 🧪 Casos de Prueba

### ✅ Prueba 1: Crear Tema SIN Imagen

1. Ir a: `http://localhost:5173/admin/temas`
2. Clic en **"Crear Tema"**
3. Llenar el formulario:
   - **Nombre:** `Prueba Tema Sin Imagen`
   - **Descripción:** `Este es un tema de prueba sin imagen`
   - **Información:** `Contenido del tema`
   - **Imagen:** Dejar vacío (NO seleccionar archivo)
4. Clic en **"Crear"**

**✅ Resultado Esperado:**
```
✅ Tema creado correctamente (mensaje verde)
✅ Aparece en la tabla sin imagen
✅ En la consola del backend: POST /api/temas/ HTTP/1.1 201
```

**❌ Si falla:**
- Verificar logs del backend
- Verificar que el stored procedure acepta NULL en img_temas

---

### ✅ Prueba 2: Crear Tema CON Imagen

**Prepara una imagen de prueba:**
- Nombre: `tema-test.jpg` o `tema-test.png`
- Tamaño: < 5MB
- Formato: JPG, PNG

**Pasos:**
1. Ir a: `http://localhost:5173/admin/temas`
2. Clic en **"Crear Tema"**
3. Llenar el formulario:
   - **Nombre:** `Prueba Tema Con Imagen`
   - **Descripción:** `Este es un tema de prueba con imagen`
   - **Información:** `Contenido del tema`
   - **Imagen:** Seleccionar `tema-test.jpg`
4. Clic en **"Crear"**

**✅ Resultado Esperado:**
```
✅ Tema creado correctamente (mensaje verde)
✅ Aparece en la tabla con preview de imagen
✅ En la consola del backend: POST /api/temas/ HTTP/1.1 201
✅ Archivo guardado en: mediafiles/temas/tema-test.jpg
```

**Verificar que se guardó el archivo:**
```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
dir mediafiles\temas
```

**Deberías ver:**
```
tema-test.jpg (o similar)
```

**❌ Si falla con Error 400:**
- Verificar que Pillow está instalado: `pip list | findstr -i pillow`
- Si no está: `pip install Pillow`
- Reiniciar el servidor Django

**❌ Si falla con Error 500:**
- Ver logs detallados del backend
- Verificar permisos de escritura en carpeta mediafiles
- Verificar que el stored procedure acepta VARCHAR para img_temas

---

### ✅ Prueba 3: Actualizar Tema SIN Cambiar Imagen

1. En la tabla de temas, buscar el tema con imagen
2. Clic en **"Editar"** ✏️
3. Cambiar solo el **Nombre:** `Tema Actualizado`
4. NO seleccionar nueva imagen
5. Clic en **"Actualizar"**

**✅ Resultado Esperado:**
```
✅ Tema actualizado correctamente
✅ La imagen anterior se mantiene
✅ En la consola: PUT /api/temas/X/ HTTP/1.1 200
```

---

### ✅ Prueba 4: Actualizar Tema CON Nueva Imagen

1. Buscar el tema con imagen
2. Clic en **"Editar"** ✏️
3. Seleccionar una **nueva imagen:** `tema-actualizado.jpg`
4. Clic en **"Actualizar"**

**✅ Resultado Esperado:**
```
✅ Tema actualizado correctamente
✅ Se muestra la nueva imagen
✅ En mediafiles/temas/ aparece: tema-actualizado.jpg
✅ En la consola: PUT /api/temas/X/ HTTP/1.1 200
```

---

### ✅ Prueba 5: Crear Reto SIN Imagen

1. Ir a: `http://localhost:5173/admin/retos`
2. Clic en **"Crear Reto"**
3. Llenar todos los campos obligatorios:
   - **Nombre:** `Reto Sin Imagen`
   - **Tema:** Seleccionar un tema
   - **Descripción:** `Descripción del reto`
   - **Pregunta:** `¿Cuál es la pregunta?`
   - **Respuestas:** Llenar las 4 opciones
   - **Respuesta Correcta:** Seleccionar una
   - **Recompensa:** `10`
   - **Costo:** `5`
   - **Imagen:** NO seleccionar
4. Clic en **"Crear"**

**✅ Resultado Esperado:**
```
✅ Reto creado correctamente
✅ Aparece en la tabla
✅ POST /api/retos/ HTTP/1.1 201
```

---

### ✅ Prueba 6: Crear Reto CON Imagen

**Prepara una imagen:**
- Nombre: `reto-test.jpg`

**Pasos:**
1. Ir a: `http://localhost:5173/admin/retos`
2. Clic en **"Crear Reto"**
3. Llenar todos los campos + **seleccionar imagen**
4. Clic en **"Crear"**

**✅ Resultado Esperado:**
```
✅ Reto creado correctamente
✅ POST /api/retos/ HTTP/1.1 201
✅ Archivo en: mediafiles/retos/reto-test.jpg
```

**Verificar:**
```bash
dir mediafiles\retos
```

---

### ✅ Prueba 7: Editar Reto CON Nueva Imagen

1. Buscar un reto existente
2. Clic en **"Editar"** ✏️
3. Seleccionar nueva imagen
4. Clic en **"Actualizar"**

**✅ Resultado Esperado:**
```
✅ Reto actualizado correctamente
✅ PUT /api/retos/X/ HTTP/1.1 200
✅ Nueva imagen guardada
```

---

## 📊 Checklist de Validación

### Backend
- [ ] Django corre sin errores
- [ ] Directorio `mediafiles/` existe
- [ ] Subdirectorios `temas/` y `retos/` existen
- [ ] URLs de MEDIA están activas

### Frontend
- [ ] React corre sin errores en consola del navegador
- [ ] No hay errores 415 (Unsupported Media Type)
- [ ] FormData se envía correctamente

### Funcionalidad Temas
- [ ] ✅ Crear tema SIN imagen → 201 Created
- [ ] ✅ Crear tema CON imagen → 201 Created + archivo guardado
- [ ] ✅ Actualizar tema SIN cambiar imagen → 200 OK
- [ ] ✅ Actualizar tema CON nueva imagen → 200 OK + nuevo archivo
- [ ] ✅ Eliminar tema → 204 No Content (o 500 con mensaje claro si tiene retos)

### Funcionalidad Retos
- [ ] ✅ Crear reto SIN imagen → 201 Created
- [ ] ✅ Crear reto CON imagen → 201 Created + archivo guardado
- [ ] ✅ Actualizar reto SIN cambiar imagen → 200 OK
- [ ] ✅ Actualizar reto CON nueva imagen → 200 OK + nuevo archivo
- [ ] ✅ Eliminar reto → 204 No Content

---

## 🔍 Debugging

### Ver Logs del Backend en Tiempo Real

```bash
# Los logs aparecen automáticamente en la terminal donde corre Django
# Busca líneas como:
[timestamp] "POST /api/temas/ HTTP/1.1" 201 XXX
[timestamp] "POST /api/temas/ HTTP/1.1" 400 XXX  # Error
```

### Ver Logs del Frontend

**Abrir DevTools del Navegador:**
1. Presiona `F12`
2. Ve a la pestaña **Console**
3. Ve a la pestaña **Network**
4. Filtra por `XHR` o `Fetch`
5. Intenta crear un tema con imagen
6. Busca la petición `POST /api/temas/`
7. Ve a:
   - **Headers** → Ver Content-Type (debe ser multipart/form-data con boundary)
   - **Payload** → Ver que img_temas aparece como archivo
   - **Response** → Ver la respuesta del servidor

---

## ❌ Errores Comunes y Soluciones

### Error: "Pillow is not installed"

**Causa:** Django requiere Pillow para procesar ImageField

**Solución:**
```bash
pip install Pillow
# Reiniciar el servidor Django
```

---

### Error 400: Bad Request al crear tema/reto con imagen

**Causa 1:** El stored procedure no acepta el tipo de dato

**Solución:** Verificar que en MySQL, el campo acepta VARCHAR o TEXT:
```sql
SHOW CREATE PROCEDURE temas_crear;
SHOW CREATE PROCEDURE retos_crear;
```

**Causa 2:** Los datos enviados no coinciden con el serializer

**Solución:** Ver logs del backend para el error específico

---

### Error 500: Internal Server Error

**Causa:** Error en el stored procedure o en el service

**Ver logs del backend:**
```
Traceback (most recent call last):
  File "...\services.py", line XX
    ...
```

**Posibles causas:**
- Stored procedure no acepta NULL en imagen
- Tipo de dato incorrecto en base de datos
- Permisos de escritura en mediafiles

---

### La imagen no se guarda físicamente

**Verificar:**
1. ¿Existe el directorio mediafiles/temas/?
2. ¿Django tiene permisos de escritura?
3. ¿El código en services.py se está ejecutando?

**Debug:**
Agregar prints temporales en `temas/services.py`:
```python
def temas_crear(nombre: str, descripcion: str, img_temas, informacion_tema: str):
    print(f"DEBUG: img_temas recibido: {img_temas}")
    print(f"DEBUG: Tipo: {type(img_temas)}")

    if img_temas:
        print(f"DEBUG: Tiene atributo read: {hasattr(img_temas, 'read')}")
        if hasattr(img_temas, 'read'):
            nombre_archivo = f"temas/{img_temas.name}"
            print(f"DEBUG: Guardando en: {nombre_archivo}")
            ruta_guardada = default_storage.save(...)
            print(f"DEBUG: Ruta guardada: {ruta_guardada}")
```

---

### Error: "No such file or directory: mediafiles"

**Solución:**
```bash
cd c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
mkdir mediafiles
mkdir mediafiles\temas
mkdir mediafiles\retos
```

---

## 📞 Reporte de Resultados

Después de las pruebas, reporta:

### ✅ Lo que funcionó:
- [ ] Crear tema sin imagen
- [ ] Crear tema con imagen
- [ ] Actualizar tema sin cambiar imagen
- [ ] Actualizar tema con nueva imagen
- [ ] Crear reto sin imagen
- [ ] Crear reto con imagen
- [ ] Actualizar reto sin cambiar imagen
- [ ] Actualizar reto con nueva imagen

### ❌ Lo que falló:
- Describe el error específico
- Copia los logs del backend
- Copia el mensaje de error del frontend

---

## 🎯 Resultado Esperado Final

Si todo funciona correctamente, deberías poder:

1. ✅ Crear temas y retos **con o sin** imágenes
2. ✅ Ver las imágenes en la tabla del admin
3. ✅ Actualizar temas/retos manteniendo la imagen anterior si no seleccionas una nueva
4. ✅ Actualizar con nueva imagen y que se guarde correctamente
5. ✅ Ver los archivos físicos en `mediafiles/temas/` y `mediafiles/retos/`
6. ✅ No recibir errores 400, 415 o 500 en operaciones normales
7. ✅ Recibir mensajes claros cuando hay errores (como IntegrityError)

---

**¡Listo para probar!** 🚀

Empieza con las pruebas 1 y 2 (Temas sin/con imagen) y reporta los resultados.
