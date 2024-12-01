const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: true, // Default loading true
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        loading: false,
      }
    case 'LOGIN_FAIL':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
        loading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
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
        token: action.payload.token,
        loading: false,
      }
    case 'VERIFY_TOKEN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      }
    default:
      return state
  }
}

export default authReducer
