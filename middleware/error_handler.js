import { writeLogDB , writeLogEntry } from "./log.js"

export function errorHandler (err,req,res,next) {
    // console.error(err.meesage)
    // res.status(500).json({error: err.message})

    writeLogEntry(req ,res)
    
}

