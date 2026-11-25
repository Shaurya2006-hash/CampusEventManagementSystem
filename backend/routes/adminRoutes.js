
const express = require("express");
const router = express.Router();

const {
    loginAdmin
} = require("../Controllers/studentController");

const {
    protect,
    adminOnly
} = require("../middleware/authmiddleware");

// Admin Login
router.post("/login", loginAdmin);

// Verify Admin
router.get("/verify", protect, adminOnly, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Admin authenticated successfully",
        admin: req.student
    });

});

module.exports = router;
