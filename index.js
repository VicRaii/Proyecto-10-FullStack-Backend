require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const mainRouter = require("./src/api/routes/main");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://proyecto-10-full-stack-frontend.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

connectDB();

app.use("/api/v1/", mainRouter);

app.use("*", (req, res, next) => {
  return res.status(404).json("Route Not Found");
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log(
    "Server started on https://proyecto-10-full-stack-frontend.vercel.app"
  );
});
