# 💰 EduFinanzas - Sistema de Educación Financiera

Plataforma educativa gamificada para el aprendizaje de finanzas personales con sistema de retos, monedas y progreso.

---

## 🎯 Características Principales

### Para Usuarios
- ✅ Registro y autenticación con JWT
- ✅ Dashboard personalizado con tips diarios
- ✅ Sistema de monedas virtuales (100 iniciales)
- ✅ Exploración de temas financieros
- ✅ Retos educativos con recompensas
- ✅ Seguimiento de progreso personal
- ✅ Edición de perfil y cambio de contraseña
- ✅ Interfaz moderna y responsive

### Para Administradores
- ✅ Panel de administración Django
- ✅ CRUD de usuarios, temas y retos
- ✅ Gestión de tips educativos
- ✅ Dashboard con estadísticas

---

## 🚀 Inicio Rápido

### Requisitos
- Python 3.8+
- Node.js 16+
- MySQL 8.0+

### Instalación

#### 1. Backend
```bash
cd BACKFRONT/BACKEND/EduFinanzas
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install django djangorestframework PyJWT mysqlclient pillow
python manage.py migrate
python manage.py runserver
```

#### 2. Frontend
```bash
cd FrontendEdufinanzas
npm install
npm run dev
```

#### 3. Base de Datos
```bash
mysql -u root -p edufinanzas_db < stored_procedures_user_features.sql
```

---

## 📚 Documentación

- **[IMPLEMENTACION_COMPLETA.md](IMPLEMENTACION_COMPLETA.md)** - Documentación técnica detallada
- **[COMO_EJECUTAR.md](COMO_EJECUTAR.md)** - Guía paso a paso de instalación
- **[ARQUITECTURA_SISTEMA.md](ARQUITECTURA_SISTEMA.md)** - Diagramas y arquitectura
- **[ENDPOINTS_USUARIO.md](BACKFRONT/BACKEND/EduFinanzas/ENDPOINTS_USUARIO.md)** - API Reference

---

## 🏗️ Tecnologías

### Backend
- Django 5.2 + Django REST Framework
- MySQL 8.0 con Stored Procedures
- JWT Authentication
- Python 3.8+

### Frontend
- React 18 + Vite
- React Router DOM v6
- Axios
- Context API

---

## 📊 Estadísticas del Proyecto

- **Archivos creados**: 23
- **Líneas de código**: ~3,500
- **Stored Procedures**: 5
- **Endpoints API**: 5 nuevos (usuario) + 20+ existentes (admin)
- **Páginas frontend**: 3 (Dashboard, Perfil, TemaDetalle)
- **Componentes**: 15+

---

## 🎨 Screenshots

### Dashboard de Usuario
- Tip del día con rotación automática
- Barra de progreso
- Grid de temas disponibles

### Perfil de Usuario
- Avatar personalizado
- Información personal
- Edición de nombre y contraseña
- Contador de monedas

### Tema Detalle
- Información del tema
- Lista de retos (bloqueados/en progreso/completados)
- Sistema de compra de retos con monedas
- Metadata de costos y recompensas

---

## 📱 Rutas de la Aplicación

### Públicas
- `/login-usuario` - Login de usuarios
- `/registro` - Registro de nuevos usuarios
- `/login` - Login de administradores

### Protegidas (Usuario)
- `/` - Dashboard de usuario
- `/perfil` - Perfil de usuario
- `/tema/:id` - Detalle de tema con retos

### Protegidas (Admin)
- `/admin` - Dashboard de administrador
- `/admin/usuarios` - Gestión de usuarios
- `/admin/temas` - Gestión de temas
- `/admin/retos` - Gestión de retos
- `/admin/tips` - Gestión de tips

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:
- Token almacenado en `localStorage`
- Duración: 24 horas
- Extracción automática del `id_usuario` en cada petición
- Renovación automática en cada login

---

## 💾 Base de Datos

### Tablas Principales
- `usuario` - Credenciales y roles
- `perfil` - Información de usuario y monedas
- `tema` - Temas educativos
- `reto` - Retos con costos y recompensas
- `progreso` - Seguimiento de retos del usuario
- `recompensa` - Tips y recompensas

### Stored Procedures
1. `obtener_perfil_por_usuario` - Obtener perfil desde token
2. `iniciar_reto` - Comprar reto con monedas
3. `obtener_retos_por_tema` - Listar retos con progreso
4. `solucionar_reto` - Completar reto y ganar recompensa
5. `calcular_progreso_usuario` - Calcular porcentaje de avance

---

## 🧪 Testing

### Backend
```bash
# Probar endpoints con curl
curl -X GET http://localhost:8000/api/perfil/me/ \
  -H "Authorization: Bearer {token}"
```

### Frontend
```bash
npm run dev
# Navegar a http://localhost:5173
```

---

## 🤝 Contribuir

Este proyecto fue desarrollado como parte de un sistema educativo. Para contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Roadmap

### Próximas Funcionalidades
- [ ] Página de resolución de retos (formulario con validación)
- [ ] Sistema de achievements/badges
- [ ] Tabla de clasificación (leaderboard)
- [ ] Progreso por tema (no solo general)
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportar progreso a PDF
- [ ] Integración con redes sociales

---

## 🐛 Reportar Bugs

Si encuentras algún error:
1. Verifica que ambos servidores estén corriendo
2. Revisa los logs del backend
3. Revisa la consola del navegador
4. Crea un issue con:
   - Descripción del error
   - Pasos para reproducirlo
   - Screenshots si es posible

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👥 Autores

- **Backend**: Implementado con Django + MySQL
- **Frontend**: Implementado con React + Vite
- **Documentación**: Generada con IA (Claude Code)

---

## 🙏 Agradecimientos

- Django REST Framework por la facilidad de creación de APIs
- React por la construcción de interfaces modernas
- MySQL por el soporte de stored procedures
- Vite por la velocidad de desarrollo

---

## 📞 Contacto

Para preguntas o sugerencias, contacta a través de:
- GitHub Issues
- Email: (agregar email del equipo)

---

## ⚡ Quick Links

- [Documentación Técnica](IMPLEMENTACION_COMPLETA.md)
- [Guía de Instalación](COMO_EJECUTAR.md)
- [Arquitectura](ARQUITECTURA_SISTEMA.md)
- [API Reference](BACKFRONT/BACKEND/EduFinanzas/ENDPOINTS_USUARIO.md)

---

**Versión**: 1.0.0
**Última actualización**: 2025-11-20
**Estado**: ✅ Producción Ready

---

<div align="center">

**💰 EduFinanzas - Aprende finanzas jugando 🎮**

[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>
