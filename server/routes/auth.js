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

// Forgot Password - Request OTP
router.post('/forgot-password', (req, res) => {
    const { email, phone } = req.body;

    db.get(`SELECT * FROM users WHERE email = ? AND phone = ?`, [email, phone], (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'User not found with matching email and phone' });

        // Generate 4-digit OTPs
        const otpEmail = Math.floor(1000 + Math.random() * 9000).toString();
        const otpPhone = Math.floor(1000 + Math.random() * 9000).toString();
        const expires = Date.now() + 10 * 60 * 1000; // 10 mins

        const sql = `UPDATE users SET otp_email = ?, otp_phone = ?, otp_expires = ? WHERE id = ?`;
        db.run(sql, [otpEmail, otpPhone, expires, user.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error generating OTP' });

            // SIMULATION LOGS
            console.log(`[OTP SIMULATION] User: ${email}`);
            console.log(`[OTP SIMULATION] Email OTP: ${otpEmail}`);
            console.log(`[OTP SIMULATION] Phone OTP: ${otpPhone}`);

            res.json({ message: 'OTPs sent to email and phone (Check server console)' });
        });
    });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, phone, otp_email, otp_phone, new_password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ? AND phone = ?`, [email, phone], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.otp_expires || user.otp_expires < Date.now()) {
            return res.status(400).json({ error: 'OTPs expired. Request new ones.' });
        }

        if (user.otp_email !== otp_email || user.otp_phone !== otp_phone) {
            return res.status(400).json({ error: 'Invalid OTPs provided' });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        const sql = `UPDATE users SET password = ?, otp_email = NULL, otp_phone = NULL, otp_expires = NULL WHERE id = ?`;
        db.run(sql, [hashedPassword, user.id], (err) => {
            if (err) return res.status(500).json({ error: 'Error resetting password' });
            res.json({ message: 'Password reset successful. Please login.' });
        });
    });
});

