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
