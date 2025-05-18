import Devs from "./devs.model.js";

export async function getDev(req,res){
let {id} = req.params
if(!id)
    return res.status(404).json({message:"didnt get dev id"})
let dev = await Devs.getDevByID(id)
if(!dev)
    return res.status(400).json({message:"didnt find dev info"},dev)
return res.status(200).json({message:"found dev",dev})
}

export async function createDev(req,res){
    let {name,email,password} = req.body
    if(!name || !email || !password)
        return res.status(404).json({meassage:"missing info"})
    let dev = new Devs(name,email,password)
    await dev.createDeveloper()
    return res.status(200).json({message:"created dev",dev})

}