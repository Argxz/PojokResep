import axios from 'axios'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_USER_URL

// Action Login
export const login = (email, password) => async (dispatch) => {
  // Validasi frontend sebelum request
  if (!email) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Email wajib diisi',
    })
    return
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Format email tidak valid',
    })
    return
  }

  if (!password) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Password wajib diisi',
    })
    return
  }

  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    })

    // Pastikan akses roles dengan benar
    const roles = response.data.data.roles || response.data.roles
    const { accessToken, refreshToken } = response.data.data

    // Dispatch login success
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: {
          ...response.data.data,
          roles,
        },
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      },
    })

    // Simpan roles di localStorage juga
    localStorage.setItem('userRoles', response.data.data.roles)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    // Tampilkan notifikasi berhasil
    await Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: `Selamat datang, ${response.data.data.username}`,
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data.data
  } catch (error) {
    let errorMessage = 'Login Gagal'
    let errorTitle = 'Login Gagal'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.error || 'Data login tidak valid'
          break
        case 401:
        case 404:
          errorMessage =
            error.response.data.error || 'Email atau password salah'
          break
        case 500:
          errorMessage = 'Masalah server. Coba lagi nanti'
          break
        default:
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            'Login Gagal'
      }
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
    await Swal.fire({
      icon: 'error',
      title: errorTitle,
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

    // Pastikan response memiliki data yang valid
    if (
      response.data.valid &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
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
    } else {
      // Jika response tidak valid, lempar error
      throw new Error('Invalid token response')
    }
  } catch (error) {
    console.error('Refresh Token Error:', error)

    // Logout paksa
    dispatch(logoutUser())

    // Hapus semua token dari localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRoles')

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
  } catch (error) {
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
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const storedRoles = localStorage.getItem('userRoles')

  dispatch({ type: 'VERIFY_TOKEN_REQUEST' })

  if (!accessToken || !refreshToken) {
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })
    return false
  }

  try {
    const response = await axios.get(`${BASE_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    // Langsung return true jika valid
    if (response.data.valid) {
      const userWithRoles = {
        ...response.data.user,
        roles: storedRoles || 'user',
      }

      dispatch({
        type: 'VERIFY_TOKEN_SUCCESS',
        payload: {
          user: userWithRoles,
          accessToken,
          refreshToken,
        },
      })
      return true
    }

    // Jika tidak valid, coba refresh token
    try {
      const refreshResponse = await dispatch(refreshTokenAction(refreshToken))

      if (refreshResponse) {
        const newVerifyResponse = await axios.get(`${BASE_URL}/verify-token`, {
          headers: { Authorization: `Bearer ${refreshResponse.accessToken}` },
        })

        if (newVerifyResponse.data.valid) {
          const userWithRoles = {
            ...newVerifyResponse.data.user,
            roles: storedRoles || 'user',
          }

          dispatch({
            type: 'VERIFY_TOKEN_SUCCESS',
            payload: {
              user: userWithRoles,
              accessToken: refreshResponse.accessToken,
              refreshToken: refreshResponse.refreshToken,
            },
          })
          return true
        }
      }
    } catch (refreshError) {
      console.error('Refresh Token Failed:', refreshError)
    }

    // Jika refresh token gagal
    dispatch({ type: 'VERIFY_TOKEN_FAILURE' })

    // Hapus token dari localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRoles')

    return false
  } catch (error) {
    console.error(
      'Verify Token Error:',
      error.response ? error.response.data : error.message,
    )

    // Tambahkan penanganan spesifik untuk error 401
    if (error.response && error.response.status === 401) {
      dispatch({ type: 'VERIFY_TOKEN_FAILURE' })

      // Hapus token dari localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userRoles')
    }

    return false
  }
}

// Action Register (tetap sama)
export const register = (username, email, password) => async (dispatch) => {
  // Validasi di frontend
  if (username.length < 3) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Username minimal 3 karakter',
    })
    throw new Error('Username terlalu pendek')
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Format email tidak valid',
    })
    throw new Error('Email tidak valid')
  }

  // Pastikan password mengandung angka dan huruf
  if (!/^(?=.*[a-z])(?=.*\d).{8,}$/.test(password)) {
    Swal.fire({
      icon: 'error',
      title: 'Validasi Gagal',
      text: 'Password harus mengandung huruf minimal 8 karakter dan angka',
    })
    throw new Error('Password tidak memenuhi kriteria')
  }

  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username,
      email,
      password,
    })

    // Kembalikan data user
    return response.data.data
  } catch (error) {
    // Tangani berbagai jenis error dengan Swal
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Validasi umum
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: error.response.data.error || 'Data registrasi tidak valid',
          })
          break

        case 409:
          if (error.response.data.error === 'Email sudah terdaftar') {
            Swal.fire({
              icon: 'error',
              title: 'Email Sudah Terdaftar',
              text: 'Email ini sudah digunakan oleh akun lain',
              confirmButtonText: 'Coba Email Lain',
            })
          } else if (error.response.data.error === 'Username sudah digunakan') {
            Swal.fire({
              icon: 'error',
              title: 'Username Sudah Terpakai',
              text: 'Username ini sudah digunakan oleh akun lain',
              confirmButtonText: 'Pilih Username Lain',
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registrasi Gagal',
              text:
                error.response.data.error ||
                'Data yang Anda masukkan sudah terdaftar',
              confirmButtonText: 'Coba Lagi',
            })
          }
          break

        case 500:
          Swal.fire({
            icon: 'error',
            title: 'Kesalahan Server',
            text: 'Terjadi masalah pada server. Silakan coba lagi.',
          })
          break

        default:
          Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text:
              error.response.data.error || 'Terjadi kesalahan saat registrasi',
          })
      }
    } else if (error.request) {
      // Tidak ada response dari server
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      })
    } else {
      // Error lainnya
      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: 'Terjadi kesalahan yang tidak terduga',
      })
    }

    // Tetap lempar error untuk penanganan di komponen
    throw error
  }
}
