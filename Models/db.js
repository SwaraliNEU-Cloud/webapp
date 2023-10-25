const Sequelize = require("sequelize");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("---------")

console.log(process.env.NODE_ENV);

console.log(process.env.DB_NAME);

console.log(process.env.DB_USER);

console.log(process.env.DB_PASSWORD);

console.log(process.env.DB_HOST);

console.log("---------")
var port = process.env.DB_PORT;
// require("dotenv").config(); // Load environment variables from .env
const sequelize = new Sequelize({

  database: process.env.DB_NAME,

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  host: process.env.DB_HOST,

  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,

  dialect: "mysql",

});

 

module.exports = sequelize;

 