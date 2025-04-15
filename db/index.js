// Connection Test File
console.log("Connecting to DB:", process.env.DATABASE_URL);

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;