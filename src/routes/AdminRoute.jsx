// src/routes/AdminRoute.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  const isAdmin = user?.roles === 'admin'

  if (loading) return <LoadingSpinner />

  if (!isAuthenticated || !isAdmin) {
    Swal.fire({
      icon: 'warning',
      title: 'Akses Ditolak',
      text: `Role Anda: ${user?.roles || 'Tidak Dikenali'}`,
      confirmButtonText: 'Mengerti',
    })
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
