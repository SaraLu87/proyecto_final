/**
 * PUNTO DE ENTRADA PRINCIPAL
 *
 * Archivo principal de la aplicación React
 * - Monta la aplicación en el DOM
 * - Importa Bootstrap CSS
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
