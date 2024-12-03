import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Logout from './pages/logout' // Sesuaikan dengan nama halaman logout Anda
import Profile from './pages/Profile' // Sesuaikan dengan nama halaman profile Anda
import ProfilePictureUpload from './pages/uploadProfilePict'
import CreateRecipe from './pages/createRecipe'
import RecipeList from './pages/recipeList'
import PrivateRoute from './components/PrivateRoute'
import setupAxiosInterceptors from './utils/axiosInterceptor'
import { verifyToken } from './redux/action/authActions' // Sesuaikan dengan nama action Anda

// Wrapper komponen untuk inisialisasi global
function AppInitializer() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Setup axios interceptors
    setupAxiosInterceptors()

    // Verifikasi token saat aplikasi dimuat
    dispatch(verifyToken())
  }, [dispatch])

  // Tampilkan loading jika sedang memverifikasi token
  if (loading) {
    return <div>Loading...</div> // Atau gunakan komponen loading spinner
  }

  return (
    <Routes>
      {/* Rute login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Dashboard />}
      />

      {/* Rute yang memerlukan autentikasi */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipelist" element={<RecipeList />} />
        <Route path="/upload-recipe" element={<CreateRecipe />} />
        <Route path="/upload-picture" element={<ProfilePictureUpload />} />
        {/* Tambahkan rute privat lainnya di sini */}
      </Route>

      {/* Tangkap rute yang tidak ditemukan */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppInitializer />
    </Router>
  )
}

export default App
