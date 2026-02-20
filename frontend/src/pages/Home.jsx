import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Users, Briefcase, Calendar, ArrowRight, BookOpen, Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="bg-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-20"
                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
                        alt="Alumni networking"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 mix-blend-multiply" aria-hidden="true" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Connect, Mentor, Grow.
                        </h1>
                        <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
                            Join your exclusive alumni network to unlock specific career opportunities, find mentorship, and stay connected with your alma mater.
                        </p>
                        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                            {user ? (
                                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8 transform transition hover:scale-105"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                                    <Link
                                        to="/register"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 sm:px-8 transform transition hover:scale-105"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 sm:px-8 transform transition hover:scale-105"
                                    >
                                        Log In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-indigo-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Trusted by thousands of graduates
                        </h2>
                        <p className="mt-3 text-xl text-indigo-200 sm:mt-4">
                            Our community is growing stronger every day.
                        </p>
                    </div>
                    <motion.dl
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8"
                    >
                        <motion.div variants={fadeIn} className="flex flex-col">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Alumni</dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">5,000+</dd>
                        </motion.div>
                        <motion.div variants={fadeIn} className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Mentorships</dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">1,200+</dd>
                        </motion.div>
                        <motion.div variants={fadeIn} className="flex flex-col mt-10 sm:mt-0">
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Events</dt>
                            <dd className="order-1 text-5xl font-extrabold text-white">350+</dd>
                        </motion.div>
                    </motion.dl>
                </div>
            </div>

            {/* Feature Section */}
            <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
                <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                    <div className="relative text-center">
                        <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to succeed
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                            Whether you're looking for guidance, seeking new opportunities, or wanting to give back, we have the tools for you.
                        </p>
                    </div>

                    <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="relative"
                        >
                            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                Mentorship Program
                            </h3>
                            <p className="mt-3 text-lg text-gray-500">
                                Connect with students and recent graduates to share your knowledge and experience. Or find a mentor who can guide you through your career journey.
                            </p>

                            <dl className="mt-10 space-y-10">
                                <div className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <Users className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">One-on-One Guidance</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        Personalized mentorship sessions tailored to your goals.
                                    </dd>
                                </div>

                                <div className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <BookOpen className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Career Advice</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        Get resume reviews, interview tips, and industry insights.
                                    </dd>
                                </div>
                            </dl>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="mt-10 -mx-4 relative lg:mt-0"
                            aria-hidden="true"
                        >
                            <img
                                className="relative mx-auto rounded-lg shadow-lg transform transition hover:scale-105 duration-300"
                                width={490}
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
                                alt="Mentorship meeting"
                            />
                        </motion.div>
                    </div>

                    <div className="relative mt-12 sm:mt-16 lg:mt-24">
                        <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="lg:col-start-2"
                            >
                                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                                    Career Opportunities
                                </h3>
                                <p className="mt-3 text-lg text-gray-500">
                                    Discover job openings and internships exclusive to our alumni network. Post opportunities to recruit top talent from your alma mater.
                                </p>

                                <dl className="mt-10 space-y-10">
                                    <div className="relative">
                                        <dt>
                                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <Briefcase className="h-6 w-6" aria-hidden="true" />
                                            </div>
                                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Exclusive Job Board</p>
                                        </dt>
                                        <dd className="mt-2 ml-16 text-base text-gray-500">
                                            Access unlisted opportunities at top companies.
                                        </dd>
                                    </div>

                                    <div className="relative">
                                        <dt>
                                            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                                <Search className="h-6 w-6" aria-hidden="true" />
                                            </div>
                                            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Alumni Directory</p>
                                        </dt>
                                        <dd className="mt-2 ml-16 text-base text-gray-500">
                                            Search and filter alumni by industry, company, or location.
                                        </dd>
                                    </div>
                                </dl>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1"
                            >
                                <img
                                    className="relative mx-auto rounded-lg shadow-lg transform transition hover:scale-105 duration-300"
                                    width={490}
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
                                    alt="Job opportunities"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div className="bg-indigo-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-indigo-200">Join upcoming events today.</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                to="/events"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transform transition hover:scale-105"
                            >
                                View Events
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex rounded-md shadow">
                            <Link
                                to="/donations"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transform transition hover:scale-105"
                            >
                                Support Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800" aria-labelledby="footer-heading">
                <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8 xl:col-span-1">
                            <span className="text-white font-bold text-2xl">AlumniConnect</span>
                            <p className="text-gray-300 text-base">
                                Connecting graduates, empowering students, and building a stronger future together.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                            <div className="md:grid md:grid-cols-2 md:gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Network</h3>
                                    <ul role="list" className="mt-4 space-y-4">
                                        <li><Link to="/directory" className="text-base text-gray-300 hover:text-white">Directory</Link></li>
                                        <li><Link to="/mentorship" className="text-base text-gray-300 hover:text-white">Mentorship</Link></li>
                                        <li><Link to="/jobs" className="text-base text-gray-300 hover:text-white">Jobs</Link></li>
                                    </ul>
                                </div>
                                <div className="mt-12 md:mt-0">
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Community</h3>
                                    <ul role="list" className="mt-4 space-y-4">
                                        <li><Link to="/events" className="text-base text-gray-300 hover:text-white">Events</Link></li>
                                        <li><Link to="/donations" className="text-base text-gray-300 hover:text-white">Give Back</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8">
                        <p className="text-base text-gray-400 xl:text-center">
                            &copy; 2026 AlumniConnect. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
