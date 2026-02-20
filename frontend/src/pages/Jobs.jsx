import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Building, Plus } from 'lucide-react';

const Jobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        type: 'job', // job or internship
        applicationLink: '',
        contactEmail: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/jobs');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/jobs', newJob, config);

            setMessage('Job posted successfully!');
            setShowCreateForm(false);
            setNewJob({
                title: '',
                company: '',
                location: '',
                description: '',
                requirements: '',
                type: 'job',
                applicationLink: '',
                contactEmail: ''
            });
            fetchJobs(); // Refresh list
        } catch (err) {
            setError('Failed to post job');
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Jobs...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
                {user && (user.role === 'alumni' || user.role === 'admin') && (
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Post Opportunity
                    </button>
                )}
            </div>

            {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {showCreateForm && (
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Post a Job or Internship</h2>
                    <form onSubmit={handleCreateJob} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Job Title" required
                                className="border p-2 rounded w-full"
                                value={newJob.title}
                                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                            />
                            <input type="text" placeholder="Company Name" required
                                className="border p-2 rounded w-full"
                                value={newJob.company}
                                onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                            />
                            <select
                                className="border p-2 rounded w-full"
                                value={newJob.type}
                                onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                            >
                                <option value="job">Full-time Job</option>
                                <option value="internship">Internship</option>
                            </select>
                            <input type="text" placeholder="Location" required
                                className="border p-2 rounded w-full"
                                value={newJob.location}
                                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Application Link (Optional)"
                                className="border p-2 rounded w-full"
                                value={newJob.applicationLink}
                                onChange={e => setNewJob({ ...newJob, applicationLink: e.target.value })}
                            />
                            <input type="email" placeholder="Contact Email (Optional)"
                                className="border p-2 rounded w-full"
                                value={newJob.contactEmail}
                                onChange={e => setNewJob({ ...newJob, contactEmail: e.target.value })}
                            />
                        </div>
                        <textarea placeholder="Job Description" required
                            className="border p-2 rounded w-full" rows="3"
                            value={newJob.description}
                            onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                        />
                        <textarea placeholder="Requirements"
                            className="border p-2 rounded w-full" rows="2"
                            value={newJob.requirements}
                            onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                        />
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Post Job</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {jobs.map(job => (
                    <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                    {job.title}
                                </h3>
                                <div className="flex items-center text-gray-600 mt-1">
                                    <Building className="h-4 w-4 mr-1" />
                                    <span className="font-medium mr-4">{job.company}</span>
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.type === 'internship' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                {job.type === 'internship' ? 'Internship' : 'Full-time'}
                            </span>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600 line-clamp-2">{job.description}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Posted by {job.poster.firstName} {job.poster.lastName}</span>
                            <div className="space-x-2">
                                {job.applicationLink && (
                                    <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50">
                                        Apply Now
                                    </a>
                                )}
                                {job.contactEmail && (
                                    <a href={`mailto:${job.contactEmail}`} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                                        Contact
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {jobs.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-500">
                    No open positions at the moment.
                </div>
            )}
        </div>
    );
};

export default Jobs;
