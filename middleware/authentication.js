const jwt = require("jsonwebtoken")
const {UnauthenticatedError} = require("../errors")

const authenticationMiddleware = async (req,res,next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnauthenticatedError("Not Authorized To View")
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId: decoded.userId, name: decoded.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Not Authorized To View")
    }
}

module.exports = authenticationMiddleware