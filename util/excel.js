const ExcelJS = require('exceljs');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('swaradb', 'root', 'Sp@17111997', {
  host: 'localhost',
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  // Add other fields as needed
});

// Load data from Excel sheet and update the database
(async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('../opt/user.csv');

  const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first sheet

  worksheet.eachRow(async (row, rowNumber) => {
    if (rowNumber === 1) {
      // Skip the header rows
      return;
    }

    const [name, email] = row.values;
    
    await User.create({ name, email }); // Create or update user
  });

  console.log('Data updated successfully');
})();
