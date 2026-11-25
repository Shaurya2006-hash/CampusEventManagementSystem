
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const Event = require("./models/Event");

const events = [
    {
        title: "TechFest 2026",
        category: "Technical",
        date: new Date("2026-11-15"),
        venue: "Auditorium",
        description: "Explore technology, coding and innovation.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        status: "upcoming"
    },
    {
        title: "Cultural Night",
        category: "Cultural",
        date: new Date("2026-11-20"),
        venue: "Open Air Theatre",
        description: "Experience music, dance and creativity.",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        status: "upcoming"
    },
    {
        title: "Sports Tournament",
        category: "Sports",
        date: new Date("2026-11-25"),
        venue: "College Ground",
        description: "Participate in exciting sports competitions.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
        status: "upcoming"
    },
    {
        title: "AI Workshop",
        category: "Technical",
        date: new Date("2026-11-28"),
        venue: "Computer Lab",
        description: "Learn about Artificial Intelligence and Machine Learning.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        status: "upcoming"
    }
];

const seedEvents = async () => {
    try {
        await connectDB();

        for (const event of events) {
            await Event.findOneAndUpdate(
                { title: event.title },
                event,
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );
        }

        const allEvents = await Event.find({});

        console.log("Events added successfully!");
        console.log("Total Events:", allEvents.length);

        await mongoose.disconnect();

    } catch (error) {
        console.error("Error adding events:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedEvents();
