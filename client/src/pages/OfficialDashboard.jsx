import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react';

const OfficialDashboard = () => {
    const [rtis, setRtis] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRTIs = async () => {
            try {
                const res = await api.get('/official/rtis'); // Fetch department RTIs
                setRtis(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRTIs();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Drafted': return 'text-slate-400';
            case 'Submitted': return 'text-yellow-400';
            case 'Response Received': return 'text-green-400';
            case 'Analyzed': return 'text-purple-400';
            default: return 'text-white';
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Department Dashboard</h1>
            <p className="text-slate-400 mb-8">Manage RTI Requests assigned to your department.</p>

            {loading ? (
                <div className="text-center text-white">Loading Requests...</div>
            ) : rtis.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white">All Caught Up!</h3>
                    <p className="text-slate-400">No pending RTIs for your department.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {rtis.map((rti) => (
                        <motion.div
                            key={rti._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-semibold text-white hover:text-purple-300">
                                        {rti.subject}
                                    </h3>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">ID: h{rti._id.slice(-6)}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-black/30 border border-white/10 ${getStatusColor(rti.status)}`}>
                                    {rti.status}
                                </span>
                            </div>

                            <p className="text-slate-300 mb-4 line-clamp-2">{rti.description}</p>

                            <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                                <div className="text-sm text-slate-400">
                                    <span className="mr-4">Filed by: {rti.user?.name || 'Citizen'}</span>
                                    <span>{new Date(rti.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/official/respond/${rti._id}`)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center"
                                >
                                    <Send size={14} className="mr-2" /> Respond
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfficialDashboard;
