const db = require("./db");
const comman = require("./comman");

const insert = function (req, res) {
    console.log("Amenity Booking Request Body:", req.body);

    const requiredFields = [
        "full_name",
        "flat_number",
        "mobile",
        "amenity",
        "booking_date",
        "time_slot",
        "payment_mode",
        "payment_reference"
    ];

    const missingFields = comman.getMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: true,
            message: "Missing fields",
            fields: missingFields
        });
    }

    const {
        full_name,
        flat_number,
        mobile,
        amenity,
        booking_date,
        time_slot,
        payment_mode,
        payment_reference
    } = req.body;

    const sql = `
        INSERT INTO amenity_bookings 
        (full_name, flat_number, mobile, amenity, booking_date, time_slot, payment_mode, payment_reference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [full_name, flat_number, mobile, amenity, booking_date, time_slot, payment_mode, payment_reference],
        (err, result) => {
            if (err) {
                console.error("DB Insert Error:", err);
                return res.status(500).json({
                    error: true,
                    message: "Database error",
                    details: err.message
                });
            }

            return res.status(201).json({
                error: false,
                success: true,
                message: "Amenity booked successfully",
                booking_id: result.insertId
            });
        }
    );
};

module.exports.insert = insert;
