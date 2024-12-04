import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Clock, Users, ChefHat, Tag, Edit } from 'lucide-react'
import { fetchRecipeDetail } from '../redux/action/recipeActions'
import { fetchUserProfile } from '../redux/action/userActions'

const RecipeDetailPage = () => {
  const dispatch = useDispatch()
  const { recipeId } = useParams()

  const recipe = useSelector((state) => state.recipe.currentRecipe)
  const loading = useSelector((state) => state.recipe.loading)
  const error = useSelector((state) => state.recipe.error)
  const currentUser = useSelector((state) => state.auth.profile)
  const authLoading = useSelector((state) => state.auth.loading)
  const recipeLoading = useSelector((state) => state.recipe.loading)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipe detail
        await dispatch(fetchRecipeDetail(recipeId))

        // Fetch user profile
        await dispatch(fetchUserProfile())
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [dispatch, recipeId])

  const checkIsRecipeOwner = () => {
    // Cek dengan multiple kondisi
    const isOwnerByUsername = currentUser?.username === recipe?.user?.username
    const isOwnerByEmail = currentUser?.email === recipe?.user?.email

    const isOwner = isOwnerByUsername || isOwnerByEmail

    return isOwner
  }

  const isRecipeOwner = checkIsRecipeOwner()

  // Loading state
  if (authLoading || recipeLoading) {
    return <div>Loading...</div>
  }

  // Fungsi untuk handle edit recipe
  const handleEditRecipe = () => {
    navigate(`/recipe/edit/${recipeId}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!recipe) return <div>Recipe not found</div>

  // Fungsi untuk memformat ingredients dan instructions
  const formatList = (text) => {
    return text.split('\n').filter((item) => item.trim() !== '')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Image */}
        <div className="relative group">
          <img
            src={
              recipe.image_url
                ? `http://localhost:3001${recipe.image_url}`
                : '/null.png'
            }
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg"
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
              </div>
            </div>
            {/* Tombol Edit */}
            {isRecipeOwner && (
              <button
                onClick={handleEditRecipe}
                className="flex items-center bg-blue-500 text-white 
          px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <Edit className="mr-2" /> Edit Resep
              </button>
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
              <Tag className="mr-2 text-purple-500" />
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
                  <span className="font-bold text-red-600 mr-2">♦</span>
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
    </div>
  )
}

export default RecipeDetailPage
