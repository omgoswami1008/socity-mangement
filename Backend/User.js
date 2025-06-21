const db = require("./db");

module.exports = {
    getUser: (req, res) => {
        res.json({ message: "User API Working" });
    },

    createUser: (req, res) => {
        const { country, city, building, flat_number, ownership_type, occupancy_status, newsletter_subscription } = req.body;

        // ✅ Validate if flat_number is provided
        if (!flat_number) {
            return res.status(400).json({ error: "Flat number is required!" });
        }

        const sql = `INSERT INTO users (country, city, building, flat_number, ownership_type, occupancy_status, newsletter_subscription)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [
            country,
            city,
            building,
            flat_number,
            ownership_type || null,
            occupancy_status || null,
            newsletter_subscription !== undefined ? newsletter_subscription : true
        ], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Failed to save user" });
            }
            res.json({ message: "User registered successfully", userId: result.insertId });
        });
    }
};
