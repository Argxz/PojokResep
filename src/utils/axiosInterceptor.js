// src/utils/axiosInterceptor.js
import axios from 'axios'
import { store } from '../redux/store'
import { logoutUser } from '../redux/action/authActions'

const setupAxiosInterceptors = () => {
  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token invalid, logout user
        store.dispatch(logoutUser())
      }
      return Promise.reject(error)
    },
  )
}

export default setupAxiosInterceptors
