import { Link } from 'react-router-dom';

const LoginUsuarioSimple = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login de Usuario</h1>
      <p>Si ves esto, el componente simple funciona</p>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Correo:</label>
          <input type="email" style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Contraseña:</label>
          <input type="password" style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="button" style={{ padding: '10px', background: '#2F7AD9', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>

      <p>
        <Link to="/login">Login para administradores</Link>
      </p>
    </div>
  );
};

export default LoginUsuarioSimple;
