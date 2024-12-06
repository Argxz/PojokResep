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
    <div className="mb-6 max-w-xl mx-auto">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Cari resep... (judul, kategori, pembuat)"
        value={searchTerm}
        onChange={handleChange} // Ganti dari onKeyPress ke onChange
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-500" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0,0,0,0.23)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        }}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  )
}

export default RecipeSearchBar
