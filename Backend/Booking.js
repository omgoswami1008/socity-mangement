const db = require("./db");
const comman = require("./Comman");
const axios = require("axios");


// Insert Booking Function
const insert = function (req, res) {
    console.log(req.body);

    let { property_id, full_name, phone_number, email, family_members, children } = req.body;

    // Check required fields
    const requiredFields = ["full_name", "phone_number", "email", "property_id"];
    const missingFields = comman.getMissingFields(req.body, requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: true,
            message: "Missing fields",
            fields: missingFields
        });
    }

    // Insert booking with 'pending' status
    let sql = `INSERT INTO bookings (property_id, full_name, phone_number, email, family_members, children, status) 
               VALUES (?, ?, ?, ?, ?, ?, 'pending')`;

    db.query(sql, [property_id, full_name, phone_number, email, family_members, children], function (err, result) {
        if (err) {
            console.error(err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    error: true,
                    message: "Duplicate Entry"
                });
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Database Error",
                    details: err.message
                });
            }
        }

        return res.status(201).json({
            error: false,
            success: true,
            message: "Booking Successful, pending admin approval",
            booking_id: result.insertId
        });
    });
};

// Admin Approval Function
const approveBooking = function (req, res) {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({
            error: true,
            message: "Booking ID is required"
        });
    }

    // Fetch booking details
    let getBookingSQL = "SELECT phone_number FROM bookings WHERE id = ? AND status = 'pending'";
    db.query(getBookingSQL, [booking_id], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Database Error",
                details: err.message
            });
        } if (results.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Booking not found or already approved"
            });
        }

        const phoneNumber = results[0].phone_number;

        // Update status to 'approved'
        let updateSQL = "UPDATE bookings SET status = 'approved' WHERE id = ?";
        db.query(updateSQL, [booking_id], function (err, updateResult) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: true,
                    message: "Error updating booking status",
                    details: err.message
                });
            }    // Send success response after updating status
            return res.status(200).json({
                error: false,
                message: "Booking approved successfully"
            });
        });
    });
};




module.exports.insert = insert;
module.exports.approveBooking = approveBooking;
