import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/action/authActions'
import { useNavigate, Link } from 'react-router-dom'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const { user } = useSelector((state) => state.auth)

  // Generate unique key for image to force reload
  const imageKey = user?.profile_picture || 'default'

  // Fallback image handling
  const getProfileImage = () => {
    if (user?.profile_picture) {
      return `http://localhost:3001/uploads/profile_pictures/${user.profile_picture}`
    }
    return '/user.png' // Pastikan ada di public folder
  }

  const handleLogoutConfirm = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <div className="relative bg-black text-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <Link to="/profile" className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
            <img
              key={imageKey}
              src={getProfileImage()}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/user.png' // Fallback on image load error
              }}
            />
          </div>
        </Link>
        <Link to="upload-recipe">
          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
            UPLOAD
          </button>
        </Link>
        {/* User Info */}
        <div className="flex-grow">
          <p className="font-semibold text-sm">{user?.username}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        {/* Logout Button/Confirmation */}
        <div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="absolute right-0 top-full mt-2 bg-white text-black shadow-lg rounded-lg p-3 z-10 w-64">
              <p className="mb-3 text-sm text-gray-700">
                Anda yakin ingin logout?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleLogoutConfirm}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Ya, Logout
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
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
