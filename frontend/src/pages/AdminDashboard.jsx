import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Shield, User, DollarSign, HandHeart, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [mentorships, setMentorships] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({ users: 0, mentorships: 0, donations: 0 });

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user, activeTab]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let usersData = [], mentorshipsData = [], donationsData = [];

            // Parallel fetch for stats if possible, but sequential for simplicity in effect
            if (activeTab === 'users' || activeTab === 'overview') {
                const res = await axios.get('http://localhost:5000/api/admin/users', config);
                usersData = res.data;
                setUsers(res.data);
            }
            if (activeTab === 'mentorships' || activeTab === 'overview') {
                const res = await axios.get('http://localhost:5000/api/admin/mentorships', config);
                mentorshipsData = res.data;
                setMentorships(res.data);
            }
            if (activeTab === 'donations' || activeTab === 'overview') {
                const res = await axios.get('http://localhost:5000/api/donations/all', config);
                donationsData = res.data.data;
                setDonations(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
            fetchData(); // Refresh list
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;
    if (user.role !== 'admin') return <div className="p-10 text-center text-red-600">Access Denied</div>;

    const tabs = [
        { id: 'users', label: 'Users', icon: User },
        { id: 'mentorships', label: 'Mentorships', icon: Briefcase },
        { id: 'donations', label: 'Donations', icon: DollarSign },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Shield className="h-8 w-8 mr-2 text-indigo-600" /> Admin Dashboard
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/*  Ideally we shouldn't rely on state length if we only fetch one tab, but for now this works if we visit tabs or load all on mount. 
                      Better approach: specific stats endpoint. 
                  */}
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-2" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {activeTab === 'users' && (
                <div className="bg-white shadow overflow-hidden rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {users.map(u => (
                            <li key={u._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                                        <div className="text-sm text-gray-500">{u.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                        u.role === 'alumni' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                    {u.role !== 'admin' && ( // Prevent deleting other admins for safety
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'mentorships' && (
                <div className="bg-white shadow overflow-hidden rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {mentorships.map(m => (
                            <li key={m._id} className="px-6 py-4">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-indigo-600">
                                            {m.student ? `${m.student.firstName} ${m.student.lastName}` : 'Unknown Student'}
                                            <span className="text-gray-500"> requested </span>
                                            {m.alumni ? `${m.alumni.firstName} ${m.alumni.lastName}` : 'Unknown Alumni'}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">"{m.message}"</p>
                                    </div>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${m.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                        m.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {m.status.toUpperCase()}
                                    </span>
                                </div>
                            </li>
                        ))}
                        {mentorships.length === 0 && <li className="px-6 py-4 text-gray-500">No mentorship requests found.</li>}
                    </ul>
                </div>
            )}

            {activeTab === 'donations' && (
                <div className="bg-white shadow overflow-hidden rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations && donations.map(d => (
                                <tr key={d._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : 'Anonymous'}
                                        </div>
                                        <div className="text-sm text-gray-500">{d.donor?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${d.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.campaign}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!donations || donations.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No donations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
