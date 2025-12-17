require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'deployment') { // Flexible check
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Diet Plan API is running. Set NODE_ENV=production to serve client.');
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
