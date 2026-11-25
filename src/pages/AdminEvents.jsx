
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminEvents() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const [registrations, setRegistrations] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showRegistrations, setShowRegistrations] = useState(false);

    const emptyForm = {
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        seats: ""
    };

    const [form, setForm] = useState(emptyForm);

    const getHeaders = () => {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
    };

    // Fetch All Events
    const fetchEvents = async () => {

        try {
            const response = await fetch(
                "http://localhost:5000/api/events"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to fetch events");
            }

            setEvents(data.events || []);

        } catch (error) {
            console.error("Fetch Events Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle Form Input
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    // Add or Update Event
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            form.seats === "" ||
            Number(form.seats) < 0 ||
            !Number.isInteger(Number(form.seats))
        ) {
            alert("Please enter a valid number of seats.");
            return;
        }

        const eventData = {
            ...form,
            seats: Number(form.seats)
        };

        try {

            let url = "http://localhost:5000/api/events";
            let method = "POST";

            if (editingId !== null) {
                url = `http://localhost:5000/api/events/${editingId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(eventData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to save event");
            }

            alert(
                editingId !== null
                    ? "Event updated successfully!"
                    : "Event added successfully!"
            );

            setForm(emptyForm);
            setEditingId(null);

            await fetchEvents();

        } catch (error) {
            console.error("Save Event Error:", error);
            alert(error.message);
        }
    };

    // Edit Event
    const handleEdit = (event) => {

        setForm({
            title: event.title || "",
            description: event.description || "",
            category: event.category || "",
            date: event.date || "",
            time: event.time || "",
            venue: event.venue || "",
            seats: String(event.seats ?? "")
        });

        setEditingId(event._id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete Event
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/api/events/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete event");
            }

            alert("Event deleted successfully!");

            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm);
            }

            await fetchEvents();

        } catch (error) {
            console.error("Delete Event Error:", error);
            alert(error.message);
        }
    };

    // Cancel Edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    // Fetch Event Registrations
    const handleViewRegistrations = async (event) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/registrations/event/${event._id}`,
                {
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch registrations"
                );
            }

            setRegistrations(data.registrations || []);
            setSelectedEvent(event);
            setShowRegistrations(true);

        } catch (error) {
            console.error("Registration Error:", error);
            alert(error.message);
        }
    };

    if (loading) {
        return <h2>Loading Events...</h2>;
    }

    return (
        <div className="admin-events-page">

            <div className="admin-events-heading">

                <div>
                    <h1>Manage Events</h1>
                    <p>Add, update and manage campus events.</p>
                </div>

                <Link
                    to="/admin"
                    className="admin-back-link"
                >
                    Back to Dashboard
                </Link>

            </div>

            {/* Add / Edit Event Form */}

            <div className="admin-event-form-card">

                <h2>
                    {editingId !== null
                        ? "Edit Event"
                        : "Add New Event"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="admin-form-grid">

                        <div className="admin-form-group">

                            <label>Event Title</label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter event title"
                                required
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>Category</label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Workshop, Sports, Cultural..."
                                required
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>Event Date</label>

                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>Event Time</label>

                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>Venue</label>

                            <input
                                type="text"
                                name="venue"
                                value={form.venue}
                                onChange={handleChange}
                                placeholder="Enter event venue"
                                required
                            />

                        </div>

                        <div className="admin-form-group">

                            <label>Available Seats</label>

                            <input
                                type="number"
                                name="seats"
                                value={form.seats}
                                onChange={handleChange}
                                placeholder="Enter number of seats"
                                min="0"
                                step="1"
                                required
                            />

                        </div>

                        <div className="admin-form-group full-width">

                            <label>Event Description</label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the event..."
                                rows="4"
                                required
                            />

                        </div>

                    </div>

                    <div className="admin-form-buttons">

                        <button type="submit">
                            {editingId !== null
                                ? "Update Event"
                                : "Add Event"}
                        </button>

                        {editingId !== null && (

                            <button
                                type="button"
                                className="cancel-edit-btn"
                                onClick={handleCancelEdit}
                            >
                                Cancel Edit
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* All Events */}

            <section className="admin-events-list-section">

                <h2>All Events ({events.length})</h2>

                {events.length === 0 ? (

                    <div className="admin-no-events">
                        <p>No events available. Add your first event above.</p>
                    </div>

                ) : (

                    <div className="admin-events-grid">

                        {events.map((event) => (

                            <div
                                className="admin-event-card"
                                key={event._id}
                            >

                                <span className="admin-event-category">
                                    {event.category || "Campus Event"}
                                </span>

                                <h3>{event.title}</h3>

                                <p>{event.description}</p>

                                <div className="admin-event-meta">

                                    <p>
                                        <strong>Date:</strong> {event.date}
                                    </p>

                                    <p>
                                        <strong>Time:</strong> {event.time}
                                    </p>

                                    <p>
                                        <strong>Venue:</strong> {event.venue}
                                    </p>

                                    <p>
                                        <strong>Seats:</strong> {event.seats}
                                    </p>

                                </div>

                                <div className="admin-event-buttons">

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(event)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewRegistrations(event)
                                        }
                                    >
                                        View Registrations
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* Registration Details */}

            {showRegistrations && (

                <section className="admin-event-form-card">

                    <h2>
                        Registered Students - {selectedEvent.title}
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowRegistrations(false)}
                    >
                        Close
                    </button>

                    {registrations.length === 0 ? (

                        <p>No students have registered for this event.</p>

                    ) : (

                        <div>

                            {registrations.map((registration) => (

                                <div
                                    key={registration._id}
                                    className="admin-event-item"
                                >

                                    <div>

                                        <h3>
                                            {registration.student?.name}
                                        </h3>

                                        <p>
                                            Email: {registration.student?.email}
                                        </p>

                                        <p>
                                            Student ID: {
                                                registration.student?.studentId
                                            }
                                        </p>

                                        <p>
                                            Status: {registration.status}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            )}

        </div>
    );
}

export default AdminEvents;
