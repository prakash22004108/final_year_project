import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, LogOut, User, FilePlus, LayoutDashboard, Menu, X, Gavel } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
        >
            <Icon size={18} />
            <span>{children}</span>
        </Link>
    );

    return (
        <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        <Scale className="text-purple-400" />
                        <span>RTI & IPC AI</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2">Login</Link>
                                <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                {user?.role === 'citizen' && (
                                    <>
                                        <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                                        <Link to="/create-rti" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                                            <FilePlus size={18} className="mr-2" /> New RTI
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'admin' && (
                                    <Link to="/admin" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all flex items-center">
                                        <Gavel size={18} className="mr-2" /> Admin Dashboard
                                    </Link>
                                )}

                                <div className="flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-purple-400 capitalize">{user.role}</p>
                                    </div>
                                    <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-white/10 p-4 space-y-2">
                    {!user ? (
                        <>
                            <Link to="/login" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/signup" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Signup</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'citizen' && (
                                <>
                                    <Link to="/dashboard" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    <Link to="/create-rti" className="block text-slate-300 hover:text-white py-2" onClick={() => setIsOpen(false)}>New RTI</Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="block text-red-400 hover:text-red-300 py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="block w-full text-left text-slate-400 hover:text-slate-300 py-2 border-t border-white/10 mt-2 pt-2">Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
