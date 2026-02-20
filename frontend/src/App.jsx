import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Jobs from './pages/Jobs';
import Mentorship from './pages/Mentorship';
import AdminDashboard from './pages/AdminDashboard';
import Donations from './pages/Donations';
import Directory from './pages/Directory';

// Temporary placeholders until we create the files
// const Home = () => <div className="p-10 text-center text-2xl">Welcome to Alumni Mentorship Platform</div>;
// const Dashboard = () => <div className="p-10 text-center">Dashboard</div>;

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className={isHomePage ? "flex-grow" : "container mx-auto py-8 px-4 flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/directory" element={<Directory />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
