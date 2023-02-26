import express, { Application, NextFunction, Request, Response } from 'express'
import usersRoutes from './routes/users.routes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'node:path'
import { Tracer } from './utils/tracer' // METHODS TRACER !
import movieRoutes from '@routes/movie.routes'

const app: Application = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
)
app.use(Tracer)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.resolve(__dirname, 'public')))

app.use('/api/users', usersRoutes)
app.use('/api/movie', movieRoutes)

if(process.env.NODE_ENV === 'production'){

  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })
  
}

// !
// TODO: catch error !
// !

export default app
