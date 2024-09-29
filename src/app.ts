import express from 'express'
import stationsRouter from './stations.router'
import { config } from 'dotenv'

config()

const PORT = process.env.PORT ?? 3000
const app = express()

app.use('/stations', stationsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
