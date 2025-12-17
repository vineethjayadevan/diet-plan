const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { calculateBMR, calculateTargetCalories, generateMealPlan } = require('../logic');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, phone, age, gender, height, weight, goal, diet_type } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (name, email, password, phone, age, gender, height, weight, goal, diet_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, hashedPassword, phone, age, gender, height, weight, goal, diet_type];

        db.run(sql, params, function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already exists' });
                return res.status(500).json({ error: err.message });
            }

            const userId = this.lastID;

            // Auto-generate initial plan
            const bmr = calculateBMR(weight, height, age, gender);
            const targetCalories = calculateTargetCalories(bmr, goal);
            const meals = generateMealPlan(targetCalories, diet_type);

            const planSql = `INSERT INTO plans (user_id, daily_calories, meals_json) VALUES (?, ?, ?)`;
            db.run(planSql, [userId, targetCalories, JSON.stringify(meals)], (err) => {
                if (err) console.error("Plan Gen Error", err);
            });

            res.json({ message: 'User registered successfully', userId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, email: user.email, id: user.id } });
    });
});

module.exports = router;
