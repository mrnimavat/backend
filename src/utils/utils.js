require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const md5 = require("md5");

const successData = (res, data, code = 200) => {
  return res.status(code).json({ ...data, statusCode: code });
};

const errorData = (res, data, code) => {
  return res.status(code ? code : 500).json({ ...data, statusCode: code });
};

const getHash = (str) => {
  const salted = process.env.SALT_STRING + str;
  return md5(salted);
};
const generateToken = (uuid) => {
  let payLoad = {
    user: {
      id: uuid,
    },
  };
  return jwt.sign(payLoad, process.env.JWT_SECRET_KEY, {
    expiresIn: 900,
  });
};

module.exports = {
  successData,
  errorData,
  getHash,
  generateToken,
};
