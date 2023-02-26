import React, { useState, useEffect, useMemo } from 'react';
import useMovies from '../../hooks/useMovies';
import { useLocation, useParams } from 'react-router-dom';
import { MovieFullDetails, TMDBMovie } from '../../types';
import VideoPlayer from '../../components/VideoPlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBookmark, faCheck, faThumbsUp
} from '@fortawesome/free-solid-svg-icons'
import './moviepage.scss'

const MoviePage = (props: any) => {
    const location = useLocation()
    const params = useParams()
    const [movieFullDetails, setMovieFullDetails] = useState<MovieFullDetails | null>(null)
    const { getMovieVideos } = useMovies()

    useEffect(() => {
        (async () => {
            const result = await getMovieVideos(params.id || '')
            
            setMovieFullDetails(result)
        })()
    }, [location.pathname])

    const moviesImagesRepo = useMemo(() => ('https://image.tmdb.org/t/p/original'),[])
    const getMovieBannerPath = () => (movieFullDetails?.movieBackdropImages[0]?.filePath)
    const getMoviePosterPath = () => (movieFullDetails?.moviePosterImages[0]?.filePath)
    const getMovieTitle = () => (movieFullDetails?.mainMovie.originalTitle)
    const getMovieYear = () => (movieFullDetails?.movieReleaseDates[0]?.releaseDates[0]?.releaseDate.substring(0, 4))
    
    const hasContent = (movieInfo: string) => {
        switch(movieInfo){
            case 'movieVideos':
                return (movieFullDetails?.movieVideosFound && movieFullDetails?.movieVideosFound.length > 0)
            case 'movieBanner':
                return (movieFullDetails?.movieBackdropImages && movieFullDetails?.movieBackdropImages.length > 0)
            case 'moviePoster':
                return (movieFullDetails?.moviePosterImages && movieFullDetails?.moviePosterImages.length > 0)
            default:
                return false
        }       
    }

    const isMobileView = () => ( innerWidth <= 567 )

    if(!(movieFullDetails && movieFullDetails.mainMovie && movieFullDetails.mainMovie.id)){
        return <></>
    }
    
    return (
        (movieFullDetails && movieFullDetails.mainMovie && movieFullDetails.mainMovie.id) ? 
        (<section className='row'>
            {/* Movie banner */}
            <article className='col-12 d-flex flex-column justify-contents-center align-items-center position-relative' style={{ height: "360px" }}>
                <img className='w-100 position-relative' style={{ height: 'inherit' }} src={ hasContent('movieBanner') ? `${ moviesImagesRepo }${ getMovieBannerPath()}`: 'https://kmovies.fly.dev/assets/no-banner.jpg' } alt={ movieFullDetails.mainMovie.originalTitle }  />
                
                {/* The video player is placed above the backdrop image */}
                <div className='position-absolute w-100 text-center' style={{ top: '10px' }}>
                    { hasContent('movieVideos') 
                        && <VideoPlayer 
                                movie={movieFullDetails.movieVideosFound[0]} 
                                options={{ width: '90%', height: String(Math.floor(340)) }} 
                            /> 
                    }
                </div>
            </article>

            {/* The movie description and features section */}
            <div className='row align-items-sm-start justify-content-center  mt-3'>
                {/* An avatar picture section */}
                <div className="col-sm-12 col-md-4 d-flex flex-column align-items-center justify-contents-center p-3" style={{ width: isMobileView() ? '100%': '300px' }}>
                    <img className='w-100 position-relative ' src={ hasContent('moviePoster') ? `${ moviesImagesRepo }${ getMoviePosterPath()}` : '/assets/no-image.png' } alt={ movieFullDetails.mainMovie.originalTitle }  />
                    <section className='w-100 d-flex justify-content-between text-white p-3  movie_actions'>
                        <span className='d-flex flex-column align-items-center'><FontAwesomeIcon icon={ faBookmark } className='mb-2' /> WatchList</span>
                        <span className='d-flex flex-column align-items-center'><FontAwesomeIcon icon={ faCheck } className='mb-2' /> Seen</span>
                        <span className='d-flex flex-column align-items-center'><FontAwesomeIcon icon={ faThumbsUp } className='mb-2' /> Like</span>
                    </section>
                </div>

                {/* Descriptions */}
                <div className="col-sm-12 col-md-8 p-3">
                    <div className='row'>
                        {/* Movie title header */}
                        <div className="d-flex align-items-end col-12">
                            <h3 className="text-white">{ getMovieTitle() } </h3>
                            { getMovieYear() && (<h4>&nbsp;&nbsp;({ getMovieYear() })</h4>) }
                        </div>

                        {/* Movie trailers, featurettes */}
                        <div className="col-12">
                            <h4>Videos: Trailers, Teasers, Featurettes</h4>
                            <div className="row">
                                { hasContent('movieVideos') ? movieFullDetails.movieVideosFound.map((video: TMDBMovie, index: number) => {
                                    if(index === 0){ return null }
                                    return (<div className="col-6" key={video.key}><VideoPlayer movie={video} options={{ height: '200', width: '100%' }} /></div>)
                                  })
                                  : <strong><h5>No trailers were found for this movie.</h5></strong>
                                }
                            </div>
                        </div>

                        {/* SYNOPSIS */}
                        <div className="col-12 mt-3">
                            <h3>SYNOPSIS</h3>
                            <p >{ movieFullDetails.mainMovie.overview }</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>)
        : <>Loading...</>
    )
}

export default MoviePage