import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

const BASE_URL = 'http://localhost:3001/api/v1/ratings'
const axiosInstance = setupAxiosInterceptors()

export const submitRating = (recipeId, value) => async (dispatch, getState) => {
  try {
    const { auth } = getState()
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

    dispatch({
      type: 'SUBMIT_RATING_SUCCESS',
      payload: {
        userRating: response.data.userRating,
        updatedRatings: response.data.updatedRatings,
      },
    })

    // Optional: Tampilkan toast sukses
    Swal.fire({
      icon: 'success',
      title: 'Rating Berhasil Disimpan',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 500,
    }).then(() => {
      window.location.reload()
    })

    return response.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memberi Rating',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })
    throw error
  }
}

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
      // Khusus 404 untuk belum ada rating
      if (error.response && error.response.status === 404) {
        dispatch({
          type: 'FETCH_USER_RATING_SUCCESS',
          payload: {
            userRating: null,
          },
        })
        return { userRating: null }
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengambil Rating',
        text: error.response?.data?.error || 'Terjadi kesalahan',
      })
      throw error
    }
  }

export const fetchRecipeRatings = (recipeId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/recipes/${recipeId}`)

    console.log('API Response:', response.data) // Tambahkan logging

    dispatch({
      type: 'FETCH_RECIPE_RATINGS_SUCCESS',
      payload: response.data, // Kirim seluruh data dari response
    })
  } catch (error) {
    console.error('Fetch Ratings Error:', error.response?.data || error.message)
    dispatch({
      type: 'FETCH_RECIPE_RATINGS_FAILURE',
      payload: error.response?.data?.error || 'Failed to fetch ratings',
    })
  }
}
