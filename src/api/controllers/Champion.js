const Champion = require('../models/Champion')
const jwt = require('jsonwebtoken')

const getMyChampions = async (req, res) => {
  try {
    const userId = req.user._id
    const champions = await Champion.find({ creator: userId })
    res.json(champions)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching champions' })
  }
}

const getChampions = async (req, res) => {
  try {
    const champions = await Champion.find()
    res.json(champions)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching champions' })
  }
}

const getChampionsByRole = async (req, res) => {
  try {
    const { role } = req.params
    const champions = await Champion.find({ role })
    res.json(champions)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching champions by role' })
  }
}

const getChampionsById = async (req, res) => {
  try {
    const { id } = req.params
    const champion = await Champion.findById(id)
    if (!champion) {
      return res.status(404).json({ message: 'Champion not found' })
    }
    res.json(champion)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching champion by ID' })
  }
}

const postChampions = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const newChampion = new Champion({
      img: req.file.path,
      name: req.body.name,
      role: req.body.role,
      creator: userId
    })

    const championSaved = await newChampion.save()
    return res.status(201).json(championSaved)
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    return next(error)
  }
}

const updateChampions = async (req, res, next) => {
  try {
    const { id } = req.params
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const champion = await Champion.findById(id)
    if (!champion) {
      return res.status(404).json({ message: 'Champion not found' })
    }

    if (champion.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const updatedChampion = await Champion.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    return res.status(200).json(updatedChampion)
  } catch (error) {
    return next(error)
  }
}

const deleteChampions = async (req, res, next) => {
  try {
    const { id } = req.params
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const champion = await Champion.findById(id)
    if (!champion) {
      return res.status(404).json({ message: 'Champion not found' })
    }

    if (champion.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await Champion.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Champion deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getMyChampions,
  getChampions,
  getChampionsByRole,
  getChampionsById,
  postChampions,
  updateChampions,
  deleteChampions
}
