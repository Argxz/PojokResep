import React, { useState } from 'react'
import axios from 'axios'

const ProfilePictureUpload = ({ onSuccessUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi tipe dan ukuran file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('Hanya file JPEG, PNG, dan JPG yang diizinkan')
        return
      }

      if (file.size > maxSize) {
        setError('Ukuran file maksimal 5MB')
        return
      }

      setSelectedFile(file)
      setError(null)

      // Buat preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Pilih file terlebih dahulu')
      return
    }

    const formData = new FormData()
    formData.append('profile_picture', selectedFile)

    try {
      setUploading(true)
      setError(null)

      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/upload-profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Log response untuk debugging
      console.log('Upload Response:', response.data)

      // Panggil callback sukses upload dengan nama file
      if (onSuccessUpload) {
        onSuccessUpload(response.data.profile_picture)
      }

      // Reset state
      setSelectedFile(null)
      setPreview(null)

      alert('Foto profil berhasil diupload')
    } catch (error) {
      console.error('Upload failed', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Gagal mengupload foto profil')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`
          w-full py-2 rounded 
          ${
            !selectedFile || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }
        `}
      >
        {uploading ? 'Mengunggah...' : 'Upload Foto Profil'}
      </button>
    </div>
  )
}

export default ProfilePictureUpload
