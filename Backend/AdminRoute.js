const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

module.exports = (app) => {

    app.post('/admin/login', (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password required" });

        db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            if (result.length === 0) return res.status(401).json({ message: "Admin not found" });

            const admin = result[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.json({ message: "Login successful", token });
        });
    });

    app.get('/admin/users', (req, res) => {
        db.query('SELECT * FROM users', (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(result);
        });
    });

};
