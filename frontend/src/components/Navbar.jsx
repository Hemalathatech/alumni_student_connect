import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import NotificationCenter from './NotificationCenter'; // Import NotificationCenter

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">AlumniConnect</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                                <Link to="/events" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Events</Link>
                                <Link to="/jobs" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Jobs</Link>
                                <Link to="/directory" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Directory</Link>
                                <Link to="/donations" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Donate</Link>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <NotificationCenter /> {/* Add Notification Center */}
                                <div className="flex items-center space-x-3 ml-4">
                                    <Link to="/dashboard" className="text-indigo-200 hover:text-white" title="Dashboard">
                                        <LayoutDashboard className="h-5 w-5" />
                                    </Link>
                                    <Link to="/profile" className="flex items-center text-indigo-200 hover:text-white">
                                        {user.profilePicture ? (
                                            <img src={`http://localhost:5000${user.profilePicture}`} className="h-8 w-8 rounded-full object-cover border-2 border-indigo-400" alt="Profile" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-indigo-400">
                                                {user.firstName[0]}
                                            </div>
                                        )}
                                        <span className="ml-2 font-medium">{user.firstName}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/events" className="text-indigo-200 block px-3 py-2 rounded-md text-base font-medium">Events</Link>
                        <Link to="/jobs" className="text-indigo-200 block px-3 py-2 rounded-md text-base font-medium">Jobs</Link>
                        <Link to="/directory" className="text-indigo-200 block px-3 py-2 rounded-md text-base font-medium">Directory</Link>
                        <Link to="/donations" className="text-indigo-200 block px-3 py-2 rounded-md text-base font-medium">Donate</Link>
                    </div>
                    {user ? (
                        <div className="pt-4 pb-3 border-t border-indigo-700">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    {user.profilePicture ? (
                                        <img src={`http://localhost:5000${user.profilePicture}`} className="h-10 w-10 rounded-full object-cover" alt="Profile" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                            {user.firstName[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user.firstName} {user.lastName}</div>
                                    <div className="text-sm font-medium leading-none text-indigo-300">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600">Dashboard</Link>
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600">Your Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600">Sign out</button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4 pb-3 border-t border-indigo-700">
                            <div className="mt-3 px-2 space-y-1">
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-200 hover:text-white hover:bg-indigo-600">Register</Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav >
    );
};

export default Navbar;
