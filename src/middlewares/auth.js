const User = require("../api/models/users");
const { verifyJwt } = require("../config/jwt");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      const error = new Error("Invalid authorization");
      error.statuscode = 401;
      throw error;
    }
    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyJwt(parsedToken);
    const user = await User.findById(id);
    if (!user) {
      const error = new Error("Invalid user");
      error.statuscode = 401;
      throw error;
    }

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
    const parsedToken = token.replace("Bearer ", "");
    const { id } = verifyJwt(parsedToken);
    const user = await User.findById(id);
    if (!user || user.role !== "admin") {
      const error = new Error("Access only allowed for admin");
      error.statusCode = 403;
      throw error;
    }
    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAuth, isAdmin };
