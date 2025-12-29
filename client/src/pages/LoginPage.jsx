import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user } = await login(formData.email, formData.password);
            
            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'official') {
                navigate('/official/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl"
            >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all">
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center text-slate-400">
                    Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300">Sign up</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
