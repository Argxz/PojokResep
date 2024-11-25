import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function RecipeList() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/recipes')
        setRecipes(response.data.data)
      } catch (err) {
        setError('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Recipes</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cooking Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serving Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recipes.map((recipe, index) => (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.title}
                  </td>
                  <td className="px-4 py-4">{recipe.description}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.user.username}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.category.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.cooking_time}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.serving_size}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {recipe.difficulty_level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default RecipeList
