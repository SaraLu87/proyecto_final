# Archivos Pendientes por Crear

Este documento detalla los archivos que aún necesitan ser creados para completar el proyecto FrontendEdufinanzas.

## ✅ Archivos Ya Creados

### Estructura Base
- ✅ package.json
- ✅ vite.config.js
- ✅ index.html
- ✅ .gitignore
- ✅ src/main.jsx
- ✅ src/App.jsx

### Servicios y Contexto
- ✅ src/services/api.js (Completo con todos los endpoints)
- ✅ src/context/AuthContext.jsx (Gestión de autenticación)

### Componentes Reutilizables
- ✅ src/components/Header/Header.jsx
- ✅ src/components/Header/Header.css
- ✅ src/components/Footer/Footer.jsx
- ✅ src/components/Footer/Footer.css
- ✅ src/components/TemaCard/TemaCard.jsx
- ✅ src/components/TemaCard/TemaCard.css
- ✅ src/components/TipCard/TipCard.jsx
- ✅ src/components/TipCard/TipCard.css
- ✅ src/components/RetoCard/RetoCard.jsx
- ✅ src/components/RetoCard/RetoCard.css
- ✅ src/components/ProgressBar/ProgressBar.jsx
- ✅ src/components/ProgressBar/ProgressBar.css
- ✅ src/components/TipModal/TipModal.jsx
- ✅ src/components/TipModal/TipModal.css
- ✅ src/components/ProtectedRoute/ProtectedRoute.jsx
- ✅ src/components/AdminRoute/AdminRoute.jsx

### Páginas
- ✅ src/pages/Home/Home.jsx
- ✅ src/pages/Home/Home.css
- ✅ src/pages/Login/Login.jsx
- ✅ src/pages/Login/Login.css
- ✅ src/pages/Register/Register.jsx
- ✅ src/pages/Register/Register.css

### Estilos
- ✅ src/styles/global.css

## ⏳ Archivos Pendientes por Crear

### 1. Página de Temas (src/pages/Temas/)

#### src/pages/Temas/Temas.jsx
```jsx
/**
 * Página de Temas
 * Muestra todos los temas disponibles con su progreso
 * Los temas se desbloquean progresivamente
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import TemaCard from '../../components/TemaCard/TemaCard'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { obtenerTemas, obtenerProgresoPerfil, obtenerRetosPorTema } from '../../services/api'
import './Temas.css'

const Temas = () => {
  const navigate = useNavigate()
  const { obtenerIdPerfil } = useAuth()

  const [temas, setTemas] = useState([])
  const [progreso, setProgreso] = useState({}) // { idTema: porcentaje }
  const [temasDesbloqueados, setTemasDesbloqueados] = useState([]) // IDs de temas desbloqueados
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarTemas()
  }, [])

  const cargarTemas = async () => {
    try {
      setLoading(true)
      const idPerfil = obtenerIdPerfil()

      // Cargar temas y progreso en paralelo
      const [temasData, progresoData] = await Promise.all([
        obtenerTemas(),
        obtenerProgresoPerfil(idPerfil),
      ])

      setTemas(temasData)

      // Calcular progreso por tema y temas desbloqueados
      await calcularProgresoPorTema(temasData, progresoData)
    } catch (err) {
      console.error('Error al cargar temas:', err)
      setError('No se pudieron cargar los temas')
    } finally {
      setLoading(false)
    }
  }

  const calcularProgresoPorTema = async (temas, progresoData) => {
    const progresoPorTema = {}
    const temasDesbloqueadosArray = []

    for (let i = 0; i < temas.length; i++) {
      const tema = temas[i]

      // Obtener retos del tema
      const retos = await obtenerRetosPorTema(tema.id_tema)
      const totalRetos = retos.length

      if (totalRetos === 0) {
        progresoPorTema[tema.id_tema] = 0
        continue
      }

      // Contar retos completados
      const retosCompletados = progresoData.filter(
        (p) => retos.some((r) => r.id_reto === p.id_reto) && p.completado
      ).length

      const porcentaje = (retosCompletados / totalRetos) * 100
      progresoPorTema[tema.id_tema] = porcentaje

      // Lógica de desbloqueo: el primer tema siempre está desbloqueado
      // Los siguientes se desbloquean al completar el 100% del anterior
      if (i === 0) {
        temasDesbloqueadosArray.push(tema.id_tema)
      } else {
        const temaAnterior = temas[i - 1]
        if (progresoPorTema[temaAnterior.id_tema] === 100) {
          temasDesbloqueadosArray.push(tema.id_tema)
        }
      }
    }

    setProgreso(progresoPorTema)
    setTemasDesbloqueados(temasDesbloqueadosArray)
  }

  const handleTemaClick = (tema) => {
    if (temasDesbloqueados.includes(tema.id_tema)) {
      navigate(`/temas/${tema.id_tema}/retos`)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Header tipo="user" />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header tipo="user" />

      <main className="page-content">
        <Container>
          <div className="temas-header fade-in">
            <h1 className="text-center mb-4">Temas de Educación Financiera</h1>
            <p className="text-center text-muted mb-4">
              Completa todos los retos de un tema para desbloquear el siguiente
            </p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Row xs={1} md={2} lg={3} className="g-4">
            {temas.map((tema) => {
              const bloqueado = !temasDesbloqueados.includes(tema.id_tema)
              const progresoTema = progreso[tema.id_tema] || 0

              return (
                <Col key={tema.id_tema}>
                  <div className="tema-container">
                    <TemaCard
                      tema={tema}
                      onClick={() => handleTemaClick(tema)}
                      bloqueado={bloqueado}
                    />
                    {!bloqueado && (
                      <div className="mt-2">
                        <ProgressBar progreso={progresoTema} />
                      </div>
                    )}
                  </div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  )
}

export default Temas
```

#### src/pages/Temas/Temas.css
```css
.temas-header {
  margin-bottom: 2rem;
}

.tema-container {
  height: 100%;
}
```

### 2. Página de TemasRetos (src/pages/TemasRetos/)

Esta página muestra:
- Información teórica del tema
- Lista de retos disponibles

**Estructura similar a Temas.jsx pero con dos secciones:**
1. Módulo de información del tema (información_tema de la BD)
2. Módulo de lista de retos con RetoCard

### 3. Página de Retos (src/pages/Retos/)

Esta página implementa los dos círculos:
- **Círculo 1:** Descripción teórica del reto
- **Círculo 2:** Pregunta con 4 opciones

**Usar useState para controlar qué círculo se muestra:**
```jsx
const [circuloActual, setCirculoActual] = useState(1)
```

### 4. Página de Perfil de Usuario (src/pages/PerfilUsuario/)

Debe permitir:
- Ver información del perfil
- Actualizar nombre, edad
- Cambiar foto de perfil (upload de imagen)
- Cambiar contraseña
- Ver monedas totales
- Ver progreso global

### 5. Panel de Administrador (src/pages/Admin/)

Debe incluir múltiples componentes:

#### src/pages/Admin/AdminPanel.jsx
Componente principal con sidebar y routing interno

#### src/pages/Admin/components/TemasAdmin.jsx
CRUD completo de temas

#### src/pages/Admin/components/RetosAdmin.jsx
CRUD completo de retos con formulario de:
- Título
- Descripción
- Pregunta
- 4 opciones de respuesta
- Respuesta correcta
- Monedas (costo y recompensa)

#### src/pages/Admin/components/TipsAdmin.jsx
CRUD completo de tips

#### src/pages/Admin/components/UsuariosAdmin.jsx
Gestión de usuarios:
- Listar usuarios
- Editar usuarios
- Eliminar usuarios
- Cambiar rol

## 🎨 Imágenes Requeridas

Crear carpeta `public/assets/` con:
- `logo.png` - Logo de EduFinanzas
- `tema-default.png` - Imagen por defecto para temas
- `reto-default.png` - Imagen por defecto para retos
- `perfil-default.png` - Imagen por defecto para perfiles

## 🔧 Configuración del Backend

Asegúrate de que el backend Django tenga:

1. **CORS configurado:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

2. **Archivos media configurados:**
```python
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'
```

3. **URLs de media en urls.py:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... tus rutas
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 📝 Notas de Implementación

### Sistema de Progreso

El progreso se calcula así:
1. Obtener todos los retos de un tema
2. Contar cuántos retos ha completado el usuario
3. Porcentaje = (retosCompletados / totalRetos) * 100

### Sistema de Monedas

1. Al completar un reto:
   - Verificar que la respuesta sea correcta
   - Sumar recompensa_monedas al perfil
   - Marcar el reto como completado en progreso

2. Al acceder a un reto:
   - Verificar que el usuario tenga suficientes monedas
   - Restar costo_monedas del perfil

### Validaciones

Implementar validaciones en todos los formularios:
- Campos requeridos
- Formatos correctos (email, números)
- Longitudes mínimas/máximas
- Contraseñas seguras

## 🚀 Pasos para Completar el Proyecto

1. Crear los archivos de páginas faltantes
2. Implementar la lógica de negocio en cada página
3. Crear los componentes del panel de administrador
4. Agregar las imágenes por defecto
5. Probar todas las funcionalidades
6. Ajustar estilos según necesidad
7. Realizar pruebas de integración con el backend

## 📚 Recursos Útiles

- [Documentación de React](https://react.dev/)
- [Documentación de React Router](https://reactrouter.com/)
- [Documentación de React Bootstrap](https://react-bootstrap.github.io/)
- [Documentación de Axios](https://axios-http.com/)

---

**Nota:** Todos los archivos siguen el mismo patrón de código limpio, comentarios explicativos y estructura modular implementada en los archivos ya creados.
