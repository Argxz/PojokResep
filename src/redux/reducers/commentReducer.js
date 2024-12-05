const initialState = {
  comments: [],
  loading: false,
  error: null,
  message: null,
}

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_COMMENTS_SUCCESS':
      return {
        ...state,
        comments: action.payload.comments,
        message: action.payload.message,
        loading: false,
        error: null,
      }
    case 'FETCH_COMMENTS_FAILURE':
      return {
        ...state,
        comments: [],
        loading: false,
        error: action.payload,
      }
    case 'UPDATE_COMMENT_SUCCESS':
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id
            ? { ...comment, ...action.payload }
            : comment,
        ),
      }
    case 'DELETE_COMMENT_SUCCESS':
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment.id !== action.payload,
        ),
      }
    default:
      return state
  }
}
