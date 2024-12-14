// src/routes/AdminRoute.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2' // Pastikan untuk mengimpor komponen LoadingSpinner

const AdminRoute = () => {
  // Mengambil state auth dari Redux store
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  // Memeriksa apakah pengguna memiliki role 'admin'
  const isAdmin = user?.roles === 'admin'

  // Menampilkan loading spinner jika data masih dimuat
  if (loading) return <LoadingSpinner />

  // Jika pengguna tidak terautentikasi atau bukan admin, tampilkan peringatan dan arahkan ke halaman utama
  if (!isAuthenticated || !isAdmin) {
    Swal.fire({
      icon: 'warning',
      title: 'Akses Ditolak',
      text: `Role Anda: ${user?.roles || 'Tidak Dikenali'}`,
      confirmButtonText: 'Mengerti',
    })
    return <Navigate to="/" replace />
  }

  // Jika pengguna terautentikasi dan merupakan admin, render komponen anak
  return <Outlet />
}

export default AdminRoute
