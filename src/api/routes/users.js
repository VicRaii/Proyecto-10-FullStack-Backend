const { isAdmin, isAuth } = require("../../middlewares/auth");
const {
  getUsers,
  updateUserRole,
  registerUser,
  loginUser,
} = require("../controllers/users");

const usersRouter = require("express").Router();

usersRouter.get("/", [isAdmin], getUsers);
usersRouter.put("/role/:id", [isAdmin], updateUserRole);
usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

module.exports = usersRouter;
