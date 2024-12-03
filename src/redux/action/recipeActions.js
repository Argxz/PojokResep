import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

const BASE_URL = 'http://localhost:3001/api/v1/recipes'

const axiosInstance = setupAxiosInterceptors()
export const createRecipe = (recipeData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_RECIPE_REQUEST' })

    const response = await axiosInstance.post('/recipes', recipeData)

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
    dispatch({
      type: 'CREATE_RECIPE_FAIL',
      payload: error.response?.data?.message || 'Recipe creation failed',
    })

    throw error
  }
}
