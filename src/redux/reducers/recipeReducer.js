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
    case 'FETCH_RECIPE_DETAIL_SUCCESS':
      return {
        ...state,
        currentRecipe: action.payload,
        loading: false,
        error: null,
      }
    case 'FETCH_RECIPE_DETAIL_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case 'UPDATE_RECIPE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }

    case 'UPDATE_RECIPE_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: state.recipes.map((recipe) =>
          recipe.id === action.payload.id
            ? { ...recipe, ...action.payload }
            : recipe,
        ),
      }

    case 'UPDATE_RECIPE_FAIL':
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
