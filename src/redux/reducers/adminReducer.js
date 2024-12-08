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
        commentsFetched: false, // Reset untuk memicu ulang fetch
      }

    case 'DELETE_ADM_COMMENT_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default adminReducer
