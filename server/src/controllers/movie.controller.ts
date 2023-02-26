import express from 'express'

// @ts-ignore
import { Tmdb } from '@dills1220/tmdb'
import response from '@utils/response'
import Movies from '@models/movies.model';

let TmdbInstance = new Tmdb(process.env.TMDB_API_KEY);

const getMovieVideos = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response<any, Record<string, any>> | undefined> => {

    const movieId = req.params.id;

    try{    
      const mainMovie = await TmdbInstance.getMovie(movieId)
      const movieVideosFound = await TmdbInstance.getMovieVideos(movieId)
      const moviePosterImages = await TmdbInstance.getMoviePosterImages(movieId)
      const movieBackdropImages = await TmdbInstance.getMovieBackdropImages(movieId)
      const movieReleaseDates = await TmdbInstance.get(`/movie/${movieId}/release_dates`)

      return response.send(
        res, 
        200, 
        {
            mainMovie,
            movieVideosFound, 
            moviePosterImages, 
            movieBackdropImages, 
            movieReleaseDates: movieReleaseDates.results.filter((rDate: {iso31661: string, releaseDates: any[]}) => (rDate.iso31661 === 'US'))
        }, 
        false
      )

    }catch(err){
      return response.send(res, 200, { mainMovie:{}, movieVideosFound: [], moviePosterImages: [], movieBackdropImages:[], movieReleaseDates:[] }, true)
    }
    
}

const searchForMovies = async (searchParam: string, page: number) => {
  
  return await TmdbInstance.get('search/movie', { query: searchParam, page })
}

const getAllMoviesBySearch = async (searchParamArray: string[], moviesFound: any[], numPages: number = 1) => {
  let searchParam = ''

  if(searchParamArray.length > 0){
    searchParam = searchParamArray.pop() || ''
  }

  // Fetch two pages of movies for each search query
  const firstSearchPage = searchForMovies(searchParam, 1)
  const secondSearchPage = searchForMovies(searchParam, 2)
  const thirdSearchPage = searchForMovies(searchParam, 3)
  
  const searchResults = await Promise.all([firstSearchPage, secondSearchPage, thirdSearchPage])

  moviesFound.push(...searchResults[0].results, ...searchResults[1].results, ...searchResults[2].results)

  if(searchParamArray.length > 0){
    await getAllMoviesBySearch( searchParamArray, moviesFound, numPages + 1)
  }

  return moviesFound
}

const getMoviesByGenre = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>> | undefined> => {

  const genres = req.body.genres

  try{
    let moviesFound = await getAllMoviesBySearch(genres, [])

    moviesFound = removeMovieDuplicates(moviesFound)
    
    return response.send(res, 200, moviesFound, false)
  }catch(err){
    console.log(err)

    return response.send(res, 200, [], true)
  }
}

const getByReleaseYear = async (page: number, releaseYear: number, allVideos: any[]) => {
  
  const response = await TmdbInstance.get(`/discover/movie?language=en-US&
                                          &include_adult=false&include_video=false
                                          &page=${page}
                                          &primary_release_year=${releaseYear}`)

  
  allVideos.push(...response.results)

  if(page < response.totalPages && page < 6 ) await getByReleaseYear(++page, releaseYear, allVideos)
  else{
    return allVideos
  }
}

const removeMovieDuplicates = (movies: any[]) => {
  if(typeof movies === 'undefined') return
  
  return movies.reduce((acc, curr) => {
    if(acc.findIndex((accMovie:any) => accMovie.id === curr.id) === -1) acc.push(curr)
    return acc
  },[])
}

const getMoviesByReleaseYear = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>> | undefined> => {

  const { releaseYear } = req.body

  let moviesFound:any[] = []

  try{
    await getByReleaseYear(1, releaseYear, moviesFound)

    moviesFound = removeMovieDuplicates(moviesFound)
    
    return response.send(res, 200, moviesFound, false)
  }catch(err){
    console.log(err)

    return response.send(res, 200, [], true)
  }
}

const search = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>> | undefined> => {
  
  const { query } = req.body

  try{
    const moviesPage1 = searchForMovies(query, 1)
    const moviesPage2 = searchForMovies(query, 2)
    const moviesPage3 = searchForMovies(query, 3)
  
    const searchResults = await Promise.all([moviesPage1, moviesPage2, moviesPage3])

    const allMoviesFound = searchResults.reduce((prev, curr) => { return [...prev, ...curr.results]}, []) 

    return response.send(res, 200, allMoviesFound, false)
  }catch(err){
    console.log(err)
    return response.send(res, 200, [], true)
  }
  
}

const getAllMovies = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>> | undefined> => {
  const TMDBVideos: any = await Movies.findOne({})
  
  return response.send(res, 200, TMDBVideos.content, false)
}

export default {
    getMovieVideos,
    getMoviesByGenre,
    getMoviesByReleaseYear,
    getAllMovies,
    search
}