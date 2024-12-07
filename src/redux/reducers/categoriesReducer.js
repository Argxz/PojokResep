const initialState = {
  categories: [],
  loading: false,
  error: null,
}

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      }
    case 'FETCH_CATEGORIES_FAILURE':
      return {
        ...state,
        categories: [],
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default categoriesReducer
