import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes    from './routes/auth'
import profileRoutes from './routes/profile'
import albumRoutes   from './routes/albums'
import photoRoutes   from './routes/photos'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',    authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/albums',  albumRoutes)
app.use('/api/photos',  photoRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`API running → http://localhost:${PORT}`)
})

logger.Log("Swapnil Nakade")
logger.Log("Chaitanya Yeole")
