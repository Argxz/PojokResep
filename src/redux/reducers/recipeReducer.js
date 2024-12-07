const initialState = {
  recipes: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalRecipes: 0,
    limit: 8,
  },
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
      return {
        ...state,
        loading: true,
      }

    case 'GET_RECIPES_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: action.payload.recipes,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalRecipes: action.payload.totalRecipes,
        },
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
    case 'DELETE_RECIPE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }

    case 'DELETE_RECIPE_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: state.recipes.filter((recipe) => recipe.id !== action.payload),
        currentRecipe: null, // Reset current recipe setelah dihapus
      }

    case 'DELETE_RECIPE_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'FETCH_USER_RECIPES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }

    case 'FETCH_USER_RECIPES_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: action.payload.recipes || action.payload, // Antisipasi struktur berbeda
        pagination: {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalRecipes:
            action.payload.totalRecipes || action.payload.length || 0,
        },
        error: null,
      }

    case 'FETCH_USER_RECIPES_FAIL':
      return {
        ...state,
        loading: false,
        recipes: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalRecipes: 0,
        },
        error: action.payload,
      }
    default:
      return state
  }
}

export default recipeReducer
