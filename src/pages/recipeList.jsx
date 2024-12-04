import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllRecipes } from '../redux/action/recipeActions'

const ListRecipes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    recipes = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.recipe || {})

  useEffect(() => {
    dispatch(getAllRecipes())
  }, [dispatch])

  const handleRecipeClick = (recipeId) => {
    // Navigasi ke halaman detail resep
    navigate(`/recipe/${recipeId}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {recipes.length === 0 ? (
        <div>Tidak ada resep</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden 
                         transition-all duration-300 ease-in-out 
                         hover:shadow-xl hover:scale-105 
                         cursor-pointer"
            >
              <div>
                <div className="relative overflow-hidden">
                  <img
                    src={
                      recipe.image_url
                        ? `http://localhost:3001/recipes/${recipe.image_url}`
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
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {recipe.category?.name || 'No Category'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListRecipes
