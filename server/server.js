import express from 'express'
import cors from 'cors'
import './dbConnect.js'

import authRouter from './routes/user.route.js'
import customerRouter from './routes/customer.route.js'

import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 6030


const server = express()
server.use(cors())
server.use(express.json())


server.use('/api/auth', authRouter);
server.use('/api/customers', customerRouter);

server.listen(PORT, ()=>{
        console.log(`Server is running at http://localhost:${PORT} 👍`);
})