const User = require("../models/User")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError, UnauthenticatedError} = require("../errors")

const register = async (req,res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError("Please Provide Email And Password")
    }
    const user = await User.findOne({ email })
    if(!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const isPassword = await user.comparePassword(password)
    console.log(isPassword)
    if(!isPassword) {
        throw new UnauthenticatedError("Invalid Password")
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name}, token})
}

module.exports = { 
    register,
    login
}