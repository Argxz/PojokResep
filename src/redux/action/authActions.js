import axios from 'axios'
import Swal from 'sweetalert2'

// Action Login
export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/users/login',
      { email, password },
    )

    // Dispatch login success
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: response.data.data,
        token: response.data.data.token,
      },
    })

    // Simpan token di localStorage
    localStorage.setItem('token', response.data.data.token)

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

    // Tangani berbagai kemungkinan error
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

// Action Register
export const register = (username, email, password) => async (dispatch) => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/users/register',
      {
        username,
        email,
        password,
      },
    )

    Swal.fire({
      icon: 'success',
      title: 'Registrasi Berhasil!',
      text: 'Silakan login dengan akun Anda',
      timer: 2000,
    })

    return response.data.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Registrasi Gagal',
      text: error.response?.data?.message || 'Terjadi kesalahan',
    })

    throw error
  }
}

// Logout action
export const logoutUser = () => (dispatch) => {
  // Hapus token dari localStorage
  localStorage.removeItem('token')

  // Dispatch logout
  dispatch({
    type: 'LOGOUT',
  })

  // Optional: Tampilkan notifikasi
  Swal.fire({
    icon: 'success',
    title: 'Logout Berhasil!',
    text: 'Anda telah keluar dari sistem',
    timer: 1500,
  })
}

// Tambahkan action untuk verifikasi token
export const verifyToken = () => async (dispatch) => {
  // Tandai proses verifikasi dimulai
  dispatch({ type: 'VERIFY_TOKEN_REQUEST' })

  const token = localStorage.getItem('token')

  // Jika tidak ada token, langsung set tidak terautentikasi
  if (!token) {
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
    return
  }

  try {
    // Ganti URL sesuai endpoint verify token Anda
    const response = await axios.get(
      'http://localhost:3001/api/v1/users/verify-token',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (response.data.valid) {
      dispatch({
        type: 'VERIFY_TOKEN_SUCCESS',
        payload: {
          user: response.data.user,
          token: token,
        },
      })
    } else {
      dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
      localStorage.removeItem('token')
    }
  } catch (error) {
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
    localStorage.removeItem('token')
  }
}
