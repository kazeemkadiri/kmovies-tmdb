import './styles/moviesfilter.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCancel,
    faCheck,
    faFilter,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import { Col, NavDropdown, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import useMovies from '../../hooks/useMovies'
import { toast } from 'react-toastify'

const MoviesFilter = (props: {
    renderNewMovielist: (arg: []) => void, 
    renderByReleaseYear: (arg: number) => void, 
    handleReset: () => void 
}) => {
    const genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir']
    const { getMoviesByGenres } = useMovies()
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])
    const [releaseYear, setReleaseYear] = useState(1900)

    useEffect(() => {
        if(releaseYear === 1900) return

        const opTimeout = setTimeout(() => {
            props.renderByReleaseYear(releaseYear)
        },2000)
        
        return () => { clearTimeout(opTimeout) }
    },[releaseYear])

    const handleYearSelection = (event: any) => {
        if(Boolean(event.target) === false) return
        setReleaseYear(event.target.value)
    }
    
    const moviesFilterTypes = [
        {
            title: 'Release year',
            menuContent: <div className='row'>
                <div className="col-auto">Release Year Content</div>

                {/* Year range selection */}
                <div className="col-12">
                    <span>1900</span>
                    <input 
                        type="range" 
                        min="1900" 
                        max="2023"
                        onChange={handleYearSelection}
                        value={releaseYear} />
                    <span>2023</span>
                </div>
            </div>
        },
        {
            title: 'Genres',
            menuContent: <div className='row'>
                {
                    genres.map((genre: string) => 
                        (
                        <div className='col-6' key={ genre } onClick={(e) => { handleGenreToggle(e, genre) }}>
                            <FontAwesomeIcon icon={faCheck} /> {genre}
                        </div>
                        )
                    )
                }
            </div>
        }
    ]

    useEffect(() => {
        if(selectedGenres.length === 0) return

        props.renderNewMovielist([]);

        (async() => {
            // Fetches new list of movies based on selected genre
            props.renderNewMovielist(await getMoviesByGenres(selectedGenres))
        })()
    }, [selectedGenres])

    const handleGenreToggle = async (event: any, genre: string) => {
        // Makes the genre "selected"
        event.target.classList.toggle('active_genre')

        // Checks if the genre is not selected
        if(selectedGenres.indexOf(genre) === -1){ 
            setSelectedGenres([...selectedGenres, genre]) 
        }else{
            setSelectedGenres(selectedGenres.filter((selGenre) => ( selGenre !== genre )))
        }
    }

    return(
      <Row className='justify-content-between'>
        <Col md={7} sm={12} className='d-flex justify-content-start align-items-center'>
            <span className='d-flex align-items-center mx-3'>
                <FontAwesomeIcon icon={faFilter} size='sm' />{'  '} FILTERS
            </span>
            {/* The various filter types are handled here */}
            { moviesFilterTypes.map( filterType => (
                <NavDropdown key={filterType.title} title={filterType.title} menuVariant="dark" className="mx-2">
                <NavDropdown.Item>{filterType.menuContent}</NavDropdown.Item>
                </NavDropdown>))
            }
            
        </Col>
        <Col md={2} sm={12} className='d-flex justify-content-start'>
            <strong onClick={() => { props.handleReset() }} className="mx-3"><FontAwesomeIcon icon={faTimes} size='sm' /> Reset</strong>
        </Col>
      </Row>
    )
}

export default MoviesFilter