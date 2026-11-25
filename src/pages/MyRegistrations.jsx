
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MyRegistrations() {

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // FETCH MY REGISTRATIONS
    useEffect(() => {

        const fetchRegistrations = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/registrations/my",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch registrations"
                    );
                }

                setRegistrations(data.registrations);

            } catch (error) {

                console.log(error);
                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchRegistrations();

    }, [token]);

    if (!token) {
        return (
            <div className="registrations-page">
                <h2>Please login to view your registrations.</h2>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="registrations-page">
                <h2>Loading Registrations...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="registrations-page">
                <h2>{error}</h2>
            </div>
        );
    }

    return (

        <div className="registrations-page">

            <div className="registrations-heading">

                <h1>My Registrations</h1>

                <p>
                    View and manage your campus event registrations.
                </p>

            </div>

            {registrations.length === 0 ? (

                <div className="no-registrations">

                    <h2>No Registrations Found</h2>

                    <p>
                        You have not registered for any events yet.
                    </p>

                    <Link to="/events">
                        Explore Events
                    </Link>

                </div>

            ) : (

                <div className="registrations-list">

                    {registrations.map((registration) => {

                        const event = registration.event;

                        if (!event) return null;

                        const isCancelled =
                            registration.status === "cancelled";

                        return (

                            <div
                                className="registration-card"
                                key={registration._id}
                            >

                                <div className="registration-info">

                                    <h2>{event.title}</h2>

                                    <p>
                                        <strong>Category:</strong>{" "}
                                        {event.category || "Not specified"}
                                    </p>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(event.date).toLocaleDateString("en-IN")}
                                    </p>

                                    <p>
                                        <strong>Venue:</strong>{" "}
                                        {event.venue}
                                    </p>

                                    <p>
                                        <strong>Registered On:</strong>{" "}
                                        {new Date(
                                            registration.registeredAt
                                        ).toLocaleDateString("en-IN")}
                                    </p>

                                    <span
                                        className={
                                            isCancelled
                                                ? "status-cancelled"
                                                : "status-active"
                                        }
                                    >
                                        {isCancelled
                                            ? "Cancelled"
                                            : "Registered"}
                                    </span>

                                </div>

                                <div className="registration-actions">

                                    <Link to={`/events/${event._id}`}>
                                        View Event
                                    </Link>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );
}

export default MyRegistrations;
