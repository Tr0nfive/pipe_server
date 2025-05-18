
import express from 'express'
import 'dotenv/config'

import userRouter from './user/users.router.js'
import storeRouter from './store/store.router.js'
import publishRouter from './publisher/publish.router.js'
import devRouter from './dev/devs.router.js'




const server = express()


const PORT = process.env.PORT  

server.use(express.json())

server.use('/api/user',userRouter)
server.use('/api/store',storeRouter)
server.use('/api/publisher',publishRouter)
server.use('/api/developers',devRouter)



server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
})


