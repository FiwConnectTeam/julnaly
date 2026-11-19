const sql = require("./db/db");
const bcrypt = require("bcryptjs");

const User = {
    async create({ name, email, password }) {
        const hash = await bcrypt.hash(password, 12);
        const [user] = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${name}, ${email}, ${hash})
            RETURNING id, name, email, created_at
        `;
        return user;
    },

    async findByEmail(email) {
        const [user] = await sql`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
        `;
        return user;
    },

    async findById(id) {
        const [user] = await sql`
            SELECT id, name, email, created_at FROM users WHERE id = ${id} LIMIT 1
        `;
        return user;
    },

    async verifyPassword(plain, hash) {
        return bcrypt.compare(plain, hash);
    },
};

module.exports = User;
