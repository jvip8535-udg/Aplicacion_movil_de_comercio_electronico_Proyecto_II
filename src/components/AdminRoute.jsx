import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../utils/auth'

// Componente para proteger rutas de admin
export default function AdminRoute() {
  const isAdmin = auth.isAdmin()

  if (!isAdmin) {
    // Si no es admin, redirigir a la página principal
    return <Navigate to="/" replace />
  }

  // Si es admin, mostrar el contenido de la ruta anidada
  return <Outlet />
}