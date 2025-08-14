
import express from 'express'
import 'dotenv/config'

//middleware logger third-party 
import morgan from 'morgan'
import cors from 'cors'

import userRouter from './services/user/users.router.js'
import storeRouter from './services/store/store.router.js'
import publishRouter from './services/publisher/publish.router.js'
import devRouter from './services/dev/devs.router.js'
import {errorHandler} from './middleware/error_handler.js'
import {apiLimiter} from './middleware/rateLimit.js'





const server = express()


//middleware
server.use(cors({
    origin:["http://localhost:3000","https://pipe-server-4la3.onrender.com","http://localhost:3001"],
    
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}))
server.use(morgan('dev'))

//add json and form support
server.use(express.json({limit: '50mb'}))
server.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT  
server.use('/api/user',apiLimiter,userRouter)
server.use('/api/store',apiLimiter,storeRouter)
server.use('/api/publisher',apiLimiter,publishRouter)
server.use('/api/developers',apiLimiter,devRouter)


//error handler
server.use(errorHandler)

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
})


