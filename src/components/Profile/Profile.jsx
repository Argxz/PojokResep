// Import yang dikelompokkan berdasarkan sumber/tipe
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Image, Edit2, Shield, X, Check } from 'lucide-react'

// Import komponen / aset dan actions
import {
  fetchUserProfile,
  updateUsernameEmail,
} from '../../redux/action/userActions'
import ProfilePictureUpload from './uploadProfilePict'

const Profile = () => {
  // Inisialisasi hooks dan state management
  const dispatch = useDispatch()
  const [imageKey, setImageKey] = useState(Date.now())

  // State untuk mode edit dan input sementara
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [editEmail, setEditEmail] = useState('')

  // Destructuring state dari Redux
  const { profile, loading, error } = useSelector((state) => state.user)

  // Effect untuk logging profil (bisa dihapus di production)
  useEffect(() => {
    console.log('Profile Data:', profile)
  }, [profile])

  // Effect untuk fetch profil pengguna saat komponen dimuat
  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])

  // Handler untuk upload gambar berhasil
  const handleSuccessUpload = () => {
    // Refresh profil dan perbarui kunci gambar
    dispatch(fetchUserProfile())
    setImageKey(Date.now())
  }

  // Fungsi untuk memulai mode edit username
  const startEditUsername = () => {
    setEditUsername(profile.username)
    setIsEditingUsername(true)
  }

  // Fungsi untuk memulai mode edit email
  const startEditEmail = () => {
    setEditEmail(profile.email)
    setIsEditingEmail(true)
  }

  // Handler update username
  const handleUpdateUsername = async () => {
    try {
      // Dispatch action update dengan username baru
      await dispatch(updateUsernameEmail(editUsername, null))
      // Keluar dari mode edit
      setIsEditingUsername(false)
    } catch (err) {
      // Error handling sudah ditangani di action
    }
  }

  // Handler update email
  const handleUpdateEmail = async () => {
    try {
      // Dispatch action update dengan email baru
      await dispatch(updateUsernameEmail(null, editEmail))
      // Keluar dari mode edit
      setIsEditingEmail(false)
    } catch (err) {
      // Error handling sudah ditangani di action
    }
  }

  // Render loading state
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

  // Render error state
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

  // Cegah render jika tidak ada profil
  if (!profile) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Bagian Overview Profil */}
          <div className="md:col-span-1">
            <div
              className="bg-white rounded-2xl shadow-xl p-6 text-center 
              transform transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative inline-block mb-6">
                {/* Gambar Profil dengan Upload */}
                <div className="relative">
                  <img
                    key={imageKey}
                    src={
                      profile.profile_picture
                        ? `http://localhost:3001/uploads/profile_pictures/${profile.profile_picture}`
                        : '/user.png'
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover 
                      border-4 border-white shadow-lg 
                      ring-4 ring-purple-500/20 
                      transform transition-transform hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/user.png'
                    }}
                  />
                  {/* Komponen Upload Gambar Profil */}
                  <div className="absolute bottom-2 right-2">
                    <ProfilePictureUpload
                      onSuccessUpload={handleSuccessUpload}
                      className="bg-white rounded-full p-2 shadow-md 
                        hover:bg-purple-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Detail Pengguna */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                    {profile.username}
                  </h2>
                  <p className="text-gray-500 mt-1">{profile.email}</p>
                  <div
                    className="mt-7 inline-block bg-purple-500 text-white 
                    px-4 py-2 rounded-full text-md font-semibold uppercase tracking-wider 
                    shadow-md hover:bg-purple-600 transition-colors"
                  >
                    {profile.roles.charAt(0).toUpperCase() +
                      profile.roles.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Detail Profil */}
          <div className="md:col-span-2 space-y-8">
            {/* Informasi Akun */}
            <div
              className="bg-white rounded-2xl shadow-xl p-6 
              hover:shadow-2xl transition-shadow"
            >
              <h3
                className="text-xl font-semibold text-gray-800 mb-6 
                flex items-center border-b pb-4 border-gray-100"
              >
                <User className="w-6 h-6 mr-3 text-purple-500" />
                Informasi Akun
              </h3>

              {/* Grid untuk Username dan Email */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Bagian Username */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm text-gray-500 mb-2 block">
                    Username
                  </label>
                  {/* Kondisional render edit/view mode */}
                  <div className="flex items-center space-x-3">
                    {isEditingUsername ? (
                      // Mode Edit Username
                      <>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className=" flex-grow border-2 border-purple-200 
                          rounded-lg p-2 focus:ring-2 focus:ring-purple-300 
                          transition-all"
                        />
                        <button
                          onClick={handleUpdateUsername}
                          className="text-green-500 hover:bg-green-100 
                          p-2 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditingUsername(false)}
                          className="text-red-500 hover:bg-red-100 
                          p-2 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      // Mode Tampilkan Username
                      <>
                        <User className="w-5 h-5 text-purple-400" />
                        <p className="font-medium text-gray-700 flex-grow">
                          {profile.username}
                        </p>
                        <button
                          onClick={startEditUsername}
                          className="text-purple-500 hover:bg-purple-100 
                          p-2 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bagian Email */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm text-gray-500 mb-2 block">
                    Email
                  </label>
                  <div className="flex items-center space-x-3">
                    {isEditingEmail ? (
                      // Mode Edit Email
                      <>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="flex-grow border-2 border-purple-200 
                          rounded-lg p-2 focus:ring-2 focus:ring-purple-300 
                          transition-all"
                        />
                        <button
                          onClick={handleUpdateEmail}
                          className="text-green-500 hover:bg-green-100 
                          p-2 rounded-full"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditingEmail(false)}
                          className="text-red-500 hover:bg-red-100 
                          p-2 rounded-full"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      // Mode Tampilkan Email
                      <>
                        <Mail className="w-5 h-5 text-green-400" />
                        <p className="font-medium text-gray-700 flex-grow">
                          {profile.email}
                        </p>
                        <button
                          onClick={startEditEmail}
                          className="text-purple-500 hover:bg-purple-100 
                          p-2 rounded-full"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Foto Profil */}
            <div
              className="bg-white rounded-2xl shadow-xl p-6 
              hover:shadow-2xl transition-shadow"
            >
              <h3
                className="text-xl font-semibold text-gray-800 mb-6 
                flex items-center border-b pb-4 border-gray-100"
              >
                <Image className="w-6 h-6 mr-3 text-purple-500" />
                Foto Profil
              </h3>

              <div className="flex items-center justify-between">
                <p className="text-gray-600">Status Foto Profil</p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      profile.profile_picture ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  <span className="text-gray-700">
                    {profile.profile_picture ? 'Uploaded' : 'Not Uploaded'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
