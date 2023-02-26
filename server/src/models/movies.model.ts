import mongoose from 'mongoose'

const MoviesSchema = new mongoose.Schema({
    content: {
        type: [],
        required: true
    }
})

const Movies = mongoose.model('Movies', MoviesSchema)

export default Movies