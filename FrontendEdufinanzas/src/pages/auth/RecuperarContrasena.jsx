/**
 * PÁGINA: RECUPERAR CONTRASEÑA
 *
 * Página informativa sobre cómo recuperar el acceso
 *
 * IMPORTANTE: El backend actual requiere autenticación JWT para todos los endpoints,
 * por lo que NO es técnicamente posible recuperar la contraseña sin estar autenticado.
 *
 * Esta página proporciona 3 soluciones alternativas:
 * 1. Contactar a otro administrador para que cambie la contraseña
 * 2. Acceder directamente a la base de datos MySQL
 * 3. Información técnica para implementar recuperación por email en el futuro
 */

import { Link } from 'react-router-dom';
import './Login.css';

const RecuperarContrasena = () => {
  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '700px' }}>
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-circle-login">
                <span className="logo-icon-login">🔐</span>
              </div>
              <h1 className="login-title" style={{ fontSize: '1.8rem' }}>
                ¿Olvidaste tu Contraseña?
              </h1>
            </div>
            <p className="login-description" style={{ marginBottom: 0 }}>
              Aquí te explicamos cómo recuperar el acceso
            </p>
          </div>

          {/* Contenido informativo */}
          <div style={{ padding: '0 0.5rem' }}>
            {/* Alerta informativa */}
            <div style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.8rem',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#92400e', fontSize: '0.95rem' }}>
                  El sistema actual requiere autenticación para cambiar contraseñas
                </p>
                <p style={{ margin: '0.5rem 0 0', color: '#92400e', fontSize: '0.85rem' }}>
                  Por seguridad, necesitas ayuda de otro administrador o acceso directo a la base de datos.
                </p>
              </div>
            </div>

            {/* Soluciones disponibles */}
            <h3 style={{ fontSize: '1.2rem', color: '#1C3A63', marginBottom: '1rem' }}>
              💡 Soluciones Disponibles
            </h3>

            {/* Solución 1: Otro administrador */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2F7AD9, #52E36A)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  1️⃣
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#1C3A63', fontSize: '1.05rem' }}>
                    Pide ayuda a otro administrador
                  </h4>
                  <p style={{ margin: '0 0 0.8rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Si hay otro administrador con acceso al panel, puede cambiar tu contraseña:
                  </p>
                  <ol style={{ margin: '0', paddingLeft: '1.2rem', color: '#475569', fontSize: '0.85rem' }}>
                    <li>El administrador inicia sesión en el panel</li>
                    <li>Va a <strong>Usuarios</strong> en el menú lateral</li>
                    <li>Busca tu usuario y hace clic en <strong>Editar</strong> ✏️</li>
                    <li>Ingresa una nueva contraseña y guarda</li>
                    <li>Te informa la nueva contraseña de manera segura</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Solución 2: Base de datos */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2F7AD9, #52E36A)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  2️⃣
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#1C3A63', fontSize: '1.05rem' }}>
                    Acceso directo a la base de datos MySQL
                  </h4>
                  <p style={{ margin: '0 0 0.8rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Si tienes acceso al servidor MySQL, puedes actualizar la contraseña directamente:
                  </p>
                  <div style={{
                    background: '#1e293b',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    overflowX: 'auto'
                  }}>
                    <pre style={{
                      margin: 0,
                      color: '#94a3b8',
                      fontSize: '0.8rem',
                      fontFamily: 'monospace',
                      lineHeight: '1.4'
                    }}>
{`# 1. Conectar a MySQL
mysql -u root -p

# 2. Usar la base de datos
USE juego_finanzas;

# 3. Ver usuarios
SELECT id_usuario, correo, rol FROM usuarios;

# 4. En Python Django, hashear tu nueva contraseña:
from django.contrib.auth.hashers import make_password
nueva_password = make_password("tu_nueva_contraseña")
print(nueva_password)

# 5. Actualizar en MySQL (reemplaza el hash)
UPDATE usuarios
SET contrasena = 'hash_generado_en_python'
WHERE correo = 'tu@correo.com';`}
                    </pre>
                  </div>
                  <p style={{ margin: '0.8rem 0 0', color: '#dc2626', fontSize: '0.8rem' }}>
                    ⚠️ <strong>Advertencia:</strong> Requiere conocimientos técnicos y acceso al servidor
                  </p>
                </div>
              </div>
            </div>

            {/* Solución 3: Implementar reset por email */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2F7AD9, #52E36A)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  3️⃣
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#1C3A63', fontSize: '1.05rem' }}>
                    Para desarrolladores: Implementar recuperación por email
                  </h4>
                  <p style={{ margin: '0 0 0.5rem', color: '#475569', fontSize: '0.9rem' }}>
                    Para habilitar la recuperación automática, se necesita:
                  </p>
                  <ul style={{ margin: '0', paddingLeft: '1.2rem', color: '#475569', fontSize: '0.85rem' }}>
                    <li>Agregar campos <code>reset_token</code> y <code>reset_token_expiry</code> a la tabla usuarios</li>
                    <li>Crear endpoint público <code>POST /api/forgot-password/</code></li>
                    <li>Crear endpoint público <code>POST /api/reset-password/</code></li>
                    <li>Configurar envío de emails (SMTP)</li>
                    <li>Generar tokens únicos y temporales</li>
                  </ul>
                  <p style={{ margin: '0.5rem 0 0', color: '#475569', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    📚 Ver archivo RECUPERACION_CONTRASENA.md para detalles técnicos
                  </p>
                </div>
              </div>
            </div>

            {/* Contacto de soporte */}
            <div style={{
              background: '#dbeafe',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>
                💬 <strong>¿Necesitas ayuda?</strong><br/>
                Contacta al equipo de desarrollo o al administrador principal del sistema
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.8rem 1.5rem',
                background: 'linear-gradient(90deg, #2F7AD9, #52E36A)',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(47, 122, 217, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ← Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
