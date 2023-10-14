// db.js

const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//       connectionLimit: 10,
//       host: 'localhost',
//       user: 'root',
//       password: 'Sp@17111997',
//       database: 'swaradb',
//         connectionLimit: 10,
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     });
    
// pool.on('error', (err) => {
//       console.error('Database connection error:', err);
//     });
    
// module.exports = pool;

// const Sequelize = require('sequelize'); 
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
//     dialect: 'mysql',
//     host:'localhost'
// });

// module.exports = sequelize

// const Sequelize = require('sequelize');

// // require('dotenv').config();
const sequelize = new Sequelize('swaradb', 'root', 'root',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize
