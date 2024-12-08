import { axiosInstance } from '../../utils/axiosInterceptor'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_ADMIN_URL

export const fetchDashboardData = () => async (dispatch) => {
  try {
    // Dispatch request action
    dispatch({ type: 'FETCH_DASHBOARD_REQUEST' })

    // Lakukan request ke backend
    const response = await axiosInstance.get(`${BASE_URL}/dashboard`)

    // Dispatch success action dengan data
    dispatch({
      type: 'FETCH_DASHBOARD_SUCCESS',
      payload: response.data.data,
    })

    return response.data.data
  } catch (error) {
    console.error('Dashboard Data Fetch Error:', error)

    // Dispatch failure action
    dispatch({
      type: 'FETCH_DASHBOARD_FAILURE',
      payload: error.response?.data || error.message,
    })

    throw error
  }
}

export const fetchAllComments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'FETCH_COMMENTS_REQUEST' })

    const response = await axiosInstance.get(`${BASE_URL}/comments`)

    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      payload: response.data.data || [],
    })
  } catch (error) {
    console.error('Fetch comments error:', error)
    dispatch({
      type: 'FETCH_COMMENTS_FAILURE',
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const deleteAdminComment = (commentId) => async (dispatch) => {
  try {
    // Tampilkan konfirmasi sebelum menghapus
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Anda akan menghapus komentar ini dari admin dashboard!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    })

    // Proses penghapusan jika dikonfirmasi
    if (result.isConfirmed) {
      dispatch({ type: 'DELETE_ADM_COMMENT_REQUEST' })

      // Kirim request DELETE untuk menghapus komentar
      const response = await axiosInstance.delete(
        `${BASE_URL}/comments/${commentId}`,
      )

      // Dispatch aksi sukses dengan ID komentar yang dihapus
      dispatch({
        type: 'DELETE_ADM_COMMENT_SUCCESS',
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
    // Dispatch aksi gagal
    dispatch({
      type: 'DELETE_ADM_COMMENT_FAILURE',
      payload: error.response?.data?.error || 'Gagal menghapus komentar',
    })

    // Tampilkan error jika gagal menghapus komentar
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus Komentar',
      text: error.response?.data?.error || 'Terjadi kesalahan',
    })

    throw error
  }
}
