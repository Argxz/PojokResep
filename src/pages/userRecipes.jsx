import React, { useEffect } from 'react'
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
} from '@mui/material'
import { Eye } from 'lucide-react'

const UserRecipes = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth) // Ambil user dari state auth
  const { recipes, loading, error } = useSelector((state) => state.recipe)

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserRecipes(user.id)) // Kirim user ID
    }
  }, [dispatch, user])

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resep Saya
      </Typography>

      {!recipes || recipes.length === 0 ? (
        <Typography variant="body1">Anda belum memiliki resep</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Judul Resep</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Tanggal Dibuat</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe, index) => (
                <TableRow key={recipe.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{recipe.title}</TableCell>
                  <TableCell>
                    {recipe.category?.name || 'Tidak Berkategori'}
                  </TableCell>
                  <TableCell>
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Eye />}
                      onClick={() => handleViewRecipe(recipe.id)}
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
