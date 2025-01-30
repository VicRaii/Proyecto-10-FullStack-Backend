const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folderName = req.body.folder || 'ProfilePictures'

    if (!file.mimetype.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen')
    }

    return {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'gif', 'jpeg', 'webp', 'avif']
    }
  }
})

const upload = multer({ storage })

module.exports = upload
