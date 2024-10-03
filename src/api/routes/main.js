const championsRouter = require("./Champion");
const usersRouter = require("./users");

const mainRouter = require("express").Router();

mainRouter.use("/champions", championsRouter);
mainRouter.use("/users", usersRouter);

module.exports = mainRouter;
