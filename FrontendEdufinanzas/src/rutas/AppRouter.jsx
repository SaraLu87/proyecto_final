/**
 * COMPONENTE: APP ROUTER
 *
 * Configuración de todas las rutas de la aplicación
 * - Ruta pública: Login
 * - Rutas protegidas: Dashboard y módulos CRUD
 * - Layout con Header, Sidebar y Footer para rutas protegidas
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componentes de layout
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

// Páginas
import Login from '../pages/auth/Login';
import RecuperarContrasena from '../pages/auth/RecuperarContrasena';
import Dashboard from '../pages/admin/Dashboard';
import Usuarios from '../pages/admin/Usuarios';
import Temas from '../pages/admin/Temas';
import Retos from '../pages/admin/Retos';
import Tips from '../pages/admin/Tips';

// Protección de rutas
import AdminRoute from './AdminRoute';

/**
 * Layout para páginas protegidas (con Header, Sidebar y Footer)
 */
const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

/**
 * Componente principal de rutas
 */
const AppRouter = () => {
  const { estaAutenticado } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de Login */}
        <Route
          path="/login"
          element={
            estaAutenticado() ? <Navigate to="/admin" replace /> : <Login />
          }
        />

        {/* Ruta de Recuperar Contraseña */}
        <Route
          path="/recuperar-contrasena"
          element={
            estaAutenticado() ? <Navigate to="/admin" replace /> : <RecuperarContrasena />
          }
        />

        {/* Rutas protegidas con AdminRoute y Layout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <AdminLayout>
                <Usuarios />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/temas"
          element={
            <AdminRoute>
              <AdminLayout>
                <Temas />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/retos"
          element={
            <AdminRoute>
              <AdminLayout>
                <Retos />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tips"
          element={
            <AdminRoute>
              <AdminLayout>
                <Tips />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Ruta por defecto: redirigir a admin o login */}
        <Route
          path="/"
          element={
            <Navigate to={estaAutenticado() ? '/admin' : '/login'} replace />
          }
        />

        {/* Ruta 404: redirigir a login o admin */}
        <Route
          path="*"
          element={
            <Navigate to={estaAutenticado() ? '/admin' : '/login'} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
