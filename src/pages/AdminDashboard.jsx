
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {

    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        activeRegistrations: 0,
        cancelledRegistrations: 0
    });

    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/student/dashboard/admin",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to fetch dashboard");
            }

            setStats(data.stats);
            setEvents(data.events);

        } catch (error) {
            console.error("Dashboard Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <h2>Loading Dashboard...</h2>;
    }

    return (
        <div className="admin-dashboard">

            <div className="admin-welcome">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Welcome to the Campus Event Management System.
                        Manage events and monitor student registrations.
                    </p>
                </div>

                <span className="admin-label">
                    Administrator
                </span>

            </div>

            <div className="admin-stats">

                <div className="admin-stat-card">
                    <h2>{stats.totalEvents}</h2>
                    <p>Total Events</p>
                </div>

                <div className="admin-stat-card">
                    <h2>{stats.totalRegistrations}</h2>
                    <p>Total Registrations</p>
                </div>

                <div className="admin-stat-card">
                    <h2>{stats.activeRegistrations}</h2>
                    <p>Active Registrations</p>
                </div>

                <div className="admin-stat-card">
                    <h2>{stats.cancelledRegistrations}</h2>
                    <p>Cancelled Registrations</p>
                </div>

            </div>

            <section className="admin-actions">

                <h2>Management Options</h2>

                <div className="admin-action-grid">

                    <Link
                        to="/admin/events"
                        className="admin-action-card"
                    >
                        <span>📅</span>
                        <h3>Manage Events</h3>
                        <p>Add, edit and delete campus events.</p>
                    </Link>

                    <Link
                        to="/admin/registrations"
                        className="admin-action-card"
                    >
                        <span>👥</span>
                        <h3>View Registrations</h3>
                        <p>Monitor student event registrations.</p>
                    </Link>

                    <Link
                        to="/admin/feedback"
                        className="admin-action-card"
                    >
                        <span>⭐</span>
                        <h3>View Feedback</h3>
                        <p>Read feedback submitted by students.</p>
                    </Link>

                </div>

            </section>

            <section className="admin-recent-events">

                <h2>Recent Events</h2>

                {events.length === 0 ? (
                    <p>No events have been created yet.</p>
                ) : (

                    <div className="admin-event-list">

                        {events.slice(0, 5).map((event) => (

                            <div
                                className="admin-event-item"
                                key={event._id}
                            >

                                <div>
                                    <h3>{event.title}</h3>

                                    <p>
                                        {event.date} | {event.venue}
                                    </p>
                                </div>

                                <span>
                                    {event.category || "Campus Event"}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default AdminDashboard;
