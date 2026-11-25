
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            default: ""
        },

        venue: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        seats: {
            type: Number,
            default: 0,
            min: 0
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["upcoming", "completed"],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);
