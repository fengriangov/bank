require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Max number of connections in the pool
    queueLimit: 0         // Unlimited queued requests
});

// Log connection status once
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Connected to MySQL database via connection pool');
        connection.release(); // Release it back to the pool
    }
});

// const promisePool = pool.promise(); // Optional support for async/await

// Export the pool
module.exports = pool;
