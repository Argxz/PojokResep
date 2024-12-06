import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Logout from './pages/logout'
import Profile from './pages/Profile'
import ProfilePictureUpload from './pages/uploadProfilePict'
import CreateRecipe from './pages/createRecipe'
import RecipeList from './pages/recipeList'
import RecipeDetailPage from './pages/recipeDetailPage'
import UserRecipes from './pages/userRecipes'
import UpdateRecipe from './pages/updateRecipePage'
import PrivateRoute from './components/PrivateRoute'
import setupAxiosInterceptors from './utils/axiosInterceptor'
import { verifyToken } from './redux/action/authActions'

import Sidebar from './components/Sidebar'

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
        {/* Sidebar - tampilkan hanya jika sudah login */}
        {isAuthenticated && <Sidebar />}

        {/* Konten utama dengan margin kiri jika sidebar ada */}
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
            {/* Rute login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Dashboard />
              }
            />

            {/* Rute yang memerlukan autentikasi */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Logout />} />
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

            {/* Tangkap rute yang tidak ditemukan */}
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
