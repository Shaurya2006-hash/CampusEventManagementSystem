
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function EventCard({ event }) {

    const navigate = useNavigate();

    const [registered, setRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);

    // CHECK REGISTRATION STATUS
    useEffect(() => {

        const checkRegistration = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setRegistered(false);
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/registrations/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                    return;
                }

                const registrations = data.registrations || [];

                const existingRegistration = registrations.some(
                    (registration) =>
                        String(registration.event?._id) === String(event._id) &&
                        registration.status === "registered"
                );

                setRegistered(existingRegistration);

            } catch (error) {

                console.log("Registration Check Error:", error);

            }
        };

        checkRegistration();

    }, [event._id]);


    // REGISTER FOR EVENT
    const handleRegister = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login before registering.");
            navigate("/login");
            return;
        }

        if (registered) {
            alert("You are already registered for this event.");
            return;
        }

        try {

            setRegistering(true);

            const response = await fetch(
                "http://localhost:5000/api/registrations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        eventId: event._id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            setRegistered(true);

            alert("Registration successful!");

        } catch (error) {

            console.log("Registration Error:", error);
            alert(error.message);

        } finally {

            setRegistering(false);

        }
    };


    return (

        <div className="event-card">

            <div className="event-image">

                <img
                    src={event.image || event.imageUrl}
                    alt={event.title}
                />

            </div>

            <div className="event-content">

                <span className="event-category">
                    {event.category}
                </span>

                <h3>{event.title}</h3>

                <p className="event-description">
                    {event.description}
                </p>

                <div className="event-info">

                    <p>📅 {event.date}</p>

                    <p>📍 {event.venue}</p>

                </div>

                <div className="event-card-bottom">

                    <span className="event-seats">
                        {event.seats} seats available
                    </span>

                    <div className="event-card-buttons">

                        <Link
                            to={`/events/${event._id}`}
                            className="view-details-btn"
                        >
                            View Details
                        </Link>

                        <button
                            onClick={handleRegister}
                            className="register-btn"
                            disabled={registered || registering}
                        >
                            {registering
                                ? "Registering..."
                                : registered
                                    ? "Registered"
                                    : "Register Now"}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EventCard;
