import { ROLES } from "../services/Roles.js";

export  async function authUser(req, res, next){
    let { role } = req.body;
    if(role != ROLES.USER)
        return res.status(403).json({message:"you dont have access ,auth faild",
    currRole:role,reqRole:ROLES.USER})
    next()

}

export async function authPublisher(req, res, next){
    let { role } = req.body;
    if(role != ROLES.PUBLISHER)
        return res.status(403).json({message:"you dont have access ,auth faild",
    currRole:role,reqRole:ROLES.PUBLISHER})
    next()
}

export async function authDev(req, res, next){
    let { role } = req.body;
    if(role != ROLES.DEV)
        res.status(403).json({message:"you dont have access ,auth faild",
    currRole:role,reqRole:ROLES.DEV})
    next()
}