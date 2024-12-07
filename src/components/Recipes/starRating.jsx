import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  submitRating,
  fetchUserRatingForRecipe,
} from '../../redux/action/ratingActions'

/**
 * Komponen untuk menampilkan dan mengelola rating bintang
 * @param {Object} props - Properti komponen
 * @param {number} [props.value] - Nilai rating awal (opsional)
 * @param {boolean} [props.editable=false] - Apakah rating dapat diubah
 * @param {Function} [props.onRateChange] - Callback saat rating berubah
 * @param {string} props.recipeId - ID resep
 * @param {number} [props.userRatingValue] - Nilai rating pengguna
 */
const StarRating = ({
  editable = false,
  onRateChange,
  recipeId,
  userRatingValue,
}) => {
  const dispatch = useDispatch()

  // State untuk rating dan hover
  const [rating, setRating] = useState(userRatingValue || 0)
  const [hover, setHover] = useState(0)

  // Update rating jika userRatingValue berubah
  useEffect(() => {
    if (userRatingValue !== undefined) {
      setRating(userRatingValue)
    }
  }, [userRatingValue])

  // Ambil rating pengguna untuk resep tertentu
  useEffect(() => {
    const fetchRating = async () => {
      if (editable) {
        try {
          const result = await dispatch(fetchUserRatingForRecipe(recipeId))

          // Validasi dan set rating
          if (result && result.userRating) {
            const fetchedRating = Number(result.userRating)

            // Pastikan rating valid (antara 1-5)
            if (fetchedRating > 0 && fetchedRating <= 5) {
              setRating(fetchedRating)
              onRateChange && onRateChange(fetchedRating)
            }
          }
        } catch (error) {
          console.log('Tidak ada rating sebelumnya')
          // Reset rating jika tidak ditemukan
          setRating(0)
        }
      }
    }

    // Panggil fungsi fetch rating
    fetchRating()
  }, [recipeId, editable, dispatch, onRateChange])

  /**
   * Menangani perubahan rating
   * @param {number} newRating - Nilai rating baru
   */
  const handleRatingChange = async (newRating) => {
    // Batalkan jika tidak dapat diedit
    if (!editable) return

    try {
      // Sanitasi rating (pastikan antara 0-5)
      const sanitizedRating = Math.min(Math.max(newRating, 0), 5)

      // Kirim rating ke backend
      const result = await dispatch(submitRating(recipeId, sanitizedRating))

      // Update state lokal
      setRating(sanitizedRating)
      onRateChange && onRateChange(sanitizedRating)
    } catch (error) {
      console.error('Gagal mengirim rating:', error)
      // Reset rating jika gagal
      setRating(0)
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Render bintang rating */}
        {[...Array(5)].map((star, index) => {
          index += 1
          return (
            <button
              type="button"
              key={index}
              className={`
                ${
                  // Warna bintang berdasarkan rating dan hover
                  index <= (hover || rating)
                    ? 'text-yellow-400' // Bintang aktif
                    : 'text-gray-300' // Bintang non-aktif
                }
                text-2xl 
                ${editable ? 'cursor-pointer' : 'cursor-default'}
                transition-colors duration-200
                focus:outline-none
              `}
              onClick={() => handleRatingChange(index)}
              // Efek hover hanya jika dapat diedit
              onMouseEnter={() => editable && setHover(index)}
              onMouseLeave={() => editable && setHover(rating)}
              disabled={!editable}
            >
              ★
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StarRating
