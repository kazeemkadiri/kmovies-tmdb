'use strict'

import express from 'express'
import movie from '@controllers/movie.controller'
let router = express.Router()

router.get('/get/:id', movie.getMovieVideos)
router.post('/genres/get', movie.getMoviesByGenre)
router.post('/release-year/get', movie.getMoviesByReleaseYear)
router.post('/search', movie.search)
router.get('/all', movie.getAllMovies)

export default router
