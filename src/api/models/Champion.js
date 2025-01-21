const mongoose = require('mongoose')

const championSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: [String],
      required: true,
      enum: ['fighter', 'assassin', 'marksman', 'tank', 'mage', 'support']
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    } // Asegúrate de que el campo creator esté definido
  },
  {
    timestamps: true,
    collection: 'champions'
  }
)

const Champion = mongoose.model('Champion', championSchema)
module.exports = Champion
