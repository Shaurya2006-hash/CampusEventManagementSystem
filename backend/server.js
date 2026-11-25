
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Student Routes
app.use("/api/students", studentRoutes);

// Dashboard Routes
app.use("/api/student/dashboard", dashboardRoutes);

// Event Routes
app.use("/api/events", eventRoutes);

// Registration Routes
app.use("/api/registrations", registrationRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Campus Event Management Backend is Running!");
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

startServer();
