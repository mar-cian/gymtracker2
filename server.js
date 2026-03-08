const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Setup
const dbFile = 'gym.db';
const dbExists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
    if (!dbExists) {
        db.run(`CREATE TABLE workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            date TEXT,
            type TEXT,
            duration INTEGER,
            intensity TEXT
        )`);
    }
});

// Routes
// Get all workouts
app.get('/api/workouts', (req, res) => {
    db.all("SELECT * FROM workouts", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ workouts: rows });
    });
});

// Get current user from CF Access
app.get('/api/me', (req, res) => {
    const email = req.headers['cf-access-authenticated-user-email'] || '';
    
    let user = null;
    if (email.toLowerCase().startsWith('giani')) user = 'Giani';
    else if (email.toLowerCase().startsWith('angie')) user = 'Angie';
    else if (email.toLowerCase().startsWith('sämi') || email.toLowerCase().startsWith('saemi')) user = 'Sämi';
    
    res.json({ email, user });
});

// Add a workout
app.post('/api/workouts', (req, res) => {
    const { user, date, type, duration } = req.body;
    
    // Simple intensity calculation logic based on duration
    let intensity = 'low';
    if (duration > 60) intensity = 'high';
    else if (duration > 30) intensity = 'medium';

    // The frontend sends raw data, backend can refine or just store
    // actually, let's keep it simple and consistent with the requirement
    // "Intensity: Brightness based on duration (20min = dark, 90min = bright)" logic is handled in frontend visualization mostly,
    // but we can store it or calculate it on the fly. Let's just store the duration.

    const stmt = db.prepare("INSERT INTO workouts (user, date, type, duration) VALUES (?, ?, ?, ?)");
    stmt.run(user, date, type, duration, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, user, date, type, duration });
    });
    stmt.finalize();
});

// Start Server
app.listen(port, () => {
    console.log(`Gym Tracker running at http://localhost:${port}`);
});
