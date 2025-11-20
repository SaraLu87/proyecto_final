# 🧪 Pruebas CRUD Completas - Panel Administrador

## 📅 Fecha: 2025-11-20

---

## ✅ Estado de Preparación

- ✅ Pillow 12.0.0 instalado en entorno virtual
- ✅ Directorio `mediafiles/` creado con subdirectorios (temas, retos, perfiles)
- ✅ Backend Django corriendo (puerto 8000)
- ✅ Frontend React corriendo en `http://localhost:5174/`
- ✅ Error 403 solucionado (User wrapper implementado)

---

## 🎯 URLs de Prueba

- **Frontend Admin**: `http://localhost:5174/admin`
- **Login**: `http://localhost:5174/login`

---

## 📋 Orden de Pruebas

### Fase 1: Autenticación y Error 403
### Fase 2: CRUD de Usuarios
### Fase 3: CRUD de Temas (CON y SIN imagen)
### Fase 4: CRUD de Retos (CON y SIN imagen)
### Fase 5: CRUD de Tips

---

## 🔐 Fase 1: Autenticación y Error 403

### Prueba 1.1: Login como Administrador

**Objetivo:** Verificar que el Error 403 está resuelto

**Pasos:**
1. Ir a: `http://localhost:5174/login`
2. Ingresar credenciales de administrador:
   - Correo: (tu correo de admin)
   - Contraseña: (tu contraseña)
3. Clic en "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Redirección a Dashboard
- ✅ Dashboard carga SIN Error 403
- ✅ Se muestra la lista de usuarios

**En el backend (terminal Django), deberías ver:**
```
POST /api/login_usuario/ HTTP/1.1 200
GET /api/usuarios/ HTTP/1.1 200
```

**❌ Si falla con 403:**
- Verificar que el archivo authentication.py tiene la clase User
- Verificar que el servidor Django se reinició correctamente
- Ver logs detallados en la terminal

---

## 👥 Fase 2: CRUD de Usuarios

### Prueba 2.1: Listar Usuarios (GET)

**URL:** `http://localhost:5174/admin/usuarios`

**Resultado Esperado:**
- ✅ Tabla con todos los usuarios
- ✅ GET /api/usuarios/ HTTP/1.1 200

---

### Prueba 2.2: Crear Usuario CON Contraseña (POST)

**Pasos:**
1. Clic en "Crear Usuario"
2. Llenar el formulario:
   - **Correo:** `test@example.com`
   - **Contraseña:** `12345678`
   - **Rol:** Usuario
3. Clic en "Crear"

**Resultado Esperado:**
- ✅ Mensaje: "Usuario creado correctamente"
- ✅ POST /api/usuarios/ HTTP/1.1 201
- ✅ Usuario aparece en la tabla

---

### Prueba 2.3: Actualizar Usuario SIN Cambiar Contraseña (PUT)

**Pasos:**
1. Buscar el usuario `test@example.com`
2. Clic en botón "Editar" ✏️
3. En el modal, cambiar:
   - **Correo:** `test_actualizado@example.com`
   - **Contraseña:** Dejar vacío
   - **Rol:** Administrador
4. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ Mensaje: "Usuario actualizado correctamente"
- ✅ PUT /api/usuarios/{id}/ HTTP/1.1 200
- ✅ Correo y rol actualizados
- ✅ Contraseña se mantiene (NO se borra)

---

### Prueba 2.4: Intentar Eliminar Usuario con Perfil (DELETE - Error Esperado)

**Pasos:**
1. Buscar un usuario que tenga un perfil asociado
2. Clic en botón "Eliminar" 🗑️
3. Confirmar eliminación

**Resultado Esperado:**
- ❌ Error controlado con mensaje claro:
  - "No se puede eliminar porque tiene datos relacionados. Primero elimina los registros dependientes."
- ✅ DELETE /api/usuarios/{id}/ HTTP/1.1 500 (pero con mensaje claro)
- ✅ Usuario NO se elimina

---

### Prueba 2.5: Eliminar Usuario SIN Relaciones (DELETE)

**Pasos:**
1. Buscar el usuario `test_actualizado@example.com` (recién creado, sin perfil)
2. Clic en "Eliminar" 🗑️
3. Confirmar

**Resultado Esperado:**
- ✅ Mensaje: "Usuario eliminado correctamente"
- ✅ DELETE /api/usuarios/{id}/ HTTP/1.1 204
- ✅ Usuario desaparece de la tabla

---

## 📚 Fase 3: CRUD de Temas

### Prueba 3.1: Listar Temas (GET)

**URL:** `http://localhost:5174/admin/temas`

**Resultado Esperado:**
- ✅ Tabla con todos los temas
- ✅ GET /api/temas/ HTTP/1.1 200

---

### Prueba 3.2: Crear Tema SIN Imagen (POST) ⚠️ CRÍTICA

**Objetivo:** Verificar que el flujo básico funciona sin imagen

**Pasos:**
1. Clic en "Crear Tema"
2. Llenar el formulario:
   - **Nombre:** `Ahorro Básico`
   - **Descripción:** `Tema sobre ahorro básico`
   - **Información:** `Aprende a ahorrar de manera efectiva`
   - **Imagen:** NO seleccionar ninguna
3. Clic en "Crear"

**Resultado Esperado:**
- ✅ Mensaje: "Tema creado correctamente"
- ✅ POST /api/temas/ HTTP/1.1 201
- ✅ Tema aparece en la tabla

**❌ Si falla con 400:**
- Ver logs detallados en terminal Django
- Verificar que el stored procedure acepta NULL en img_tema
- Revisar que los campos enviados coinciden con el serializer

---

### Prueba 3.3: Crear Tema CON Imagen (POST) ⚠️ CRÍTICA

**Objetivo:** Verificar que el upload de imagen funciona

**Preparación:**
- Descargar o preparar una imagen de prueba: `test-tema.jpg` (< 5MB)

**Pasos:**
1. Clic en "Crear Tema"
2. Llenar el formulario:
   - **Nombre:** `Inversión Básica`
   - **Descripción:** `Tema sobre inversión`
   - **Información:** `Conceptos básicos de inversión`
   - **Imagen:** Seleccionar `test-tema.jpg`
3. Clic en "Crear"

**Resultado Esperado:**
- ✅ Mensaje: "Tema creado correctamente"
- ✅ POST /api/temas/ HTTP/1.1 201
- ✅ Tema aparece en la tabla con preview de imagen

**Verificar físicamente que se guardó:**
```bash
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\temas
```
Deberías ver: `test-tema.jpg` (o similar)

**❌ Si falla con 400:**
1. Ver logs en terminal Django (Traceback completo)
2. Verificar que:
   - Pillow está instalado (✅ ya lo verificamos)
   - Directorio mediafiles/temas existe (✅ ya lo creamos)
   - El stored procedure acepta VARCHAR para img_tema
3. Reportar el error específico que aparece en logs

---

### Prueba 3.4: Actualizar Tema SIN Cambiar Imagen (PUT)

**Pasos:**
1. Buscar el tema "Inversión Básica" (con imagen)
2. Clic en "Editar" ✏️
3. Cambiar solo:
   - **Nombre:** `Inversión Básica Actualizado`
   - **Descripción:** `Descripción actualizada`
4. NO seleccionar nueva imagen
5. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ Mensaje: "Tema actualizado correctamente"
- ✅ PUT /api/temas/{id}/ HTTP/1.1 200
- ✅ Nombre y descripción actualizados
- ✅ La imagen anterior se mantiene

---

### Prueba 3.5: Actualizar Tema CON Nueva Imagen (PUT)

**Preparación:**
- Tener otra imagen: `test-tema-2.jpg`

**Pasos:**
1. Buscar el tema "Inversión Básica Actualizado"
2. Clic en "Editar" ✏️
3. Seleccionar nueva imagen: `test-tema-2.jpg`
4. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ PUT /api/temas/{id}/ HTTP/1.1 200
- ✅ Se muestra la nueva imagen

**Verificar:**
```bash
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\temas
```
Deberías ver: `test-tema-2.jpg`

---

### Prueba 3.6: Intentar Eliminar Tema con Retos (DELETE - Error Esperado)

**Pasos:**
1. Buscar un tema que tenga retos asociados
2. Clic en "Eliminar" 🗑️
3. Confirmar

**Resultado Esperado:**
- ❌ Error controlado:
  - "No se puede eliminar porque tiene datos relacionados. Primero elimina los registros dependientes."
- ✅ DELETE /api/temas/{id}/ HTTP/1.1 500 (mensaje claro)

---

### Prueba 3.7: Eliminar Tema SIN Retos (DELETE)

**Pasos:**
1. Buscar el tema "Ahorro Básico" (sin retos)
2. Clic en "Eliminar" 🗑️
3. Confirmar

**Resultado Esperado:**
- ✅ Mensaje: "Tema eliminado correctamente"
- ✅ DELETE /api/temas/{id}/ HTTP/1.1 204

---

## 🎯 Fase 4: CRUD de Retos

### Prueba 4.1: Listar Retos (GET)

**URL:** `http://localhost:5174/admin/retos`

**Resultado Esperado:**
- ✅ Tabla con todos los retos
- ✅ GET /api/retos/ HTTP/1.1 200

---

### Prueba 4.2: Crear Reto SIN Imagen (POST)

**Pasos:**
1. Clic en "Crear Reto"
2. Llenar todos los campos:
   - **Nombre:** `Reto de Ahorro`
   - **Tema:** Seleccionar un tema existente
   - **Descripción:** `Descripción del reto`
   - **Pregunta:** `¿Cuál es la mejor forma de ahorrar?`
   - **Respuesta 1:** `Guardar bajo el colchón`
   - **Respuesta 2:** `En una cuenta de ahorros`
   - **Respuesta 3:** `Gastar todo`
   - **Respuesta 4:** `No ahorrar`
   - **Respuesta Correcta:** `En una cuenta de ahorros`
   - **Recompensa:** `10`
   - **Costo:** `5`
   - **Imagen:** NO seleccionar
3. Clic en "Crear"

**Resultado Esperado:**
- ✅ Mensaje: "Reto creado correctamente"
- ✅ POST /api/retos/ HTTP/1.1 201
- ✅ Reto aparece en la tabla

---

### Prueba 4.3: Crear Reto CON Imagen (POST) ⚠️ CRÍTICA

**Preparación:**
- Imagen: `test-reto.jpg`

**Pasos:**
1. Igual que Prueba 4.2, pero:
   - **Nombre:** `Reto de Inversión con Imagen`
   - **Imagen:** Seleccionar `test-reto.jpg`
2. Clic en "Crear"

**Resultado Esperado:**
- ✅ Mensaje: "Reto creado correctamente"
- ✅ POST /api/retos/ HTTP/1.1 201

**Verificar archivo:**
```bash
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\retos
```
Deberías ver: `test-reto.jpg`

**❌ Si falla con 400:**
- Ver logs detallados en Django
- Mismas verificaciones que en Temas

---

### Prueba 4.4: Actualizar Reto SIN Cambiar Imagen (PUT)

**Pasos:**
1. Buscar "Reto de Inversión con Imagen"
2. Clic en "Editar" ✏️
3. Cambiar solo:
   - **Nombre:** `Reto de Inversión Actualizado`
4. NO seleccionar nueva imagen
5. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ PUT /api/retos/{id}/ HTTP/1.1 200
- ✅ Imagen anterior se mantiene

---

### Prueba 4.5: Actualizar Reto CON Nueva Imagen (PUT)

**Preparación:**
- Imagen: `test-reto-2.jpg`

**Pasos:**
1. Editar reto y seleccionar nueva imagen
2. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ PUT /api/retos/{id}/ HTTP/1.1 200
- ✅ Nueva imagen guardada

---

### Prueba 4.6: Eliminar Reto (DELETE)

**Pasos:**
1. Buscar "Reto de Ahorro" (sin relaciones)
2. Clic en "Eliminar" 🗑️
3. Confirmar

**Resultado Esperado:**
- ✅ DELETE /api/retos/{id}/ HTTP/1.1 204

---

## 💡 Fase 5: CRUD de Tips

### Prueba 5.1: Listar Tips (GET)

**URL:** `http://localhost:5174/admin/tips`

**Resultado Esperado:**
- ✅ Tabla con todos los tips
- ✅ GET /api/tips/ HTTP/1.1 200

---

### Prueba 5.2: Crear Tip (POST)

**Pasos:**
1. Clic en "Crear Tip"
2. Llenar:
   - **Nombre:** `Tip de Ahorro Diario`
   - **Descripción:** `Ahorra el 10% de tus ingresos`
3. Clic en "Crear"

**Nota:** Ya NO se debe enviar `id_perfil` (fue removido)

**Resultado Esperado:**
- ✅ Mensaje: "Tip creado correctamente"
- ✅ POST /api/tips/ HTTP/1.1 201

**❌ Si falla:**
- Verificar que el campo id_perfil NO aparece en el payload del frontend
- Ver logs del backend

---

### Prueba 5.3: Actualizar Tip (PUT)

**Pasos:**
1. Buscar "Tip de Ahorro Diario"
2. Clic en "Editar" ✏️
3. Cambiar:
   - **Descripción:** `Ahorra el 20% de tus ingresos`
4. Clic en "Actualizar"

**Resultado Esperado:**
- ✅ PUT /api/tips/{id}/ HTTP/1.1 200

---

### Prueba 5.4: Eliminar Tip (DELETE)

**Pasos:**
1. Seleccionar un tip
2. Clic en "Eliminar" 🗑️
3. Confirmar

**Resultado Esperado:**
- ✅ DELETE /api/tips/{id}/ HTTP/1.1 204

---

## 📊 Checklist de Validación Final

### Autenticación
- [ ] ✅ Login exitoso sin Error 403
- [ ] ✅ Dashboard carga lista de usuarios
- [ ] ✅ Token JWT funciona correctamente

### CRUD Usuarios
- [ ] ✅ Listar usuarios (GET)
- [ ] ✅ Crear usuario (POST)
- [ ] ✅ Actualizar usuario sin cambiar contraseña (PUT)
- [ ] ✅ Error controlado al eliminar usuario con perfil (DELETE)
- [ ] ✅ Eliminar usuario sin relaciones (DELETE)

### CRUD Temas
- [ ] ✅ Listar temas (GET)
- [ ] ✅ Crear tema SIN imagen (POST)
- [ ] ⚠️ Crear tema CON imagen (POST) - CRÍTICO
- [ ] ✅ Actualizar tema sin cambiar imagen (PUT)
- [ ] ✅ Actualizar tema con nueva imagen (PUT)
- [ ] ✅ Error controlado al eliminar tema con retos (DELETE)
- [ ] ✅ Eliminar tema sin retos (DELETE)
- [ ] ✅ Archivo físico guardado en mediafiles/temas/

### CRUD Retos
- [ ] ✅ Listar retos (GET)
- [ ] ✅ Crear reto SIN imagen (POST)
- [ ] ⚠️ Crear reto CON imagen (POST) - CRÍTICO
- [ ] ✅ Actualizar reto sin cambiar imagen (PUT)
- [ ] ✅ Actualizar reto con nueva imagen (PUT)
- [ ] ✅ Eliminar reto (DELETE)
- [ ] ✅ Archivo físico guardado en mediafiles/retos/

### CRUD Tips
- [ ] ✅ Listar tips (GET)
- [ ] ✅ Crear tip SIN enviar id_perfil (POST)
- [ ] ✅ Actualizar tip (PUT)
- [ ] ✅ Eliminar tip (DELETE)

---

## 🔍 Monitoreo de Logs

### Backend Django (Terminal 1)

Durante las pruebas, observa:

```
✅ CORRECTO:
POST /api/login_usuario/ HTTP/1.1 200
GET /api/usuarios/ HTTP/1.1 200
POST /api/temas/ HTTP/1.1 201
PUT /api/temas/1/ HTTP/1.1 200
DELETE /api/temas/1/ HTTP/1.1 204

❌ ERRORES:
POST /api/temas/ HTTP/1.1 400  # Ver Traceback
POST /api/temas/ HTTP/1.1 403  # Permiso denegado
POST /api/temas/ HTTP/1.1 500  # Error del servidor
```

### Frontend (Consola del Navegador - F12)

- Ve a la pestaña **Console** para errores de JavaScript
- Ve a la pestaña **Network** → filtro **XHR** para ver:
  - Request Headers (debe incluir Authorization: Bearer xxx)
  - Request Payload (datos enviados)
  - Response (respuesta del servidor)

---

## 🚨 Errores Comunes y Soluciones

### Error 403 persiste después del fix
**Solución:**
1. Verificar que authentication.py tiene la clase User
2. Reiniciar servidor Django: Ctrl+C y volver a ejecutar
3. Limpiar cache del navegador y recargar

### Error 400 al crear tema/reto CON imagen
**Posibles causas:**
1. Pillow no instalado (✅ ya verificado)
2. Directorio mediafiles no existe (✅ ya creado)
3. Stored procedure no acepta NULL o tipo incorrecto
4. Serializer rechazando el archivo

**Solución:**
- Ver el Traceback completo en terminal Django
- Reportar el error específico

### Imagen no se guarda físicamente
**Verificar:**
1. Permisos de escritura en directorio mediafiles/
2. Código en services.py se ejecuta (agregar prints temporales)
3. default_storage.save() retorna la ruta correctamente

---

## 📞 Reporte de Resultados

Después de completar las pruebas, reporta:

### ✅ Lo que funcionó:
- [ ] Login y Error 403
- [ ] CRUD Usuarios completo
- [ ] CRUD Temas sin imagen
- [ ] CRUD Temas con imagen
- [ ] CRUD Retos sin imagen
- [ ] CRUD Retos con imagen
- [ ] CRUD Tips completo

### ❌ Lo que falló:
Para cada error, incluye:
1. **Prueba específica** (ej: Prueba 3.3 - Crear tema con imagen)
2. **Código de error** (400, 403, 500)
3. **Logs del backend** (Traceback completo)
4. **Request/Response** del Network tab del navegador

---

## 🎯 Prioridad de Pruebas

**Alta Prioridad (CRÍTICAS):**
1. Prueba 1.1 - Login sin Error 403
2. Prueba 3.2 - Crear tema SIN imagen
3. Prueba 3.3 - Crear tema CON imagen
4. Prueba 4.3 - Crear reto CON imagen

**Media Prioridad:**
5. Resto de CRUDs de Temas y Retos
6. CRUD de Usuarios completo

**Baja Prioridad:**
7. CRUD de Tips

---

## 🚀 Comandos Rápidos

### Reiniciar Backend Django
```bash
# Ctrl+C en la terminal del servidor
cd C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas
C:\Users\USER\Documents\entornos\prueba\Scripts\python.exe manage.py runserver
```

### Verificar Archivos Guardados
```bash
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\temas
dir C:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas\mediafiles\retos
```

### Ver Logs en Tiempo Real
```bash
# Los logs aparecen automáticamente en la terminal donde corre Django
# Busca líneas como:
[timestamp] "POST /api/temas/ HTTP/1.1" 201 XXX
```

---

**¡Listo para probar!** 🚀

Empieza con la **Prueba 1.1 (Login)** para verificar que el Error 403 está resuelto, luego continúa con las pruebas críticas de Temas (3.2 y 3.3).
