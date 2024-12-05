import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

const BASE_URL = 'http://localhost:3001/api/v1/comments'
const axiosInstance = setupAxiosInterceptors()

export const createComment =
  (recipeId, content) => async (dispatch, getState) => {
    try {
      const { auth } = getState()
      const response = await axiosInstance.post(
        `${BASE_URL}`,
        {
          recipe_id: recipeId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )

      // Refresh comments setelah membuat komentar
      dispatch(fetchCommentsByRecipeId(recipeId))

      return response.data
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membuat Komentar',
        text: error.response?.data?.error || 'Terjadi kesalahan',
      })
      throw error
    }
  }

export const fetchCommentsByRecipeId = (recipeId) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/recipes/${recipeId}`)

    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      payload: {
        comments: response.data.data,
        message: response.data.message,
      },
    })
  } catch (error) {
    // Cek apakah error status adalah 404
    if (error.response && error.response.status === 404) {
      // Jika 404, dispatch dengan array kosong
      dispatch({
        type: 'FETCH_COMMENTS_SUCCESS',
        payload: {
          comments: [],
          message: 'Belum ada komentar',
        },
      })
    } else {
      // Untuk error lainnya, tetap gunakan error handling biasa
      dispatch({
        type: 'FETCH_COMMENTS_FAILURE',
        payload: error.response?.data?.error || 'Gagal mengambil komentar',
      })
    }
  }
}

export const updateComment =
  (commentId, content) => async (dispatch, getState) => {
    try {
      const { auth } = getState()
      const response = await axiosInstance.put(
        `${BASE_URL}/${commentId}`,
        {
          content,
          user_id: auth.user.id, // Tambahkan user_id sesuai backend
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )

      dispatch({
        type: 'UPDATE_COMMENT_SUCCESS',
        payload: response.data.data,
      })

      Swal.fire({
        icon: 'success',
        title: 'Komentar Berhasil Diupdate',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      return response.data.data
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengupdate Komentar',
        text: error.response?.data?.error || 'Terjadi kesalahan',
      })
      throw error
    }
  }

export const deleteComment = (commentId) => async (dispatch, getState) => {
  try {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda tidak dapat mengembalikan komentar yang dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })

    if (result.isConfirmed) {
      const { auth } = getState()
      const response = await axiosInstance.delete(`${BASE_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: {
          user_id: auth.user.id,
        },
      })

      dispatch({
        type: 'DELETE_COMMENT_SUCCESS',
        payload: commentId,
      })

      Swal.fire({
        icon: 'success',
        title: 'Komentar Berhasil Dihapus',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      return response.data
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus Komentar',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })
    throw error
  }
}
