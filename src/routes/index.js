const express = require("express");
const userRouter = require("../routes/user.routes");
const { limiter } = require("../middleware/ratelimit.middleware");

const Router = express.Router();

Router.use("/api/v1/user", limiter, userRouter);

module.exports = { Router };
