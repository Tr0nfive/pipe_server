    import User from "./user.model.js"
    import bcrypt from 'bcryptjs'

export async function get_all_users (req,res) {

let users  =  await User.getUsers()
if(!users)
    return res.status(404).json({message:"no users were found"}).send()

else
    return res.status(200).json({message:"seccesus",users}).send()

}
export async function getUserById(req,res){

    //let id = req.params.id
    let { id } = req.params

    let user = await User.getUsers(id)

   if(!user)
    return res.status(404).json({message:"user were not found"})

   else
    return res.status(200).json({message:"seccesus",user})
}

export async function addUser(req,res) {
    let {email,password,username} = req.body
    if(!email || !password || !username){
        return res.status(400).json({message:"missing info"})
    }
    
    if(await User.IsEmailTaken(email))
        return res.status(404).json({message:"email already exists"})
    let regPass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    if(!regPass.test(password))
        return res.status(404).json({message:"invalid password"})
    if(await User.IsUsernameExists(username))
        return res.status(404).json({message:"username already exists"})
    let newPass = bcrypt.hashSync(password,12)
    let user = new User(email,newPass,username)
    await user.addUser()
    return res.status(200).json({message:"user added",user})

}

export async function isUserExistsById(req,res){
    let {id} = req.params
    if(!id)
    return res.status(400).json({message:"missing user info"}) 
    let user = await User.isUserExists(id)
    if(!user)
    return res.status(404).json({message:"user not found"})
    else
    return res.status(200).json({message:"user found",user}) 

}

export async function isUsernameExists(req,res){
    let {username} = req.params
    if(!username)
    return res.status(400).json({message:"missing user info"})
    if(username.length <3)
        return res.status(400).json({message:"invalid username"})
    let name = await User.IsUsernameExists(username)
    console.log(name)
    if(!name)
    return res.status(200).json({message:"username not found"})
    return res.status(300).json({message:"username already exists"})
}

export async function isEmailExists(req,res){
    let {email} = req.params
    if(!email)
    return res.status(400).json({message:"missing user info"})
    let name = await User.IsEmailTaken(email)
    console.log('name', name)
    if(name ===null)
    return res.status(200).json({message:"email not found"})
    return res.status(300).json({message:"email already exists"})
}



export async function getUserLibary (req,res) {
let {id} = req.params
if(!id)
    return res.status(400).json({meassage:"missing user info"})
const exists = await User.isUserExists(id)
if(!exists)
    return res.status(404).json({message:"user not founded"})
let user = await User.getUsers(id)
return res.status(200).json({message:"user found",user})

}

export async function login(res,req) {
    let {email,password} = req.body
    if(!email || !password)
    return res.status(400).json({message:"missing info"})
    let user = await User.login(email,password)

}

export function get_user_data (req,res) {
res.send("get_user_data")
}
export function get_game_store_data (req,res) {
res.send("get_game_store_data")
}

export function get_game_install_data (req,res) {
res.send("get_game_install_data")
}