
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function EventDetails() {

    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [registering, setRegistering] = useState(false);

    // FETCH EVENT DETAILS
    useEffect(() => {

        const fetchEvent = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/events/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Event not found");
                }

                setEvent(data.event);

            } catch (error) {

                console.log("Event Fetch Error:", error);
                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchEvent();

    }, [id]);


    // CHECK EXISTING REGISTRATION
    useEffect(() => {

        const checkRegistration = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setAlreadyRegistered(false);
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
                    console.log("Authentication Error:", data.message);
                    return;
                }

                const registrations = data.registrations || [];

                const registered = registrations.some(
                    (registration) =>
                        String(registration.event?._id) === String(id) &&
                        registration.status === "registered"
                );

                setAlreadyRegistered(registered);

            } catch (error) {

                console.log("Registration Check Error:", error);

            }
        };

        checkRegistration();

    }, [id]);


    // REGISTER FOR EVENT
    const handleRegister = async () => {

        // Get latest JWT token
        const token = localStorage.getItem("token");

        console.log("Token during registration:", token);

        if (!token) {
            alert("Please login before registering.");
            return;
        }

        if (!event) {
            alert("Event details are not available.");
            return;
        }

        if (alreadyRegistered) {
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

            setAlreadyRegistered(true);

            alert("Registration successful!");

        } catch (error) {

            console.error("Registration Error:", error);

            alert(error.message);

        } finally {

            setRegistering(false);

        }
    };


    // LOADING
    if (loading) {
        return <h2>Loading Event Details...</h2>;
    }


    // EVENT NOT FOUND
    if (error || !event) {

        return (

            <div className="event-not-found">

                <h2>Event Not Found</h2>

                <Link to="/#events">
                    Back to Events
                </Link>

            </div>

        );
    }


    // EVENT DETAILS UI
    return (

        <div className="event-details-page">

            <Link to="/#events" className="back-link">
                ← Back to Events
            </Link>

            <div className="event-details-card">

                <div className="event-details-header">

                    <span className="event-category">
                        {event.category || "Campus Event"}
                    </span>

                    <h1>{event.title}</h1>

                    <p>{event.description}</p>

                </div>


                <div className="event-information">

                    <div>

                        <strong>Date</strong>

                        <p>
                            {new Date(event.date).toLocaleDateString("en-IN")}
                        </p>

                    </div>


                    <div>

                        <strong>Venue</strong>

                        <p>{event.venue}</p>

                    </div>


                    <div>

                        <strong>Status</strong>

                        <p>{event.status}</p>

                    </div>

                </div>


                <div className="event-registration">

                    {alreadyRegistered ? (

                        <button disabled className="registered-button">
                            Already Registered
                        </button>

                    ) : (

                        <button
                            onClick={handleRegister}
                            disabled={registering}
                        >
                            {registering
                                ? "Registering..."
                                : "Register for Event"}
                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}

export default EventDetails;
