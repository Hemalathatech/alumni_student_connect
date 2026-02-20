import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, MessageSquare, Check, X, Clock, Briefcase } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

const Mentorship = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [selectedAlumni, setSelectedAlumni] = useState(searchParams.get('alumniId') || '');
    const [alumniList, setAlumniList] = useState([]);

    useEffect(() => {
        if (user?.role === 'student') {
            fetchStudentData();
        } else if (user?.role === 'alumni') {
            fetchAlumniData();
        }
    }, [user]);

    const fetchStudentData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch my requests
            const reqRes = await axios.get('http://localhost:5000/api/mentorship/student/status', config);
            setRequests(reqRes.data);

            // Fetch alumni list
            const alumniRes = await axios.get('http://localhost:5000/api/auth/alumni', config);
            setAlumniList(alumniRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAlumniData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const res = await axios.get('http://localhost:5000/api/mentorship/alumni/requests', config);
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/mentorship/request', {
                alumni: selectedAlumni,
                message: requestMessage
            }, config);

            setMessage('Request sent successfully!');
            setSelectedAlumni('');
            setRequestMessage('');
            fetchStudentData();
        } catch (err) {
            alert('Failed to send request');
        }
    };

    const handleResponse = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.put(`http://localhost:5000/api/mentorship/alumni/respond/${id}`, { status }, config);
            fetchAlumniData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentorship Program</h1>

            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}

            {user.role === 'student' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Requests</h2>
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                To: {req.alumni ? `${req.alumni.firstName} ${req.alumni.lastName}` : 'Unknown Alumni'}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{req.message}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
                                        Sent: {new Date(req.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {requests.length === 0 && (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">No active requests.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Mentorship</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <p className="text-gray-600 mb-4 text-sm">
                                Select an alumni mentor from the list below and send them a personal message explaining your goals.
                            </p>
                            <form onSubmit={handleSendRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Mentor</label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                                        value={selectedAlumni}
                                        onChange={e => setSelectedAlumni(e.target.value)}
                                    >
                                        <option value="">-- Choose an Alumni --</option>
                                        {alumniList.map(alumni => (
                                            <option key={alumni._id} value={alumni._id}>
                                                {alumni.firstName} {alumni.lastName} {alumni.currentCompany ? `- ${alumni.currentRole} at ${alumni.currentCompany}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={requestMessage}
                                        onChange={e => setRequestMessage(e.target.value)}
                                        placeholder="Introduce yourself and explain why you're seeking mentorship..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!selectedAlumni}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Send Mentorship Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {user.role === 'alumni' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Incoming Requests</h2>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                            {requests.filter(r => r.status === 'pending').length} Pending
                        </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {requests.map(req => (
                            <div key={req._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                            {req.student?.firstName?.[0]}
                                        </div>
                                        <div className="ml-3 overflow-hidden">
                                            <p className="text-base font-medium text-gray-900 truncate">
                                                {req.student?.firstName} {req.student?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{req.student?.email}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md mb-4 h-24 overflow-y-auto">
                                        <p className="text-gray-600 text-sm italic">"{req.message}"</p>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </div>

                                        {req.status === 'pending' ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleResponse(req._id, 'accepted')}
                                                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    title="Accept Request"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleResponse(req._id, 'rejected')}
                                                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    title="Reject Request"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${req.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {requests.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No mentorship requests</h3>
                            <p className="mt-1 text-sm text-gray-500">You haven't received any requests from students yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Mentorship;
