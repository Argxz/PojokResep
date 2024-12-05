import axios from 'axios'
import Swal from 'sweetalert2'

const BASE_URL = 'http://localhost:3001/api/v1/users'

// Action Login
export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    })

    const { accessToken, refreshToken } = response.data.data

    // Dispatch login success
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: response.data.data,
        accessToken,
        refreshToken,
      },
    })

    // Simpan token di localStorage
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Tampilkan notifikasi berhasil
    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: `Selamat datang, ${response.data.data.username}`,
      timer: 2000,
    })

    return response.data.data
  } catch (error) {
    let errorMessage = 'Login Gagal'

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        'Login Gagal'
    } else if (error.request) {
      errorMessage = 'Tidak ada respon dari server'
    } else {
      errorMessage = error.message || 'Terjadi kesalahan'
    }

    // Dispatch login failure
    dispatch({
      type: 'LOGIN_FAIL',
      payload: errorMessage,
    })

    // Tampilkan notifikasi error
    Swal.fire({
      icon: 'error',
      title: 'Login Gagal',
      text: errorMessage,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Coba Lagi',
    })

    throw error
  }
}

// Action Refresh Token
export const refreshTokenAction = (refreshToken) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/refresh-token`, {
      refreshToken,
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    // Update token di localStorage
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    // Dispatch refresh token success
    dispatch({
      type: 'REFRESH_TOKEN',
      payload: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    })

    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    // Jika refresh token gagal, logout paksa
    dispatch(logoutUser())
    throw error
  }
}

// Action Logout
export const logoutUser = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')

    // Kirim request logout ke backend
    await axios.post(`${BASE_URL}/logout`, {
      refreshToken,
    })

    // Hapus token dari localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    // Dispatch logout
    dispatch({ type: 'LOGOUT' })

    // Tampilkan notifikasi
    Swal.fire({
      icon: 'success',
      title: 'Logout Berhasil!',
      text: 'Anda telah keluar dari sistem',
      timer: 1500,
    })

    // Redirect ke halaman login
    window.location.href = '/login'
  } catch (error) {
    console.error('Logout error:', error)

    // Tetap lakukan logout lokal jika request gagal
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    dispatch({ type: 'LOGOUT' })

    Swal.fire({
      icon: 'warning',
      title: 'Logout',
      text: 'Anda telah keluar dari sistem',
      timer: 1500,
    })

    // Redirect ke halaman login
    window.location.href = '/login'
  }
}

// Action Verifikasi Token
export const verifyToken = () => async (dispatch) => {
  dispatch({ type: 'VERIFY_TOKEN_REQUEST' })

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (!accessToken || !refreshToken) {
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
    return
  }

  try {
    // Verifikasi access token
    const response = await axios.get(`${BASE_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.data.valid) {
      dispatch({
        type: 'VERIFY_TOKEN_SUCCESS',
        payload: {
          user: response.data.user,
          accessToken,
          refreshToken,
        },
      })
      return true
    }

    // Jika token expired, coba refresh
    const refreshResponse = await dispatch(refreshTokenAction(refreshToken))

    // Verifikasi ulang token baru
    const newVerifyResponse = await axios.get(`${BASE_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${refreshResponse.accessToken}` },
    })

    dispatch({
      type: 'VERIFY_TOKEN_SUCCESS',
      payload: {
        user: newVerifyResponse.data.user,
        accessToken: refreshResponse.accessToken,
        refreshToken: refreshResponse.refreshToken,
      },
    })

    return true
  } catch (error) {
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
    dispatch(logoutUser())
    return false
  }
}

// Action Register (tetap sama)
export const register = (username, email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username,
      email,
      password,
    })

    Swal.fire({
      icon: 'success',
      title: 'Registrasi Berhasil!',
      text: 'Silakan login dengan akun Anda',
      timer: 2000,
    })

    return response.data.data
  } catch (error) {
    // Penanganan error yang lebih detail
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Error validasi
          const validationErrors =
            error.response.data.details || error.response.data.error

          // Cek error spesifik
          if (typeof validationErrors === 'string') {
            Swal.fire({
              icon: 'error',
              title: 'Validasi Gagal',
              text: validationErrors,
            })
          } else if (Array.isArray(validationErrors)) {
            // Jika error adalah array, ambil pesan pertama
            Swal.fire({
              icon: 'error',
              title: 'Validasi Gagal',
              text: validationErrors[0],
            })
          } else if (typeof validationErrors === 'object') {
            // Jika error adalah object, cari pesan error
            const errorMessage = Object.values(validationErrors)[0]
            Swal.fire({
              icon: 'error',
              title: 'Validasi Gagal',
              text: errorMessage,
            })
          }
          break

        case 409:
          // Conflict error (email/username sudah ada)
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text:
              error.response.data.error ||
              'Email atau username sudah terdaftar',
          })
          break

        case 500:
          // Server error
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan Saat Registrasi',
            text: 'Pastikan Username / Email belum terdaftar dan password menggunakan nomor',
          })
          break

        default:
          // Error umum
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: error.response.data.message || 'Terjadi kesalahan',
          })
      }
    }

    throw error
  }
}
