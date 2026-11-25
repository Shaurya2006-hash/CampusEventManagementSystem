
import { useEffect, useState } from "react";

function Event() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/events")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                return response.json();
            })
            .then((data) => {
                setEvents(data.events);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setError("Unable to load events");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2>Loading Events...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Upcoming Events</h1>

            <div className="event-container">
                {events.map((event) => (
                    <div className="event-card" key={event._id}>
                        <img
                            src={event.image}
                            alt={event.title}
                            className="event-image"
                        />

                        <h2>{event.title}</h2>
                        <p>Category: {event.category}</p>
                        <p>
                            Date: {new Date(event.date).toLocaleDateString("en-IN")}
                        </p>
                        <p>Venue: {event.venue}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Event;
