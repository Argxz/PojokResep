import axios from 'axios'
import { store } from '../redux/store'
import { logoutUser, refreshTokenAction } from '../redux/action/authActions'

const BASE_URL = 'http://localhost:3001/api/v1'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

const setupAxiosInterceptors = () => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken')
      console.log('Request Token:', accessToken) // Tambahkan log
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

      return Promise.reject(error)
    },
  )

  return axiosInstance
}

export default setupAxiosInterceptors