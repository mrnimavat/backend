"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "/../config/config.js"))[env];
const db = {};
let sequelize = {};

// Create a Sequelize connection to the database using the URL in config/config.js
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config);
}

const camelCase = (str) => {
  const firstChar = str.charAt(0).toUpperCase();
  str = str.slice(1);
  return (
    firstChar +
    str
      .toLowerCase()
      .replace(/([-_][a-z])/g, (ltr) => ltr.toUpperCase())
      .replace(/[^a-zA-Z]/g, "")
  );
};

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    const modelPath = path.join(__dirname, file);
    const modelDefaultOptions = {
      paranoid: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTableName: true,
    };
    try {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes,
        modelDefaultOptions
      );
      // model.sync({ alter: true })
      db[camelCase(model.name)] = model;
    } catch (e) {
      throw Error(`Exception ${e} occurred while loading model ${modelPath}`);
    }
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
