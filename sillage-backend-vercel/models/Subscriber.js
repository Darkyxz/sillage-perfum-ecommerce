// models/Subscriber.js
const { query: execute } = require('../config/database');

class Subscriber {
    constructor() {
        this.tableName = 'subscribers';
    }

    async create(email, token) {
        const sql = `INSERT INTO ${this.tableName} (email, token, subscribed) VALUES (?, ?, ?)`;
        const result = await execute(sql, [email, token, true]);
        return result.insertId;
    }

    async findByToken(token) {
        const sql = `SELECT * FROM ${this.tableName} WHERE token = ? LIMIT 1`;
        const rows = await execute(sql, [token]);
        return rows && rows.length ? rows[0] : null;
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1`;
        const rows = await execute(sql, [email]);
        return rows && rows.length ? rows[0] : null;
    }

    async unsubscribe(token) {
        const sql = `DELETE FROM ${this.tableName} WHERE token = ?`;
        const result = await execute(sql, [token]);
        return result.affectedRows > 0;
    }

    async getAllActive() {
        const sql = `SELECT * FROM ${this.tableName} WHERE subscribed = true`;
        const rows = await execute(sql);
        return rows || [];
    }
}

module.exports = new Subscriber();