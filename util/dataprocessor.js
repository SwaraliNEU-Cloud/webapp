// dataProcessor.js

// function processData(lines) {
//     const processedData = [];
  
//     for (const line of lines) {
//       // Process each line as needed
//       const values = line.split(',');
//       // Perform data processing operations here
//       // For example, you can create objects or manipulate data
//       const processedLine = {
//         // Define how you want to process the data
//         field1: values[0],
//         field2: values[1],
//         // ...
//       };
  
//       processedData.push(processedLine);
//     }
  
//     return processedData;
//   }
  
//   module.exports = {
//     processData,
//   };



// function processData(dataArray) {
//   // Process the loaded data here if needed
//   return dataArray; // For now, simply return the loaded data
// }

// module.exports = {
//   processData,
// };


// const { User1 } = require('../Models/UserOLD');  // Adjust the path based on your directory structure
const bcrypt = require('bcrypt');
const sequelize = require('../Models/db');
const User1 = sequelize.models.User;

// async function processUsers(users) {
//     for (let user of users) {
//         // Hash the password before saving to the database
//         const hashedPassword = await bcrypt.hash(user.password, 10);

//         await User1.findOrCreate({
//             where: { email: user.email },
//             defaults: {
//                 first_name: user.first_name,
//                 last_name: user.last_name,
//                 password: hashedPassword,
//                 account_created: new Date(),
//                 account_updated: new Date()
//             }
//         });
//     }
// }

// module.exports = processUsers;

// const bcrypt = require('bcrypt');
// const { User } = require('../Models/user');

const processUsers = async (users) => {

    console.log('In Process Users')
    console.log(users)
    for (let userEntry  of users) {

        let userData = userEntry ['first_name,last_name,email,password'].split(',');
        let user = {
            first_name: userData[0],
            last_name: userData[1],
            email: userData[2],
            password: userData[3]
        };
        console.log(user.email)
        console.log(user.password)
        

        const attributes = sequelize.models.User.rawAttributes;
        const fields = Object.keys(attributes);
        console.log(fields);
        // console.log(User1.f)

        

        // Check if user exists in DB
        // const existingUser = await User1.findOne({where: { user.email }});
        const existingUser = await  sequelize.models.User.findOne({ where: { email: user.email } });

        if (!existingUser) {
            await sequelize.models.User.create(user);
        }
    }
};

module.exports = processUsers;




