const initialState = {
  recipes: [],
  loading: false,
  error: null,
}

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_RECIPE_REQUEST':
      return { ...state, loading: true }

    case 'CREATE_RECIPE_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: [...state.recipes, action.payload],
      }

    case 'CREATE_RECIPE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'GET_RECIPES_REQUEST':
      return { ...state, loading: true }

    case 'GET_RECIPES_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: action.payload,
      }

    case 'GET_RECIPES_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default recipeReducer
