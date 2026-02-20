import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Plus, Check } from 'lucide-react';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'webinar'
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/events', newEvent, config);

            setMessage('Event created successfully!');
            setShowCreateForm(false);
            setNewEvent({ title: '', description: '', date: '', location: '', type: 'webinar' });
            fetchEvents(); // Refresh list
        } catch (err) {
            setError('Failed to create event');
            console.error(err);
        }
    };

    const handleRSVP = async (eventId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to RSVP');

            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/events/rsvp/${eventId}`, {}, config);

            // Refresh to show updated attendee count
            fetchEvents();
            alert('RSVP Successful!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to RSVP');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Events...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                {user && (user.role === 'alumni' || user.role === 'admin') && (
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Event
                    </button>
                )}
            </div>

            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {showCreateForm && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Event Title" required
                                className="border p-2 rounded w-full"
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                            <select
                                className="border p-2 rounded w-full"
                                value={newEvent.type}
                                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                            >
                                <option value="webinar">Webinar</option>
                                <option value="workshop">Workshop</option>
                                <option value="reunion">Reunion</option>
                                <option value="networking">Networking</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="datetime-local" required
                                className="border p-2 rounded w-full"
                                value={newEvent.date}
                                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                            <input type="text" placeholder="Location (or URL)" required
                                className="border p-2 rounded w-full"
                                value={newEvent.location}
                                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                            />
                        </div>
                        <textarea placeholder="Description" required
                            className="border p-2 rounded w-full" rows="3"
                            value={newEvent.description}
                            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create Event</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map(event => (
                    <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                                        event.type === 'reunion' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                            <div className="space-y-2 text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {event.location}
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    {event.attendees.length} Attendees
                                </div>
                            </div>

                            <button
                                onClick={() => handleRSVP(event._id)}
                                disabled={user && event.attendees.includes(user._id || user.id)}
                                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${user && event.attendees.includes(user._id || user.id)
                                        ? 'bg-green-600 cursor-default'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {user && event.attendees.includes(user._id || user.id) ? (
                                    <>
                                        <Check className="h-4 w-4 mr-2" /> RSVP'd
                                    </>
                                ) : 'RSVP Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {events.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-500">
                    No upcoming events. Check back later!
                </div>
            )}
        </div>
    );
};

export default Events;
