
const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d"
        }
    );
};


// STUDENT REGISTRATION
const registerStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            studentId,
            department,
            year
        } = req.body;

        if (
            !name || !email || !password ||
            !studentId || !department || !year
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingEmail = await Student.findOne({
            email: normalizedEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const existingStudent = await Student.findOne({
            studentId: studentId.trim()
        });

        if (existingStudent) {
            return res.status(409).json({
                message: "Student ID already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            studentId: studentId.trim(),
            department: department.trim(),
            year
        });

        const token = generateToken(student._id);

        res.status(201).json({
            message: "Student registered successfully",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                department: student.department,
                year: student.year,
                role: student.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email or Student ID already exists"
            });
        }

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// STUDENT LOGIN
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const student = await Student.findOne({
            email: email.toLowerCase().trim()
        });

        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(student._id);

        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                department: student.department,
                year: student.year,
                role: student.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


// ADMIN LOGIN
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const admin = await Student.findOne({
            email: email.toLowerCase().trim()
        });

        if (!admin || admin.role !== "admin") {
            return res.status(401).json({
                message: "Invalid admin credentials"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid admin credentials"
            });
        }

        const token = generateToken(admin._id);

        res.status(200).json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error);

        res.status(500).json({
            message: "Server error during admin login"
        });
    }
};


// GET LOGGED-IN STUDENT PROFILE
const getStudentProfile = async (req, res) => {
    try {
        res.status(200).json({
            student: req.student
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch student profile"
        });
    }
};


module.exports = {
    registerStudent,
    loginStudent,
    loginAdmin,
    getStudentProfile
};
