// db.js

const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');
require('dotenv').config(); 

const db_address = process.env.DB_ENDPOINT.toString().split(':')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    dialect: 'mysql',
    host: db_address[0],
    port: parseInt(db_address[1]),
});



module.exports = sequelize
