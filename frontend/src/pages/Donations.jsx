import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Heart, History, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Donations = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [amount, setAmount] = useState('');
    const [campaign, setCampaign] = useState('General Fund');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchMyDonations();
    }, []);

    const fetchMyDonations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/donations/my-donations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDonations(res.data.data);
        } catch (error) {
            console.error("Error fetching donations", error);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/donations', {
                amount,
                campaign,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSuccessMsg('Thank you for your generous donation!');
                setAmount('');
                setMessage('');
                fetchMyDonations(); // Refresh list
            }
        } catch (error) {
            console.error("Donation failed", error);
            alert("Donation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-2" /> Support Your Alma Mater
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Donation Form */}
                <div className="bg-white shadow rounded-lg p-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-indigo-600" /> Make a Donation
                    </h2>

                    {successMsg && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleDonate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Campaign</label>
                            <select
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option>General Fund</option>
                                <option>Scholarship Program</option>
                                <option>Campus Development</option>
                                <option>Student Activities</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={3}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Leave a message of support..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Donate Now'}
                        </button>
                    </form>
                </div>

                {/* Donation History */}
                <div className="bg-white shadow rounded-lg p-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <History className="h-5 w-5 mr-2 text-gray-600" /> Your Donation History
                    </h2>

                    <div className="flow-root">
                        <ul className="-my-5 divide-y divide-gray-200">
                            {donations && donations.map((d) => (
                                <li key={d._id} className="py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                <DollarSign className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                ${d.amount} to {d.campaign}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {new Date(d.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {d.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {(!donations || donations.length === 0) && (
                                <li className="py-4 text-center text-gray-500">
                                    No donations yet. Make your first contribution today!
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donations;
