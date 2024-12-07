const initialState = {
  ratings: [],
  userRating: null,
  loading: false,
  error: null,
  message: null,
}

export const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_RECIPE_RATINGS_SUCCESS':
      return {
        ...state,
        ratings: action.payload,
        loading: false,
        error: null,
      }
    case 'FETCH_RECIPE_RATINGS_FAILURE':
      return {
        ...state,
        ratings: [],
        loading: false,
        error: action.payload,
      }
    case 'FETCH_USER_RATING_SUCCESS':
      return {
        ...state,
        userRating: action.payload.userRating,
        loading: false,
        error: null,
      }
    case 'SUBMIT_RATING_SUCCESS':
      return {
        ...state,
        userRating: action.payload.userRating,
        ratings: action.payload.updatedRatings || state.ratings,
        loading: false,
        error: null,
      }
    default:
      return state
  }
}
