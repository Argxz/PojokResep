import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import setupAxiosInterceptors from '../utils/axiosInterceptor'
import { createRecipe } from '../redux/action/recipeActions'

const axiosInstance = setupAxiosInterceptors()

const CreateRecipe = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: '',
    serving_size: '',
    difficulty_level: '',
    category_id: '',
  })

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Gunakan axiosInstance bukan axios langsung
        const response = await axiosInstance.get(
          'http://localhost:3001/api/v1/categories',
        )
        setCategories(response.data.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const recipeData = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        cooking_time: formData.cooking_time.toString(), // Konversi ke string
        serving_size: formData.serving_size.toString(), // Konversi ke string
        difficulty_level: formData.difficulty_level,
        category_id: parseInt(formData.category_id),
      }

      const response = await dispatch(createRecipe(recipeData))
      //   navigate('/recipes') // Redirect setelah berhasil
    } catch (error) {
      console.error('Full Error:', error)
      console.error('Error Response:', error.response)

      // Log detail error dari server
      if (error.response) {
        // Server responded with an error
        console.error('Server Error Data:', error.response.data)
        console.error('Server Error Status:', error.response.status)
        console.error('Server Error Headers:', error.response.headers)

        alert(
          `Server Error: ${
            error.response.data.message || 'Unknown server error'
          }`,
        )
      }
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-gray-50 rounded-lg shadow-lg max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Ingredients</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">Cooking Time (minutes)</label>
          <input
            type="number"
            name="cooking_time"
            value={formData.cooking_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Serving Size</label>
          <input
            type="number"
            name="serving_size"
            value={formData.serving_size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Difficulty Level</label>
          <select
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Recipe
        </button>
      </form>
    </div>
  )
}

export default CreateRecipe
