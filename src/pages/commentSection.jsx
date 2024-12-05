import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Edit,
  Trash2,
  MessageCircle,
  Send,
  Save,
  X,
  LogIn,
  MessageSquare,
} from 'lucide-react'
import {
  createComment,
  fetchCommentsByRecipeId,
  updateComment,
  deleteComment,
} from '../redux/action/commentActions'

const CommentSection = ({ recipeId }) => {
  const dispatch = useDispatch()
  const [commentContent, setCommentContent] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const comments = useSelector((state) => state.comment.comments)
  const commentMessage = useSelector((state) => state.comment.message)
  const authUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(fetchCommentsByRecipeId(recipeId))
  }, [dispatch, recipeId])

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!commentContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Komentar Kosong',
        text: 'Silakan tulis komentar terlebih dahulu',
      })
      return
    }

    try {
      await dispatch(createComment(recipeId, commentContent))
      setCommentContent('')
    } catch (error) {
      console.error('Gagal membuat komentar', error)
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment)
    setCommentContent(comment.content)
  }

  const handleUpdateComment = async () => {
    if (!commentContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Komentar Kosong',
        text: 'Silakan tulis komentar terlebih dahulu',
      })
      return
    }

    try {
      await dispatch(updateComment(editingComment.id, commentContent))
      setEditingComment(null)
      setCommentContent('')
    } catch (error) {
      console.error('Gagal mengupdate komentar', error)
    }
  }

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
  }

  return (
    <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <MessageCircle className="mr-3 text-blue-500" />
        Komentar
      </h3>

      {/* Form Komentar */}
      {authUser ? (
        <form
          onSubmit={editingComment ? handleUpdateComment : handleSubmitComment}
          className="mb-6 relative"
        >
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full p-4 pr-12 border-2 border-gray-200 
            rounded-lg focus:outline-none focus:border-blue-500 
            transition duration-300 resize-none"
            rows="4"
            maxLength={500}
          />
          <span className="absolute bottom-2 right-4 text-gray-400">
            {commentContent.length}/500
          </span>
          <div className="flex space-x-2 mt-3">
            {editingComment ? (
              <>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 
                  rounded-lg hover:bg-green-600 transition flex items-center"
                >
                  <Save className="mr-2" /> Simpan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingComment(null)
                    setCommentContent('')
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 
                  rounded-lg hover:bg-gray-300 transition flex items-center"
                >
                  <X className="mr-2" /> Batal
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 
                rounded-lg hover:bg-blue-600 transition flex items-center"
              >
                <Send className="mr-2" /> Kirim Komentar
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">
            <LogIn className="inline mr-2" />
            Silakan login untuk membuat komentar
          </p>
        </div>
      )}

      {/* Daftar Komentar */}
      <div className="space-y-4 mt-6">
        {comments.length === 0 ? (
          <div className="text-center bg-gray-100 p-6 rounded-lg">
            <MessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-500">
              {commentMessage || 'Belum ada komentar'}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 p-4 rounded-lg border-l-4 
              border-blue-400 hover:shadow-md transition duration-300"
            >
              <div className="flex items-center mb-2">
                <img
                  src={
                    comment.user?.profile_picture
                      ? `http://localhost:3001/uploads/profile_pictures/${comment.user.profile_picture}`
                      : '/user.png'
                  }
                  alt={comment.user?.username}
                  className="w-10 h-10 rounded-full mr-3 border-2 border-blue-200"
                />
                <div>
                  <span className="font-semibold text-gray-800">
                    {comment.user?.username}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {/* Tambahkan waktu komentar jika ada */}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>

              {/* Tombol Edit dan Delete */}
              {authUser && authUser.id === comment.user_id && (
                <div className="flex space-x-2 mt-2 justify-end">
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
