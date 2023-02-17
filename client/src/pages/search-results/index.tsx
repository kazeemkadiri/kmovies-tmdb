import { TMDBMovie } from "../../types";
import MovieCard from '../../components/MovieCard'
import slug from "slug"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react";
import useMovies from "../../hooks/useMovies";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../redux/store";
import ReactPaginate from "react-paginate";
import { SET_SEARCH_MOVIES_LIST } from "../../redux/actions";
import { Col, Row } from "react-bootstrap";

const SearchResults = () => {
    const navigate = useNavigate()
    const { searchMovies } = useMovies()
    const [ moviesArr, setMoviesArr ] = useState<TMDBMovie[]>([]) 
    const params = useParams()
    const dispatch = useAppDispatch()
    const perPage = 24
    let moviesSearchRedux: { searchMoviesList: TMDBMovie[] } = useAppSelector((state: RootState) => state.movies )
    const moviesSearchInStore = useMemo(() => (moviesSearchRedux.searchMoviesList), [moviesSearchRedux.searchMoviesList])
    const [pageMovies, setPageMovies] = useState<TMDBMovie[]>([])

    useEffect(() => {
      const {searchquery} =  params;

      (async () => {

        const moviesArray = await searchMovies( searchquery === undefined ? '' : searchquery )
       
        saveSearchResultsToStore(moviesArray)
      })()
    }, [params.searchquery])

    useEffect(() => {
      if(typeof moviesArr === 'undefined') return

      const selectedMoviesList = moviesArr.slice(0, perPage)
      
      setPaginatedPageMovies( selectedMoviesList )
    },[moviesArr])

    useEffect(() => {
      setMoviesArr(moviesSearchInStore)
    }, [moviesSearchInStore])

    const saveSearchResultsToStore = (moviesArray: TMDBMovie[]) => {
      dispatch({
        type: SET_SEARCH_MOVIES_LIST,
        payload: moviesArray
      })
    }

    const showSelectedMoviePage = (movie: TMDBMovie) => {
        navigate(`/movies/${slug(movie.originalTitle)}/${movie.id}`)
    }

    const setPaginatedPageMovies = (movies: TMDBMovie[]) => {
        setPageMovies( movies )
    }

    const scrollToTop = () => {
      window.scrollTo(0,0)
    }

    const handlePageClick = (data: any) => {
      scrollToTop()

      let selected = data.selected;
      
      let offset = Math.ceil(selected * perPage);
      
      const selectedMovieList = moviesArr.slice(offset, offset + perPage)
      
      setPaginatedPageMovies( selectedMovieList )
    };

    if(!pageMovies || !moviesArr){
      return <div>Loading...</div>
    }

    return (
        <Row className="mt-5">
        {
          pageMovies && pageMovies.length > 0 && pageMovies.map((movie: TMDBMovie, index: number) => {
            return (
              <Col className="h-sm-auto mb-2" key={index} sm={12} md={3} lg={2} style={{ cursor: "pointer" }} onClick={() => { showSelectedMoviePage(movie)}}>
                <MovieCard movie={movie} />
              </Col>
            )
          })
        }
        {
          pageMovies && pageMovies.length > 0 && 
          <div className='col-12'>
            <ReactPaginate
              previousLabel="previous"
              nextLabel="next"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={Math.ceil(moviesArr.length / perPage)}
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
              initialPage={1}
              // eslint-disable-next-line no-unused-vars
              hrefBuilder={(page, pageCount, selected) =>
                page >= 1 && page <= pageCount ? `/search/page/${page}` : '#'
              }
              onClick={(clickEvent) => {
                return
              }}
            />
          </div>
        }
      </Row>
    )
} 

export default SearchResults