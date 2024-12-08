// Impor library yang dibutuhkan
import Swal from 'sweetalert2'
import { axiosInstance } from '../../utils/axiosInterceptor'

// Ambil URL basis dari environment variable
const BASE_URL = import.meta.env.VITE_RECIPE_URL

/**
 * Aksi untuk membuat resep baru
 * @param {Object} recipeData - Data resep yang akan dibuat
 */
export const createRecipe = (recipeData) => async (dispatch) => {
  try {
    // Dispatch aksi permintaan pembuatan resep
    dispatch({ type: 'CREATE_RECIPE_REQUEST' })

    // Kirim permintaan POST untuk membuat resep
    const response = await axiosInstance.post(`${BASE_URL}`, recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Penting untuk upload file
      },
    })

    // Dispatch aksi sukses dengan data resep
    dispatch({
      type: 'CREATE_RECIPE_SUCCESS',
      payload: response.data.data,
    })

    // Tampilkan notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Dibuat',
      text: 'Silahkan lihat hasil resep anda',
      timer: 2000,
    })

    return response.data.data
  } catch (error) {
    // Log error untuk debugging
    console.error('Create Recipe Error:', error)

    // Dispatch aksi gagal dengan pesan error
    dispatch({
      type: 'CREATE_RECIPE_FAIL',
      payload: error.response?.data?.message || 'Gagal membuat resep',
    })

    // Tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Membuat Resep',
      text:
        error.response?.data?.message || 'Terjadi kesalahan saat membuat resep',
    })

    throw error
  }
}

/**
 * Aksi untuk mengambil semua resep
 * @param {number} page - Halaman yang akan diambil
 * @param {number} limit - Jumlah resep per halaman
 */
export const getAllRecipes =
  (page = 1, limit = 8) =>
  async (dispatch, getState) => {
    try {
      // Ambil token otentikasi dari state
      const { auth } = getState()

      // Dispatch aksi permintaan pengambilan resep
      dispatch({ type: 'GET_RECIPES_REQUEST' })

      // Kirim permintaan GET untuk mengambil resep
      const response = await axiosInstance.get(
        `${BASE_URL}?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )

      // Tangani struktur respons yang berbeda
      const data = response.data.data || response.data

      // Dispatch aksi sukses dengan data resep
      dispatch({
        type: 'GET_RECIPES_SUCCESS',
        payload: {
          recipes: data.recipes || data,
          currentPage: data.currentPage || page,
          totalPages: data.totalPages || 1,
          totalRecipes:
            data.totalRecipes || (data.recipes ? data.recipes.length : 0),
        },
      })
    } catch (error) {
      // Log error untuk debugging
      console.error('Error fetching recipes:', error)
      console.error('Error Response:', error.response)

      // Dispatch aksi gagal dengan pesan error
      dispatch({
        type: 'GET_RECIPES_FAIL',
        payload:
          error.response?.data?.message ||
          error.message ||
          'Gagal mengambil resep',
      })
    }
  }

/**
 * Aksi untuk mengambil detail resep
 * @param {number} recipeId - ID resep yang akan diambil detailnya
 */
export const fetchRecipeDetail = (recipeId) => async (dispatch) => {
  try {
    // Kirim permintaan GET untuk mengambil detail resep
    const response = await axiosInstance.get(`${BASE_URL}/${recipeId}`)

    // Pastikan data ada
    if (!response.data) {
      throw new Error('Tidak ada data resep yang diterima')
    }

    // Dispatch aksi sukses dengan detail resep
    dispatch({
      type: 'FETCH_RECIPE_DETAIL_SUCCESS',
      payload: response.data,
    })

    return {
      payload: response.data,
    }
  } catch (error) {
    // Dispatch aksi gagal dengan pesan error
    dispatch({
      type: 'FETCH_RECIPE_DETAIL_FAILURE',
      payload: error.response?.data || error.message,
    })
    throw error
  }
}

/**
 * Aksi untuk memperbarui resep
 * @param {number} recipeId - ID resep yang akan diperbarui
 * @param {Object} formData - Data resep yang baru
 */
export const updateRecipe = (recipeId, formData) => async (dispatch) => {
  try {
    // Kirim permintaan PUT untuk memperbarui resep
    const response = await axiosInstance.put(
      `${BASE_URL}/${recipeId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    // Dispatch aksi sukses dengan data resep yang diperbarui
    dispatch({
      type: 'UPDATE_RECIPE_SUCCESS',
      payload: response.data.data,
    })

    // Tampilkan notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Diperbarui!',
      text: 'Perubahan resep telah disimpan.',
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data.data
  } catch (error) {
    // Log error untuk debugging
    console.error('Update Recipe Error:', error)

    // Dispatch aksi gagal dengan pesan error
    dispatch({
      type: 'UPDATE_RECIPE_FAIL',
      payload: error.response?.data?.error || 'Gagal memperbarui resep',
    })

    // Tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Update Resep',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })

    throw error
  }
}

/**
 * Aksi untuk menghapus resep
 * @param {number} recipeId - ID resep yang akan dihapus
 */
export const deleteRecipe = (recipeId) => async (dispatch) => {
  try {
    // Dispatch aksi permintaan penghapusan resep
    dispatch({ type: 'DELETE_RECIPE_REQUEST' })

    // Kirim permintaan DELETE untuk menghapus resep
    const response = await axiosInstance.delete(`${BASE_URL}/${recipeId}`)

    // Dispatch aksi sukses dengan ID resep yang dihapus
    dispatch({
      type: 'DELETE_RECIPE_SUCCESS',
      payload: recipeId,
    })

    // Tampilkan notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Dihapus',
      timer: 2000,
    })

    return response.data
  } catch (error) {
    // Dispatch aksi gagal dengan pe // Dispatch aksi gagal dengan pesan error
    dispatch({
      type: 'DELETE_RECIPE_FAIL',
      payload: error.response?.data?.message || 'Gagal menghapus resep',
    })

    // Tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus Resep',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })

    throw error
  }
}

/**
 * Aksi untuk mengambil resep pengguna
 */
export const fetchUserRecipes = () => async (dispatch, getState) => {
  try {
    // Ambil token otentikasi dan ID pengguna dari state
    const { auth } = getState()
    const userId = auth.user?.id

    // Kirim permintaan GET untuk mengambil resep pengguna
    const response = await axiosInstance.get(`${BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    // Dispatch aksi sukses dengan data resep pengguna
    dispatch({
      type: 'FETCH_USER_RECIPES_SUCCESS',
      payload: response.data,
    })
  } catch (error) {
    // Cek spesifik status 404
    if (error.response && error.response.status === 404) {
      // Jika 404, dispatch dengan payload kosong tanpa log
      dispatch({
        type: 'FETCH_USER_RECIPES_SUCCESS',
        payload: [], // Kirim array kosong
      })
      return
    }

    // Untuk error lain, log dan dispatch
    console.error('Error fetching user recipes:', error)
    // Dispatch aksi gagal jika terjadi kesalahan
    dispatch({
      type: 'FETCH_USER_RECIPES_FAIL',
      payload:
        error.response?.data?.message || 'Gagal mengambil resep pengguna',
    })
  }
}
