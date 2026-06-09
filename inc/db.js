require('dotenv').config();
const mysql = require('mysql2/promise');

let connection = null;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });
  }
  return connection;
}

module.exports = getConnection;
