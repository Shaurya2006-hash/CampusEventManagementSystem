
const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    getStudentProfile
} = require("../Controllers/studentController");

const {
    protect
} = require("../middleware/authmiddleware");

// Student Registration
router.post("/register", registerStudent);

// Student Login
router.post("/login", loginStudent);

// Student Profile
router.get("/profile", protect, getStudentProfile);

module.exports = router;
