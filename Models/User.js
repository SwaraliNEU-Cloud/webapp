// models/User.js

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/config'); // Import your Sequelize database configuration

// const User = sequelize.define('User', {
//   first_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   last_name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true, // Ensure the email follows the email format
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   account_created:{
//     type: DataTypes.DATE,
//     allowNull:false,
//     defaultValue: DataTypes.NOW
//   },
//   account_updated:{
//     type: DataTypes.DATE
//   }
// });

// Hook to hash the user's password before saving it
// User.beforeCreate(async (user) => {
//   const saltRounds = 10; // Adjust the number of salt rounds as needed
//   const hashedPassword = await bcrypt.hash(user.password, saltRounds);
//   user.password = hashedPassword;
// });

// module.exports = User;


const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const hashedPassword = bcrypt.hashSync(value, 10); // hashing the password
          console.log(hashedPassword)
          this.setDataValue('password', hashedPassword);
        }
      },
      account_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      account_updated: {
        type: DataTypes.DATE
      }

}, {
    // Other model options go here
  });

  
  User.associate = (models) => {
    User.hasMany(models.Assignment, { foreignKey: 'userId', as: 'assignments' });
  };

  console.log(User === sequelize.models.User);

  module.exports = User