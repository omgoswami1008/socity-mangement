const db = require("./db");
const comman = require("./Comman");

// Insert Contact Message Function
const insertContact = function (req, res) {
    console.log(req.body);

    let { name, flat_number, subject, message } = req.body;

    const requiredFields = ["name", "flat_number", "subject", "message"];
    const missingFields = comman.getMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: true,
            message: "Missing fields",
            fields: missingFields
        });
    }

    let sql = `INSERT INTO contact_messages (name, flat_number, subject, message) VALUES (?, ?, ?, ?)`;

    db.query(sql, [name, flat_number, subject, message], function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Database Error",
                details: err.message
            });
        }

        return res.status(201).json({
            error: false,
            success: true,
            message: "Message sent successfully!",
            contact_id: result.insertId
        });
    });
};

// Fetch All Contact Messages for Admin Panel
const getAllContacts = function (req, res) {
    let sql = `SELECT * FROM contact_messages ORDER BY created_at DESC`;

    db.query(sql, function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Database Error",
                details: err.message
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            data: results
        });
    });
};

module.exports.insertContact = insertContact;
module.exports.getAllContacts = getAllContacts;
