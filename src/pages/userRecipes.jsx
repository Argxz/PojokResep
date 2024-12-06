import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserRecipes } from '../redux/action/recipeActions'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material'
import { Eye, BookOpen, Calendar, Layers, PlusCircle } from 'lucide-react'

const UserRecipes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // State untuk filter dan sorting
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  // Selector untuk data
  const { user } = useSelector((state) => state.auth)
  const { recipes, loading, error } = useSelector((state) => state.recipe)

  // Effect untuk fetch resep
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserRecipes(user.id))
    }
  }, [dispatch, user])

  // Handler untuk view recipe
  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  // Handler untuk create recipe
  const handleCreateRecipe = () => {
    navigate('/upload-recipe')
  }

  // Filter dan sort recipes
  const processedRecipes = React.useMemo(() => {
    let result = recipes || []

    // Filter berdasarkan kategori
    if (filter !== 'all') {
      result = result.filter((recipe) => recipe.category?.name === filter)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      return 0
    })

    return result
  }, [recipes, filter, sortBy])

  //Format tanggal dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: '100vh',
      }}
    >
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h4"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              <BookOpen size={32} /> Resep Saya
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusCircle />}
              onClick={handleCreateRecipe}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Buat Resep Baru
            </Button>
          </Grid>
        </Grid>
      </CardContent>

      {processedRecipes.length === 0 ? (
        <Card
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Anda belum memiliki resep
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: '#1e1e1e',
                borderBottom: '3px solid #ff6b6b',
              }}
            >
              <TableRow>
                {['No', 'Judul Resep', 'Kategori', 'Tanggal', 'Aksi'].map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        fontSize: '0.9rem',
                        opacity: 0.9,
                      }}
                    >
                      {header}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {processedRecipes.map((recipe, index) => (
                <TableRow
                  key={recipe.id}
                  hover
                  sx={{
                    '& > td': {
                      borderBottom: '1px solid #e0e0e0',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {recipe.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={recipe.category?.name || 'Tidak Berkategori'}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #2c2c2c, #1a1a1a)',
                        color: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontWeight: 'medium',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Calendar size={16} />
                      {formatDate(recipe.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<Eye />}
                      onClick={() => handleViewRecipe(recipe.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        position: 'relative',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'linear-gradient(135deg, #1a1a1a, #2c2c2c)',
                        overflow: 'hidden',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background:
                            'linear-gradient(120deg, transparent, rgba(255,255,255,0.1), transparent)',
                          transition: 'all 0.3s ease',
                        },
                        '&:hover': {
                          '&:before': {
                            left: '100%',
                          },
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        },
                        px: 2,
                        py: 1,
                      }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default UserRecipes
