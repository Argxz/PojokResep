import React, { useState, useCallback } from 'react'

//Impor komponen yg diperlukan
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

/**
 * Komponen bilah pencarian resep
 * @param {Object} props - Properti komponen
 * @param {Function} props.onSearch - Fungsi callback untuk pencarian
 */
const RecipeSearchBar = ({ onSearch }) => {
  // State untuk menyimpan kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState('')

  // Fungsi pencarian dengan optimasi menggunakan useCallback
  const handleSearch = useCallback(
    (value) => {
      onSearch(value)
    },
    [onSearch],
  )

  /**
   * Menangani perubahan input pencarian
   * @param {Event} e - Event perubahan input
   */
  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Filter langsung saat mengetik
    handleSearch(value)
  }

  /**
   * Menangani pembersihan input pencarian
   */
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
          // Ikon pencarian di awal input
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: 'rgba(96,165,250,1)', // biru cerah
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'rgba(59,130,246,1)', // biru sedikit gelap
                  },
                }}
              />
            </InputAdornment>
          ),

          // Ikon hapus di akhir input (muncul saat ada teks)
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
                    color: 'rgba(209,213,219,1)', // abu-abu terang
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),

          // Gaya kustom untuk input
          sx: {
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(17,24,39,0.8)', // latar belakang gelap

            // Gaya border
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid rgba(75,85,99,0.7)', // border gelap
              borderRadius: '16px',
              transition: 'all 0.3s ease',
            },

            // Efek hover
            '&:hover': {
              backgroundColor: 'rgba(17,24,39,0.9)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(96,165,250,0.5)', // biru cerah
              },
            },

            // Gaya saat difokuskan
            '&.Mui-focused': {
              backgroundColor: 'rgba(37,99,235,0.1)', // biru-600

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(96,165,250,0.8)', // biru cerah
                borderWidth: '2px',
              },
            },

            // Gaya teks input
            '& input': {
              padding: '12px 14px',
              fontSize: '0.95rem',
              color: 'rgba(17,24,39,0.9)', // teks sangat terang untuk kontras
              transition: 'all 0.3s ease',

              // Gaya placeholder
              '&::placeholder': {
                color: 'rgba(243,244,246,1)', // Putih murni dengan opacity
                opacity: 1, // Pastikan opacity terlihat
                transition: 'color 0.3s ease',
              },
            },
          },
        }}
      />

      {/* Lapisan gradient latar belakang */}
      <div
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(37,99,235,0.05), rgba(59,130,246,0.03))', // gradient lembut
          zIndex: -10,
          borderRadius: '16px',
          filter: 'blur(6px)', // efek blur
          opacity: 0.4,
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  )
}

export default RecipeSearchBar
