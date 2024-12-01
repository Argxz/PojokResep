import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register } from '../redux/action/authActions'
import { useNavigate } from 'react-router-dom'
import LogoImage from '../assets/pores.png'
import Swal from 'sweetalert2'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector((state) => state.auth)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login(email, password))
      navigate('/') // Redirect ke halaman utama setelah login
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
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
      await dispatch(register(username, email, password))
      setActiveTab('login') // Pindah ke tab login setelah registrasi
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Logo Section */}
      <div className="flex-1 flex items-center justify-center border-r border-gray-300">
        <img src={LogoImage} alt="Logo" className="h-90" />
      </div>

      {/* Login/Register Section */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Navigation Tabs */}
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'login'
                ? 'bg-black text-white'
                : 'bg-white text-black border'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-bold ${
              activeTab === 'register'
                ? 'bg-black text-white'
                : 'bg-white text-black border'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Box for Login/Register Forms */}
        <div className="w-96 bg-white p-8 rounded-lg shadow-lg border border-gray-300">
          {activeTab === 'login' ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
              <form onSubmit={handleLogin}>
                {error && (
                  <div className="text-red-500 text-center mb-4">{error}</div>
                )}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Login
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">REGISTER</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Register
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
