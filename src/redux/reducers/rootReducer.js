// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from './authReducer'
import recipeReducer from './recipeReducer'
import userReducer from './userReducer'
import { commentReducer } from './commentReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  recipe: recipeReducer,
  user: userReducer,
  comment: commentReducer,
})

export default rootReducer
