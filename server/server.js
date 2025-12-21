import express from 'express'
import cors from 'cors'
import './dbConnect.js'

import arouter from './Routes/user.route.js'

const server = express()
server.use(cors())
server.use(express.json())

import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT

server.use('/api/auth', arouter)

server.listen(PORT, ()=>{
        console.log(`Server is running at http://localhost:${PORT} 👍`);
})