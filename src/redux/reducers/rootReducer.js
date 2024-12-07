// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from './authReducer'
import recipeReducer from './recipeReducer'
import userReducer from './userReducer'
import { commentReducer } from './commentReducer'
import { ratingReducer } from './ratingReducer'
import categoriesReducer from './categoriesReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  recipe: recipeReducer,
  user: userReducer,
  comment: commentReducer,
  rating: ratingReducer,
  categories: categoriesReducer,
})

export default rootReducer
