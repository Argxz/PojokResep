import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllRecipes } from '../redux/action/recipeActions'
import RecipeSearchBar from '../components/Recipes/Searchbar'
import { Chip } from '@mui/material'

const ListRecipes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [filteredRecipes, setFilteredRecipes] = useState([])
  const { recipes, pagination, loading, error } = useSelector(
    (state) => state.recipe,
  )

  useEffect(() => {
    dispatch(getAllRecipes(currentPage))
  }, [currentPage, dispatch])

  const handlePageChange = async (pageNumber) => {
    setIsLoading(true)

    // Scroll ke atas halaman dengan smooth behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    try {
      // Simulasi delay untuk efek visual
      await new Promise((resolve) => setTimeout(resolve, 300))

      setCurrentPage(pageNumber)
    } catch (error) {
      console.error('Page change error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Pastikan recipes sudah ada sebelum di-set
    if (recipes && recipes.length > 0) {
      setFilteredRecipes(recipes)
    }
  }, [recipes])

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  const handleSearch = (searchTerm) => {
    if (!recipes || recipes.length === 0) return

    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.category?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        recipe.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredRecipes(filtered)
  }

  if (loading) return <div></div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl -mt-10 md:-mt-16 lg:-mt-10">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}
      <RecipeSearchBar onSearch={handleSearch} />

      {filteredRecipes.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Resep Tidak Ditemukan</h2>
          <p className="text-gray-400">
            Coba kata kunci pencarian lain atau buat resep baru
          </p>
        </div>
      ) : (
        <div>
          <div
            className={`
    grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6
    transition-all duration-500 ease-in-out
    ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
  `}
          >
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe.id)}
                className={`
   transform transition-all duration-300 
   ${isLoading ? 'blur-sm' : 'blur-none'}
   cursor-pointer group
 `}
              >
                {/* Konten kartu resep seperti sebelumnya */}
                <div
                  className="bg-white rounded-lg shadow-md overflow-hidden 
                   transition-all duration-300 ease-in-out 
                   hover:shadow-xl hover:scale-105 
                   cursor-pointer group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        recipe.image_url
                          ? `http://localhost:3001${recipe.image_url}`
                          : '/null.png'
                      }
                      alt={recipe.title}
                      className="w-full h-48 object-cover 
                                 transition-transform duration-300 
                                 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-black opacity-0 
                                  group-hover:opacity-20 
                                  transition-opacity duration-300"
                    ></div>
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={
                            recipe.user?.profile_picture
                              ? `http://localhost:3001/uploads/profile_pictures/${recipe.user.profile_picture}`
                              : '/user.png'
                          }
                          alt={recipe.user?.username || 'User'}
                          className="w-10 h-10 rounded-full object-cover mr-2"
                        />
                        <span className="text-sm">
                          {recipe.user?.username || 'Unknown User'}
                        </span>
                      </div>
                      <div className="text-right">
                        <h2 className="text-base font-bold mb-1">
                          {recipe.title}
                        </h2>
                        <Chip
                          label={recipe.category?.name || 'Tidak Berkategori'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            color: '#2196f3',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            fontWeight: 'medium',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div
              className="flex justify-center items-center space-x-2 mt-6 
    transition-all duration-500 ease-in-out"
            >
              {/* Tombol Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
        px-4 py-2 text-sm font-medium text-gray-700 
        bg-white rounded-md border border-gray-300 
        hover:bg-gray-50 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-300
        ${isLoading ? 'pointer-events-none' : ''}
      `}
              >
                Previous
              </button>

              {/* Nomor Halaman */}
              <div className="flex space-x-1">
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`
            w-10 h-10 rounded-full flex items-center justify-center 
            text-sm font-semibold transition-all duration-300
            ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }
            ${isLoading ? 'opacity-50' : ''}
          `}
                    disabled={isLoading}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Tombol Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages || isLoading}
                className={`
        px-4 py-2 text-sm font-medium text-gray-700 
        bg-white rounded-md border border-gray-300 
        hover:bg-gray-50 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all duration-300
        ${isLoading ? 'pointer-events-none' : ''}
      `}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ListRecipes
