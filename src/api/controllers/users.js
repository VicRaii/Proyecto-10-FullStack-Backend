const bcrypt = require('bcrypt')
const User = require('../models/users')
const { generateSign } = require('../../config/jwt')
const cloudinary = require('cloudinary').v2

const getPublicId = (url) => {
  const segments = url.split('/')
  const fileName = segments[segments.length - 1]
  return fileName.split('.')[0]
}

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
      password: hashedPassword,
      profilePicture,
      role: 'user'
    })

    const userSaved = await newUser.save()

    const token = generateSign(userSaved._id)

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: userSaved._id,
        userName: userSaved.userName,
        profilePicture: userSaved.profilePicture,
        role: userSaved.role
      },
      token
    })
  } catch (error) {
    console.error('Server Error:', error)
    next(error)
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

    if (userName && userName !== user.userName) {
      const duplicateUser = await User.findOne({ userName })
      if (duplicateUser) {
        return res
          .status(400)
          .json({ message: 'This UserName is not available' })
      }
    }

    if (email && email !== user.email) {
      const duplicateEmail = await User.findOne({ email })
      if (duplicateEmail) {
        return res
          .status(400)
          .json({ message: 'This Email is already registered' })
      }
    }

    if (profilePicture && user.profilePicture) {
      const publicId = getPublicId(user.profilePicture)
      await cloudinary.uploader.destroy(publicId)
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

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  updateUserRole
}
