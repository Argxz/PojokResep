import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserProfile,
  updateUsernameEmail,
} from '../redux/action/userActions'
import ProfilePictureUpload from './uploadProfilePict'
import {
  User,
  Mail,
  Image,
  Edit2,
  Settings,
  Shield,
  X,
  Check,
} from 'lucide-react'

const Profile = () => {
  const dispatch = useDispatch()
  const [imageKey, setImageKey] = useState(Date.now())

  // Deklarasi state untuk edit mode
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)

  // State untuk input sementara
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const { profile, loading, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  const handleSuccessUpload = () => {
    dispatch(fetchUserProfile())
    setImageKey(Date.now())
  }
  // Fungsi untuk memulai edit
  const startEditUsername = () => {
    setEditUsername(profile.username)
    setIsEditingUsername(true)
  }

  const startEditEmail = () => {
    setEditEmail(profile.email)
    setIsEditingEmail(true)
  }

  // Fungsi untuk submit update
  const handleUpdateUsername = async () => {
    try {
      await dispatch(updateUsernameEmail(editUsername, null))
      setIsEditingUsername(false)
    } catch (err) {
      // Error sudah ditangani di action
    }
  }

  const handleUpdateEmail = async () => {
    try {
      await dispatch(updateUsernameEmail(null, editEmail))
      setIsEditingEmail(false)
    } catch (err) {
      // Error sudah ditangani di action
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 w-48 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    )

  // Render error
  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Profile Error
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )

  if (!profile) return null
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar Profile */}
          <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                key={imageKey}
                src={
                  profile.profile_picture
                    ? `http://localhost:3001/uploads/profile_pictures/${profile.profile_picture}`
                    : '/user.png'
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                onError={(e) => {
                  e.target.src = '/user.png'
                }}
              />
              <div className="absolute bottom-0 right-0">
                <ProfilePictureUpload
                  onSuccessUpload={handleSuccessUpload}
                  className="bg-white rounded-full p-2 shadow-md"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              {profile.username}
            </h2>
            <p className="text-slate-500 mb-4">{profile.email}</p>

            <button
              className="w-full flex items-center justify-center space-x-2 
              bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 
              transition duration-300 mb-4"
            >
              <Settings className="w-5 h-5" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3
                className="text-xl font-semibold text-slate-800 mb-4 
                border-b pb-3 border-slate-100 flex items-center"
              >
                <User className="w-6 h-6 mr-3 text-blue-500" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Username</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {isEditingUsername ? (
                      <>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="flex-grow border rounded-lg p-2"
                        />
                        <button
                          onClick={handleUpdateUsername}
                          className="text-green-500 hover:bg-green-100 p-1 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditingUsername(false)}
                          className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 text-blue-400" />
                        <p className="font-medium text-slate-700">
                          {profile.username}
                        </p>
                        <button
                          onClick={startEditUsername}
                          className="ml-2 text-blue-500 hover:bg-blue-100 p-1 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {isEditingEmail ? (
                      <>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="flex-grow border rounded-lg p-2"
                        />
                        <button
                          onClick={handleUpdateEmail}
                          className="text-green-500 hover:bg-green-100 p-1 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditingEmail(false)}
                          className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 text-green-400" />
                        <p className="font-medium text-slate-700">
                          {profile.email}
                        </p>
                        <button
                          onClick={startEditEmail}
                          className="ml-2 text-blue-500 hover:bg-blue-100 p-1 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3
                className="text-xl font-semibold text-slate-800 mb-4 
                border-b pb-3 border-slate-100 flex items-center"
              >
                <Image className="w-6 h-6 mr-3 text-purple-500" />
                Profile Picture
              </h3>

              <div className="flex items-center justify-between">
                <p className="text-slate-600">Profile Picture Status</p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      profile.profile_picture ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="text-slate-700">
                    {profile.profile_picture ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center space-x-2 
              bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 
              transition duration-300"
            >
              <Edit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
