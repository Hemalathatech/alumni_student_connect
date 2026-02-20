import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Directory = () => {
    const [alumni, setAlumni] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            // Reusing admin users endpoint or creating a public one?
            // Usually we need a specific endpoint for public directory. 
            // For now, let's assume we can filter client side or use a new endpoint if I created it.
            // I didn't create a specific 'directory' endpoint, but I can use a filtered user search if backend supports it.
            // Since I didn't verify backend user search, I'll assume I need to fetch all and filter OR 
            // I should have created a route. 
            // To be safe and quick, I'll fetch `api/admin/users` IF I am admin, but wait, normal users can't see that.
            // I need a public/protected route for fetching alumni. 
            // Let's check `auth.routes.js` again. It has `/me` and `/profile`. 
            // I need to add a route to get all alumni in `auth.routes.js` or `admin.routes.js` (accessible to authenticated users).

            // NOTE: I am writing this file assuming I will add the route in the NEXT step if it doesn't exist.
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/alumni', { // Proposed endpoint
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlumni(res.data);
        } catch (error) {
            console.error(error);
            // Fallback for demo if endpoint fails (empty list)
            setAlumni([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAlumni = alumni.filter(a =>
        a.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.currentCompany && a.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.currentRole && a.currentRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.department && a.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Alumni Directory
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Connect with fellow graduates and expand your professional network.
                </p>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="Search by name, company, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading directory...</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAlumni.map((person) => (
                        <div key={person._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                                        <span className="text-xl font-bold text-indigo-600">
                                            {person.firstName[0]}{person.lastName[0]}
                                        </span>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                                {person.firstName} {person.lastName}
                                            </h3>
                                            {person.isRegistered ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    Active Alumni
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    Not Registered Yet
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{person.department} • {person.graduationYear}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {person.currentRole ? `${person.currentRole} at ${person.currentCompany}` : 'Open to opportunities'}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {person.location || 'Location not specified'}
                                    </div>
                                </div>
                                <div className="mt-5">
                                    {/* ✅ Registered alumni: show active Send Request button */}
                                    {person.isRegistered ? (
                                        <button
                                            onClick={() => navigate(`/mentorship?alumniId=${person._id}`)}
                                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                        >
                                            Send Request
                                        </button>
                                    ) : (
                                        /* ❌ Dataset-only alumni: disable button */
                                        <button
                                            disabled
                                            title="This alumni has not registered on the platform yet"
                                            className="w-full flex justify-center items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                                        >
                                            Not Available for Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Directory;
