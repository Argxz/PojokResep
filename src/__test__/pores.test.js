import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import RecipeSearchBar from '../components/Recipes/Searchbar'

describe('RecipeSearchBar Component', () => {
  // Mock fungsi onSearch
  const mockOnSearch = jest.fn()

  // Render ulang komponen sebelum setiap test
  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  test('renders search input correctly', () => {
    render(<RecipeSearchBar onSearch={mockOnSearch} />)

    // Cek apakah input pencarian ada
    const searchInput = screen.getByPlaceholderText(
      'Cari resep... (judul, kategori, pembuat)',
    )
    expect(searchInput).toBeInTheDocument()
  })

  test('updates search term when typing', () => {
    render(<RecipeSearchBar onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText(
      'Cari resep... (judul, kategori, pembuat)',
    )

    // Simulasi mengetik
    fireEvent.change(searchInput, { target: { value: 'pasta' } })

    // Cek apakah input berubah
    expect(searchInput.value).toBe('pasta')

    // Cek apakah onSearch dipanggil dengan benar
    expect(mockOnSearch).toHaveBeenCalledWith('pasta')
  })

  test('clears search term when clear button is clicked', () => {
    render(<RecipeSearchBar onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText(
      'Cari resep... (judul, kategori, pembuat)',
    )

    // Simulasi mengetik
    fireEvent.change(searchInput, { target: { value: 'pasta' } })

    // Cari dan klik tombol clear berdasarkan icon
    const clearIcon = screen.getByTestId('ClearIcon')
    fireEvent.click(clearIcon.closest('button'))

    // Cek apakah input kosong
    expect(searchInput.value).toBe('')

    // Cek apakah onSearch dipanggil dengan string kosong
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  test('calls onSearch with empty string initially', () => {
    // Gunakan useEffect untuk memastikan pemanggilan awal
    render(<RecipeSearchBar onSearch={mockOnSearch} />)

    // Tunggu sejenak untuk memastikan useEffect dipanggil
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  test('renders search and clear icons', () => {
    render(<RecipeSearchBar onSearch={mockOnSearch} />)

    // Cek keberadaan ikon pencarian
    const searchIcon = screen.getByTestId('SearchIcon')
    expect(searchIcon).toBeInTheDocument()

    // Ketik sesuatu untuk memunculkan tombol clear
    const searchInput = screen.getByPlaceholderText(
      'Cari resep... (judul, kategori, pembuat)',
    )
    fireEvent.change(searchInput, { target: { value: 'test' } })

    // Cek keberadaan ikon clear
    const clearIcon = screen.getByTestId('ClearIcon')
    expect(clearIcon).toBeInTheDocument()
  })
})
