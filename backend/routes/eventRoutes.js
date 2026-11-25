
const express = require("express");

const router = express.Router();

const Event = require("../models/Event");
const Registration = require("../models/Registration");

const {
    protect,
    adminOnly
} = require("../middleware/authmiddleware");


// Fetch All Events
router.get("/", async (req, res) => {

    try {

        const events = await Event.find()
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            events
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Fetch Single Event Details
router.get("/:id", async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Add New Event - Admin Only
router.post("/", protect, adminOnly, async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            date,
            time,
            venue,
            seats
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !date ||
            !time ||
            !venue ||
            seats === undefined ||
            seats === null ||
            seats === ""
        ) {
            return res.status(400).json({
                message: "Please provide all event details."
            });
        }

        if (
            !Number.isInteger(Number(seats)) ||
            Number(seats) < 0
        ) {
            return res.status(400).json({
                message: "Seats must be a valid non-negative integer."
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            date,
            time,
            venue,
            seats: Number(seats)
        });

        res.status(201).json({
            success: true,
            message: "Event added successfully!",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Update Event - Admin Only
router.put("/:id", protect, adminOnly, async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            date,
            time,
            venue,
            seats
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !date ||
            !time ||
            !venue ||
            seats === undefined ||
            !Number.isInteger(Number(seats)) ||
            Number(seats) < 0
        ) {
            return res.status(400).json({
                message: "Please provide valid event details."
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        const activeRegistrations =
            await Registration.countDocuments({
                event: event._id,
                status: "registered"
            });

        if (Number(seats) < activeRegistrations) {
            return res.status(400).json({
                message: "Seats cannot be less than current active registrations."
            });
        }

        event.title = title;
        event.description = description;
        event.category = category;
        event.date = date;
        event.time = time;
        event.venue = venue;
        event.seats = Number(seats);

        await event.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully!",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// Delete Event - Admin Only
router.delete("/:id", protect, adminOnly, async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        await Registration.deleteMany({
            event: req.params.id
        });

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully!"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;
