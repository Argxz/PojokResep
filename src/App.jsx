import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

// Import Pages
import Auth from './pages/AuthPages'
import LandingPage from './components/LandingPage'
import Profile from './components/Profile/Profile'
import CreateRecipe from './pages/createRecipe'
import RecipeList from './pages/recipeList'
import RecipeDetailPage from './pages/recipeDetailPage'
import UserRecipes from './pages/userRecipes'
import UpdateRecipe from './pages/updateRecipePage'
import AdminDashboard from './pages/AdminDashboard'

// Import Components
import Sidebar from './components/Sidebar'
import ProfilePictureUpload from './components/Profile/uploadProfilePict'

//Import Routes
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'

// Import Utilities
import { verifyToken } from './redux/action/authActions'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const checkToken = async () => {
      // Jangan verify token di halaman login
      if (location.pathname === '/login') return

      const result = await dispatch(verifyToken())
      if (!result) {
        // Redirect ke login jika token invalid
        navigate('/login')
      }
    }

    checkToken()
  }, [dispatch, navigate, location.pathname])

  if (loading) {
    return <div>Loading...</div>
  }

  // Cek apakah sedang di halaman admin
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="flex">
      {isAuthenticated && user?.roles !== 'admin' && <Sidebar />}

      <div
        className={`
          flex-1 
          ${isAuthenticated && user?.roles !== 'admin' ? 'ml-60' : ''} 
          p-4 
          overflow-y-auto 
          h-screen
        `}
      >
        <Routes>
          {/* Authentication Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                user?.roles === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Auth />
              )
            }
          />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={
                user?.roles === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe" element={<RecipeList />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
            <Route path="/recipe/user/:userId" element={<UserRecipes />} />
            <Route path="/upload-recipe" element={<CreateRecipe />} />
            <Route path="/recipe/edit/:recipeId" element={<UpdateRecipe />} />
            <Route path="/upload-picture" element={<ProfilePictureUpload />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all Route */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                user?.roles === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  )
}

// Wrap App dengan Router di file yang memanggil App
export default () => (
  <Router>
    <App />
  </Router>
)
