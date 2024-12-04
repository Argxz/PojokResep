const initialState = {
  isAuthenticated: false,
  user: null,
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: true,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
        loading: false,
      }
    case 'LOGIN_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: action.payload,
        loading: false,
      }
    case 'REFRESH_TOKEN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
        loading: false,
      }
    case 'VERIFY_TOKEN_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'VERIFY_TOKEN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
      }
    case 'VERIFY_TOKEN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        loading: false,
      }
    default:
      return state
  }
}

export default authReducer
