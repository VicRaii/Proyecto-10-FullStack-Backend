const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinaryConfig')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req, file) => 'png', // Puedes cambiar el formato si es necesario
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
  }
})

const upload = multer({ storage })

module.exports = upload
