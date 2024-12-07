import Swal from 'sweetalert2'
import { axiosInstance } from '../../utils/axiosInterceptor'

const BASE_URL = import.meta.env.VITE_USER_URL

export const uploadProfilePicture = (file) => async (dispatch) => {
  // Validasi file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    Swal.fire({
      icon: 'error',
      title: 'Upload Gagal',
      text: 'Hanya file JPEG, PNG, dan JPG yang diizinkan',
    })
    return
  }

  if (file.size > maxSize) {
    Swal.fire({
      icon: 'error',
      title: 'Upload Gagal',
      text: 'Ukuran file maksimal 5MB',
    })
    return
  }

  try {
    dispatch({ type: 'UPLOAD_PROFILE_PICTURE_REQUEST' })

    const formData = new FormData()
    formData.append('profile_picture', file)

    const response = await axiosInstance.post(
      `${BASE_URL}/upload-profile-picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    dispatch({
      type: 'UPLOAD_PROFILE_PICTURE_SUCCESS',
      payload: response.data.profile_picture,
    })

    Swal.fire({
      icon: 'success',
      title: 'Upload Berhasil',
      text: 'Foto profil berhasil diupload',
      timer: 2000,
    })

    return response.data.profile_picture
  } catch (error) {
    console.error('Upload Profile Picture Error:', error)

    dispatch({
      type: 'UPLOAD_PROFILE_PICTURE_FAIL',
      payload: error.response?.data?.message || 'Upload foto profil gagal',
    })

    Swal.fire({
      icon: 'error',
      title: 'Upload Gagal',
      text:
        error.response?.data?.message ||
        'Terjadi kesalahan saat upload foto profil',
    })

    throw error
  }
}

export const fetchUserProfile = () => async (dispatch) => {
  try {
    // Dispatch request action
    dispatch({ type: 'FETCH_PROFILE_REQUEST' })
    const response = await axiosInstance.get(`${BASE_URL}/profile`)

    dispatch({
      type: 'FETCH_PROFILE_SUCCESS',
      payload: response.data,
    })
    return response.data
  } catch (error) {
    console.error('Profile Fetch Error:', error)
    dispatch({
      type: 'FETCH_PROFILE_FAILURE',
      payload: error.response?.data || error.message,
    })
    throw error
  }
}

export const updateUsernameEmail = (username, email) => async (dispatch) => {
  try {
    dispatch({ type: 'UPDATE_PROFILE_REQUEST' })

    const response = await axiosInstance.put(`${BASE_URL}/profile`, {
      username,
      email,
    })

    // Dispatch success action dan update profile
    dispatch({
      type: 'UPDATE_PROFILE_SUCCESS',
      payload: response.data.data,
    })

    // Tampilkan pesan sukses
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: response.data.message || 'Profil berhasil diupdate',
      timer: 2000,
    })

    return response.data.data
  } catch (error) {
    console.error('Update Profile Error:', error)

    // Tangani error spesifik
    let errorMessage = 'Gagal update profil'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.details || 'Validasi data gagal'
          break
        case 409:
          errorMessage =
            error.response.data.error || 'Username/email sudah digunakan'
          break
        case 500:
          errorMessage = 'Terjadi kesalahan server'
          break
        default:
          errorMessage = error.response.data.error || 'Gagal update profil'
      }
    }

    // Dispatch error action
    dispatch({
      type: 'UPDATE_PROFILE_FAILURE',
      payload: errorMessage,
    })

    // Tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Update Gagal',
      text: errorMessage,
    })

    throw error
  }
}
