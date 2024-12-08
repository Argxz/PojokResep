// Impor library
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, register } from '../../redux/action/authActions'
import { useNavigate } from 'react-router-dom'
import LogoImage from '../../assets/porespth.png'
import SmallLogo from '../../assets/pores-sm2.png'

//Impor komponen yang diperlukan
import Swal from 'sweetalert2'
import { Mail, Lock, User, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Auth = () => {
  // State untuk mengelola formulir dan tab aktif
  const [activeTab, setActiveTab] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Hook untuk dispatch aksi dan navigasi
  const dispatch = useDispatch()
  const navigate = useNavigate()

  /**
   * Menangani proses login
   * @param {Event} e - Event formulir
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Dispatch aksi login
      await dispatch(login(email, password))
      navigate('/') // Redirect ke halaman utama setelah login
    } catch (error) {}
  }

  /**
   * Menangani proses registrasi
   * @param {Event} e - Event formulir
   */
  const handleRegister = async (e) => {
    e.preventDefault()

    // Validasi konfirmasi password
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Password Tidak Cocok',
        text: 'Pastikan password dan konfirmasi password sama.',
        icon: 'error',
        confirmButtonText: 'OK',
      })
      return
    }

    try {
      // Dispatch aksi registrasi
      const result = await dispatch(register(username, email, password))

      // Tampilkan konfirmasi registrasi
      const { isConfirmed } = await Swal.fire({
        title: 'Registrasi Berhasil!',
        text: 'Apakah Anda ingin login sekarang?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ya, Login',
        cancelButtonText: 'Tidak',
      })

      // Pindah ke tab login jika dikonfirmasi
      if (isConfirmed) {
        setActiveTab('login')
        setEmail(email)
      }
    } catch (error) {}
  }

  // Variasi animasi untuk transisi formulir
  const formVariants = {
    hidden: {
      opacity: 0,
      x: activeTab === 'login' ? -50 : 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        type: 'tween',
      },
    },
    exit: {
      opacity: 0,
      x: activeTab === 'login' ? 50 : -50,
      transition: {
        duration: 0.3,
        type: 'tween',
      },
    },
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Kontainer Formulir */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={SmallLogo}
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">
              {activeTab === 'login' ? 'Selamat Datang' : 'Daftar Sekarang'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'login'
                ? 'Masuk untuk melanjutkan perjalanan Anda'
                : 'Buat akun Anda'}
            </p>
          </div>

          {/* Kontainer Animasi Formulir */}
          <AnimatePresence mode="wait">
            {/* Formulir Login */}
            {activeTab === 'login' ? (
              <motion.div
                key="login"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
              >
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Input Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* Input Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* Tombol Login */}
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                  >
                    Login
                  </button>
                </form>
              </motion.div>
            ) : (
              // Formulir Registrasi
              <motion.div
                key="register"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
              >
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Input Username */}
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div
                      className="absolute z-10 w-64 p-4 -top-36 left-0 
    transform transition-all duration-300 ease-in-out 
    origin-bottom-left 
    scale-0 group-focus-within:scale-100 
    bg-white 
    border border-gray-200 
    rounded-xl 
    shadow-2xl 
    overflow-hidden"
                    >
                      <div
                        className="absolute bottom-0 left-5 w-4 h-4 
      bg-white 
      border-r border-b 
      border-gray-200 
      transform rotate-45 
      -translate-y-1/2"
                      ></div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Username Guidelines
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Minimal 3 karakter
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Tanpa spasi
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Huruf & angka saja
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Input Email */}
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div
                      className="absolute z-10 w-64 p-4 -top-36 left-0 
    transform transition-all duration-300 ease-in-out 
    origin-bottom-left 
    scale-0 group-focus-within:scale-100 
    bg-white 
    border border-gray-200 
    rounded-xl 
    shadow-2xl 
    overflow-hidden"
                    >
                      <div
                        className="absolute bottom-0 left-5 w-4 h-4 
      bg-white 
      border-r border-b 
      border-gray-200 
      transform rotate-45 
      -translate-y-1/2"
                      ></div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Email Guidelines
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Format email valid
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Contoh: nama@example.com
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Domain harus valid
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Input Password */}
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div
                      className="absolute z-10 w-64 p-4 -top-44 left-0 
    transform transition-all duration-300 ease-in-out 
    origin-bottom-left 
    scale-0 group-focus-within:scale-100 
    bg-white 
    border border-gray-200 
    rounded-xl 
    shadow-2xl 
    overflow-hidden"
                    >
                      <div
                        className="absolute bottom-0 left-5 w-4 h-4 
      bg-white 
      border-r border-b 
      border-gray-200 
      transform rotate-45 
      -translate-y-1/2"
                      ></div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Password Guidelines
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Minimal 8 karakter
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Kombinasi huruf & angka
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Disarankan simbol unik
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Input Konfirmasi Password */}
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Konfirmasi Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* Tombol Registrasi */}
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                  >
                    Register
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Gambar Latar Belakang */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center fixed right-0 top-0 bottom-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1551782450-17144efb9c50')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-center max-w-md p-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <img
                src={LogoImage}
                alt="Pores Logo"
                className="h-80 w-auto object-contain 
      border-2 border-gray-200 
      rounded-2xl 
      ring-4 ring-white/10 
      hover:ring-white/20 
      transition-all 
      duration-300"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              {activeTab === 'login' ? 'Baru di sini?' : 'Sudah terdaftar?'}
            </h2>
            <p className="mb-6 text-white/80">
              {activeTab === 'login'
                ? 'Daftar dan mulai perjalanan Anda bersama kami!'
                : 'Masuk untuk mengakses akun pribadi Anda.'}
            </p>
            <button
              onClick={() =>
                setActiveTab(activeTab === 'login' ? 'register' : 'login')
              }
              className="px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-all"
            >
              {activeTab === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
