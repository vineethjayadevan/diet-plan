const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const initDB = () => {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      age INTEGER,
      gender TEXT,
      height REAL,
      weight REAL,
      goal TEXT,
      diet_type TEXT,
      otp_email TEXT,
      otp_phone TEXT,
      otp_expires DATETIME
    )`);

        // Plans Table (Stores the latest plan for the user)
        db.run(`CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      daily_calories INTEGER,
      meals_json TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    });
};

module.exports = { db, initDB };
