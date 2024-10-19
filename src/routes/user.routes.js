const express = require("express");
const userController = require("../controller/user.controller");
const userRouter = express.Router();

userRouter.post("/createUser", userController.createUser);

userRouter.post("/loginUser", userController.loginUser);

userRouter.get("/logoutUser/:uuid", userController.logoutUser);

module.exports = userRouter;
