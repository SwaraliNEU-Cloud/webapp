// db.js


const Sequelize = require('sequelize');

// require('dotenv').config();

 

const sequelize = new Sequelize('swaradb', 'root', 'Sp@17111997',{

    dialect: 'mysql',

    host:'localhost'

});

 

module.exports = sequelize
