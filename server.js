const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Temporary complaint database
let complaints = [];

// Generate complaint ID
function generateComplaintId() {
    return "CMP" + Date.now();
}

// Get all complaints
app.get("/api/complaints", (req, res) => {
    res.json(complaints);
});

// Submit a complaint
app.post("/api/complaints", (req, res) => {

    const {
        name,
        email,
        phone,
        category,
        subject,
        description
    } = req.body;

    // Validation
    if (
        !name ||
        !email ||
        !phone ||
        !category ||
        !subject ||
        !description
    ) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    const complaint = {
        id: generateComplaintId(),
        name,
        email,
        phone,
        category,
        subject,
        description,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    complaints.push(complaint);

    res.status(201).json({
        success: true,
        message: "Complaint submitted successfully!",
        complaint
    });
});

// Search complaint by ID
app.get("/api/complaints/:id", (req, res) => {

    const complaint = complaints.find(
        item => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found."
        });
    }

    res.json({
        success: true,
        complaint
    });
});

// Update complaint status
app.put("/api/complaints/:id", (req, res) => {

    const complaint = complaints.find(
        item => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found."
        });
    }

    complaint.status = req.body.status;

    res.json({
        success: true,
        message: "Complaint status updated.",
        complaint
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Complaint Management System running at`);
    console.log(`http://localhost:${PORT}`);
});