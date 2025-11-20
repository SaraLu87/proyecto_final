# 🔍 DIAGNÓSTICO DEL FLUJO FRONTEND → BACKEND

## 📊 ANÁLISIS DEL CÓDIGO ACTUAL

### ✅ Lo que está BIEN implementado:

1. **UserAuthContext** correctamente estructurado
2. **API Services** con interceptores configurados
3. **Componentes** bien organizados (Dashboard, Profile, TemaDetalle)
4. **Rutas protegidas** (UserRoute) funcionando
5. **localStorage** manejado correctamente con prefijos 'user'

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### Problema 1: Dependencias Circulares en useEffect

**Ubicación**: `Dashboard.jsx` línea 54

```javascript
useEffect(() => {
  if (tips.length > 0) {
    rotarTip();
    const intervalo = setInterval(() => {
      rotarTip();
    }, 1200000);
    return () => clearInterval(intervalo);
  }
}, [tips]); // ⚠️ Falta dependencia 'rotarTip' pero causaría loop infinito
```

**Problema**: La función `rotarTip` usa `tips` internamente, lo que puede causar un loop infinito si se agrega como dependencia.

---

### Problema 2: Estructura del Objeto de Progreso

**Ubicación**: `Dashboard.jsx` línea 64-67

```javascript
const [tipsData, temasData, progresoData] = await Promise.all([
  obtenerTips(),         // ¿Retorna array o objeto?
  obtenerTemas(),        // ¿Retorna array o objeto?
  obtenerMiProgreso()    // ¿Retorna objeto con estructura esperada?
]);
```

**Riesgo**: Si el backend no retorna exactamente la estructura esperada, el frontend fallará silenciosamente.

---

## 🔄 FLUJO COMPLETO DOCUMENTADO

### Paso 1: Usuario Accede a la Aplicación

```
Usuario abre → http://localhost:5173
       ↓
main.jsx renderiza <App />
       ↓
App.jsx envuelve con <AuthProvider> y <UserAuthProvider>
       ↓
UserAuthContext.verificarSesion() se ejecuta
       ↓
Busca 'userToken' en localStorage
       ↓
¿Token existe?
  │
  ├── NO → cargando = false, usuario = null
  │         ↓
  │    AppRouter redirige a /login-usuario
  │
  └── SÍ → Carga usuario y perfil de localStorage
            ↓
       cargando = false, usuario = {...}
            ↓
       AppRouter muestra Dashboard
```

---

### Paso 2: Usuario Hace Login

```
Usuario en /login-usuario
       ↓
Ingresa correo y contraseña
       ↓
Click "Iniciar Sesión"
       ↓
LoginUsuario.handleSubmit()
       ↓
UserAuthContext.login(correo, contraseña)
       ↓
api.post('/login_usuario/', { correo, contrasena })
       ↓
axios interceptor NO agrega token (es login, no hay token aún)
       ↓
Backend responde: { token, usuario }
       ↓
¿usuario.rol === 'Usuario'?
  │
  ├── NO → Error: "Acceso denegado"
  │
  └── SÍ → localStorage.setItem('userToken', token)
            localStorage.setItem('userUsuario', JSON.stringify(usuario))
            ↓
       setUsuario(usuario)
            ↓
       obtenerMiPerfil() ← AQUÍ SE HACE LA SEGUNDA LLAMADA
            ↓
       axios interceptor AHORA agrega el token:
       headers: { Authorization: Bearer {token} }
            ↓
       api.get('/perfil/me/')
            ↓
       Backend valida token → retorna perfil
            ↓
       localStorage.setItem('userPerfil', JSON.stringify(perfil))
       setPerfil(perfil)
            ↓
       navigate('/')  → Redirige al Dashboard
```

---

### Paso 3: Dashboard Carga Datos

```
Dashboard montado
       ↓
useEffect(() => cargarDatos(), [])
       ↓
Promise.all([
  obtenerTips(),      → GET /tips/
  obtenerTemas(),     → GET /temas/
  obtenerMiProgreso() → GET /perfil/me/progreso/
])
       ↓
Axios interceptor agrega token a las 3 peticiones:
headers: { Authorization: Bearer {userToken} }
       ↓
Backend valida token y ejecuta:
  1. TipPeriodicaViewSet.list()
  2. TemaViewSet.list()
  3. ProgresoMeView.get()
       ↓
Retorna:
  1. tips: [ { id_recompensa, nombre, descripcion, tipo } ]
  2. temas: [ { id_tema, nombre, descripcion, img_tema } ]
  3. progreso: { total_retos, retos_completados, porcentaje_completado }
       ↓
Dashboard.setState():
  setTips(tips)
  setTemas(temas)
  setProgreso(progreso)
  setTipActual(tips[0])
  setCargando(false)
       ↓
Renderiza UI:
  - Tip del día
  - Barra de progreso
  - Grid de temas
```

---

### Paso 4: Usuario Navega a Tema

```
Usuario click en tema
       ↓
navigate(`/tema/${idTema}`)
       ↓
TemaDetalle montado con params.idTema
       ↓
useEffect(() => cargarDatos(), [idTema])
       ↓
Promise.all([
  obtenerTemaPorId(idTema),      → GET /temas/{id}/
  obtenerRetosPorTema(idTema)    → GET /temas/{id}/retos/
])
       ↓
Axios agrega token
       ↓
Backend ejecuta:
  1. TemaViewSet.retrieve(id)
  2. RetosPorTemaView.get(id_tema)
       ↓
Backend ejecuta SP: obtener_retos_por_tema(id_tema, id_perfil)
       ↓
Retorna retos con campos:
  {
    id_reto,
    titulo,
    descripcion,
    costo_moneda,
    recompensa_moneda,
    iniciado: true/false,      ← viene del JOIN con progreso
    completado: true/false     ← viene del JOIN con progreso
  }
       ↓
TemaDetalle renderiza:
  - Retos con badges (bloqueado/en progreso/completado)
  - Botones según estado
```

---

### Paso 5: Usuario Inicia un Reto

```
Usuario click "Iniciar Reto"
       ↓
TemaDetalle.handleIniciarReto(idReto, costo)
       ↓
Validar: perfil.monedas >= costo
  │
  ├── NO → Mostrar error: "Monedas insuficientes"
  │
  └── SÍ → window.confirm("¿Deseas iniciar?")
            │
            ├── NO → Cancelar
            │
            └── SÍ → iniciarReto(idReto)
                      ↓
                 api.post(`/retos/${idReto}/iniciar/`)
                      ↓
                 Axios agrega token
                      ↓
                 Backend: IniciarRetoView.post(id_reto)
                      ↓
                 1. Extrae id_usuario del token
                 2. Obtiene perfil asociado
                 3. Llama SP: iniciar_reto(id_perfil, id_reto)
                      ↓
                 SP valida y ejecuta:
                   - IF monedas < costo THEN ERROR
                   - UPDATE perfil SET monedas = monedas - costo
                   - INSERT INTO progreso (...)
                      ↓
                 Retorna: { message, progreso, perfil }
                      ↓
                 Frontend:
                   - recargarPerfil() → actualiza monedas
                   - obtenerRetosPorTema() → actualiza lista
                   - Mostrar mensaje de éxito
                      ↓
                 UserHeader muestra monedas actualizadas
                 Reto ahora aparece como "En progreso"
```

---

## 🐛 PROBLEMAS POTENCIALES Y SOLUCIONES

### Problema 1: Dashboard no muestra nada

**Posibles causas**:

1. **Backend no está corriendo**
   ```bash
   # Verificar
   curl http://localhost:8000/api/temas/
   ```

2. **No hay datos en la BD**
   ```sql
   SELECT COUNT(*) FROM tema;
   SELECT COUNT(*) FROM recompensa WHERE tipo = 'Tip';
   ```

3. **Token inválido o expirado**
   - Revisar console.log del navegador (F12)
   - Verificar que el token esté en localStorage

4. **Error de CORS**
   - Revisar console.log del navegador
   - Verificar settings.py del backend:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
   ]
   ```

---

### Problema 2: Login funciona pero Dashboard está en blanco

**Causa probable**: El perfil no se carga correctamente

**Solución**:
1. Abrir DevTools (F12)
2. Ver Network tab
3. Verificar que `/api/perfil/me/` retorne status 200
4. Verificar estructura del JSON retornado

**Debug en UserAuthContext.jsx línea 120-133**:
```javascript
try {
  const perfilData = await obtenerMiPerfil();
  console.log('✅ Perfil cargado:', perfilData); // ← AGREGAR ESTO

  if (perfilData) {
    localStorage.setItem('userPerfil', JSON.stringify(perfilData));
    setPerfil(perfilData);
  }
} catch (perfilError) {
  console.error('❌ Error al cargar perfil:', perfilError); // ← YA EXISTE
  console.error('Response:', perfilError.response?.data); // ← AGREGAR ESTO
}
```

---

### Problema 3: Tips o Temas no se muestran

**Causa**: La tabla está vacía en la BD

**Solución**: Poblar datos de prueba

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

## 🔧 COMANDOS DE VERIFICACIÓN

### Backend
```bash
# Verificar que Django esté corriendo
curl http://localhost:8000/api/

# Verificar endpoint de temas (sin auth)
curl http://localhost:8000/api/temas/

# Verificar endpoint de tips (sin auth)
curl http://localhost:8000/api/tips/

# Verificar endpoint de perfil (con auth)
curl -H "Authorization: Bearer {tu_token}" http://localhost:8000/api/perfil/me/
```

### Frontend
```bash
# Ver logs del navegador
# Abrir DevTools (F12) → Console

# Ver peticiones HTTP
# Abrir DevTools (F12) → Network → filtrar por "api"
```

### Base de Datos
```sql
-- Verificar que hay datos
SELECT COUNT(*) as total_temas FROM tema;
SELECT COUNT(*) as total_retos FROM reto;
SELECT COUNT(*) as total_tips FROM recompensa WHERE tipo = 'Tip';
SELECT COUNT(*) as total_usuarios FROM usuario WHERE rol = 'Usuario';
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de reportar que "no se ve nada", verifica:

- [ ] Backend Django está corriendo en puerto 8000
- [ ] Frontend Vite está corriendo en puerto 5173
- [ ] MySQL está corriendo
- [ ] Base de datos tiene al menos 1 tema
- [ ] Base de datos tiene al menos 1 tip
- [ ] Base de datos tiene al menos 1 reto
- [ ] Stored procedures están ejecutados
- [ ] Usuario puede hacer login (ver mensaje de éxito)
- [ ] Token se guarda en localStorage (F12 → Application → Local Storage)
- [ ] Console del navegador no muestra errores 401 o 404
- [ ] Network tab muestra peticiones exitosas (status 200)

---

## 📝 SIGUIENTE PASO

Voy a crear un componente de DEBUG para ayudarte a identificar el problema específico.
