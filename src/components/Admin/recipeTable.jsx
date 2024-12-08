import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2 } from 'lucide-react'
import {
  fetchAllRecipes,
  deleteAdminRecipe,
} from '../../redux/action/adminActions'

const RecipeTables = () => {
  const dispatch = useDispatch()
  const { recipes, loading, error, recipesFetched } = useSelector(
    (state) => state.admin,
  )

  // Memoisasi fetch recipes
  const fetchRecipes = useCallback(() => {
    dispatch(fetchAllRecipes())
  }, [dispatch])

  const handleDeleteRecipe = (recipeId) => {
    dispatch(deleteAdminRecipe(recipeId))
  }

  useEffect(() => {
    if (!recipesFetched) {
      fetchRecipes()
    }
  }, [recipesFetched, fetchRecipes])

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  if (loading && recipes.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    )
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
        <h2 className="text-2xl font-bold">Semua Resep</h2>
        <button
          onClick={fetchRecipes}
          className="text-blue-500 hover:text-blue-700"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500">Tidak Ada Resep</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Judul</th>
                <th className="py-2 px-4 text-left">Penulis</th>
                <th className="py-2 px-4 text-left">Tanggal Dibuat</th>
                <th className="py-2 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{recipe.title}</td>
                  <td className="py-2 px-4">
                    {recipe.user?.username || 'Anonymous'}
                  </td>
                  <td className="py-2 px-4">{formatDate(recipe.createdAt)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Recipe"
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

export default RecipeTables
