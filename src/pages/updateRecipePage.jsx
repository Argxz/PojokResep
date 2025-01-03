import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Upload, ChefHat } from 'lucide-react'
import { updateRecipe, fetchRecipeDetail } from '../redux/action/recipeActions'
import { fetchCategories } from '../redux/action/categoriesActions'
import Swal from 'sweetalert2'

/**
 * Komponen untuk mengupdate resep
 * @component
 * @returns {JSX.Element} Formulir update resep
 */
const UpdateRecipe = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { recipeId } = useParams()

  // Selector untuk kategori
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  )

  // State untuk data formulir
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
    existing_image: '',
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)

  // Ambil data kategori dan detail resep
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch untuk fetch categories
        await dispatch(fetchCategories())

        // Fetch detail resep
        const recipeResponse = await dispatch(fetchRecipeDetail(recipeId))
        const recipe = recipeResponse.payload

        // Set data formulir
        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time,
          serving_size: recipe.serving_size,
          difficulty_level: recipe.difficulty_level,
          category_id: recipe.category_id,
          existing_image: recipe.image,
          image: null,
        })

        // Set preview gambar
        setImagePreview(
          recipe.image ? `http://localhost:3001${recipe.image}` : null,
        )
        setLoading(false)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Resep',
          text: 'Terjadi kesalahan saat memuat detail resep',
        })
        setLoading(false)
      }
    }

    fetchData()
  }, [recipeId, dispatch])

  /**
   * Menangani perubahan gambar
   * @param {Event} e - Event perubahan input file
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi ukuran file
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Ukuran File Terlalu Besar',
          text: 'Maksimal ukuran file adalah 5MB',
        })
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
        Swal.fire({
          icon: 'error',
          title: 'Tipe File Tidak Didukung',
          text: 'Hanya mendukung file JPEG, PNG, JPG, atau WebP',
        })
        return
      }

      // Set data gambar
      setFormData((prev) => ({ ...prev, image: file }))

      // Buat preview gambar
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Menangani perubahan input formulir
   * @param {Event} e - Event perubahan input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  /**
   * Mengirim formulir update resep
   * @param {Event} e - Event submit formulir
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi formulir
    const requiredFields = [
      'title',
      'description',
      'ingredients',
      'instructions',
      'cooking_time',
      'serving_size',
      'difficulty_level',
      'category_id',
    ]
    const isFormValid = requiredFields.every((field) => formData[field])

    if (!isFormValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulir Tidak Lengkap',
        text: 'Harap lengkapi semua field sebelum mengirim',
      })
      return
    }

    // Konversi data ke FormData
    const formDataToSubmit = new FormData()

    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key]) {
        formDataToSubmit.append('image', formData[key])
      } else if (key !== 'image' && key !== 'existing_image') {
        formDataToSubmit.append(key, formData[key])
      }
    })

    try {
      // Dispatch aksi update resep
      await dispatch(updateRecipe(recipeId, formDataToSubmit))

      // Notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Resep Berhasil Diupdate',
        text: 'Anda akan dialihkan ke halaman resep',
        timer: 2000,
        showConfirmButton: false,
      })

      // Navigasi ke halaman detail resep
      navigate(`/recipe/${recipeId}`)
    } catch (error) {
      // Tangani error
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengupdate Resep',
        text: error.message || 'Terjadi kesalahan saat mengupdate resep',
      })
    }
  }

  // Tampilan loading
  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="relative bg-white shadow-[0_0_15px_rgba(34,197,94,0.5),0_0_25px_rgba(22,163,74,0.4)] border-2 border-green-300 rounded-2xl p-8 w-full max-w-2xl">
        {/* Judul */}
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-600 flex items-center justify-center">
          <ChefHat className="mr-3" /> Update Resep
        </h1>

        {/* Formulir Update Resep */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field-field formulir (seperti pada contoh sebelumnya) */}
          {/* Judul */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Judul Resep
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Masukkan judul resep"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Deskripsi Resep
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Ceritakan sedikit tentang resep ini"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Bahan */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Bahan-Bahan
              <span className="text-sm text-gray-500 ml-2">
                (Pisahkan setiap bahan dengan enter)
              </span>
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Contoh:&#10; 250g tepung&#10; 2 butir telur&#10; 100ml susu"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Instruksi */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Langkah Pembuatan
              <span className="text-sm text-gray-500 ml-2">
                (Pisahkan setiap langkah dengan enter)
              </span>
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Contoh:&#10; Campur tepung dan gula&#10; Tambahkan telur&#10; Aduk hingga rata"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Waktu Memasak & Porsi */}
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
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Contoh: 30"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Porsi{' '}
              </label>
              <input
                type="number"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Contoh: 4"
                required
              />
            </div>
          </div>

          {/* Tingkat Kesulitan */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tingkat Kesulitan
            </label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Pilih Tingkat Kesulitan</option>
              <option value="Mudah">Mudah</option>
              <option value="Menengah">Menengah</option>
              <option value="Sulit">Sulit</option>
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Kategori
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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

          {/* Gambar Resep */}
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

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Update Resep
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateRecipe
