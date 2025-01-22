const bcrypt = require('bcrypt')
const User = require('../models/users')
const { generateSign } = require('../../config/jwt')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

const registerUser = async (req, res, next) => {
  try {
    console.log('Request file:', req.file) // Verifica si el archivo está siendo recibido correctamente

    const { userName, email, password } = req.body
    const profilePicture = req.file ? req.file.path : null

    if (!userName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' })
    }

    const duplicateUser = await User.findOne({ userName })
    const duplicateEmail = await User.findOne({ email })

    if (duplicateUser) {
      return res.status(400).json({ message: 'This UserName is not available' })
    }

    if (duplicateEmail) {
      return res
        .status(400)
        .json({ message: 'This Email is already registered' })
    }

    const newUser = new User({
      userName,
      email,
      password,
      profilePicture, // Asegúrate de que se guarda correctamente la URL de Cloudinary
      role: 'user'
    })

    const userSaved = await newUser.save()
    return res.status(201).json(userSaved) // Devuelve el usuario con la URL de la imagen
  } catch (error) {
    console.error('Server Error:', error) // Asegúrate de que el error esté siendo logueado
    next(error)
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' })
    }

    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: 'User or password incorrect' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'User or password incorrect' })
    }

    const token = generateSign(user._id)
    return res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, userName: user.userName, role: user.role },
      token
    })
  } catch (error) {
    console.error('Register Error:', error)
    return res
      .status(500)
      .json({ message: 'An unexpected error occurred', error: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { userName, email } = req.body
    const profilePicture = req.file ? req.file.path : null

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verificar si el nuevo nombre de usuario ya existe
    if (userName && userName !== user.userName) {
      const duplicateUser = await User.findOne({ userName })
      if (duplicateUser) {
        return res
          .status(400)
          .json({ message: 'This UserName is not available' })
      }
    }

    // Verificar si el nuevo correo electrónico ya existe
    if (email && email !== user.email) {
      const duplicateEmail = await User.findOne({ email })
      if (duplicateEmail) {
        return res
          .status(400)
          .json({ message: 'This Email is already registered' })
      }
    }

    user.userName = userName || user.userName
    user.email = email || user.email
    if (profilePicture) {
      user.profilePicture = profilePicture
    }

    const updatedUser = await user.save()
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Update Error:', error)
    next(error)
  }
}

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const validRoles = ['admin', 'user']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`
      })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.role = role
    const updatedUser = await user.save()
    return res
      .status(200)
      .json({ message: 'User role updated successfully', user: updatedUser })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  updateUserRole
}
