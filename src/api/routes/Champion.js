const { isAuth } = require("../../middlewares/auth");
const {
  deleteChampions,
  getChampionsByRole,
  getChampionsById,
  getChampions,
  updateChampions,
  postChampions,
} = require("../controllers/Champion");

const championsRouter = require("express").Router();

championsRouter.get("/role/:role", getChampionsByRole);
championsRouter.get("/:id", getChampionsById);
championsRouter.get("/", [isAuth], getChampions);
championsRouter.post("/", [isAuth], postChampions);
championsRouter.put("/:id", [isAuth], updateChampions);
championsRouter.delete("/:id", [isAuth], deleteChampions);

module.exports = championsRouter;
