const User = require('../api/models/users')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const { id } = verifyJwt(token)
    const user = await User.findById(id)
    if (!user) {
      return res.status(401).json({ message: 'User not found or invalid' })
    }

    user.password = undefined
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' })
    }
    next(error)
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const { id } = verifyJwt(token)
    const user = await User.findById(id)
    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access restricted to administrators' })
    }

    user.password = undefined
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' })
    }
    next(error)
  }
}

module.exports = { isAuth, isAdmin }
