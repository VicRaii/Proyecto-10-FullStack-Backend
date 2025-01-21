const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: false,
      enum: ['admin', 'user'],
      default: 'user'
    },
    favourites: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: 'champions'
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
