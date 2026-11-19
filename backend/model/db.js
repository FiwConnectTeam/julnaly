const postgres = require("postgres").default;

const sql = postgres(process.env.DATABASE_URL, {
    ssl: "require",        // Neon requires SSL
    max: 10,               // max connections in pool
    idle_timeout: 20,      // seconds — important for serverless like Neon
    connect_timeout: 10,
});

module.exports = sql;
