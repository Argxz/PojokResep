import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProfilePictureUpload from './uploadProfilePict'
import { useDispatch } from 'react-redux'
import { verifyToken } from '../redux/action/authActions' // Sesuaikan path

const Profile = () => {
  const dispatch = useDispatch()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageKey, setImageKey] = useState(Date.now())

  const fetchProfile = async () => {
    try {
      // Gunakan accessToken
      let accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        // Coba verifikasi token jika tidak ada
        const tokenVerified = await dispatch(verifyToken())
        if (!tokenVerified) {
          throw new Error('Unauthorized')
        }
        // Ambil ulang token setelah verifikasi
        accessToken = localStorage.getItem('accessToken')
      }

      const response = await axios.get(
        'http://localhost:3001/api/v1/users/profile',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      setProfile(response.data) // Sesuaikan dengan struktur response backend
      setLoading(false)
    } catch (err) {
      console.error('Fetch Profile Error:', err)

      // Jika token invalid, logout
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        dispatch({ type: 'LOGOUT' })
        window.location.href = '/login'
        return
      }

      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [dispatch])

  const handleSuccessUpload = () => {
    fetchProfile()
    setImageKey(Date.now())
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <ProfilePictureUpload onSuccessUpload={handleSuccessUpload} />

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold">Username</label>
            <p className="text-gray-900">{profile.username}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Email</label>
            <p className="text-gray-900">{profile.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Profile Picture
            </label>
            <img
              key={imageKey}
              src={
                profile.profile_picture
                  ? `http://localhost:3001/uploads/profile_pictures/${profile.profile_picture}`
                  : '/user.png'
              }
              alt="Profile Picture"
              className="w-32 h-32 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/user.png'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
