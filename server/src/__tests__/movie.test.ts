import { MongoMemoryReplSet } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

let mongoServer: MongoMemoryReplSet

beforeEach(async () => {
    mongoServer = await MongoMemoryReplSet.create()
    
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(mongoServer.getUri(), { dbName: "kmovies" + Math.floor(Math.random() * 10) })
})

afterEach(async () => {
    if(mongoServer)await mongoServer.stop()
    await mongoose.disconnect()
})

describe('MoviesController', () => {
    it('GET="/api/movie/all" should get all movies', async () => {

        return request(app)
                .get('/api/movie/all')
                .expect(200)
                .then((response: any) => {
                    //console.log(response.body)
                    //expect(response.body.length).toBeGreaterThan(0)
                })
                
    })
})