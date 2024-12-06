import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/action/authActions'
import { Link } from 'react-router-dom'
import { LogOut, Upload, BookOpen, AlertCircle } from 'lucide-react'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const [showConfirm, setShowConfirm] = useState(false)

  const { user } = useSelector((state) => state.auth)
  const userId = user?.id

  const imageKey = user?.profile_picture || 'default'

  const getProfileImage = () => {
    if (user?.profile_picture) {
      return `http://localhost:3001/uploads/profile_pictures/${user.profile_picture}`
    }
    return '/user.png'
  }

  const handleLogoutConfirm = () => {
    dispatch(logoutUser())
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 max-w-3xl md:max-w-4xl w-full mx-auto">
      <div className="flex items-center space-x-6">
        {/* Profile Picture */}
        <Link to="/profile" className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-500 transition-transform duration-300 hover:scale-110">
            <img
              key={imageKey}
              src={getProfileImage()}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/user.png'
              }}
            />
          </div>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          <Link to="upload-recipe">
            <button className="bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center space-x-3 hover:bg-blue-600 transition-colors transform active:scale-95">
              <Upload className="w-6 h-6" />
              <span className="text-base">Upload Resep</span>
            </button>
          </Link>

          <Link to="recipe">
            <button className="bg-emerald-500 text-white px-4 py-3 rounded-xl flex items-center space-x-3 hover:bg-emerald-600 transition-colors transform active:scale-95">
              <BookOpen className="w-6 h-6" />
              <span className="text-base">Daftar Resep</span>
            </button>
          </Link>
          <Link to={`/recipe/user/${userId}`}>
            <button className="bg-blue-500 text-white px-4 py-3 rounded-xl flex items-center space-x-3 hover:bg-emerald-600 transition-colors transform active:scale-95">
              <BookOpen className="w-6 h-6" />
              <span className="text-base">Daftar Resep User</span>
            </button>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <p className="font-bold text-lg text-gray-800">{user?.username}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Logout Button/Confirmation */}
        <div className="relative">
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors transform active:scale-90"
          >
            <LogOut className="w-7 h-7" />
          </button>

          {showConfirm && (
            <div className="absolute right-0 top-full mt-4 bg-white shadow-2xl rounded-2xl p-6 w-96 z-50 border border-gray-100 animate-fade-in">
              <div className="flex items-center space-x-4 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-base text-gray-700 font-semibold">
                  Anda yakin ingin logout dari aplikasi?
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors transform active:scale-95 flex items-center justify-center space-x-3"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="text-base">Ya, Logout</span>
                </button>

                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors transform active:scale-95"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LogoutButton
