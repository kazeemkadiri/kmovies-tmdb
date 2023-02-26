export type TMDBMovie = {
    originalTitle: string,
    posterPath: string,
    id: number,
    backdropPath: string,
    key: string,
    name: string,
    overview: string,
}

export type TMDBMovieReleaseDate = {
    releaseDates: { releaseDate: string } []
}

export type TMDBMoviePosterImage = {
    aspectRatio: number,
    height: number,
    iso6391: null,
    filePath: string,
    voteAverage: number,
    voteCount: number,
    width: number
}

export type TMDBMovieBackdropImage = TMDBMoviePosterImage

export type MovieFullDetails = {
    mainMovie: TMDBMovie,
    movieVideosFound: TMDBMovie[],
    moviePosterImages: TMDBMoviePosterImage[],
    movieBackdropImages: TMDBMovieBackdropImage[],
    movieReleaseDates: TMDBMovieReleaseDate[],
}