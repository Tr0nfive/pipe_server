
import { error } from 'console'
import Store from './store.model.js'

export async function getGamesStore(req,res){
    let games = await Store.getGamesStore()
    if(!games)
        return res.status(404).json({message:"games not found"})
    return res.status(200).json({message:"games found",games})
}

export async function getGameById(req,res){
    let {id} = req.params
    if(!id)
        return res.status(400).json({message:"missing game info"})
    let game = await Store.getGameById(id)
    if(!game)
        return res.status(404).json({message:"game not found"})
    return res.status(200).json({message:"game found",game})
}

export async function searchGameByName(req,res){
    let {name} = req.params
    if(!name)
        return res.status(400).json({message:"missing game info"})
    let games = await Store.searchGameByName(name)
    if(!games || games.length === 0)
        return res.status(404).json({message:"games not found"})
    return res.status(200).json({message:"games found",games})
}

export async function getGameStorePage(req,res){
    let {id} = req.params
    if(!id)
        return res.status(400).json({message:"missing game info"})
    let game = await Store.getGameStorePage(id)
    if(!game)
        return res.status(404).json({message:"game not found"})
    return res.status(200).json({message:"game found",game})
}

export async function getGameRequirements(req,res){
    let {id} = req.params
    if(!id)
        return res.status(400).json({message:"missing game info"})
    let require = await Store.getGameRequirements(id)
    if (!require)
        return res.status(400).json({message:"no game req were found" })
    return res.status(200).json({message:"got game req" ,data : require})
}

export async function getHardwareDb(req,res){
    try{

        let hardwareDb = await Store.getHardwareDb()
        if(!hardwareDb)
           return res.status(404).json({message:"unknow error"})
        return res.status(200).json({data:hardwareDb})
    }catch(err){
        return res.status(404).json({message:"couldnt get hardwareDb",error:err.message})
    }

}

export async function saveGameBenchmarkVerdict(req,res){
    const {id} = req.params
    const{hardware,verditct} =req.body
    if (!id||!hardware||!verditct)
        return res.status(400).json({message:"missing info"})
    const send = Store.saveGameBenchmarkVerdict(id,hardware,verditct)
    if(!send)
        return res.status(404).json({message:"couldnt save benchmark"})
    return res.status(200).json({message:"saved benchmark"})
}   

