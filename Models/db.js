
const Sequelize = require('sequelize'); 
// Load dotenv only in development environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log("---------")
console.log(process.env.NODE_ENV);
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log("---------")


const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    dialect: 'mysql',
    // dialect: 'mariadb',
    host: process.env.DB_HOST,
    // port: 3306,sadasd

});

module.exports = sequelize