import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authReducer'
import recipeReducer from './reducers/recipeReducer'
import userReducer from './reducers/userReducer'
import { commentReducer } from './reducers/commentReducer'
import { ratingReducer } from './reducers/ratingReducer'
import categoriesReducer from './reducers/categoriesReducer'
import adminReducer from './reducers/adminReducer'

// Konfigurasi persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
}

// Buat reducer yang dipersist
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    recipe: recipeReducer,
    user: userReducer,
    comment: commentReducer,
    rating: ratingReducer,
    categories: categoriesReducer,
    admin: adminReducer,
  }),
)

// Buat store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Buat persistor
export const persistor = persistStore(store)
