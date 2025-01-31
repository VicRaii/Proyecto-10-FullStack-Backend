require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./src/config/db')
const mainRouter = require('./src/api/routes/main')
const errorHandler = require('./src/middlewares/errorHandler')

const app = express()

app.use(express.json())

const corsOptions = {
  origin: [
    'https://proyecto-10-full-stack-frontend.vercel.app',
    'https://proyecto-10-full-stack-frontend-cnkei7tfg-vicraiis-projects.vercel.app',
    'http://localhost:5173' // Local server for testing
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

connectDB()

app.use('/api/v1/', mainRouter)

app.use((err, req, res, next) => {
  if (err.message === 'El archivo debe ser una imagen') {
    return res.status(400).json({ message: err.message })
  }
  next(err)
})

app.use('*', (req, res, next) => {
  return res.status(404).json('Route Not Found')
})

app.use(errorHandler)

app.use((err, req, res, next) => {
  console.error('Error capturado:', err)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

app.listen(3000, () => {
  console.log('Server started on: http://localhost:3000/')
})
