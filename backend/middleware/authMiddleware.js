
const jwt = require("jsonwebtoken");
const Student = require("../models/student");

// Check Authentication
const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized. Please login."
            });
        }

        // Verify JWT Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find Logged-in User
        const student = await Student.findById(decoded.id)
            .select("-password");

        if (!student) {
            return res.status(401).json({
                message: "Account not found."
            });
        }

        req.student = student;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token. Please login again."
        });
    }
};


// Check Admin Authorization
const adminOnly = (req, res, next) => {

    if (req.student && req.student.role === "admin") {
        return next();
    }

    return res.status(403).json({
        message: "Access denied. Admin only."
    });
};


module.exports = {
    protect,
    adminOnly
};
