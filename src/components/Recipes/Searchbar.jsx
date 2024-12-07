import React, { useState, useCallback } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

const RecipeSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Gunakan useCallback untuk mengoptimalkan performa
  const handleSearch = useCallback(
    (value) => {
      onSearch(value)
    },
    [onSearch],
  )

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Filter langsung saat mengetik
    handleSearch(value)
  }

  const handleClear = () => {
    setSearchTerm('')
    handleSearch('')
  }

  return (
    <div className="mb-3 mt-1 max-w-2xl mx-auto relative">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Cari resep... (judul, kategori, pembuat)"
        value={searchTerm}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: 'rgba(96,165,250,1)', // bright blue
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'rgba(59,130,246,1)', // slightly darker blue
                  },
                }}
              />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                size="small"
                sx={{
                  transition: 'all 0.3s ease',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <ClearIcon
                  fontSize="small"
                  sx={{
                    color: 'rgba(209,213,219,1)', // light gray
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(17,24,39,0.8)', // very dark background

            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid rgba(75,85,99,0.7)', // dark border
              borderRadius: '16px',
              transition: 'all 0.3s ease',
            },

            '&:hover': {
              backgroundColor: 'rgba(17,24,39,0.9)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(96,165,250,0.5)', // bright blue
              },
            },

            '&.Mui-focused': {
              backgroundColor: 'rgba(37,99,235,0.1)', // blue-600

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(96,165,250,0.8)', // bright blue
                borderWidth: '2px',
              },
            },

            '& input': {
              padding: '12px 14px',
              fontSize: '0.95rem',
              color: 'rgba(17,24,39,0.9)', // very light text for contrast
              transition: 'all 0.3s ease',

              '&::placeholder': {
                color: 'rgba(243,244,246,1)', // Putih murni dengan opacity
                opacity: 1, // Pastikan opacity terlihat
                transition: 'color 0.3s ease',
              },
            },
          },
        }}
      />

      {/* Background Gradient Layer */}
      <div
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(37,99,235,0.05), rgba(59,130,246,0.03))',
          zIndex: -10,
          borderRadius: '16px',
          filter: 'blur(6px)',
          opacity: 0.4,
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  )
}

export default RecipeSearchBar
