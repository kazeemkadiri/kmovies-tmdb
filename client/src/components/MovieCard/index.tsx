import './styles/movietypes.scss'
import type { TMDBMovie } from './../../types'
import { Card } from 'react-bootstrap'

const MovieCard = (props: {movie: TMDBMovie}) => {
    
    return <Card className="w-100 site-bg-color p-0 h-100 border-0 mb-3">
          <Card.Body className='p-0'>
            <Card.Text className='h-100'>
              <img 
                className='img-fluid h-100' 
                src={!props.movie.posterPath ? '/no-image.png' : `https://image.tmdb.org/t/p/original/${props.movie.posterPath}`} 
                alt={props.movie.originalTitle} />
            </Card.Text>
          </Card.Body>
        </Card>
}

export default MovieCard