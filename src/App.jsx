import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CategoryList from './pages/categoryList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryList />} />
      </Routes>
    </Router>
  )
}

export default App
