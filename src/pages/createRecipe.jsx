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
    image: null, // Tambahkan state untuk image
  })

  const [imagePreview, setImagePreview] = useState(null)

  // Tambahkan handler untuk image
  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Validasi ukuran file
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }

      // Validasi tipe file
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ]
      if (!allowedTypes.includes(file.type)) {
        alert('Hanya mendukung file JPEG, PNG, JPG, atau WebP')
        return
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Preview image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

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

    const formDataToSubmit = new FormData()

    // Tambahkan semua field ke FormData
    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        formDataToSubmit.append('image', formData[key])
      } else if (key !== 'image') {
        formDataToSubmit.append(key, formData[key])
      }
    })
    try {
      const createdRecipe = await dispatch(createRecipe(formDataToSubmit))

      // Optional: Reset form atau navigasi
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        cooking_time: '',
        serving_size: '',
        difficulty_level: '',
        category_id: '',
        image: null,
      })
      setImagePreview(null)
      navigate(`/recipe/${createdRecipe.id}`)
    } catch (error) {
      console.error('Full Error:', error)
      console.error('Error Response:', error.response)
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
        <div>
          <label>Recipe Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Recipe
        </button>
      </form>
    </div>
  )
}

export default CreateRecipe
