# 🚀 CÓMO EJECUTAR EL PROYECTO EDUFINANZAS

## 📋 REQUISITOS PREVIOS

### Backend
- Python 3.8+
- MySQL 8.0+
- pip (gestor de paquetes de Python)

### Frontend
- Node.js 16+
- npm o yarn

---

## 🔧 CONFIGURACIÓN DEL BACKEND

### 1. Crear y Activar Entorno Virtual

```bash
# En Windows
cd BACKFRONT\BACKEND\EduFinanzas
python -m venv venv
venv\Scripts\activate

# En Linux/Mac
cd BACKFRONT/BACKEND/EduFinanzas
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install django djangorestframework PyJWT mysqlclient pillow
```

### 3. Configurar Base de Datos

Asegúrate de que tu base de datos MySQL esté configurada en `eduFinanzas/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'edufinanzas_db',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### 4. Ejecutar los Stored Procedures

Conecta a MySQL y ejecuta el archivo:

```bash
mysql -u tu_usuario -p edufinanzas_db < stored_procedures_user_features.sql
```

O desde MySQL Workbench, abre y ejecuta el archivo `stored_procedures_user_features.sql`

### 5. Aplicar Migraciones

```bash
python manage.py migrate
```

### 6. Crear Superusuario (Opcional)

```bash
python manage.py createsuperuser
```

### 7. Ejecutar Servidor de Desarrollo

```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

---

## 🎨 CONFIGURACIÓN DEL FRONTEND

### 1. Navegar al Directorio del Frontend

```bash
cd FrontendEdufinanzas
```

### 2. Instalar Dependencias

```bash
npm install
```

Si tienes errores, intenta:

```bash
npm install --legacy-peer-deps
```

### 3. Verificar Configuración de API

Asegúrate de que la URL del backend esté correcta en `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});
```

### 4. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🧪 PROBAR LA APLICACIÓN

### 1. Crear Usuario de Prueba

1. Abre el navegador en `http://localhost:5173`
2. Haz clic en "Registrar"
3. Completa el formulario:
   - Correo: `test@example.com`
   - Contraseña: `123456`
   - Nombre de perfil: `Usuario Test`
   - Edad: `25`
4. Haz clic en "Registrar"

### 2. Iniciar Sesión

1. Serás redirigido al login
2. Ingresa credenciales:
   - Correo: `test@example.com`
   - Contraseña: `123456`
3. Haz clic en "Iniciar Sesión"

### 3. Explorar Dashboard

- Verás el tip del día
- Barra de progreso (0% inicialmente)
- Cards de temas disponibles

### 4. Ver Perfil

1. Haz clic en "Mi Perfil" en el header
2. Verás tus 100 monedas iniciales
3. Haz clic en "Editar Perfil" para cambiar nombre o contraseña

### 5. Explorar Tema

1. Vuelve al Dashboard
2. Haz clic en un tema
3. Verás lista de retos (todos bloqueados inicialmente)
4. Haz clic en "Iniciar Reto" en algún reto
5. Confirma la compra
6. Verás tus monedas reducidas

---

## 📊 POBLAR BASE DE DATOS (Opcional)

### Crear Temas de Prueba

Desde el admin de Django (`http://localhost:8000/admin`):

1. Inicia sesión con el superusuario
2. Agrega temas:
   - Nombre: "Introducción a las Finanzas"
   - Descripción: "Conceptos básicos de finanzas personales"
3. Agrega retos:
   - Título: "¿Qué es el ahorro?"
   - Descripción: "Pregunta básica sobre ahorro"
   - Costo: 20 monedas
   - Recompensa: 50 monedas
   - Tema: (selecciona el tema creado)

### O Usar Script SQL

Puedes crear un script `poblar_datos.sql` con inserts de ejemplo:

```sql
-- Insertar tema
INSERT INTO tema (nombre, descripcion, img_tema)
VALUES ('Introducción a las Finanzas', 'Conceptos básicos', NULL);

-- Insertar retos
INSERT INTO reto (titulo, descripcion, costo_moneda, recompensa_moneda, id_tema)
VALUES
  ('¿Qué es el ahorro?', 'Pregunta sobre ahorro', 20, 50, 1),
  ('Tipos de inversión', 'Pregunta sobre inversión', 30, 60, 1);

-- Insertar tips
INSERT INTO recompensa (tipo, nombre, descripcion)
VALUES
  ('Tip', 'Ahorra el 10%', 'Destina al menos el 10% de tus ingresos al ahorro'),
  ('Tip', 'Presupuesto mensual', 'Crea un presupuesto y síguelo cada mes');
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Can't connect to MySQL server"

**Solución**: Verifica que MySQL esté corriendo:

```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

### Error: "Module not found"

**Solución Frontend**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Solución Backend**:
```bash
pip install -r requirements.txt
```

### Error: "Token expired" o "Invalid token"

**Solución**: Cierra sesión y vuelve a iniciar sesión. El token tiene duración de 24 horas.

### Error: "CORS policy"

**Solución**: Verifica que en `settings.py` del backend esté configurado:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Frontend no muestra datos

**Solución**:
1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Verifica que las peticiones a la API sean exitosas (status 200)
4. Si hay errores 401, cierra sesión e inicia de nuevo

---

## 📁 ESTRUCTURA DE DIRECTORIOS

```
proyecto_final/
├── BACKFRONT/
│   └── BACKEND/
│       └── EduFinanzas/          # Proyecto Django
│           ├── manage.py
│           ├── eduFinanzas/      # Configuración
│           ├── usuarios/         # App usuarios
│           ├── perfiles/         # App perfiles
│           ├── temas/            # App temas
│           ├── retos/            # App retos
│           ├── tips/             # App tips
│           └── progresos/        # App progresos
├── FrontendEdufinanzas/          # Proyecto React
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── rutas/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── IMPLEMENTACION_COMPLETA.md
└── COMO_EJECUTAR.md
```

---

## 🔐 CREDENCIALES DE PRUEBA

### Usuario Regular
- **Correo**: test@example.com
- **Contraseña**: 123456
- **Rol**: Usuario
- **Monedas iniciales**: 100

### Administrador (si creaste superusuario)
- **Usuario**: admin
- **Contraseña**: (la que estableciste)
- **Panel**: http://localhost:8000/admin

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa los logs del backend (terminal donde corre Django)
2. Revisa la consola del navegador (F12 → Console)
3. Verifica que ambos servidores estén corriendo
4. Asegúrate de que los stored procedures estén ejecutados

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de probar, asegúrate de que:

- [ ] MySQL está corriendo
- [ ] Base de datos `edufinanzas_db` existe
- [ ] Stored procedures ejecutados
- [ ] Servidor Django corriendo en puerto 8000
- [ ] Dependencias de Node instaladas
- [ ] Servidor Vite corriendo en puerto 5173
- [ ] Al menos un tema y reto creados en la BD
- [ ] Tips creados en la tabla `recompensa`

---

## 🎉 ¡LISTO!

Si todo está configurado correctamente, deberías poder:
- ✅ Registrarte como usuario
- ✅ Iniciar sesión
- ✅ Ver el dashboard con tips y progreso
- ✅ Ver temas disponibles
- ✅ Iniciar retos (comprar con monedas)
- ✅ Editar tu perfil
- ✅ Ver tus monedas actualizarse en tiempo real

---

*Última actualización: 2025-11-20*
