
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import "./StudentDashboard.css";

function StudentDashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch dashboard and registration data
    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your dashboard.");
                setDashboard(null);
                return;
            }

            // Fetch dashboard data
            const dashboardResponse = await axios.get(
                "http://localhost:5000/api/student/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Fetch logged-in student's registrations
            const registrationResponse = await axios.get(
                "http://localhost:5000/api/registrations/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Dashboard API Response:", dashboardResponse.data);
            console.log("Registration API Response:", registrationResponse.data);

            setDashboard(dashboardResponse.data);

            setRegistrations(
                registrationResponse.data.registrations || []
            );

        } catch (err) {

            console.error("Dashboard Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );

            setDashboard(null);

        } finally {

            setLoading(false);

        }
    };

    // Load dashboard when page opens
    useEffect(() => {
        fetchDashboard();
    }, []);

    // Loading
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard">
                    <h2>Loading Dashboard...</h2>
                </div>
            </>
        );
    }

    // Error
    if (error) {
        return (
            <>
                <Navbar />

                <div className="dashboard">
                    <h2>{error}</h2>

                    <Link to="/login" className="browse-btn">
                        Go to Login
                    </Link>
                </div>
            </>
        );
    }

    if (!dashboard) {
        return null;
    }

    // Backend data
    const user = dashboard.student;

    const events = Array.isArray(dashboard.upcomingEvents)
        ? dashboard.upcomingEvents
        : [];

    // Show only active registrations
    const myRegistrations = registrations.filter(
        (registration) => registration.status === "registered"
    );

    // Get IDs of registered events
    const registeredEventIds = myRegistrations.map(
        (registration) => String(registration.event?._id)
    );

    // Remove registered events from available events
    const availableEvents = events.filter(
        (event) =>
            !registeredEventIds.includes(String(event._id))
    );

    const totalRegistrations = myRegistrations.length;
    const totalEvents = availableEvents.length;

    return (
        <>
            <Navbar />

            <div className="dashboard">

                {/* Welcome Section */}

                <div className="dashboard-welcome">

                    <div>

                        <span className="welcome-tag">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            Welcome, {user?.name || "Student"}!
                        </h1>

                        <p>
                            Manage your campus events and registrations here.
                        </p>

                        <p>
                            Student ID: {user?.studentId}
                        </p>

                        <p>
                            Department: {user?.department}
                        </p>

                        <p>
                            Year: {user?.year}
                        </p>

                    </div>

                    <Link to="/events" className="dashboard-btn">
                        Explore Events →
                    </Link>

                </div>


                {/* Statistics */}

                <div className="dashboard-stats">

                    <div className="stat-card">

                        <span className="stat-icon">🎟️</span>

                        <h3>{totalRegistrations}</h3>

                        <p>Registered Events</p>

                    </div>

                    <div className="stat-card">

                        <span className="stat-icon">📅</span>

                        <h3>{totalEvents}</h3>

                        <p>Available Events</p>

                    </div>

                </div>


                {/* Registered Events */}

                <section className="registered-section">

                    <div className="dashboard-heading">

                        <h2>My Registered Events</h2>

                        <p>
                            Events you have joined on campus.
                        </p>

                    </div>

                    {myRegistrations.length === 0 ? (

                        <div className="empty-dashboard">

                            <div className="empty-icon">
                                📭
                            </div>

                            <h3>No Registered Events Yet</h3>

                            <p>
                                You have not registered for any events yet.
                                Explore events and participate in campus activities.
                            </p>

                            <Link to="/events" className="browse-btn">
                                Browse Events
                            </Link>

                        </div>

                    ) : (

                        <div className="registered-grid">

                            {myRegistrations.map((registration) => {

                                const event = registration.event;

                                if (!event) {
                                    return null;
                                }

                                return (

                                    <div
                                        className="registered-card"
                                        key={registration._id}
                                    >

                                        <span className="event-label">
                                            REGISTERED
                                        </span>

                                        <h3>{event.title}</h3>

                                        <p>
                                            📅 {new Date(event.date).toLocaleDateString("en-IN")}
                                        </p>

                                        <p>
                                            📍 {event.venue}
                                        </p>

                                        <Link to={`/events/${event._id}`}>
                                            View Details →
                                        </Link>

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </section>


                {/* Available Events */}

                <section className="available-events">

                    <div className="dashboard-heading">

                        <h2>
                            Available Events ({totalEvents})
                        </h2>

                        <p>
                            Discover all events happening on campus.
                        </p>

                        <button
                            type="button"
                            onClick={fetchDashboard}
                            className="browse-btn"
                        >
                            Refresh Events ↻
                        </button>

                    </div>

                    {availableEvents.length > 0 ? (

                        <div className="events-list">

                            {availableEvents.map((event) => (

                                <div
                                    className="event-card"
                                    key={event._id}
                                >

                                    {event.image && (
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="event-image"
                                        />
                                    )}

                                    <h3>{event.title}</h3>

                                    <p>
                                        Category: {event.category}
                                    </p>

                                    <p>{event.description}</p>

                                    <p>
                                        📅 Date: {
                                            new Date(event.date).toLocaleDateString("en-IN")
                                        }
                                    </p>

                                    <p>
                                        📍 Venue: {event.venue}
                                    </p>

                                    <Link to={`/events/${event._id}`}>
                                        View Event →
                                    </Link>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="empty-dashboard">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h3>No Available Events</h3>

                            <p>
                                You have either registered for all available events
                                or there are no upcoming events.
                            </p>

                            <Link to="/events" className="browse-btn">
                                Explore Events
                            </Link>

                        </div>

                    )}

                </section>


                {/* Quick Links */}

                <section className="quick-links">

                    <div className="dashboard-heading">

                        <h2>Quick Links</h2>

                        <p>
                            Access important student features.
                        </p>

                    </div>

                    <div className="quick-grid">

                        <Link to="/events" className="quick-card">

                            <span>🎉</span>

                            <h3>Browse Events</h3>

                            <p>
                                Discover upcoming campus events.
                            </p>

                        </Link>

                        <Link to="/registrations" className="quick-card">

                            <span>📋</span>

                            <h3>My Registrations</h3>

                            <p>
                                Manage your event registrations.
                            </p>

                        </Link>

                        <Link to="/feedback" className="quick-card">

                            <span>💬</span>

                            <h3>Give Feedback</h3>

                            <p>
                                Share your experience with us.
                            </p>

                        </Link>

                    </div>

                </section>

            </div>


            {/* Footer */}

            <footer className="dashboard-footer">

                <h3>🎓 CampusConnect</h3>

                <p>
                    Making college events easier to discover and manage.
                </p>

                <p>
                    © 2026 CampusConnect. All rights reserved.
                </p>

            </footer>

        </>
    );

}

export default StudentDashboard;
