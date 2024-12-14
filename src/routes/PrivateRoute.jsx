// src/routes/PrivateRoute.jsx
import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const PrivateRoute = () => {
  // State untuk mengatur loading spinner dan tampilan alert
  const [loadingSpin, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  // Mengatur timer untuk loading spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000) // Delay 1 detik

    return () => clearTimeout(timer) // Bersihkan timer saat komponen unmount
  }, [])

  // Mengambil state isAuthenticated dan loading dari Redux store
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  // Mengatur alert jika pengguna tidak terautentikasi
  useEffect(() => {
    if (!loading && !isAuthenticated && !loadingSpin) {
      Swal.fire({
        title: 'Anda belum login',
        text: 'Silakan login terlebih dahulu untuk mengakses halaman ini.',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then(() => setShowAlert(true))
    }
  }, [loading, isAuthenticated, loadingSpin])

  // Menampilkan loading spinner jika masih dalam proses loading
  if (loading || loadingSpin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    )
  }

  // Jika alert ditampilkan, arahkan pengguna ke halaman login
  if (showAlert) {
    return <Navigate to="/login" replace />
  }

  // Jika pengguna terautentikasi, render komponen anak
  return isAuthenticated ? <Outlet /> : null
}

export default PrivateRoute
