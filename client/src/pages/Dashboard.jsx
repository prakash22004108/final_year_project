import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { Link } from 'react-router-dom';
import { Plus, FileText, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [rtis, setRtis] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRTIs();
    }, []);

    const fetchRTIs = async () => {
        try {
            const res = await api.get('/rti');
            setRtis(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Drafted': return 'bg-gray-500/20 text-gray-300';
            case 'Submitted': return 'bg-blue-500/20 text-blue-300';
            case 'Response Received': return 'bg-yellow-500/20 text-yellow-300';
            case 'Analyzed': return 'bg-purple-500/20 text-purple-300';
            default: return 'bg-slate-700/50 text-slate-300';
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">Manage your RTI applications and complaints.</p>
                </div>
                <Link to="/create-rti" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-lg shadow-purple-900/20 transition-all">
                    <Plus size={20} className="mr-2" />
                    New Application
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-20">Loading...</div>
            ) : rtis.length === 0 ? (
                <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                    <p className="text-slate-400 mb-6">Start by creating your first RTI application.</p>
                    <Link to="/create-rti" className="text-purple-400 hover:text-purple-300 font-medium">Create Now &rarr;</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rtis.map((rti, index) => (
                        <motion.div
                            key={rti._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rti.status)}`}>
                                    {rti.status}
                                </span>
                                <span className="text-slate-500 text-sm">{new Date(rti.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 truncate" title={rti.subject}>{rti.subject}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{rti.department}</p>

                            <Link to={`/rti/${rti._id}`} className="inline-flex items-center text-purple-400 hover:text-white transition-colors text-sm font-medium group-hover:translate-x-1">
                                View Status <ChevronRight size={16} className="ml-1" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
