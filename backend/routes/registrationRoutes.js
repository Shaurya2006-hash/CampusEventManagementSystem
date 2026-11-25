
const express = require("express");

const router = express.Router();

const Registration = require("../models/Registration");
const Event = require("../models/Event");

const {
    protect,
    adminOnly
} = require("../middleware/authmiddleware");


// Student Event Registration API
router.post("/", protect, async (req, res) => {

    try {

        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required."
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        const existingRegistration = await Registration.findOne({
            student: req.student._id,
            event: eventId
        });

        if (
            existingRegistration &&
            existingRegistration.status === "registered"
        ) {
            return res.status(400).json({
                message: "You have already registered for this event."
            });
        }

        const activeCount = await Registration.countDocuments({
            event: eventId,
            status: "registered"
        });

        if (activeCount >= event.seats) {
            return res.status(400).json({
                message: "Sorry, all seats are filled."
            });
        }

        let registration;

        if (existingRegistration) {

            existingRegistration.status = "registered";
            existingRegistration.registeredAt = Date.now();

            registration = await existingRegistration.save();

        } else {

            registration = await Registration.create({
                student: req.student._id,
                event: eventId,
                status: "registered"
            });

        }

        res.status(201).json({
            success: true,
            message: "Event registration successful!",
            registration
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// My Registrations API
router.get("/my", protect, async (req, res) => {

    try {

        const registrations = await Registration.find({
            student: req.student._id
        })
            .populate("event")
            .sort({ registeredAt: -1 });

        res.status(200).json({
            success: true,
            registrations
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Cancel Registration API
router.patch("/:id/cancel", protect, async (req, res) => {

    try {

        const registration = await Registration.findOne({
            _id: req.params.id,
            student: req.student._id
        });

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found."
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                message: "Registration is already cancelled."
            });
        }

        registration.status = "cancelled";

        await registration.save();

        res.status(200).json({
            success: true,
            message: "Registration cancelled successfully!",
            registration
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Admin: View Students Registered for an Event
router.get(
    "/event/:eventId",
    protect,
    adminOnly,
    async (req, res) => {

        try {

            const event = await Event.findById(
                req.params.eventId
            );

            if (!event) {
                return res.status(404).json({
                    message: "Event not found."
                });
            }

            const registrations = await Registration.find({
                event: req.params.eventId
            })
                .populate(
                    "student",
                    "name email studentId"
                )
                .sort({ registeredAt: -1 });

            res.status(200).json({
                success: true,
                event,
                registrations
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

module.exports = router;
