// dataLoader.js

// const fs = require('fs');

// function loadDataFromFile(filePath) {
//   try {
//     const data = fs.readFileSync('../opt/user.csv', 'utf8');
//     return data.split('\n');
//   } catch (error) {
//     console.error('Error loading data:', error);
//     return [];
//   }
// }

// module.exports = {
//   loadDataFromFile,
// };



// const fs = require('fs');

// async function loadCSVDataAndUpdateOrCreate(UserModel, filePath) {
//   try {
//     const data = fs.readFileSync('./opt/user.csv', 'utf8');
//     const rows = data.split('\n');
//     console.log();

//     // Remove the header row if it exists
//     if (rows.length > 0) {
//       rows.shift(); // Remove the first element (header)
//     }

//     for (const row of rows) {
//       const columns = row.split(',');
//       // Check if the row has the expected number of columns
//       if (columns.length === 4) {
//       const userData = {
//         first_name: columns[0].trim(),
//         last_name: columns[1].trim(),
//         email: columns[2].trim(),
//         password: columns[3].trim(),

//       };
      

//       // Use upsert or findOrCreate to update or create records
//       await UserModel.upsert(userData, { where: { email: userData.email } });
//     }else {
//       console.error('Invalid CSV data row:', row);
//         // Handle or log the error as needed
//       }

//     }
    
//     console.log('Data loaded and updated/created successfully.');
//   } catch (error) {
//     console.error('Error loading and updating/creating data:', error);
//   }
// }

// module.exports = {
//   loadCSVDataAndUpdateOrCreate,
// };



const fs = require('fs').promises;
const path = require('path');
const csvParser = require('papaparse');

const loadUsersFromCSV = async (filePath) => {
    const fileContent = await fs.readFile(path.join(__dirname, filePath), 'utf-8');

    // Parse CSV with tab as the delimiter
    const results = csvParser.parse(fileContent, {
        delimiter: '\t',  // <- Tab delimiter
        header: true,
        skipEmptyLines: true
    });

    if (results.errors.length) {
        throw new Error(`Error parsing CSV: ${results.errors[0].message}`);
    }

    return results.data;
};

module.exports = loadUsersFromCSV;


