import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2 } from 'lucide-react'
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
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Komentar</h3>

      {/* Form Komentar */}
      {authUser ? (
        <form
          onSubmit={editingComment ? handleUpdateComment : handleSubmitComment}
          className="mb-6"
        >
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full p-3 border rounded-lg"
            rows="4"
            maxLength={500}
          />
          <div className="flex space-x-2 mt-2">
            {editingComment ? (
              <>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingComment(null)
                    setCommentContent('')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Kirim Komentar
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="text-gray-600">Silakan login untuk membuat komentar</p>
      )}

      {/* Daftar Komentar */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">
            {commentMessage || 'Belum ada komentar'}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg shadow-md relative"
            >
              <div className="flex items-center mb-2">
                <img
                  src={
                    comment.user?.profile_picture
                      ? `http://localhost:3001/uploads/profile_pictures/${comment.user.profile_picture}`
                      : '/user.png'
                  }
                  alt={comment.user?.username}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold">{comment.user?.username}</span>
              </div>
              <p>{comment.content}</p>

              {/* Tombol Edit dan Delete */}
              {authUser && authUser.id === comment.user_id && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => handleEditComment(comment)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
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
