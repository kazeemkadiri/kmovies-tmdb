import './home.scss'
import Hero from '../../components/Hero'
import MovieTypes from '../../components/MovieTypes'
import MoviesFilter from '../../components/MoviesFilter'
import MovieCard from '../../components/MovieCard'
import useMovies from '../../hooks/useMovies'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import type { TMDBMovie } from '../../types'
import { useEffect, useState, useMemo } from 'react'
import { VideoTypes } from '../../constants/VideoTypes'
import slug from 'slug'
import { shuffle } from 'fast-shuffle'
import ReactPaginate from 'react-paginate'
import { useAppDispatch, useAppSelector } from '../../hooks/useStore'
import { RootState } from '../../redux/store'
import { Col, Row } from 'react-bootstrap'
import { CLEAR_MOVIES_LIST, SET_MOVIES_LIST } from '../../redux/actions'

const Home = () => {
  const location = useLocation()
  const { 
    getAllMovies, 
    getMovieVideos,
    getMoviesByReleaseYear 
  } = useMovies()
  const [allMovies, setAllMovies] = useState<TMDBMovie[] | any[]>([])
  const [pageMovies, setPageMovies] = useState<TMDBMovie[] | any[]>([])
  const [videoType, setVideoType] = useState(VideoTypes.MOVIE)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const perPage = 24
  const homeMoviesRedux: { moviesList: TMDBMovie[] } = useAppSelector((state: RootState) => state.movies )
  const homeMoviesInStore = useMemo(() => (homeMoviesRedux.moviesList), [homeMoviesRedux.moviesList])
  

  const currentPage = useMemo(() => {
    return parseInt(params.pagenum || '1')
  }, [params.pagenum])

  // This hook is called when the current page changes from the URL
  useEffect(() => {
    let offset = Math.ceil(currentPage * perPage);

    const selectedMovieList = allMovies.slice(offset, offset + perPage)

    setPaginatedPageMovies( selectedMovieList )
  }, [currentPage])

  useEffect(() => {    
    (async () => {
        await showHomePageMovies()
    })()
  }, [ location.pathname ])

  useEffect(() => {
      if(!homeMoviesInStore || homeMoviesInStore.length === 0) return

      setAllMovies( homeMoviesInStore )
  }, [homeMoviesInStore])

  useEffect(() => {
    const viewingPage: string = location.pathname.split('/')[1]

    switch(viewingPage){
      case 'movie':
        setVideoType(VideoTypes.MOVIE)
        break;
      case 'tv_show':
        setVideoType(VideoTypes.TV_SHOW)
        break;
      case 'all':
        setVideoType(VideoTypes.ALL)
        break;
      default:
        setVideoType(VideoTypes.MOVIE)
    }
  },[location.pathname])

  // This hook call will initialize the pagination of movies
  useEffect(() => {
    const first24Movies = allMovies.slice(0, perPage)

    setPaginatedPageMovies( first24Movies )
  },[ allMovies ])

  const hasMovies = () => {
    return pageMovies && (pageMovies.length > 0)
  }

  const setPaginatedPageMovies = (movies: TMDBMovie[]) => {
    setPageMovies( movies )
  }

  const saveHomeMoviesInStore = (movies: TMDBMovie[] | unknown[]) => {
    dispatch({ type: SET_MOVIES_LIST, payload: movies })
  }

  const showHomePageMovies = async () => {
    if(homeMoviesInStore && homeMoviesInStore.length > 0){
      setAllMovies(homeMoviesInStore)
      return
    }
    
    const movies = await getAllMovies()

    const shuffledMovies = shuffle(movies)

    saveHomeMoviesInStore(shuffledMovies)
  }

  const renderNewMovieList = (moviesArray: []) => {
    const shuffledMoviesArray = shuffle(moviesArray)
    setAllMovies( shuffledMoviesArray )
  }

  const handleReset = async () => {
    dispatch({ type: CLEAR_MOVIES_LIST })
  }

  const renderByReleaseYear = async (year: number) => {
    const movies = await getMoviesByReleaseYear(year)

    const shuffledMovies = shuffle(movies)

    setAllMovies( shuffledMovies )
  } 

  const showSelectedMoviePage = (movie: TMDBMovie) => {
    navigate(`/movies/${slug(movie.originalTitle)}/${movie.id}`)
  }

  const scrollToTop = () => {
    window.scrollTo(0,0)
  }

  const handlePageClick = (data: any) => {
    scrollToTop()

    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    const selectedMovieList = allMovies.slice(offset, offset + perPage)
    
    setPaginatedPageMovies( selectedMovieList )
  };

  if(!pageMovies) return <div>Loading movies</div>

  return (
    <div>
      <Hero />
      {/* Hero */}
      <section className="row">
        <div className='col-auto'>
          <MovieTypes />
        </div>
        <div className="col">
          <MoviesFilter 
            renderNewMovielist={renderNewMovieList}
            renderByReleaseYear={renderByReleaseYear}
            handleReset={handleReset} />
        </div>
      </section>

      {/* Movies list */}
      <Row className="mt-5">
        {/* For TMDB */}
        {
          hasMovies() && pageMovies.map((movie: TMDBMovie, index: number) => {

            return (
              
                <Col className="h-sm-auto mb-2" key={index} sm={12} md={3} lg={2} style={{ cursor: "pointer" }} onClick={() => { showSelectedMoviePage(movie)}}>
                    <MovieCard movie={movie} />
                </Col>

            )
          })
        }

        {
          hasMovies() && <div className='col-12'>
          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={Math.ceil(allMovies.length / perPage)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
            // eslint-disable-next-line no-unused-vars
            hrefBuilder={(page, pageCount, selected) =>
              (page >= 1 && page <= pageCount ? `/movies/page/${page}` : '#')
            }
            onClick={(clickEvent) => {
              return
            }}
          />
          </div>
        }       
      </Row>
      
    </div>
  )
}

export default Home
