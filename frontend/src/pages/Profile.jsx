import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Briefcase, GraduationCap, MapPin, Linkedin, Save, Camera } from 'lucide-react';

const Profile = () => {
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        graduationYear: '',
        degree: '',
        major: '',
        currentCompany: '',
        currentRole: '',
        skills: '',
        bio: '',
        location: '',
        linkedinProfile: '',
        profilePicture: ''
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                role: user.role || '',
                department: user.department || '',
                graduationYear: user.graduationYear || '',
                degree: user.degree || '',
                major: user.major || '',
                currentCompany: user.currentCompany || '',
                currentRole: user.currentRole || '',
                skills: user.skills ? user.skills.join(', ') : '',
                bio: user.bio || '',
                location: user.location || '',
                linkedinProfile: user.linkedinProfile || '',
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('profilePicture', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const res = await axios.post('http://localhost:5000/api/upload', formDataObj, config);

            // Update local state with new image path
            setFormData(prev => ({ ...prev, profilePicture: res.data.filePath }));
            setMessage('Image uploaded temporarily. Click Save Changes to persist.');
        } catch (error) {
            console.error(error);
            setMessage('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const dataToSubmit = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };

            const res = await axios.put('http://localhost:5000/api/auth/profile', dataToSubmit, config);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setMessage('Failed to update profile');
            console.error(error);
        }
    };

    if (loading || !user) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header with Background and Avatar */}
                <div className="h-32 bg-indigo-600"></div>
                <div className="px-4 py-5 sm:px-6 relative">
                    <div className="absolute -top-16 left-6">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden flex justify-center items-center">
                                {formData.profilePicture ? (
                                    <img
                                        src={`http://localhost:5000${formData.profilePicture}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 text-white">
                                    <Camera className="h-4 w-4" />
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="ml-40 flex justify-between items-end">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h3>
                            <p className="text-sm text-gray-500 capitalize">{formData.role} {formData.currentRole && `• ${formData.currentRole} at ${formData.currentCompany}`}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:p-0 mt-6">
                    {message && <div className={`mx-6 mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{message}</div>}

                    <form onSubmit={handleSubmit} className="sm:divide-y sm:divide-gray-200">
                        {/* Basic Info */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center"><User className="h-4 w-4 mr-2" /> Full Name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <div className="flex space-x-2">
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border rounded p-1 w-full" placeholder="First Name" />
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Last Name" />
                                    </div>
                                ) : `${formData.firstName} ${formData.lastName}`}
                            </dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email (Read Only)</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formData.email}</dd>
                        </div>

                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Role</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{formData.role}</dd>
                        </div>

                        {/* Education */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                            <dt className="text-sm font-medium text-gray-500 flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> Education</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                                {isEditing ? (
                                    <>
                                        <input type="text" name="department" value={formData.department} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Department" />
                                        <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Degree (e.g. B.Tech)" />
                                        <input type="text" name="major" value={formData.major} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Major" />
                                        <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Graduation Year" />
                                    </>
                                ) : (
                                    <div>
                                        <p><span className="font-semibold">Dept:</span> {formData.department}</p>
                                        <p><span className="font-semibold">Degree:</span> {formData.degree}</p>
                                        <p><span className="font-semibold">Major:</span> {formData.major}</p>
                                        <p><span className="font-semibold">Year:</span> {formData.graduationYear}</p>
                                    </div>
                                )}
                            </dd>
                        </div>

                        {/* Professional */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Professional</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                                {isEditing ? (
                                    <>
                                        <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Current Company" />
                                        <input type="text" name="currentRole" value={formData.currentRole} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Current Role" />
                                        <textarea name="skills" value={formData.skills} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Skills (comma separated)" rows={2} />
                                    </>
                                ) : (
                                    <div>
                                        <p><span className="font-semibold">Company:</span> {formData.currentCompany}</p>
                                        <p><span className="font-semibold">Role:</span> {formData.currentRole}</p>
                                        <p><span className="font-semibold">Skills:</span> {formData.skills}</p>
                                    </div>
                                )}
                            </dd>
                        </div>

                        {/* Additional */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                            <dt className="text-sm font-medium text-gray-500">Details</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Location" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Linkedin className="h-4 w-4 text-gray-400" />
                                            <input type="text" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} className="border rounded p-1 w-full" placeholder="LinkedIn Profile URL" />
                                        </div>
                                        <textarea name="bio" value={formData.bio} onChange={handleChange} className="border rounded p-1 w-full" placeholder="Bio / Summary" rows={3} />

                                    </>
                                ) : (
                                    <div>
                                        <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400" /> {formData.location}</p>
                                        <p className="flex items-center"><Linkedin className="h-4 w-4 mr-2 text-gray-400" /> {formData.linkedinProfile && <a href={formData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">LinkedIn Profile</a>}</p>
                                        <p className="italic mt-2">{formData.bio}</p>
                                    </div>
                                )}
                            </dd>
                        </div>

                        {isEditing && (
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Save className="h-4 w-4 mr-2" /> {uploading ? 'Uploading...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
