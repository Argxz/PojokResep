// rootReducer.js
import { combineReducers } from 'redux'
import authReducer from './authReducer'
import recipeReducer from './recipeReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  recipe: recipeReducer,
  user: userReducer,
})

export default rootReducer
