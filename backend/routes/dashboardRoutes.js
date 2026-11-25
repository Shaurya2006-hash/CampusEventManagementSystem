
const express = require("express");

const router = express.Router();

const Event = require("../models/Event");
const Registration = require("../models/Registration");

const {
    protect,
    adminOnly
} = require("../middleware/authmiddleware");


// Student Dashboard API
router.get("/", protect, async (req, res) => {

    try {

        const events = await Event.find().sort({ date: 1 });

        const registrations = await Registration.find({
            student: req.student._id,
            status: "registered"
        }).populate("event");

        res.status(200).json({
            success: true,

            totalEvents: events.length,

            totalRegistrations: registrations.length,

            upcomingEvents: events,

            registrations
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// Admin Dashboard API
router.get("/admin", protect, adminOnly, async (req, res) => {

    try {

        const totalEvents = await Event.countDocuments();

        const totalRegistrations =
            await Registration.countDocuments();

        const activeRegistrations =
            await Registration.countDocuments({
                status: "registered"
            });

        const cancelledRegistrations =
            await Registration.countDocuments({
                status: "cancelled"
            });

        const events = await Event.find()
            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            stats: {
                totalEvents,
                totalRegistrations,
                activeRegistrations,
                cancelledRegistrations
            },

            events

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;
