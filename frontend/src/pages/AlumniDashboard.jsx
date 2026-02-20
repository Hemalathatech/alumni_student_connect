import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, HandHeart, Calendar, Users } from 'lucide-react';

const AlumniDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-600">Thank you for being a valued part of our alumni community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/mentorship" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <Users className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Mentor Students</h3>
                            <p className="text-sm text-gray-500">Share your experience</p>
                        </div>
                    </div>
                </Link>

                <Link to="/jobs" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Briefcase className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Post a Job</h3>
                            <p className="text-sm text-gray-500">Recruit talent</p>
                        </div>
                    </div>
                </Link>

                <Link to="/donations" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <HandHeart className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Give Back</h3>
                            <p className="text-sm text-gray-500">Support your alma mater</p>
                        </div>
                    </div>
                </Link>

                <Link to="/events" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 p-3 rounded-full">
                            <Calendar className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Alumni Events</h3>
                            <p className="text-sm text-gray-500">Networking & Reunions</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-indigo-600">0</div>
                        <div className="text-gray-500 text-sm mt-1">Students Mentored</div>
                    </div>
                    <div className="border p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-gray-500 text-sm mt-1">Jobs Posted</div>
                    </div>
                    <div className="border p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-red-600">$0</div>
                        <div className="text-gray-500 text-sm mt-1">Total Donations</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlumniDashboard;
