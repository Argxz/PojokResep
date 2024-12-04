import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadProfilePicture } from '../redux/action/userActions'
import { Camera, X } from 'lucide-react'

const ProfilePictureUpload = ({ onSuccessUpload, className = '' }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.user)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await dispatch(uploadProfilePicture(selectedFile))

      // Panggil callback jika berhasil
      if (onSuccessUpload) {
        onSuccessUpload()
      }

      // Reset state
      setSelectedFile(null)
      setPreview(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Upload failed', err)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
    setPreview(null)
  }

  return (
    <>
      {/* Tombol Kamera untuk Membuka Modal */}
      <button
        onClick={openModal}
        className={`
          rounded-full bg-white p-2 shadow-md 
          hover:bg-gray-100 transition-all duration-300
          flex items-center justify-center
          ${className}
        `}
      >
        <Camera className="w-5 h-5 text-blue-500" />
      </button>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            {/* Tombol Tutup */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">
              Upload Profile Picture
            </h2>

            {/* Input File */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="mb-4 w-full"
            />

            {/* Preview */}
            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {/* Tombol Upload */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className={`
                w-full py-3 rounded-lg transition-all duration-300
                ${
                  !selectedFile || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {loading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePictureUpload
