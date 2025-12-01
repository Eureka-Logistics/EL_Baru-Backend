require('dotenv').config()
const mysql = require('mysql2/promise');

const query = async (sql, params) => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });
    const [results,] = await connection.execute(sql, params);

    return results;
}

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    dialect:process.env.DB_DIALECT,
    pool: {
  max: 20,          // jumlah maksimum koneksi di pool
  min: 5,           // koneksi minimum
  acquire: 60000,   // waktu maksimum (dalam ms) menunggu koneksi (default hanya 10000 ms)
  idle: 10000       // waktu idle sebelum koneksi ditutup
},
dialectOptions: {
  connectTimeout: 60000 // untuk MySQL
},
    query
}