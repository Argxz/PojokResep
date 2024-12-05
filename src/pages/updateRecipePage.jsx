import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import setupAxiosInterceptors from '../utils/axiosInterceptor'
import { updateRecipe, fetchRecipeDetail } from '../redux/action/recipeActions'

const axiosInstance = setupAxiosInterceptors()

const UpdateRecipe = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { recipeId } = useParams()
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
    image: null,
    existing_image: '', // Untuk menyimpan URL gambar existing
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Fetch recipe detail dan categories saat komponen mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipe detail
        const recipeResponse = await dispatch(fetchRecipeDetail(recipeId))
        const recipe = recipeResponse.payload

        // Fetch categories
        const categoriesResponse = await axiosInstance.get(
          'http://localhost:3001/api/v1/categories',
        )

        // Set form data dengan data resep
        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          serving_size: recipe.serving_size,
          difficulty_level: recipe.difficulty_level,
          category_id: recipe.category_id,
          existing_image: recipe.image, // URL gambar existing
          image: null,
        })

        // Set preview gambar
        setImagePreview(recipe.image)

        // Set categories
        setCategories(categoriesResponse.data.data)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [recipeId, dispatch])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      // Validasi ukuran dan tipe file (sama seperti create)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB')
        return
      }

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Buat FormData untuk submit
    const formDataToSubmit = new FormData()

    // Tambahkan field yang berubah
    Object.keys(formData).forEach((key) => {
      // Filter field yang tidak kosong atau berubah
      if (
        formData[key] !== null &&
        formData[key] !== '' &&
        formData[key] !== undefined
      ) {
        // Khusus handling untuk image
        if (key === 'image' && formData[key] instanceof File) {
          formDataToSubmit.append('image', formData[key])
        } else if (key !== 'image') {
          // Konversi ke string untuk field lainnya
          formDataToSubmit.append(key, String(formData[key]))
        }
      }
    })

    try {
      // Set loading state
      setIsLoading(true)

      // Dispatch action update
      const updatedRecipe = await dispatch(
        updateRecipe(recipeId, formDataToSubmit),
      )

      // Navigasi atau refresh
      navigate(`/recipe/${recipeId}`)
    } catch (error) {
      // Error handling
      console.error('Update Recipe Error:', error)
    }
  }
  // Tambahkan loading state
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-6 py-10 bg-gray-50 rounded-lg shadow-lg max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Update Recipe</h1>
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
            <option value="Mudah">Mudah</option>
            <option value="Menengah">Menengah</option>
            <option value="Sulit">Sulit</option>
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
          <label>Current Recipe Image</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Current Recipe"
              className="max-w-full h-auto mb-4 rounded"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Update Recipe
        </button>
      </form>
    </div>
  )
}

export default UpdateRecipe
