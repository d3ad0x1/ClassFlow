import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './i18n';
import './index.css';

import App from './App.jsx';
import Public from './pages/Public.jsx';
import Teacher from './pages/Teacher.jsx';
import Admin from './pages/Admin.jsx';

const router = createHashRouter([
  { path: '/', element: <App />, children: [
    { path: '', element: <Public /> },
    { path: 'teacher', element: <Teacher /> },
    { path: 'admin', element: <Admin /> },
  ]},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
