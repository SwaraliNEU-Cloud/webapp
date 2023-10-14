// const chai = require('chai');
// const expect = chai.expect;
// const supertest = require('supertest');
// const app = require('../app'); // Import your Express application

// describe('/healthz Endpoint', () => {
//   it('should return a 200 status code when the database is healthy', async () => {
//     const response = await supertest(app).get('/healthz');
//     expect(response.status).to.equal(200);
//   });

//   // Add more test cases as needed
// });
// // healthz.test.js

// require('dotenv').config({ path: '.env.test' }); // Load environment variables for testing

// // Set environment variables for testing
// process.env.DB_HOST = 'localhost';
// process.env.DB_USER = 'root';
// process.env.DB_PASSWORD = 'Sp@17111997';
// process.env.DB_NAME = 'swaradb'; // Use the MySQL test database

// // Your test cases go here


const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('swaradb', 'root', 'root',{
  dialect: 'mysql',
  host:'localhost'
});

describe('GET /healthz', () => {
  it('should return 200 and status ok when DB is connected', async () => {
    await request(app)
      .get('/healthz')
      .expect('Cache-Control', 'no-cache, no-store, must-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ status: 'ok' });
      });
  });

  // Additional test for 503 could be added, but it requires mocking the DB connection failure.
});
