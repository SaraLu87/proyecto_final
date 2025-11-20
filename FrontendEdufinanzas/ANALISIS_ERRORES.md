# 🔍 Análisis Completo de Errores del Frontend

## 📊 Resumen de Errores Encontrados

| Error | Tipo | Afecta a | Causa | Solución |
|-------|------|----------|-------|----------|
| **Error 500** | IntegrityError | Usuarios, Temas | Foreign Key Constraints | Mejorar manejo de errores en frontend |
| **Error 400** | Bad Request | Usuarios (Update) | Datos mal formateados | Corregir estructura de datos |
| **Error 415** | Unsupported Media Type | Temas, Retos (Create) | Headers incorrectos con FormData | Quitar Content-Type en FormData |

---

## 🔴 Error 1: IntegrityError (500) - Foreign Key Constraints

### Descripción del Error
```
IntegrityError: (1451, 'Cannot delete or update a parent row:
a foreign key constraint fails')
```

### Ocurre en:
- ❌ `DELETE /api/usuarios/3/` → No se puede eliminar usuario con perfil asociado
- ❌ `DELETE /api/temas/1/` → No se puede eliminar tema con retos asociados

### Causa Raíz
La base de datos tiene restricciones de integridad referencial:

```sql
-- Usuario → Perfil → Tips
usuarios.id_usuario
  → perfiles.id_usuario
    → tips_periodicas.id_perfil

-- Tema → Retos
temas.id_tema
  → retos.id_tema
```

**No se puede eliminar un registro "padre" si tiene registros "hijos" asociados.**

### Impacto
- El backend devuelve error 500
- El frontend muestra "Error al eliminar"
- El usuario no entiende por qué no puede eliminar

### ✅ Solución en el Frontend

**1. Capturar el error específico**
**2. Mostrar mensaje claro al usuario**
**3. Ofrecer soluciones alternativas**

```javascript
// Antes (incorrecto):
catch (err) {
  setError('Error al eliminar el usuario');
}

// Después (correcto):
catch (err) {
  if (err.response?.status === 500) {
    const message = err.response?.data?.detail || '';
    if (message.includes('foreign key') || message.includes('IntegrityError')) {
      setError(
        'No se puede eliminar este usuario porque tiene datos asociados ' +
        '(perfiles, tips, etc.). Primero elimina los datos relacionados.'
      );
    } else {
      setError('Error al eliminar el usuario');
    }
  }
}
```

---

## 🟡 Error 2: Bad Request (400) - Datos Mal Formateados

### Descripción del Error
```
Bad Request: /api/usuarios/3/
PUT /api/usuarios/3/ HTTP/1.1 400 43
```

### Ocurre en:
- ❌ `PUT /api/usuarios/3/` → Al actualizar usuario

### Causa Raíz
El backend espera una estructura de datos específica, pero el frontend envía datos incorrectos.

**Backend espera:**
```python
{
  "correo": "usuario@ejemplo.com",
  "contrasena": "password",  # Puede ser vacío al actualizar
  "rol": "Usuario" o "Administrador"
}
```

**Frontend puede estar enviando:**
```javascript
{
  correo: "usuario@ejemplo.com",
  contrasena: "",  // String vacío causa error
  rol: "Usuario",
  id_usuario: 3,  // Campo extra no esperado
  fecha_registro: "..."  // Campo extra no esperado
}
```

### ✅ Solución

**Limpiar datos antes de enviar:**

```javascript
// Antes (incorrecto):
await actualizarUsuario(usuarioActual.id_usuario, formData);

// Después (correcto):
const datosEnviar = {
  correo: formData.correo,
  rol: formData.rol,
};

// Solo incluir contraseña si no está vacía
if (formData.contrasena && formData.contrasena.trim()) {
  datosEnviar.contrasena = formData.contrasena;
}

await actualizarUsuario(usuarioActual.id_usuario, datosEnviar);
```

---

## 🔵 Error 3: Unsupported Media Type (415) - Headers Incorrectos

### Descripción del Error
```
Unsupported Media Type: /api/temas/
POST /api/temas/ HTTP/1.1 415 129
```

### Ocurre en:
- ❌ `POST /api/temas/` → Al crear tema con imagen
- ❌ `POST /api/retos/` → Al crear reto con imagen

### Causa Raíz
Cuando enviamos `FormData` con Axios, **NO debemos especificar manualmente** el `Content-Type`. Axios lo hace automáticamente con el boundary correcto.

**Código incorrecto en api.js:**
```javascript
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // ❌ INCORRECTO
    },
  });
  return response.data;
};
```

**Por qué falla:**
- Axios necesita agregar el `boundary` al Content-Type
- Al especificarlo manualmente, perdemos el boundary
- El servidor no puede parsear el FormData

### ✅ Solución

**Dejar que Axios maneje el Content-Type automáticamente:**

```javascript
// Correcto:
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData);
  // Axios detecta automáticamente que es FormData
  // y agrega: Content-Type: multipart/form-data; boundary=----...
  return response.data;
};
```

---

## 📋 Flujo Correcto de Cada Endpoint

### 1️⃣ USUARIOS

#### GET /api/usuarios/
```
Frontend → GET /api/usuarios/
Backend → Retorna: [{id_usuario, correo, rol, fecha_registro}, ...]
Frontend → Muestra lista en tabla
```
**Estado:** ✅ Funciona correctamente

#### POST /api/usuarios/
```
Frontend → Envía: {correo, contrasena, rol}
Backend → Hashea contraseña con Django
Backend → Llama SP usuarios_crear()
Backend → Retorna: {id_usuario, correo, rol, ...}
Frontend → Muestra éxito y recarga lista
```
**Estado:** ✅ Funciona correctamente

#### PUT /api/usuarios/{id}/
```
Frontend → Envía: {correo, rol, contrasena? }
Backend → Si contraseña vacía, no la actualiza
Backend → Si tiene contraseña, la hashea
Backend → Llama SP usuarios_actualizar()
Backend → Retorna: {id_usuario, correo, rol, ...}
Frontend → Muestra éxito
```
**Estado:** ⚠️ Requiere corrección (Error 400)

**Problema:** Frontend envía campos extras o contraseña vacía mal formateada

**Solución:**
```javascript
// Limpiar datos antes de enviar
const datosLimpios = {
  correo: formData.correo,
  rol: formData.rol
};

if (formData.contrasena && formData.contrasena.trim()) {
  datosLimpios.contrasena = formData.contrasena;
}

await actualizarUsuario(id, datosLimpios);
```

#### DELETE /api/usuarios/{id}/
```
Frontend → DELETE /api/usuarios/3/
Backend → Llama SP usuarios_eliminar()
MySQL → Verifica constraints
  ❌ Si tiene perfiles/tips → IntegrityError
  ✅ Si no tiene dependencias → Elimina
Backend → Retorna 204 o 500
Frontend → Muestra resultado
```
**Estado:** ⚠️ Funciona pero necesita mejor manejo de errores

---

### 2️⃣ TEMAS

#### GET /api/temas/
```
Frontend → GET /api/temas/
Backend → Retorna: [{id_tema, nombre, descripcion, img_temas, ...}, ...]
Frontend → Muestra lista (con preview de imágenes)
```
**Estado:** ✅ Funciona correctamente

#### POST /api/temas/
```
Frontend → FormData {nombre, descripcion, informacion_tema, img_temas}
Backend → Parsea multipart/form-data
Backend → Guarda imagen en mediafiles/
Backend → Llama SP temas_crear()
Backend → Retorna: {id_tema, nombre, ..., img_temas: "/media/..."}
Frontend → Muestra éxito
```
**Estado:** ❌ Error 415 - Unsupported Media Type

**Problema:** Headers incorrectos en Axios

**Solución:**
```javascript
// En api.js - Quitar headers manuales
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData);
  // SIN especificar headers manualmente
  return response.data;
};
```

#### PUT /api/temas/{id}/
```
Frontend → FormData {nombre, descripcion, informacion_tema, img_temas?}
Backend → Si img_temas vacío, mantiene la anterior
Backend → Si img_temas presente, actualiza imagen
Backend → Llama SP temas_actualizar()
Backend → Retorna tema actualizado
```
**Estado:** ⚠️ Mismo problema que POST (Error 415)

#### DELETE /api/temas/{id}/
```
Frontend → DELETE /api/temas/1/
Backend → Verifica si tiene retos asociados
  ❌ Si tiene retos → IntegrityError (500)
  ✅ Si no tiene → Elimina
```
**Estado:** ⚠️ Funciona pero necesita mejor manejo

---

### 3️⃣ RETOS

#### GET /api/retos/
```
Frontend → GET /api/retos/
Backend → Retorna: [{id_reto, nombre_reto, id_tema, descripcion,
                      pregunta, respuestas..., img_reto}, ...]
Frontend → Muestra lista con nombre del tema
```
**Estado:** ✅ Funciona correctamente

#### POST /api/retos/
```
Frontend → FormData {
  nombre_reto, id_tema, descripcion, pregunta,
  respuesta_uno, respuesta_dos, respuesta_tres, respuesta_cuatro,
  respuestaCorrecta, recompensa_monedas, costo_monedas, img_reto
}
Backend → Parsea FormData
Backend → Guarda imagen
Backend → Llama SP retos_crear()
Backend → Retorna reto creado
```
**Estado:** ⚠️ Mismo problema que Temas (Error 415)

#### PUT /api/retos/{id}/
**Estado:** ⚠️ Mismo problema (Error 415)

#### DELETE /api/retos/{id}/
```
Frontend → DELETE /api/retos/5/
Backend → Verifica progreso asociado
Backend → Elimina
```
**Estado:** ✅ Debería funcionar (sin constraints problemáticas)

---

### 4️⃣ TIPS

#### GET /api/tips/
```
Frontend → GET /api/tips/
Backend → Retorna: [{id_recompensa, id_perfil, nombre, descripcion}, ...]
```
**Estado:** ✅ Funciona correctamente

#### POST /api/tips/
```
Frontend → JSON {id_perfil, nombre, descripcion}
Backend → Llama SP tips_crear()
Backend → Retorna tip creado
```
**Estado:** ✅ Funciona (no usa FormData)

#### PUT /api/tips/{id}/
**Estado:** ✅ Funciona

#### DELETE /api/tips/{id}/
**Estado:** ✅ Funciona

---

## 🔧 Correcciones Necesarias en el Frontend

### 1. Archivo: `src/services/api.js`

#### Problema: Headers manuales en FormData
```javascript
// ❌ INCORRECTO
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',  // Causa error 415
    },
  });
};

// ✅ CORRECTO
export const crearTema = async (formData) => {
  const response = await api.post('/temas/', formData);
  // Axios detecta FormData automáticamente
  return response.data;
};
```

**Afecta a:**
- `crearTema()`
- `actualizarTema()`
- `crearReto()`
- `actualizarReto()`

---

### 2. Archivo: `src/pages/admin/Usuarios.jsx`

#### Problema: Envío de contraseña vacía y campos extras

```javascript
// ❌ INCORRECTO
const handleSubmit = async (e) => {
  const datosEnviar = {
    correo: formData.correo,
    contrasena: formData.contrasena,  // Puede ser ""
    rol: formData.rol,
  };
  await actualizarUsuario(id, datosEnviar);
};

// ✅ CORRECTO
const handleSubmit = async (e) => {
  const datosEnviar = {
    correo: formData.correo,
    rol: formData.rol,
  };

  // Solo incluir contraseña si no está vacía
  if (formData.contrasena && formData.contrasena.trim()) {
    datosEnviar.contrasena = formData.contrasena;
  }

  await actualizarUsuario(id, datosEnviar);
};
```

---

### 3. Manejo de Errores de Eliminación

#### En todos los módulos (Usuarios, Temas, Retos, Tips)

```javascript
// ✅ CORRECTO
const handleEliminar = async (item) => {
  try {
    await eliminarItem(item.id);
    setExito('Eliminado correctamente');
    await cargarLista();
  } catch (err) {
    console.error('Error al eliminar:', err);

    // Manejar error de foreign key
    if (err.response?.status === 500) {
      const detail = err.response?.data?.detail || '';

      if (detail.includes('foreign key') || detail.includes('IntegrityError')) {
        setError(
          'No se puede eliminar porque tiene datos relacionados. ' +
          'Primero elimina los registros dependientes.'
        );
      } else {
        setError('Error del servidor al eliminar');
      }
    } else {
      setError('Error al eliminar el registro');
    }
  }
};
```

---

## ✅ Checklist de Correcciones

- [ ] Quitar `Content-Type: multipart/form-data` de api.js en:
  - [ ] `crearTema()`
  - [ ] `actualizarTema()`
  - [ ] `crearReto()`
  - [ ] `actualizarReto()`

- [ ] Limpiar datos antes de enviar en Usuarios.jsx:
  - [ ] No enviar contraseña vacía
  - [ ] Solo enviar campos necesarios

- [ ] Mejorar manejo de errores de eliminación en:
  - [ ] Usuarios.jsx
  - [ ] Temas.jsx
  - [ ] Retos.jsx
  - [ ] Tips.jsx

---

## 🎯 Resultado Esperado Después de las Correcciones

| Operación | Estado Actual | Estado Esperado |
|-----------|---------------|-----------------|
| Crear Usuario | ✅ Funciona | ✅ Funciona |
| Editar Usuario | ❌ Error 400 | ✅ Funciona |
| Eliminar Usuario | ⚠️ Error 500 sin contexto | ✅ Mensaje claro |
| Crear Tema | ❌ Error 415 | ✅ Funciona |
| Editar Tema | ❌ Error 415 | ✅ Funciona |
| Eliminar Tema | ⚠️ Error 500 sin contexto | ✅ Mensaje claro |
| Crear Reto | ❌ Error 415 | ✅ Funciona |
| Editar Reto | ❌ Error 415 | ✅ Funciona |
| Eliminar Reto | ✅ Funciona | ✅ Funciona |
| Tips (CRUD) | ✅ Funciona | ✅ Funciona |

---

**Próximo paso:** Aplicar todas las correcciones en el código del frontend.
