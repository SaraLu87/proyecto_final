/**
 * COMPONENTE: APP
 *
 * Componente raíz de la aplicación
 * - Envuelve la aplicación con el AuthProvider
 * - Configura el router principal
 */

import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import AppRouter from './rutas/AppRouter';

// Importar estilos globales
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <AppRouter />
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
