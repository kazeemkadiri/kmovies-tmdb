import './styles/movietypes.scss'
import { Link } from 'react-router-dom'

const MovieTypes = () => {
    return(
      <div className='d-flex mx-3'>
        <Link to='/movies'><strong>Movies</strong></Link>
      </div>
    )
}

export default MovieTypes