// Import yang dikelompokkan berdasarkan sumber/tipe
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BookOpen, Upload, LogOut, Home, AlertCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// Import aset dan actions
import SmallLogo from '../assets/pores-sm2.png'
import { logoutUser } from '../redux/action/authActions'

const Sidebar = () => {
  // Inisialisasi hooks dan state dengan jelas
  const dispatch = useDispatch()
  const location = useLocation()

  // Destructuring state dengan cara yang rapi
  const { user } = useSelector((state) => state.auth)
  const userId = user?.id

  // State management untuk konfirmasi logout
  const [showConfirm, setShowConfirm] = useState(false)

  // Definisi menu items sebagai konstanta dengan struktur yang jelas
  const menuItems = [
    {
      icon: <Home className="w-5 h-5 mr-4" />,
      label: 'Beranda',
      path: '/',
    },
    {
      icon: <Upload className="w-5 h-5 mr-4" />,
      label: 'Unggah Resep',
      path: '/Upload-recipe',
    },
    {
      icon: <BookOpen className="w-5 h-5 mr-4" />,
      label: 'Resep Saya',
      path: `/recipe/user/${userId}`,
    },
  ]

  // Fungsi handler dengan nama yang jelas dan tujuan tunggal
  const handleLogoutConfirm = () => {
    // Dispatch action logout
    dispatch(logoutUser())
    // Reset state konfirmasi
    setShowConfirm(false)
  }

  return (
    // Container sidebar dengan className yang deskriptif
    <div className="h-screen w-60 bg-gray-900 text-white flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto shadow-2xl">
      {/* Logo Section - Komponen terpisah dengan tanggung jawab tunggal */}
      <div className="p-6 sticky top-0 bg-opacity-90 bg-gray-900 z-10 flex flex-col items-center justify-center">
        {/* Logo dan judul dengan efek hover yang menarik */}
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center p-2 mb-4">
          <img
            src={SmallLogo}
            alt="Logo"
            className="w-24 h-24 object-contain rounded-full"
          />
        </div>

        {/* Judul dengan efek hover dan transisi */}
        <div className="text-center">
          <h2
            className="text-4xl font-bold text-white mb-1 
            transition-all duration-300 
            hover:text-green-400 
            hover:scale-105"
          >
            POJOK
          </h2>
          <h2
            className="text-4xl font-bold text-white mb-1 
            transition-all duration-300 
            hover:text-emerald-400 
            hover:scale-105"
          >
            RESEP
          </h2>
        </div>
      </div>

      {/* Navigation dengan mapping menu items */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item, index) => (
          // Setiap item menu memiliki conditional rendering
          <Link
            key={index}
            to={item.path}
            className={`
              relative 
              flex items-center px-4 py-3 rounded-xl 
              transition-all duration-300 group
              overflow-hidden
              ${
                location.pathname === item.path
                  ? 'bg-gray-600/20 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }
            `}
          >
            {/* Indikator aktif dengan transisi halus */}
            <div
              className={`
                absolute left-0 top-0 bottom-0 w-1 
                ${
                  location.pathname === item.path
                    ? 'bg-green-500'
                    : 'bg-transparent'
                } 
                group-hover:bg-emerald-500/50 
                transition-colors
              `}
            ></div>

            {/* Render icon dengan conditional styling */}
            {item.icon &&
              React.cloneElement(item.icon, {
                className: `w-5 h-5 mr-3 
                  ${
                    location.pathname === item.path
                      ? 'text-purple-400'
                      : 'text-gray-400 group-hover:text-white'
                  }`,
              })}

            {/* Label menu dengan efek hover */}
            <span
              className="flex-1 font-medium tracking-wide 
              transform transition-transform 
              group-hover:translate-x-1"
            >
              {item.label}
            </span>

            {/* Indikator path aktif */}
            {location.pathname === item.path && (
              <div
                className="absolute right-3 
                transform rotate-45 
                w-3 h-3 
                bg-emerald-500/50"
              ></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section - Profil dan logout */}
      <div className="p-4 mt-auto space-y-4">
        {/* Profil section dengan efek hover menarik */}
        <Link to="/profile" className="block relative group">
          {/* Gradient background dengan animasi */}
          <div
            className="absolute -inset-0.5 
              bg-gradient-to-r from-green-600 to-emerald-600 
              rounded-2xl opacity-75 
              blur-lg group-hover:opacity-100 
              transition duration-300 
              animate-pulse"
          ></div>

          {/* Konten profil */}
          <div
            className="relative bg-black/60 backdrop-blur-lg 
              border border-white/20 
              rounded-2xl p-4 flex items-center justify-between 
              shadow-2xl 
              transition-all duration-300
              group"
          >
            {/* Detail profil pengguna */}
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full 
                  ring-2 ring-offset-2 ring-purple-500/50 
                  overflow-hidden mr-4 
                  transform group-hover:scale-110 transition-transform"
              >
                {/* Fallback gambar profil */}
                <img
                  src={
                    user?.profile_picture
                      ? `http://localhost:3001/uploads/profile_pictures/${user.profile_picture}`
                      : '/user.png'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/user.png'
                  }}
                />
              </div>

              {/* Informasi username dan email */}
              <div>
                <p
                  className="text-sm font-semibold text-white 
                    mb-1 tracking-wide 
                    group-hover:text-purple-400 
                    transition-colors"
                >
                  {user?.username || 'Guest'}
                </p>
                <p
                  className="text-xs text-gray-400 
                    opacity-80 
                    hover:text-white 
                    transition-colors"
                >
                  {user?.email || 'Not logged in'}
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Tombol Logout dengan konfirmasi */}
        <div className="space-y-2 relative">
          <div className="relative">
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center 
        px-4 py-3 bg-red-700 text-white rounded-lg 
        hover:bg-red-600 transition-colors 
        group"
            >
              <LogOut
                className="w-5 h-5 mr-2 
          group-hover:rotate-12 
          transition-transform"
              />
              Log out
            </button>

            {/* Modal konfirmasi logout */}
            {showConfirm && (
              <div
                className="absolute bottom-20 left-0 right-0 
    mx-3 
    bg-white dark:bg-gray-800 
    shadow-2xl rounded-2xl 
    p-4  // Kembalikan ke p-4 
    z-50 
    animate-fade-in 
    border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle
                    className="w-6 h-6 text-red-500 
        animate-pulse"
                  />
                  <p
                    className="text-sm text-gray-700 
        dark:text-gray-200 font-semibold"
                  >
                    Anda yakin ingin logout?
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleLogoutConfirm}
                    className="flex-1 bg-red-500 text-white 
        px-3 py-2 rounded-xl 
        text-sm
        hover:bg-red-600 
        transition-colors 
        transform active:scale-95 
        flex items-center justify-center 
        space-x-2 
        group"
                  >
                    <LogOut
                      className="w-4 h-4 
          group-hover:rotate-12 
          transition-transform"
                    />
                    <span>Logout</span>
                  </button>

                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-gray-200 
        dark:bg-gray-700 
        text-gray-700 
        dark:text-gray-300 
        px-3 py-2 
        rounded-xl 
        text-sm
        hover:bg-gray-300 
        dark:hover:bg-gray-600 
        transition-colors 
        transform active:scale-95"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright Section - Pengembang Web */}
        <div className="text-center mt-4">
          <p
            className="text-xs text-gray-500 opacity-90 
              transition-all duration-300 
              hover:text-emerald-300 
              hover:opacity-100 
              cursor-default"
          >
            © 2024 ARGXZ . All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
