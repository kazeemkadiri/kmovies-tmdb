import { PayloadAction } from '@reduxjs/toolkit'
import { TMDBMovie } from '../../types';
import { SET_MOVIES_LIST, SET_SEARCH_MOVIES_LIST, CLEAR_SEARCH_MOVIES_LIST, CLEAR_MOVIES_LIST } from '../actions';

const initialState: { moviesList: TMDBMovie[], searchMoviesList: TMDBMovie[] } = {
  moviesList: [],
  searchMoviesList: []
}

const moviesReducer = (state = initialState, action: PayloadAction<any>) => {
  switch (action.type) {
    case SET_MOVIES_LIST:
      return { ...state, moviesList: action.payload }
      break;
    case SET_SEARCH_MOVIES_LIST:
      return { ...state, searchMoviesList: action.payload }
      break;
    case CLEAR_MOVIES_LIST:
      return {...state, moviesList: []}
      break;
    case CLEAR_SEARCH_MOVIES_LIST:
      return {...state, searchMoviesList: []}
    default:
      return state
  }
}

export default moviesReducer
