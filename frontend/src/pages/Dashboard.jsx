import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">Please login to view dashboard.</div>;
    }

    switch (user.role) {
        case 'student':
            return <StudentDashboard />;
        case 'alumni':
            return <AlumniDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return <div className="text-center mt-10 text-red-500">Unknown user role: {user.role}</div>;
    }
};

export default Dashboard;
