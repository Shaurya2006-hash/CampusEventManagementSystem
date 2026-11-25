
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const Student = require("./models/student");

const createAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            throw new Error("Please provide ADMIN_EMAIL and ADMIN_PASSWORD in .env");
        }

        if (password.length < 6) {
            throw new Error("Admin password must contain at least 6 characters");
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingAdmin = await Student.findOne({
            email: normalizedEmail
        });

        if (existingAdmin) {
            if (existingAdmin.role === "admin") {
                console.log("Admin account already exists");
            } else {
                console.log("This email already belongs to a student account");
            }

            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Student.create({
            name: "Campus Admin",
            email: normalizedEmail,
            password: hashedPassword,
            studentId: "ADMIN001",
            department: "Administration",
            year: "Admin",
            role: "admin"
        });

        console.log("Admin account created successfully");
        console.log("Admin Email:", admin.email);

    } catch (error) {
        console.error("Admin Creation Error:", error);

    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
