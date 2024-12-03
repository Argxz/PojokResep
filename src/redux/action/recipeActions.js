import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

const BASE_URL = 'http://localhost:3001/api/v1/recipes'

const axiosInstance = setupAxiosInterceptors()
export const createRecipe = (recipeData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}`, recipeData)

    Swal.fire({
      icon: 'success',
      title: 'Resep Berhasil Dibuat',
      text: 'Silahkan lihat hasil resep anda',
      timer: 2000,
    })

    return response.data
  } catch (error) {
    // Handle error
    console.error('Error creating recipe:', error)
    throw error
  }
}
