import User from "./user.model.js"




export async function addUser(req, res) {
    let { email, password, username } = req.body
    if (!email || !password || !username) {
        return res.status(400).json({ message: "missing info" })
    }

    if (await User.IsEmailTaken(email))
        return res.status(226).json({ message: "email already exists" })
    let regPass = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    if (!regPass.test(password))
        return res.status(404).json({ message: "invalid password" })
    if (await User.IsUsernameExists(username))
        return res.status(226).json({ message: "username already exists" })
    let user = new User(email, password, username)
    await user.addUser()
    return res.status(200).json({ message: "user added", user })

}

export async function isUserExistsById(req, res) {
    let { id } = req.params
    if (!id)
        return res.status(400).json({ message: "missing user info" })
    let user = await User.isUserExists(id)
    if (!user)
        return res.status(404).json({ message: "user not found" })
    else
        return res.status(200).json({ message: "user found", user })

}

export async function isUsernameExists(req, res) {
    let { username } = req.params
    if (!username)
        return res.status(400).json({ message: "missing user info" })
    if (username.length < 3)
        return res.status(400).json({ message: "invalid username" })
    let name = await User.IsUsernameExists(username)
    console.log(name)
    if (!name)
        return res.status(200).json({ message: "username isnt taken" })
    return res.status(400).json({ message: "username already exists" })
}

export async function isEmailExists(req, res) {
    let { email } = req.params
    if (!email)
        return res.status(400).json({ message: "missing user info" })
    let Email = await User.IsEmailTaken(email)
    console.log('name', Email)
    if (Email === null)
        return res.status(200).json({ message: "email not found", Email })
    return res.status(400).json({ message: "email already exists", Email })
}



export async function getUserLibary(req, res) {
    let { id } = req.params
    if (!id)
        return res.status(400).json({ meassage: "missing user info" })
    let data = await User.getUserLibary(id)
    if (!data || data.length === 0)
        return res.status(404).json({ message: "library is empty" })
    return res.status(200).json({ message: "library found", data })


}

export async function login(req, res) {
    let { email, password } = req.body
    console.log('email', email)
    console.log('password', password)
    if (!email || !password)
        return res.status(400).json({ message: "missing info" })
    console.log('email', email)
    console.log('password', password)
    let user = await User.Login(email, password)
    console.log('user - controller', user)
    console.log('user', user)

    if (!user)
        return res.status(400).json({ message: "the email or the password is incorrect" })
    else
        return res.status(200).json({ message: "user logged in", token: user })

}

export async function updateUserEmail(req, res) {
    let { id } = req.params
    let { email } = req.body
    if (!id || !email)
        return res.status(400).json({ message: "missing info" })
    if (await User.IsEmailTaken(email))
        return res.status(226).json({ message: "email already exits" })
    let user = await User.updateEmail(id, email)
    if (!user)
        return res.status(400).json({ message: "user not found" })
    return res.status(200).json({ message: "user updated", user })
}

export async function updateUserPassword(req, res) {
    let { id } = req.params
    let { currPass, newPass, confirmPass } = req.body
    if (!id || !currPass || !newPass || !confirmPass)
        return res.status(400).json({ message: "missing info" })



}

export async function updateUserUsername(req, res) {
    let { id } = req.params
    let { username } = req.body
    if (!id || !username)
        return res.status(400).json({ message: "missing info" })
    if (username.length < 3)
        return res.status(400).json({ message: "invalid username" })
    if (await User.IsUsernameExists(username))
        return res.status(226).json({ message: "username already exists" })
    let user = await User.updateUsername(id, username)
    if (!user)
        return res.status(400).json({ message: "user not found" })
    return res.status(200).json({ message: "user updated", user })
}



export async function addGameToUserWishlist(req, res) {
    let { userId, gameId } = req.body

    
    if (!userId || !gameId)
        return res.status(400).json({ message: "missing info" })
    
    let result = await User.addGameToUserWishlist(userId, gameId)

    if (result === "exists")
        return res.status(226).json({ message: "game already in wishlist" })
    console.log('result', result)
    if (!result)
        return res.status(400).json({ message: "game wasnt added to wishlist" })
    return res.status(200).json({ message: "game added to wishlist" })
}

export async function getUserWishlist(req, res) {
    let { id } = req.params

    if (!id)
        return res.status(400).json({ message: "missing user info" })
    let user = await User.isUserExists(id)
    if (!user)
        return res.status(404).json({ message: "user not found" })
    let userData = await User.getUserWishlist(id)

    if (!userData)
        return res.status(404).json({ message: "user data not found" })
    console.log('userData', userData)

    if (!userData || userData.length === 0)
        return res.status(404).json({ message: "wishlist is empty" })
    return res.status(200).json({ message: "wishlist found", userData })
}

export async function removeGameFromUserWishlist(req, res) {
    let { userId, gameId } = req.body

    if (!userId || !gameId)
        return res.status(400).json({ message: "missing info" })
    let user = await User.isUserExists(userId)
    if (!user)
        return res.status(404).json({ message: "user not found" })
    let game = await User.getGameById(gameId)
    if (!game)
        return res.status(404).json({ message: "game not found" })
    let result = await User.removeGameFromUserWishlist(userId, gameId)

    if (!result)
        return res.status(400).json({ message: "game wasnt removed from wishlist" })
    return res.status(200).json({ message: "game removed from wishlist" })
}

export async function isGameInUserWishlist(req, res) {
    let { userId, gameId } = req.params
    if (!userId || !gameId)
        return res.status(400).json({ message: "missing info" })

    let userData = await User.getUserWishlist(userId)
    if (!userData)
        return res.status(404).json({ message: "user data not found" })
    console.log('userData', userData)
    if (!userData.wishlist || !userData.wishlist.includes(gameId))
        return res.status(205).json({ message: "game not in wishlist" })
    return res.status(200).json({ message: "game in wishlist" })
}

export async function addGameToUserLibary(req, res) {
    let { userId, gameId } = req.body
    if (!userId || !gameId)
        return res.status(400).json({ message: "missing info" })
    let data = await User.addGameToUserLibary(userId, gameId)
    if (!data)
        return res.status(400).json({ message: "game wasnt added to library" })
    return res.status(200).json({ message: "game added to library" })
}
