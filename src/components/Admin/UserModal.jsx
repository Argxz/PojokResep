import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { X, Users, Trash2 } from 'lucide-react'
import { closeUserModal } from '../../redux/action/adminActions'
import { deleteAdminUser } from '../../redux/action/adminActions'

const UserModal = () => {
  const dispatch = useDispatch()
  const { users, userLoading, userError } = useSelector((state) => state.admin)

  const handleClose = () => {
    dispatch(closeUserModal())
  }

  const handleDeleteUser = (userId) => {
    dispatch(deleteAdminUser(userId))
  }

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 relative max-h-[90vh] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex items-center mb-6">
          <Users className="w-10 h-10 text-blue-500 mr-4" />
          <h2 className="text-2xl font-bold text-gray-800">Total Users List</h2>
        </div>

        {userLoading ? (
          <div className="text-center py-10">
            <span className="loading-spinner text-blue-500">Loading...</span>
          </div>
        ) : userError ? (
          <div className="text-red-500 text-center py-10">{userError}</div>
        ) : (
          <div className="overflow-x-auto">
            {Array.isArray(users) && users.length > 0 ? (
              <table className="w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-4 text-left">No</th>
                    <th className="py-3 px-4 text-left">Username</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Registered</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={userLoading}
                          className={`px-3 py-1 rounded ${
                            userLoading
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {userLoading ? (
                            <span className="animate-spin">
                              <Trash2 className="w-5 h-5" />
                            </span>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserModal
