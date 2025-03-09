const { objectEnumNames } = require('@prisma/client/runtime/library')
const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something Went Wrong Please Try Again"
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.code && err.code === 11000) {
    const fieldName = Object.keys(err.keyValue)[0]
    const formattedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    customError.msg = `Duplicate Value Entered For ${formattedField} Field`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === "ValidationError") {
    const fieldNames = Object.keys(err.errors).map((field) => field.charAt(0).toUpperCase() + field.slice(1)).join(", ")
    customError.msg = `Please Provide ${fieldNames}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === "CastError") {
    customError.msg = `No Job Found With ID: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
return res.status(customError.statusCode).json( {msg: customError.msg} )
}

module.exports = errorHandlerMiddleware
