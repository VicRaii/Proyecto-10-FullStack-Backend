const User = require('../api/models/users')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const { id } = verifyJwt(token) // Verifica y decodifica el token
    const user = await User.findById(id) // Busca el usuario por ID en la base de datos
    if (!user) {
      return res.status(401).json({ message: 'User not found or invalid' })
    }

    // Elimina el campo de contraseña por seguridad
    user.password = undefined
    req.user = user // Asocia el usuario autenticado con la solicitud
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' })
    }
    next(error) // Maneja otros errores
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const { id } = verifyJwt(token) // Verifica y decodifica el token
    const user = await User.findById(id) // Busca el usuario por ID
    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access restricted to administrators' })
    }

    // Elimina el campo de contraseña por seguridad
    user.password = undefined
    req.user = user // Asocia el usuario autenticado con la solicitud
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
