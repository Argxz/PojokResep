// Import yang dikelompokkan berdasarkan sumber/tipe
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Camera, X } from 'lucide-react'

// Import komponen / aset dan actions
import { uploadProfilePicture } from '../../redux/action/userActions'

const ProfilePictureUpload = ({ onSuccessUpload, className = '' }) => {
  // State management untuk upload gambar
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Inisialisasi dispatch dan selector
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.user)

  // Handler untuk perubahan file
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Set file yang dipilih
      setSelectedFile(file)

      // Buat preview gambar
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handler untuk proses upload
  const handleUpload = async () => {
    // Cegah upload jika tidak ada file
    if (!selectedFile) return

    try {
      // Dispatch action upload
      await dispatch(uploadProfilePicture(selectedFile))

      // Panggil callback sukses upload jika ada
      if (onSuccessUpload) {
        onSuccessUpload()
      }

      // Reset state setelah upload berhasil
      resetUploadState()
    } catch (err) {
      // Log error upload
      console.error('Upload failed', err)
    }
  }

  // Fungsi untuk membuka modal
  const openModal = () => setIsModalOpen(true)

  // Fungsi untuk menutup modal dan reset state
  const closeModal = () => {
    resetUploadState()
  }

  // Fungsi utilitas untuk reset state upload
  const resetUploadState = () => {
    setIsModalOpen(false)
    setSelectedFile(null)
    setPreview(null)
  }

  return (
    <>
      {/* Tombol untuk membuka modal upload */}
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
            {/* Tombol tutup modal */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Judul modal */}
            <h2 className="text-xl font-semibold mb-4 text-center">
              Upload Profile Picture
            </h2>

            {/* Input file untuk memilih gambar */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              className="mb-4 w-full"
            />

            {/* Preview gambar yang dipilih */}
            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>
            )}

            {/* Tampilkan pesan error jika ada */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {/* Tombol upload dengan kondisi disable */}
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
              {/* Ubah teks tombol berdasarkan state loading */}
              {loading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePictureUpload
