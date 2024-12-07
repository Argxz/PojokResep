import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  ChefHat,
  BookOpen,
  Utensils,
  Clock,
  Image as ImageIcon,
} from 'lucide-react'
import { createRecipe } from '../redux/action/recipeActions'
import { fetchCategories } from '../redux/action/categoriesActions'

const CreateRecipe = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { categories, loading, error } = useSelector(
    (state) => state.categories,
  )

  const [activeStep, setActiveStep] = useState(0)
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
  })
  const [imagePreview, setImagePreview] = useState(null)

  // Steps configuration
  const steps = [
    {
      icon: <BookOpen />,
      title: 'Informasi Dasar',
      fields: ['title', 'description'],
    },
    {
      icon: <Utensils />,
      title: 'Bahan & Instruksi',
      fields: ['ingredients', 'instructions'],
    },
    {
      icon: <Clock />,
      title: 'Detail Resep',
      fields: [
        'cooking_time',
        'serving_size',
        'difficulty_level',
        'category_id',
      ],
    },
    {
      icon: <ImageIcon />,
      title: 'Gambar Resep',
      fields: ['image'],
    },
  ]

  // Handlers (gunakan handler yang sudah ada)
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
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

      setFormData((prev) => ({ ...prev, image: file }))

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

  const handleNextStep = () => {
    // Validasi step saat ini sebelum lanjut
    const currentStepFields = steps[activeStep].fields
    const isStepValid = currentStepFields.every(
      (field) => formData[field] !== null && formData[field] !== '',
    )

    if (isStepValid) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
    } else {
      alert('Harap lengkapi semua field pada tahap ini')
    }
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSubmit = new FormData()

    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        formDataToSubmit.append('image', formData[key])
      } else if (key !== 'image') {
        formDataToSubmit.append(key, formData[key])
      }
    })

    try {
      const createdRecipe = await dispatch(createRecipe(formDataToSubmit))
      navigate(`/recipe/${createdRecipe.id}`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Judul Resep
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Masukkan judul resep"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Deskripsi Resep
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Ceritakan sedikit tentang resep ini"
                rows="3"
                required
              ></textarea>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Bahan-Bahan
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Contoh:&#10;250g tepung&#10;2 butir telur&#10;100ml susu"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Langkah Pembuatan
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Contoh:&#10;1. Campur tepung&#10;2. Tambahkan telur&#10;3. Aduk rata"
                rows="4"
                required
              ></textarea>
            </div>
          </>
        )
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Waktu Memasak (menit)
              </label>
              <input
                type="number"
                name="cooking_time"
                value={formData.cooking_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Contoh: 30"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Porsi
              </label>
              <input
                type="number"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                placeholder="Contoh: 4"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Tingkat Kesulitan
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                required
              >
                <option value="">Pilih Tingkat Kesulitan</option>
                <option value="Mudah">Mudah</option>
                <option value="Menengah">Menengah</option>
                <option value="Sulit">Sulit</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Kategori
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Gambar Resep
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
              >
                <Upload className="mr-2" /> Unggah Gambar
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="ml-4 rounded-lg"
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="relative bg-white shadow-[0_0_15px_rgba(34,197,94,0.5),0_0_25px_rgba(22,163,74,0.4)] border-2 border-green-300 rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600 flex items-center justify-center">
          <ChefHat className="mr-3" /> Buat Resep Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNextStep
              }
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              {activeStep === steps.length - 1 ? 'Kirim' : 'Selanjutnya'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRecipe
