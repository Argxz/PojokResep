const initialState = {
  profilePicture: null,
  loading: false,
  error: null,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPLOAD_PROFILE_PICTURE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }

    case 'UPLOAD_PROFILE_PICTURE_SUCCESS':
      return {
        ...state,
        loading: false,
        profilePicture: action.payload,
        error: null,
      }

    case 'UPLOAD_PROFILE_PICTURE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'FETCH_PROFILE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_PROFILE_SUCCESS':
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: null,
      }
    case 'FETCH_PROFILE_FAILURE':
      return {
        ...state,
        loading: false,
        profile: null,
        error: action.payload,
      }
    default:
      return state
  }
}

export default userReducer
