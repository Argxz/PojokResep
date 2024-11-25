import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CategoryList from './pages/categoryList'
import RecipeList from './pages/recipeList'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
