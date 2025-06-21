const express = require("express");
const path = require("path");
const cors = require("cors");
const db = require("./db");
const User = require("./User");
const { getAllResidents, getResidentById } = require("./Residents"); // Import functions
const maintenance = require("./Maintenanse")
const AmenityBooking = require("./AmenityBooking");
const contact = require("./Contact");
const generateInvoice = require("./generateInvoice");


const app = express();

const Booking = require("./Booking");
const BOOKING = '/booking';

// Middleware
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    // Update with your React.js app's origin
    optionsSuccessStatus: 200,
}));
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
// Sample residents data
const residents = [
    { id: 1, image: "/assets/img/property/property-20.jpg", title: "Luxury & Modern Villa", location: "Saint Just", price: 35000, beds: 3, baths: 4, sqft: 1300, status: "For Rent" },
    { id: 2, image: "/assets/img/property/property-21.jpg", title: "Villa In Luis Park", location: "High Street, USA", price: 34900, beds: 6, baths: 4, sqft: 3110, status: "For Rent" },
    { id: 3, image: "/assets/img/property/property-22.jpg", title: "Villa In Luis Park", location: "High Street, USA", price: 34900, beds: 6, baths: 4, sqft: 3110, status: "For Rent" },
    { id: 4, image: "/assets/img/property/property-23.jpg", title: "Villa In Luis Park", location: "High Street, USA", price: 34900, beds: 6, baths: 4, sqft: 3110, status: "For Rent" },
    { id: 5, image: "/assets/img/property/property-26.jpg", title: "Villa In Luis Park", location: "High Street, USA", price: 34900, beds: 6, baths: 4, sqft: 3110, status: "For Rent" },
    { id: 6, image: "/assets/img/property/property-25.jpg", title: "Villa In Luis Park", location: "High Street, USA", price: 34900, beds: 6, baths: 4, sqft: 3110, status: "For Rent" }
];

// ✅ API Route to Get Residents Data
app.get("/residents", (req, res) => {
    res.json(residents);
});

app.get('/residents/:id', (req, res) => {
    const residentId = req.params.id;
    const resident = residents.find(resident => resident.id == residentId);
    res.json(resident);
});

// Define API Routes
app.get("/user-api", User.getUser);
app.post("/users", User.createUser);
// ✅ FIXED: Use POST for inserting a booking
app.post("/booking", (req, res) => Booking.insert(req, res));  // ✅ Change GET to POST

app.get("/bookings", (req, res) => {
    let getBookingsSQL = "SELECT id, full_name, phone_number, email, family_members, children FROM bookings";

    db.query(getBookingsSQL, (err, results) => {
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
            data: results
        });
    });
});


// ✅ FIXED: Use POST for inserting a maintenance request

app.post("/maintenance", (req, res) => maintenance.insert(req, res));
app.get("/api/maintenance/invoice/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM maintenance WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: true, message: "Invoice not found" });
        }
        generateInvoice(res, results[0]); // ✅
    });
});


// ✅ FIXED: Use POST for inserting an amenity booking
app.post("/AmenityBooking", (req, res) => AmenityBooking.insert(req, res));

//fixted : api is contact
app.post('/contact', contact.insertContact);
app.get('/admin/contacts', contact.getAllContacts);


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
