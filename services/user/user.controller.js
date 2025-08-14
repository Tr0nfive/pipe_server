    import User from "./user.model.js"
   
    


export async function addUser(req,res) {
    let {email,password,username} = req.body
    if(!email || !password || !username){
        return res.status(400).json({message:"missing info"})
    }
    
    if(await User.IsEmailTaken(email))
        return res.status(226).json({message:"email already exists"})
    let regPass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    if(!regPass.test(password))
        return res.status(404).json({message:"invalid password"})
    if(await User.IsUsernameExists(username))
        return res.status(226).json({message:"username already exists"})
    let user = new User(email,password,username)
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
    return res.status(200).json({message:"username isnt taken"})
    return res.status(400).json({message:"username already exists"})
}

export async function isEmailExists(req,res){
    let {email} = req.params
    if(!email)
    return res.status(400).json({message:"missing user info"})
    let Email = await User.IsEmailTaken(email)
    console.log('name', Email)
    if(Email ===null)
    return res.status(200).json({message:"email not found",Email})
    return res.status(400).json({message:"email already exists",Email})
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

export async function login(req,res) {
    let {email,password} = req.body
    console.log('email', email)
    console.log('password', password)
    if(!email || !password)
    return res.status(400).json({message:"missing info"})
    console.log('email', email)
    console.log('password', password)
    let user = await User.Login(email,password)
    console.log('user - controller', user)
    console.log('user', user)
    
    if(!user)
        return res.status(400).json({message:"the email or the password is incorrect"})
    else
    return res.status(200).json({message:"user logged in",user})

}

export async function updateUserEmail(req,res){
    let {id} = req.params
    let {email} = req.body
    if(!id || !email)
    return res.status(400).json({message:"missing info"})
    if(await User.IsEmailTaken(email))
        return res.status(226).json({message:"email already exits"})
    let user = await User.updateEmail(id,email)
    if(!user)
        return res.status(400).json({message:"user not found"})
    return res.status(200).json({message:"user updated",user})
}

export async function updateUserPassword(req,res){
    let {id} = req.params
    let {currPass,newPass,confirmPass} = req.body
    if(!id || !currPass || !newPass || !confirmPass)
        return res.status(400).json({message:"missing info"})
    
    
    
}

export async function updateUserUsername(req,res){
    let {id} = req.params
    let {username} = req.body
    if(!id || !username)
        return res.status(400).json({message:"missing info"})
    if(username.length < 3)
        return res.status(400).json({message:"invalid username"})
    if(await User.IsUsernameExists(username))
        return res.status(226).json({message:"username already exists"})
    let user = await User.updateUsername(id,username)
    if(!user)
        return res.status(400).json({message:"user not found"})
    return res.status(200).json({message:"user updated",user})
}

export async function getGamesStore(req,res){
    let games = await User.getGamesStore()
    if(!games)
        return res.status(404).json({message:"games not found"})
    return res.status(200).json({message:"games found",games})
}




