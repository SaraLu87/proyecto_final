# 🔧 Solución: Error 401 al Iniciar Sesión

## ❌ El Error

```
Unauthorized: /api/login_usuario/
POST /api/login_usuario/ HTTP/1.1 401 35
```

Este error significa que las credenciales (correo y contraseña) no son correctas o no existen en la base de datos.

---

## 🔍 Diagnóstico del Problema

El error 401 (Unauthorized) ocurre cuando:

1. ❌ El correo electrónico no existe en la base de datos
2. ❌ La contraseña no coincide con la almacenada
3. ❌ El usuario existe pero su contraseña no está correctamente hasheada
4. ❌ El usuario no tiene rol de "Administrador"

---

## ✅ Soluciones

### Solución 1: Verificar Usuarios en MySQL (Recomendada)

#### Paso 1: Conectar a MySQL
```bash
mysql -u root -p
# Ingresa tu contraseña de MySQL
```

#### Paso 2: Ver usuarios existentes
```sql
USE juego_finanzas;

SELECT id_usuario, correo, rol, fecha_registro
FROM usuarios;
```

Esto te mostrará todos los usuarios. **Anota el correo de un usuario con rol 'Administrador'**.

#### Paso 3: Verificar si hay un administrador
```sql
SELECT id_usuario, correo, rol
FROM usuarios
WHERE rol = 'Administrador';
```

**Si NO hay ningún administrador**, ve a la Solución 2.

---

### Solución 2: Crear un Usuario Administrador Nuevo

Si no existe ningún administrador, necesitas crear uno:

#### Opción A: Crear desde MySQL directamente

```sql
USE juego_finanzas;

-- Crear un nuevo usuario administrador con contraseña "admin123"
-- IMPORTANTE: Esta contraseña NO está hasheada, necesitas usar Django para hashearla
INSERT INTO usuarios (correo, contrasena, rol)
VALUES ('admin@edufinanzas.com', 'temporal123', 'Administrador');
```

**⚠️ IMPORTANTE:** Esta contraseña NO funcionará porque no está hasheada. Ve a la Opción B.

#### Opción B: Crear con Python/Django (Recomendado)

1. **Abre una terminal en la carpeta del backend:**
```bash
cd "c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas"
```

2. **Instala pymysql si no está instalado:**
```bash
pip install pymysql
```

3. **Ejecuta Python y crea el usuario:**
```python
# Abre Python
python

# Ejecuta este código línea por línea:
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduFinanzas.settings')

import django
django.setup()

from django.contrib.auth.hashers import make_password
import MySQLdb

# Conectar a MySQL
db = MySQLdb.connect(
    host="127.0.0.1",
    user="root",
    passwd="123456789",  # Tu contraseña de MySQL
    db="juego_finanzas"
)

cursor = db.cursor()

# Hashear la contraseña
correo = "admin@edufinanzas.com"
contrasena = "admin123"  # Cambia esto por tu contraseña deseada
contrasena_hash = make_password(contrasena)

# Insertar usuario
sql = """
INSERT INTO usuarios (correo, contrasena, rol)
VALUES (%s, %s, 'Administrador')
"""
cursor.execute(sql, (correo, contrasena_hash))
db.commit()

print(f"✅ Usuario creado: {correo}")
print(f"🔑 Contraseña: {contrasena}")
print(f"🔐 Hash: {contrasena_hash[:50]}...")

cursor.close()
db.close()
```

4. **Sal de Python:**
```python
exit()
```

---

### Solución 3: Actualizar Contraseña de Usuario Existente

Si ya tienes un usuario administrador pero olvidaste su contraseña:

#### Usando Python/Django:

```python
# Abre Python
python

# Ejecuta este código:
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduFinanzas.settings')

import django
django.setup()

from django.contrib.auth.hashers import make_password
import MySQLdb

# Conectar a MySQL
db = MySQLdb.connect(
    host="127.0.0.1",
    user="root",
    passwd="123456789",  # Tu contraseña de MySQL
    db="juego_finanzas"
)

cursor = db.cursor()

# Hashear la nueva contraseña
correo = "tu_correo@ejemplo.com"  # Cambia esto por el correo del admin
nueva_contrasena = "admin123"      # Cambia esto por tu nueva contraseña
contrasena_hash = make_password(nueva_contrasena)

# Actualizar usuario
sql = """
UPDATE usuarios
SET contrasena = %s
WHERE correo = %s AND rol = 'Administrador'
"""
cursor.execute(sql, (contrasena_hash, correo))
db.commit()

print(f"✅ Contraseña actualizada para: {correo}")
print(f"🔑 Nueva contraseña: {nueva_contrasena}")

cursor.close()
db.close()

exit()
```

---

### Solución 4: Usar el Procedimiento Almacenado del Backend

El backend tiene un procedimiento almacenado `usuarios_crear`:

```sql
USE juego_finanzas;

CALL usuarios_crear(
    'admin@edufinanzas.com',
    'admin123',
    'Administrador'
);
```

**⚠️ NOTA:** Este procedimiento debe hashear la contraseña internamente. Si no lo hace, la contraseña no funcionará.

---

## 🧪 Probar el Login

Después de crear o actualizar el usuario, prueba el login:

1. Ve a `http://localhost:5173/login`
2. Ingresa el correo: `admin@edufinanzas.com`
3. Ingresa la contraseña: `admin123` (o la que configuraste)
4. Haz clic en "Iniciar Sesión"

---

## 🔍 Verificar que el Backend Esté Funcionando

### 1. Verifica que Django esté corriendo:
```bash
# En la terminal del backend
cd "c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas"
python manage.py runserver
```

Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
```

### 2. Verifica que MySQL esté corriendo:
```bash
mysql -u root -p
```

### 3. Prueba el endpoint directamente con curl:
```bash
curl -X POST http://localhost:8000/api/login_usuario/ \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"admin@edufinanzas.com\",\"contrasena\":\"admin123\"}"
```

Si funciona, deberías ver:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "usuario": {
    "id_usuario": 1,
    "correo": "admin@edufinanzas.com",
    "rol": "Administrador"
  }
}
```

---

## 📝 Script Completo de Creación de Admin

Guarda este script como `crear_admin.py` en la carpeta del backend:

```python
# crear_admin.py
import os
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduFinanzas.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.contrib.auth.hashers import make_password
import MySQLdb

def crear_admin():
    # Solicitar datos
    print("=== CREAR USUARIO ADMINISTRADOR ===\n")
    correo = input("Ingresa el correo del admin: ").strip()
    if not correo:
        correo = "admin@edufinanzas.com"
        print(f"Usando correo por defecto: {correo}")

    contrasena = input("Ingresa la contraseña: ").strip()
    if not contrasena:
        contrasena = "admin123"
        print(f"Usando contraseña por defecto: {contrasena}")

    # Hashear contraseña
    print("\n🔐 Hasheando contraseña...")
    contrasena_hash = make_password(contrasena)

    # Conectar a MySQL
    print("📡 Conectando a MySQL...")
    try:
        db = MySQLdb.connect(
            host="127.0.0.1",
            user="root",
            passwd="123456789",
            db="juego_finanzas"
        )
        cursor = db.cursor()

        # Verificar si el correo ya existe
        cursor.execute("SELECT id_usuario FROM usuarios WHERE correo = %s", (correo,))
        existe = cursor.fetchone()

        if existe:
            print(f"\n⚠️  El correo {correo} ya existe!")
            actualizar = input("¿Quieres actualizar su contraseña? (s/n): ").lower()

            if actualizar == 's':
                cursor.execute(
                    "UPDATE usuarios SET contrasena = %s WHERE correo = %s",
                    (contrasena_hash, correo)
                )
                db.commit()
                print(f"\n✅ Contraseña actualizada para: {correo}")
        else:
            # Insertar nuevo usuario
            cursor.execute(
                """INSERT INTO usuarios (correo, contrasena, rol)
                   VALUES (%s, %s, 'Administrador')""",
                (correo, contrasena_hash)
            )
            db.commit()
            print(f"\n✅ Usuario administrador creado exitosamente!")

        print(f"\n📧 Correo: {correo}")
        print(f"🔑 Contraseña: {contrasena}")
        print(f"\n🎉 ¡Puedes iniciar sesión ahora!")

        cursor.close()
        db.close()

    except MySQLdb.Error as e:
        print(f"\n❌ Error de MySQL: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    crear_admin()
```

**Uso:**
```bash
cd "c:\Users\USER\Documents\proyectos\proyecto_final\BACKFRONT\BACKEND\EduFinanzas"
python crear_admin.py
```

---

## ✅ Checklist de Verificación

Antes de intentar el login, verifica:

- [ ] Backend Django está corriendo (`python manage.py runserver`)
- [ ] MySQL está corriendo
- [ ] La base de datos `juego_finanzas` existe
- [ ] Existe al menos un usuario con rol "Administrador"
- [ ] La contraseña del usuario está correctamente hasheada
- [ ] Frontend está corriendo (`npm run dev`)
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la terminal de Django

---

## 🆘 Si Aún No Funciona

### Revisa los logs de Django:
En la terminal donde corre `python manage.py runserver`, busca el error específico.

### Revisa la consola del navegador:
1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Intenta hacer login
4. Haz clic en la petición "login_usuario"
5. Ve a "Response" para ver el mensaje de error específico

### Mensaje de error común:

```json
{
  "detail": "Credenciales incorrectas"
}
```

Esto significa que el correo o contraseña no coinciden.

---

## 📞 Necesitas Más Ayuda

Si después de seguir todos estos pasos aún tienes el error 401:

1. Verifica que el correo sea EXACTAMENTE el mismo (sin espacios extras)
2. Verifica que la contraseña sea EXACTAMENTE la misma
3. Verifica que el usuario tenga rol "Administrador" (no "administrador" en minúsculas)
4. Intenta crear un usuario completamente nuevo con otro correo

---

**Última actualización:** Noviembre 2024
