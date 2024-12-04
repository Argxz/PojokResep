import axios from 'axios'
import { store } from '../redux/store'
import { logoutUser, refreshTokenAction } from '../redux/action/authActions'
import Swal from 'sweetalert2'

const BASE_URL = 'http://localhost:3001/api/v1'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

const setupAxiosInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Log detail error untuk debugging
      console.error('Axios Interceptor Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
      // Cek jika error adalah 401 (Unauthorized) atau 403 (Forbidden)
      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true

        try {
          // Ambil refresh token dari localStorage
          const refreshToken = localStorage.getItem('refreshToken')

          if (!refreshToken) {
            // Jika tidak ada refresh token, langsung logout
            store.dispatch(logoutUser())
            return Promise.reject(error)
          }

          // Kirim request refresh token
          const response = await axios.post(`${BASE_URL}/users/refresh-token`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data

          // Update token di localStorage
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          // Update token di Redux (opsional)
          store.dispatch(refreshTokenAction(accessToken, newRefreshToken))

          // Set ulang header authorization
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

          // Kirim ulang request original
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Jika refresh token gagal, logout paksa
          console.error('Refresh token failed:', refreshError)
          store.dispatch(logoutUser())
          return Promise.reject(refreshError)
        }
      }

      // Tambahkan error handling spesifik
      if (error.response) {
        switch (error.response.status) {
          case 400:
            // Validasi error
            Swal.fire({
              icon: 'warning',
              title: 'Validasi Gagal',
              text:
                error.response.data.message || 'Periksa kembali input Anda.',
            })
            break
          case 401:
            Swal.fire({
              icon: 'info',
              title: 'Sesi Habis',
              text: 'Sesi Anda telah habis. Silakan login ulang.',
              didClose: () => {
                store.dispatch(logoutUser())
              },
            })
            break
          case 403:
            Swal.fire({
              icon: 'error',
              title: 'Akses Ditolak',
              text: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
            })
            break
          case 404:
            Swal.fire({
              icon: 'warning',
              title: 'Data Tidak Ditemukan',
              text: 'Data yang Anda cari tidak tersedia.',
            })
            break
          case 500:
            Swal.fire({
              icon: 'error',
              title: 'Kesalahan Server',
              text: 'Kesalahan server internal. Silakan coba lagi nanti.',
            })
            break
        }
      } else if (error.request) {
        // Request dibuat tapi tidak ada response
        toast.error(
          'Tidak ada respon dari server. Periksa koneksi internet Anda.',
        )
      } else {
        // Error lainnya
        toast.error('Terjadi kesalahan tidak terduga.')
      }

      return Promise.reject(error)
    },
  )

  return axiosInstance
}

export default setupAxiosInterceptors
