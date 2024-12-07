import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  submitRating,
  fetchUserRatingForRecipe,
} from '../redux/action/ratingActions'

const StarRating = ({
  value,
  editable = false,
  onRateChange,
  recipeId,
  userRatingValue, // Tambahkan parameter ini
}) => {
  const dispatch = useDispatch()
  // Gunakan userRatingValue sebagai initial state
  const [rating, setRating] = useState(userRatingValue || 0)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    // Update rating jika userRatingValue berubah
    if (userRatingValue !== undefined) {
      setRating(userRatingValue)
    }
  }, [userRatingValue])

  useEffect(() => {
    const fetchRating = async () => {
      if (editable) {
        try {
          const result = await dispatch(fetchUserRatingForRecipe(recipeId))
          if (result && result.userRating) {
            // Pastikan rating valid sebelum di-set
            const fetchedRating = Number(result.userRating)
            if (fetchedRating > 0 && fetchedRating <= 5) {
              setRating(fetchedRating)
              onRateChange && onRateChange(fetchedRating)
            }
          }
        } catch (error) {
          console.log('No previous rating found')
          // Reset rating ke 0 jika tidak ada rating sebelumnya
          setRating(0)
        }
      }
    }
  }, [recipeId, editable, dispatch])

  const handleRatingChange = async (newRating) => {
    if (!editable) return

    try {
      // Pastikan newRating valid
      const sanitizedRating = Math.min(Math.max(newRating, 0), 5)

      const result = await dispatch(submitRating(recipeId, sanitizedRating))

      // Update local state
      setRating(sanitizedRating)
      onRateChange && onRateChange(sanitizedRating)
    } catch (error) {
      console.error('Error submitting rating:', error)
      // Optional: Reset rating jika submit gagal
      setRating(0)
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((star, index) => {
          index += 1
          return (
            <button
              type="button"
              key={index}
              className={`
                ${
                  index <= (hover || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }
                text-2xl 
                ${editable ? 'cursor-pointer' : 'cursor-default'}
                transition-colors duration-200
                focus:outline-none
              `}
              onClick={() => handleRatingChange(index)}
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
