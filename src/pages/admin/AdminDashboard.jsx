import React from 'react'
import { Link, Outlet } from 'react-router-dom'

// Este componente actúa como el layout para todas las páginas de admin
// Si estamos en /admin, Outlet renderizará AdminHome
// Si estamos en /admin/products, Outlet renderizará AdminProducts
export default function AdminDashboard() {
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
      {/* Columna de Navegación Admin */}
      <nav className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link to="/admin">Inicio (Dashboard)</Link>
        <Link to="/admin/products">Manejar Productos</Link>
        <Link to="/admin/orders">Ver Órdenes</Link>
        <hr />
        <Link to="/">Volver a la tienda</Link>
      </nav>

      {/* Contenido principal de la página de admin */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

// Componente para la página de inicio del admin
export function AdminHome() {
  return (
    <div className="card">
      <h2>Panel de Administración</h2>
      <p>Bienvenido al panel de administración. Selecciona una opción del menú de la izquierda para comenzar.</p>
    </div>
  )
}