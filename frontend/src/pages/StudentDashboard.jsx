import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BookOpen, Briefcase, Calendar, UserPlus, Star } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRecommendations();
        }
    }, [user]);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/mentorship/recommend', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendations(res.data.slice(0, 3)); // Top 3
        } catch (error) {
            console.error("Failed to fetch recommendations", error);
        } finally {
            setLoadingRecs(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-600">Here's what's happening in your alumni network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/mentorship" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <UserPlus className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Find a Mentor</h3>
                            <p className="text-sm text-gray-500">Connect with alumni</p>
                        </div>
                    </div>
                </Link>

                <Link to="/jobs" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Briefcase className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Jobs & Internships</h3>
                            <p className="text-sm text-gray-500">Explore opportunities</p>
                        </div>
                    </div>
                </Link>

                <Link to="/events" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
                            <p className="text-sm text-gray-500">Register now</p>
                        </div>
                    </div>
                </Link>

                <Link to="/profile" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Update Profile</h3>
                            <p className="text-sm text-gray-500">Keep info current</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recommended Section - AI Powered */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Star className="h-5 w-5 text-yellow-500 mr-2" /> Recommended Mentors
                        </h2>
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">AI Powered</span>
                    </div>

                    <div className="space-y-4">
                        {loadingRecs ? (
                            <p className="text-gray-500 italic">Analyzing your profile...</p>
                        ) : recommendations.length > 0 ? (
                            recommendations.map(alumni => (
                                <div key={alumni._id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{alumni.firstName} {alumni.lastName}</p>
                                        <p className="text-sm text-gray-500">{alumni.currentRole} at {alumni.currentCompany}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-green-600">{alumni.match_score > 0 ? `${alumni.match_score}% Match` : ''}</div>
                                        <Link to={`/mentorship?alumniId=${alumni._id}`} className="text-xs text-indigo-600 hover:text-indigo-800">
                                            Request
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Complete your profile skills to get better recommendations.</p>
                        )}
                    </div>
                    <Link to="/directory" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-4 inline-block">
                        View all mentors &rarr;
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Job Postings</h2>
                    <div className="space-y-4">
                        <p className="text-gray-500 italic">No new jobs posted today.</p>
                        {/* Map jobs here */}
                    </div>
                    <Link to="/jobs" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-4 inline-block">
                        View all jobs &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
