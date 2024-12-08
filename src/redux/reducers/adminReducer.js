const initialState = {
  dashboardData: {
    totalUsers: 0,
    totalRecipes: 0,
    totalComments: 0,
    totalRatings: 0,
  },
  comments: [],
  loading: false,
  error: null,
  commentsFetched: false,
  recipes: [],
  recipesFetched: false,
  users: [],
  userModalOpen: false,
  userLoading: false,
  userError: null,
}

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DASHBOARD_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_DASHBOARD_SUCCESS':
      return {
        ...state,
        loading: false,
        dashboardData: action.payload,
        error: null,
      }
    case 'FETCH_DASHBOARD_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'FETCH_COMMENTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        comments: action.payload || [],
        commentsFetched: true, // Set flag
        error: null,
      }
    case 'FETCH_COMMENTS_FAILURE':
      return {
        ...state,
        loading: false,
        comments: [],
        commentsFetched: false, // Reset flag
        error: action.payload,
      }
    case 'DELETE_ADM_COMMENT_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }

    case 'DELETE_ADM_COMMENT_SUCCESS':
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment.id !== action.payload,
        ),
        loading: false,
        commentsFetched: false,
      }

    case 'DELETE_ADM_COMMENT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'FETCH_RECIPES_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'FETCH_RECIPES_SUCCESS':
      return {
        ...state,
        loading: false,
        recipes: action.payload || [],
        recipesFetched: true,
        error: null,
      }
    case 'FETCH_RECIPES_FAILURE':
      return {
        ...state,
        loading: false,
        recipes: [],
        recipesFetched: false,
        error: action.payload,
      }
    case 'DELETE_ADM_RECIPE_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'DELETE_ADM_RECIPE_SUCCESS':
      return {
        ...state,
        recipes: state.recipes.filter((recipe) => recipe.id !== action.payload),
        loading: false,
        recipesFetched: false,
      }
    case 'DELETE_ADM_RECIPE_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'FETCH_ALL_USERS_REQUEST':
      return {
        ...state,
        userLoading: true,
        userError: null,
      }
    case 'FETCH_ALL_USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        userLoading: false,
      }
    case 'FETCH_ALL_USERS_FAIL':
      return {
        ...state,
        userLoading: false,
        userError: action.payload,
      }
    case 'OPEN_USER_MODAL':
      return {
        ...state,
        userModalOpen: true,
      }
    case 'CLOSE_USER_MODAL':
      return {
        ...state,
        userModalOpen: false,
      }
    case 'DELETE_ADM_USER_REQUEST':
      return {
        ...state,
        userLoading: true,
        userError: null,
      }
    case 'DELETE_ADM_USER_SUCCESS':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        userLoading: false,
      }
    case 'DELETE_ADM_USER_FAILURE':
      return {
        ...state,
        userLoading: false,
        userError: action.payload,
      }
    default:
      return state
  }
}

export default adminReducer
