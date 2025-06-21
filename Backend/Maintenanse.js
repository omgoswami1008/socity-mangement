const db = require("./db");
const comman = require("./comman");

exports.insert = (req, res) => {
    const { name, property_id, mobile_number, payment_method, amount } = req.body;

    const requiredFields = ["name", "property_id", "mobile_number", "payment_method", "amount"];
    const missingFields = comman.getMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: true,
            message: "Missing fields",
            fields: missingFields
        });
    }

    // Calculate late fee
    const today = new Date();
    const dayOfMonth = today.getDate();
    let late_fee = 0;

    if (dayOfMonth > 10) {
        late_fee = (dayOfMonth - 10) * 500;
    }

    const sql = `
        INSERT INTO maintenance 
        (name, property_id, mobile_number, payment_method, amount, late_fee, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(sql, [name, property_id, mobile_number, payment_method, amount, late_fee], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
                error: true,
                message: "Database error",
                details: err.message
            });
        }

        res.status(201).json({
            error: false,
            success: true,
            message: `Maintenance payment submitted. Late fee: ₹${late_fee}`,
            maintenance_id: result.insertId,
            late_fee: late_fee
        });
    });
};
