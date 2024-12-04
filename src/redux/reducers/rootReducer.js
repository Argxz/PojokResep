// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from './authReducer'
import recipeReducer from './recipeReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  recipe: recipeReducer, // Pastikan key-nya 'recipe'
})

export default rootReducer
