const jwt = require('jsonwebtoken')

const generateSign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1y'
  })
}

const verifyJwt = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new Error('Token verification failed')
  }
}

module.exports = { generateSign, verifyJwt }
