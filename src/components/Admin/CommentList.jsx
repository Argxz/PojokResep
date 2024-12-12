import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllComments,
  deleteAdminComment,
} from '../../redux/action/adminActions'
import { Trash2 } from 'lucide-react'

const CommentsList = () => {
  const dispatch = useDispatch()
  const { comments, loading, error, commentsFetched } = useSelector(
    (state) => state.admin,
  )

  // Memoisasi fetch comments
  const fetchComments = useCallback(() => {
    dispatch(fetchAllComments())
  }, [dispatch])

  const handleDeleteComment = (commentId) => {
    dispatch(deleteAdminComment(commentId))
  }

  useEffect(() => {
    if (!commentsFetched) {
      fetchComments()
    }
  }, [commentsFetched, fetchComments])

  if (loading && comments.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    )
  }
  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Semua Komentar</h2>
        <button
          onClick={fetchComments}
          className="text-blue-500 hover:text-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-gray-500">Tidak Ada Komentar</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Resep</th>
                <th className="py-2 px-4 text-left">Komentar</th>
                <th className="py-2 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {comment.user?.username || 'Anonymous'}
                  </td>
                  <td className="py-2 px-4">
                    {comment.recipe?.title || 'Deleted Recipe'}
                  </td>
                  <td className="py-2 px-4 truncate max-w-xs">
                    {comment.content}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CommentsList
