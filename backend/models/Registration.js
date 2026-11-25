
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        registeredAt: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["registered", "cancelled"],
            default: "registered"
        }
    },
    {
        timestamps: true
    }
);

registrationSchema.index(
    {
        student: 1,
        event: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);
