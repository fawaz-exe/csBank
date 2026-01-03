import express from 'express'
import cors from 'cors'
import './dbConnect.js'

import authRouter from './routes/user.route.js'
import customerRouter from './routes/customer.route.js'
import tellerRouter from './routes/teller.route.js'
import accountRouter from './routes/account.route.js'

import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 6030


const server = express()
server.use(cors())
server.use(express.json())


server.use('/api/auth', authRouter);
server.use('/api/customers', customerRouter);
server.use('/api/tellers', tellerRouter);
server.use('/api/accounts', accountRouter);

server.use((req, res) => {
    res.status(404).json({ error: "Route not found ! ⚠️" });
});

server.listen(PORT, ()=>{
        console.log(`Server is running at http://localhost:${PORT} 👍`);
})