const express = require("express");
const debug = require("debug");
const log = debug("app:index");
const cors = require("cors");
const userRouter = require("./src/routes/user.routes");
require("dotenv").config();

var corsOptions = {
  origin: "*",
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Users Routes
app.use("/api/v1/user", userRouter);

// 404 Page
app.use((req, res) => {
  res.status(404).send({ title: "404 Page Not-Found" });
});

app.listen(process.env.PORT, () =>
  log(`App started on port ${process.env.PORT}`)
);
