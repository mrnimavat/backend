require("dotenv").config();

const config = {
  development: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE_NAME,
    host: process.env.PG_HOST,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
};

module.exports = config;
