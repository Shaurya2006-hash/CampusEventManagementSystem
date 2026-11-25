
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";

import Navbar from "./components/NavBar";
import EventCard from "./components/EventCard";
import Guard from "./components/Guard";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

// Home Component
function Home() {

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch events from MongoDB
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
                setError("Unable to load events.");
                setLoading(false);

            });

    }, []);

    // Search and Category Filter
    const filteredEvents = events.filter((event) => {

        const matchesSearch = event.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" || event.category === category;

        return matchesSearch && matchesCategory;

    });

    return (
        <>
            <Navbar />

            {/* Hero Section */}

            <section className="hero" id="home">

                <div className="hero-content">

                    <span className="hero-tag">
                        YOUR CAMPUS. YOUR COMMUNITY.
                    </span>

                    <h1>
                        Discover Events.
                        <br />
                        Create Memories.
                    </h1>

                    <p>
                        Explore exciting college events, participate
                        in activities and make your campus life memorable.
                    </p>

                    <a href="#events" className="explore-btn">
                        Explore Events →
                    </a>

                </div>

            </section>


            {/* Events Section */}

            <section className="events-section" id="events">

                <div className="section-heading">

                    <div>

                        <h2>Upcoming Events</h2>

                        <p>
                            Find something exciting happening on campus.
                        </p>

                    </div>

                    <span>{filteredEvents.length} Events</span>

                </div>


                {/* Search and Category Filter */}

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >

                        <option value="All">All Categories</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Academic">Academic</option>

                    </select>

                </div>


                {/* Loading */}

                {loading && (
                    <h2>Loading Events...</h2>
                )}


                {/* Error */}

                {error && (
                    <p className="no-events">
                        {error}
                    </p>
                )}


                {/* Event Cards */}

                {!loading && !error && (

                    <div className="event-grid">

                        {filteredEvents.map((event) => (

                            <EventCard
                                key={event._id}
                                event={event}
                            />

                        ))}

                    </div>

                )}


                {/* No Events */}

                {!loading && !error && filteredEvents.length === 0 && (

                    <p className="no-events">
                        No events found!
                    </p>

                )}

            </section>


            {/* Footer */}

            <footer id="about">

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


// Automatically decide which page to display

function HomeRoute() {

    const token = localStorage.getItem("token");

    if (token) {
        return <Home />;
    }

    return <Signup />;
}


// Main App Component

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Guest Routes */}

                <Route element={<GuestRoute />}>

                    <Route path="/login" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />

                </Route>


                {/* Conditional Homepage */}

                <Route path="/" element={<HomeRoute />} />


                {/* Event Details */}

                <Route
                    path="/events/:id"
                    element={<EventDetails />}
                />


                {/* Protected Routes */}

                <Route element={<ProtectedRoute />}>

                    {/* Student Dashboard */}

                    <Route
                        path="/student"
                        element={
                            <Guard role="student">
                                <StudentDashboard />
                            </Guard>
                        }
                    />


                    {/* Student Registrations */}

                    <Route
                        path="/registrations"
                        element={
                            <Guard role="student">
                                <MyRegistrations />
                            </Guard>
                        }
                    />


                    {/* Admin Dashboard */}

                    <Route
                        path="/admin"
                        element={
                            <Guard role="admin">
                                <AdminDashboard />
                            </Guard>
                        }
                    />


                    {/* Admin Event Management */}

                    <Route
                        path="/admin/events"
                        element={
                            <Guard role="admin">
                                <AdminEvents />
                            </Guard>
                        }
                    />

                </Route>


                {/* Unknown Routes */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
