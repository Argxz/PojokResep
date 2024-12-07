import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

// URL basis untuk endpoint kategori dari environment variable
const BASE_URL = import.meta.env.VITE_CATEGORY_URL

// Inisialisasi axios dengan interceptor
const axiosInstance = setupAxiosInterceptors()

/**
 * Action creator untuk mengambil daftar kategori
 * @returns {Function} Fungsi dispatch Redux
 */
export const fetchCategories = () => async (dispatch) => {
  try {
    // Melakukan request GET ke endpoint kategori
    const response = await axiosInstance.get(BASE_URL)

    // Dispatch aksi sukses dengan data kategori
    dispatch({
      type: 'FETCH_CATEGORIES_SUCCESS',
      payload: response.data.data,
    })

    // Kembalikan data kategori
    return response.data.data
  } catch (error) {
    // Tampilkan sweet alert error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengambil Kategori',
      text:
        error.response?.data?.error ||
        'Terjadi kesalahan saat mengambil kategori',
    })

    // Dispatch aksi gagal
    dispatch({
      type: 'FETCH_CATEGORIES_FAILURE',
      payload: error.response?.data?.error || 'Failed to fetch categories',
    })

    // Lempar error untuk penanganan lebih lanjut
    throw error
  }
}
