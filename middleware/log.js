import {writeFile ,appendFile,mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { __dirname } from '../global.js'

export async function writeLogEntry(req,res,next) {
    
    let clientIP=  req.ip || req.connection.remoteAddress

    let logFormat  = `${clientIP} - ${new Date().toISOString()} - ${req.method} - ${req.baseUrl}${req.Url} - ${res.statusCode}\n`

    let logDir = path.join(__dirname, 'logs')
    let logFile = path.join(logDir, `access_DB_${new Date().toISOString().split('T')[0]}.log`)

    try {
        if (!existsSync(logDir)) {
            await mkdir(logDir)
        }
        if (!existsSync(logFile)) 
            await writeFile(logFile, logFormat) // Create the log file if it doesn't exist
        else
            await appendFile(logFile, logFormat)
    } catch (error) {
        console.error("Error writing log entry:", error)
    }
    if(next)
        next()
}


export async function writeLogDB(error,data,next) {
     
    let func = data.func
    delete data.func
    console.log('data', data)
    let format = `${func} - ${error} - ${JSON.stringify(data)}\n`
    let logDir = path.join(__dirname, 'logs')
    let logFile = path.join(logDir, `access_${new Date().toISOString().split('T')[0]}.log`)

    try {
        if (!existsSync(logDir)) {
            await mkdir(logDir)
        }
        if (!existsSync(logFile)) 
            await writeFile(logFile, format) // Create the log file if it doesn't exist
        else
            await appendFile(logFile, format)
    } catch (error) {
        console.error("Error writing log entry:", error)
    }
    if(next)
        next()
}
