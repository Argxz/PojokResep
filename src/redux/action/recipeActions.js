import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

const BASE_URL = 'http://localhost:3001/api/v1/recipes'

const axiosInstance = setupAxiosInterceptors()
export const createRecipe = (recipeData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_RECIPE_REQUEST' })

    const response = await axiosInstance.post('/recipes', recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Penting untuk upload file
      },
    })

    dispatch({
      type: 'CREATE_RECIPE_SUCCESS',
      payload: response.data.data,
    })

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

    dispatch({
      type: 'CREATE_RECIPE_FAIL',
      payload: error.response?.data?.message || 'Recipe creation failed',
    })

    // Tampilkan pesan error dari server jika ada
    Swal.fire({
      icon: 'error',
      title: 'Gagal Membuat Resep',
      text:
        error.response?.data?.message || 'Terjadi kesalahan saat membuat resep',
    })

    throw error
  }
}

export const getAllRecipes = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_RECIPES_REQUEST' })

    const response = await axiosInstance.get('/recipes')

    dispatch({
      type: 'GET_RECIPES_SUCCESS',
      payload: response.data.data,
    })

    return response.data.data
  } catch (error) {
    dispatch({
      type: 'GET_RECIPES_FAIL',
      payload: error.response?.data?.message || 'Gagal mengambil resep',
    })

    throw error
  }
}

export const fetchRecipeDetail = (recipeId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`/recipes/${recipeId}`)

    // Pastikan data ada
    if (!response.data) {
      throw new Error('No recipe data received')
    }

    dispatch({
      type: 'FETCH_RECIPE_DETAIL_SUCCESS',
      payload: response.data, // Fleksibel dengan struktur response
    })

    return {
      payload: response.data,
    }
  } catch (error) {
    dispatch({
      type: 'FETCH_RECIPE_DETAIL_FAILURE',
      payload: error.response?.data || error.message,
    })
    throw error
  }
}

export const updateRecipe = (recipeId, formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.put(`/recipes/${recipeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    dispatch({
      type: 'UPDATE_RECIPE_SUCCESS',
      payload: response.data.data,
    })

    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Diperbarui!',
      text: 'Perubahan resep telah disimpan.',
      timer: 2000,
      showConfirmButton: false,
    })

    return response.data.data
  } catch (error) {
    console.error('Update Recipe Error:', error)

    dispatch({
      type: 'UPDATE_RECIPE_FAIL',
      payload: error.response?.data?.error || 'Update recipe failed',
    })

    Swal.fire({
      icon: 'error',
      title: 'Gagal Update Resep',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })

    throw error
  }
}

export const deleteRecipe = (recipeId) => async (dispatch) => {
  try {
    dispatch({ type: 'DELETE_RECIPE_REQUEST' })

    const response = await axiosInstance.delete(`/recipes/${recipeId}`)

    dispatch({
      type: 'DELETE_RECIPE_SUCCESS',
      payload: recipeId,
    })

    // Optional: Tambahkan toast/notification sukses
    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Dihapus',
      timer: 2000,
    })

    return response.data
  } catch (error) {
    dispatch({
      type: 'DELETE_RECIPE_FAIL',
      payload: error.response?.data?.message || 'Gagal menghapus resep',
    })

    // Optional: Tambahkan toast/notification error
    Swal.fire({
      icon: 'error',
      title: 'Gagal Update Resep',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })

    throw error
  }
}

export const fetchUserRecipes = () => async (dispatch, getState) => {
  try {
    const { auth } = getState()
    const userId = auth.user?.id // Tambah optional chaining

    const response = await axiosInstance.get(`${BASE_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    dispatch({
      type: 'FETCH_USER_RECIPES_SUCCESS',
      payload: response.data,
    })
  } catch (error) {
    console.error('Error fetching user recipes:', error)
    dispatch({
      type: 'FETCH_USER_RECIPES_FAILURE',
      payload: error.response?.data || error.message,
    })
    throw error
  }
}
