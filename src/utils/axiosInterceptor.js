import axios from 'axios'
import { store } from '../redux/store'
import { logoutUser, refreshTokenAction } from '../redux/action/authActions'

const BASE_URL = import.meta.env.VITE_BASE_URL
const REFRESH_TOKEN_ENDPOINT = import.meta.env.VITE_REFRESH_TOKEN_ENDPOINT

const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Tambahkan timeout
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const setupInterceptors = () => {
    // Request Interceptor
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

    // Response Interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Cek kondisi token expired
        const isTokenExpiredError =
          error.response?.status === 401 || error.response?.status === 403

        // Hindari infinite loop
        if (isTokenExpiredError && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')

            if (!refreshToken) {
              // Logout jika tidak ada refresh token
              store.dispatch(logoutUser())
              return Promise.reject(error)
            }

            // Request refresh token
            const response = await axios.post(
              `${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            const { accessToken, refreshToken: newRefreshToken } = response.data

            // Update token di localStorage
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Update token di Redux
            store.dispatch(
              refreshTokenAction({
                accessToken,
                refreshToken: newRefreshToken,
              }),
            )

            // Set ulang header authorization
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
            }

            // Kirim ulang request original
            return axiosInstance(originalRequest)
          } catch (refreshError) {
            // Log error refresh token
            console.error('Refresh token failed:', refreshError)

            // Logout paksa jika refresh token gagal
            store.dispatch(logoutUser())
            return Promise.reject(refreshError)
          }
        }

        // Handle error lainnya
        return Promise.reject(error)
      },
    )

    return axiosInstance
  }

  return setupInterceptors()
}

// Export instance axios
export const axiosInstance = createAxiosInstance()

// Export fungsi setup interceptors
export const setupAxiosInterceptors = () => {
  return axiosInstance
}

export default axiosInstance
