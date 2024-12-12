// Impor library yang dibutuhkan
import Swal from 'sweetalert2'
import { axiosInstance } from '../../utils/axiosInterceptor'

// Ambil URL basis dari environment variable
const BASE_URL = import.meta.env.VITE_RATING_URL

/**
 * Aksi untuk mengirim rating resep
 * @param {number} recipeId - ID resep yang akan diberi rating
 * @param {number} value - Nilai rating
 */
export const submitRating = (recipeId, value) => async (dispatch, getState) => {
  try {
    // Ambil token otentikasi dari state
    const { auth } = getState()

    // Kirim permintaan POST untuk rating
    const response = await axiosInstance.post(
      `${BASE_URL}`,
      {
        recipe_id: recipeId,
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      },
    )

    // Dispatch aksi sukses dengan data rating
    dispatch({
      type: 'SUBMIT_RATING_SUCCESS',
      payload: {
        userRating: response.data.userRating,
        updatedRatings: response.data.updatedRatings,
      },
    })

    // Tampilkan notifikasi sukses
    Swal.fire({
      icon: 'success',
      title: 'Rating Berhasil Disimpan',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 500,
    }).then(() => {
      // Muat ulang halaman setelah notifikasi
      window.location.reload()
    })

    return response.data
  } catch (error) {
    // Tangani kesalahan dan tampilkan pesan error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memberi Rating',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })
    throw error
  }
}

/**
 * Aksi untuk mengambil rating pengguna untuk resep tertentu
 * @param {number} recipeId - ID resep yang akan dicari ratingnya
 */
export const fetchUserRatingForRecipe =
  (recipeId) => async (dispatch, getState) => {
    try {
      const { auth } = getState()

      const response = await axiosInstance.get(`${BASE_URL}/user/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      dispatch({
        type: 'FETCH_USER_RATING_SUCCESS',
        payload: {
          userRating: response.data.userRating,
        },
      })

      return response.data
    } catch (error) {
      dispatch({
        type: 'FETCH_USER_RATING_SUCCESS',
        payload: {
          userRating: null,
        },
      })

      return { userRating: null }
    }
  }

/**
 * Aksi untuk mengambil rating resep
 * @param {number} recipeId - ID resep yang akan dicari ratingnya
 */
export const fetchRecipeRatings = (recipeId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/recipes/${recipeId}`)

    const ratings = response.data.data || []
    dispatch({
      type: 'FETCH_RECIPE_RATINGS_SUCCESS',
      payload: ratings,
    })
  } catch (error) {
    console.error('Error fetching recipe ratings:', error)
    if (error.response && error.response.status === 404) {
      dispatch({
        type: 'FETCH_RECIPE_RATINGS_SUCCESS',
        payload: [],
      })
    } else {
      dispatch({
        type: 'FETCH_RECIPE_RATINGS_FAILURE',
        payload: error.response?.data?.error || 'Gagal mengambil rating',
      })
    }
  }
}
