const bcrypt = require("bcrypt");
const User = require("../models/users");
const { generateSign } = require("../../config/jwt");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const duplicateUser = await User.findOne({ userName });
    const duplicateEmail = await User.findOne({ email });

    if (duplicateUser) {
      return res
        .status(400)
        .json({ message: "This UserName is not available" });
    }

    if (duplicateEmail) {
      return res
        .status(400)
        .json({ message: "This Email is already registered" });
    }

    const newUser = new User({
      userName,
      email,
      password,
      role: "user",
    });

    const userSaved = await newUser.save();
    return res.status(201).json(userSaved);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User or password incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "User or password incorrect" });
    }

    const token = generateSign(user._id);
    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, userName: user.userName, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${validRoles.join(", ")}`,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    const updatedUser = await user.save();
    return res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUserRole,
};
