import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Clock, Users, ChefHat, Utensils, Edit, Trash2 } from 'lucide-react'
import { fetchRecipeDetail, deleteRecipe } from '../redux/action/recipeActions'
import { fetchUserProfile } from '../redux/action/userActions'
import { fetchRecipeRatings } from '../redux/action/ratingActions'
import { Typography, Box, CircularProgress } from '@mui/material'
import CommentSection from '../components/Recipes/commentSection'
import StarRating from '../components/Recipes/starRating'
import Swal from 'sweetalert2'

/**
 * Halaman Detail Resep
 * @component
 * @returns {JSX.Element} Komponen halaman detail resep
 */
const RecipeDetailPage = () => {
  const dispatch = useDispatch()
  const { recipeId } = useParams()
  const navigate = useNavigate()

  // State untuk modal konfirmasi
  const [showModal, setShowModal] = useState(false)

  // Selector untuk mengambil data dari state global
  const recipe = useSelector((state) => state.recipe.currentRecipe)
  const authUser = useSelector((state) => state.auth.user)
  const error = useSelector((state) => state.recipe.error)
  const authLoading = useSelector((state) => state.auth.loading)
  const recipeLoading = useSelector((state) => state.recipe.loading)
  const ratings = useSelector((state) => state.rating.ratings)

  /**
   * Menghitung rating user saat ini
   */
  const userRatingValue = useMemo(() => {
    if (!Array.isArray(ratings) || !authUser) return 0

    const userRating = ratings.find((rating) => rating.user_id === authUser.id)
    return userRating ? userRating.value : 0
  }, [ratings, authUser])

  /**
   * Menghitung rating rata-rata resep
   */
  const recipeRating = useMemo(() => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0

    const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0)
    return totalRating / ratings.length
  }, [ratings])

  // Ambil data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchRecipeDetail(recipeId))
        await dispatch(fetchUserProfile())
        await dispatch(fetchRecipeRatings(recipeId))
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      }
    }

    fetchData()
  }, [dispatch, recipeId])

  /**
   * Periksa apakah pengguna adalah pemilik resep
   * @returns {boolean} Status kepemilikan resep
   */
  const checkIsRecipeOwner = () => {
    return authUser && recipe && authUser.id === recipe.user_id
  }

  const isRecipeOwner = checkIsRecipeOwner()

  // Tampilan loading
  if (authLoading || recipeLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  // Handler untuk edit resep
  const handleEditRecipe = () => {
    navigate(`/recipe/edit/${recipeId}`)
  }

  // Handler untuk menampilkan modal hapus
  const handleDeleteRecipe = () => {
    Swal.fire({
      title: 'Konfirmasi Hapus Resep',
      text: 'Apakah Anda yakin ingin menghapus resep ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete()
      }
    })
  }

  // Konfirmasi dan proses penghapusan resep
  const confirmDelete = async () => {
    try {
      await dispatch(deleteRecipe(recipeId))

      Swal.fire({
        icon: 'success',
        title: 'Resep Berhasil Dihapus',
        showConfirmButton: false,
        timer: 1500,
      })

      navigate('/recipe')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus Resep',
        text: error.message,
      })
    }
  }

  // Tangani error
  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    )
  }
  if (!recipe) return <div>Resep tidak ditemukan</div>

  /**
   * Memformat teks menjadi daftar
   * @param {string} text - Teks yang akan diformat
   * @returns {string[]} Daftar item
   */
  const formatList = (text) => {
    if (!text) return []
    return text.split('\n').filter((item) => item.trim() !== '')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Struktur layout detail resep */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Kolom utama detail resep */}
        <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Konten detail resep */}
          {/* Header Image */}
          <div className="relative group">
            <img
              src={
                recipe.image_url
                  ? `http://localhost:3001${recipe.image_url}`
                  : '/null.png'
              }
              alt={recipe.title}
              className="w-full h-[450px] md:h-[500px] lg:h-[600px] object-contain bg-gray-100 rounded-lg"
            />
            <div
              className="absolute inset-0 
              bg-gradient-to-b from-transparent to-black/70 
              rounded-lg opacity-100 group-hover:opacity-0 
              transition-opacity duration-300 
              flex items-end p-6"
            >
              <h1
                className="text-3xl font-bold text-white 
                shadow-lg shadow-black/50 
                backdrop-blur-sm bg-white/15 p-3 rounded-lg"
              >
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={
                    recipe.user?.profile_picture
                      ? `http://localhost:3001/uploads/profile_pictures/${recipe.user.profile_picture}`
                      : '/user.png'
                  }
                  alt={recipe.user?.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{recipe.user?.username}</p>
                  <p className="text-gray-600">Recipe Creator</p>
                  {/* Tampilkan rating rata-rata */}
                  <div className="flex items-center">
                    <StarRating
                      value={recipeRating || 0}
                      userRatingValue={userRatingValue}
                      editable={authUser && authUser.id !== recipe.user_id}
                      recipeId={recipeId}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-semibold">
                      ({(recipeRating || 0).toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      / 5) · {ratings.length || '0'} Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Edit */}
              {isRecipeOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditRecipe}
                    className="flex items-center bg-blue-500 text-white 
                    px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <Edit className="mr-2" /> Edit Resep
                  </button>
                  <button
                    onClick={handleDeleteRecipe}
                    className="flex items-center bg-red-500 text-white 
                    px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="mr-2" /> Hapus Resep
                  </button>
                </div>
              )}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                  <div className="relative w-auto max-w-sm mx-auto my-6">
                    <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                      <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                        <h3 className="text-xl font-semibold">
                          Konfirmasi Hapus Resep
                        </h3>
                        <button
                          className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          ×
                        </button>
                      </div>
                      <div className="relative flex-auto p-6">
                        <p className="my-4 text-blueGray-500">
                          Apakah Anda yakin ingin menghapus resep ini?
                        </p>
                      </div>
                      <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                        <button
                          className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-gray-600 uppercase 
    transition-all duration-300 ease-in-out 
    hover:bg-gray-100 hover:text-gray-900 
    rounded-md"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Batal
                        </button>
                        <button
                          className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase 
    bg-red-500 
    transition-all duration-300 ease-in-out 
    hover:bg-red-600 
    active:bg-red-700 
    rounded-md 
    shadow-md hover:shadow-lg"
                          type="button"
                          onClick={confirmDelete}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recipe Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="mr-2 text-blue-500" />
                <span>{recipe.cooking_time} Menit </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 text-green-500" />
                <span>{recipe.serving_size} Porsi</span>
              </div>
              <div className="flex items-center">
                <ChefHat className="mr-2 text-red-500" />
                <span>{recipe.difficulty_level}</span>
              </div>
              <div className="flex items-center">
                <Utensils className="mr-2 text-purple-500" />
                <span>{recipe.category?.name || 'No Category'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700">{recipe.description}</p>
            </div>

            {/* Ingredients dengan efek hover */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formatList(recipe.ingredients).map((ingredient, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-bold text-red-600 mr-2">▣</span>
                    <span className="font-semibold text-gray-800">
                      {ingredient}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Petunjuk Memasak</h2>
              <ol className="space-y-4">
                {formatList(recipe.instructions).map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start bg-gray-50 p-4 rounded-lg"
                  >
                    <span
                      className="mr-4 text-2xl font-bold text-green-600 
          min-w-[40px] text-center"
                    >
                      {index + 1}.
                    </span>
                    <p className="text-gray-800">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Kolom komentar */}
        <div className="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 h-fit md:top-8">
          <CommentSection recipeId={recipeId} />
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
