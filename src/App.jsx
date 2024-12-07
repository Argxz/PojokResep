import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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

// Import Components
import Sidebar from './components/Sidebar'
import ProfilePictureUpload from './components/Profile/uploadProfilePict'

//Import Routes
import PrivateRoute from './routes/PrivateRoute'

// Import Utilities
import setupAxiosInterceptors from './utils/axiosInterceptor'
import { verifyToken } from './redux/action/authActions'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    setupAxiosInterceptors()
    dispatch(verifyToken())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />}

        <div
          className={`
            flex-1 
            ${isAuthenticated ? 'ml-60' : ''} 
            p-4 
            overflow-y-auto 
            h-screen
          `}
        >
          <Routes>
            {/* Authentication Route */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />}
            />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recipe" element={<RecipeList />} />
              <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
              <Route path="/recipe/user/:userId" element={<UserRecipes />} />
              <Route path="/upload-recipe" element={<CreateRecipe />} />
              <Route path="/recipe/edit/:recipeId" element={<UpdateRecipe />} />
              <Route
                path="/upload-picture"
                element={<ProfilePictureUpload />}
              />
            </Route>

            {/* Catch-all Route */}
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? '/' : '/login'} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
