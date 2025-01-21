const { isAuth } = require('../../middlewares/auth')
const upload = require('../../middlewares/upload')
const {
  deleteChampions,
  getChampionsByRole,
  getChampionsById,
  getChampions,
  updateChampions,
  postChampions,
  getMyChampions
} = require('../controllers/Champion')

const championsRouter = require('express').Router()

championsRouter.get('/role/:role', getChampionsByRole)
championsRouter.get('/:id', getChampionsById)
championsRouter.get('/', [isAuth], getChampions)
championsRouter.get('/my-champions', [isAuth], getMyChampions)
championsRouter.post('/', [isAuth, upload.single('img')], postChampions)
championsRouter.put('/:id', [isAuth], updateChampions)
championsRouter.delete('/:id', [isAuth], deleteChampions)

module.exports = championsRouter
