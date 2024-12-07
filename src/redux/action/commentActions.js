import Swal from 'sweetalert2'
import setupAxiosInterceptors from '../../utils/axiosInterceptor'

// URL basis untuk endpoint komentar dari environment variable
const BASE_URL = import.meta.env.VITE_COMMENT_URL

// Inisialisasi axios dengan interceptor
const axiosInstance = setupAxiosInterceptors()

/**
 * Action creator untuk membuat komentar baru
 * @param {number} recipeId - ID resep yang akan diberi komentar
 * @param {string} content - Isi komentar
 * @returns {Function} Fungsi dispatch Redux
 */
export const createComment =
  (recipeId, content) => async (dispatch, getState) => {
    try {
      // Ambil token dari state auth
      const { auth } = getState()

      // Kirim request POST untuk membuat komentar
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

      // Refresh daftar komentar setelah membuat komentar baru
      dispatch(fetchCommentsByRecipeId(recipeId))

      // Tampilkan notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Comment berhasil disubmit',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      })

      return response.data
    } catch (error) {
      // Tampilkan error jika gagal membuat komentar
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membuat Komentar',
        text: error.response?.data?.error || 'Terjadi kesalahan',
      })
      throw error
    }
  }

/**
 * Action creator untuk mengambil komentar berdasarkan ID resep
 * @param {number} recipeId - ID resep yang akan diambil komentarnya
 * @returns {Function} Fungsi dispatch Redux
 */
export const fetchCommentsByRecipeId = (recipeId) => async (dispatch) => {
  try {
    // Ambil komentar untuk resep tertentu
    const response = await axiosInstance.get(`${BASE_URL}/recipes/${recipeId}`)

    // Dispatch aksi sukses dengan data komentar
    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      payload: {
        comments: response.data.data,
        message: response.data.message,
      },
    })
  } catch (error) {
    // Tangani kasus khusus untuk error 404 (tidak ada komentar)
    if (error.response && error.response.status === 404) {
      dispatch({
        type: 'FETCH_COMMENTS_SUCCESS',
        payload: {
          comments: [],
          message: 'Belum ada komentar',
        },
      })
    } else {
      // Dispatch aksi gagal untuk error lainnya
      dispatch({
        type: 'FETCH_COMMENTS_FAILURE',
        payload: error.response?.data?.error || 'Gagal mengambil komentar',
      })
    }
  }
}

/**
 * Action creator untuk mengupdate komentar
 * @param {number} commentId - ID komentar yang akan diupdate
 * @param {string} content - Isi komentar baru
 * @returns {Function} Fungsi dispatch Redux
 */
export const updateComment =
  (commentId, content) => async (dispatch, getState) => {
    try {
      // Ambil token dan user ID dari state auth
      const { auth } = getState()

      // Kirim request PUT untuk update komentar
      const response = await axiosInstance.put(
        `${BASE_URL}/${commentId}`,
        {
          content,
          user_id: auth.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      )

      // Dispatch aksi sukses dengan data komentar yang diupdate
      dispatch({
        type: 'UPDATE_COMMENT_SUCCESS',
        payload: response.data.data,
      })

      // Tampilkan notifikasi sukses
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
      // Tampilkan error jika gagal update komentar
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengupdate Komentar',
        text: error.response?.data?.error || 'Terjadi kesalahan',
      })
      throw error
    }
  }

/**
 * Action creator untuk menghapus komentar
 * @param {number} commentId - ID komentar yang akan dihapus
 * @returns {Function} Fungsi dispatch Redux
 */
export const deleteComment = (commentId) => async (dispatch, getState) => {
  try {
    // Tampilkan konfirmasi sebelum menghapus
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

    // Proses penghapusan jika dikonfirmasi
    if (result.isConfirmed) {
      // Ambil token dan user ID dari state auth
      const { auth } = getState()

      // Kirim request DELETE untuk menghapus komentar
      const response = await axiosInstance.delete(`${BASE_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: {
          user_id: auth.user.id,
        },
      })

      // Dispatch aksi sukses dengan ID komentar yang dihapus
      dispatch({
        type: 'DELETE_COMMENT_SUCCESS',
        payload: commentId,
      })

      // Tampilkan notifikasi sukses
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
    // Tampilkan error jika gagal menghapus komentar
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus Komentar',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })
    throw error
  }
}
