const { isAuth } = require("../../middlewares/auth");
const {
  deleteChampions,
  getChampionsByRole,
  getChampionsById,
  getChampions,
  postChampions,
  updateChampions,
} = require("../controllers/Champion");

const championsRouter = require("express").Router();

championsRouter.get("/role/:role", getChampionsByRole);
championsRouter.get("/:id", getChampionsById);
championsRouter.get("/", getChampions);
championsRouter.post("/", postChampions);
championsRouter.put("/:id", updateChampions);
championsRouter.delete("/:id", deleteChampions);

module.exports = championsRouter;
