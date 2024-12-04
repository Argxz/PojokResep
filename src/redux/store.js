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

// Konfigurasi persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], // Hanya persist reducer auth
}

// Buat reducer yang dipersist
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    // reducer lain
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