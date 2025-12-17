const express = require('express');
const { db } = require('../db');
const { calculateBMR, calculateTargetCalories, generateMealPlan } = require('../logic');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    // Bearer <token>
    const actualToken = token.split(' ')[1];
    jwt.verify(actualToken, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.userId = decoded.id;
        next();
    });
};

// Get User Profile & Plan
router.get('/dashboard', verifyToken, (req, res) => {
    // Get User
    db.get(`SELECT id, name, email, age, gender, height, weight, goal, diet_type FROM users WHERE id = ?`, [req.userId], (err, user) => {
        if (err) return res.status(500).json({ error: 'Error fetching user' });

        // Get Latest Plan
        db.get(`SELECT * FROM plans WHERE user_id = ? ORDER BY id DESC LIMIT 1`, [req.userId], (err, plan) => {
            if (err) return res.status(500).json({ error: 'Error fetching plan' });

            res.json({
                user,
                plan: plan ? {
                    daily_calories: plan.daily_calories,
                    meals: JSON.parse(plan.meals_json)
                } : null
            });
        });
    });
});

// Update Preferences (Regenerates Plan)
router.put('/profile', verifyToken, (req, res) => {
    const { weight, age, goal, diet_type } = req.body;

    // Update User
    const sql = `UPDATE users SET weight = ?, age = ?, goal = ?, diet_type = ? WHERE id = ?`;
    db.run(sql, [weight, age, goal, diet_type, req.userId], function (err) {
        if (err) return res.status(500).json({ error: 'Error updating user' });

        // Fetch updated user to recalculate (need height/gender which might not have changed but are needed for BMR)
        db.get(`SELECT * FROM users WHERE id = ?`, [req.userId], (err, user) => {
            if (err) return res.status(500).json({ error: 'Error fetching user data' });

            // Regenerate Plan
            const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
            const targetCalories = calculateTargetCalories(bmr, user.goal);
            const meals = generateMealPlan(targetCalories, user.diet_type);

            const planSql = `INSERT INTO plans (user_id, daily_calories, meals_json) VALUES (?, ?, ?)`;
            db.run(planSql, [req.userId, targetCalories, JSON.stringify(meals)], (err) => {
                if (err) return res.status(500).json({ error: 'Plan Gen Error' });
                res.json({ message: 'Profile updated and Plan regenerated', plan: { daily_calories: targetCalories, meals } });
            });
        });
    });
});

module.exports = router;
