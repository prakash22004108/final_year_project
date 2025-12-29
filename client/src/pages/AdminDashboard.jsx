import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { motion } from 'framer-motion';
import { Gavel, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints/admin');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading Admin Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
                <Gavel className="mr-3 text-red-500" /> Admin Complaint Dashboard
            </h1>

            <div className="grid gap-6">
                {complaints.map((c) => (
                    <motion.div 
                        key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-white/5">
                            <div>
                                <div className="flex items-center text-red-400 mb-1">
                                    <AlertTriangle size={16} className="mr-2" />
                                    <h3 className="font-semibold">{c.rtiRequest?.subject || "Unknown RTI"}</h3>
                                </div>
                                <p className="text-xs text-slate-500">Filed by: {c.user?.name} ({c.user?.email})</p>
                            </div>
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded uppercase font-bold border border-yellow-500/20">
                                {c.status}
                            </span>
                        </div>

                        {/* IPC Sections */}
                        <div className="p-4 bg-black/20 border-b border-white/5 flex flex-wrap gap-2">
                            {c.suggestedIPCSections.map((ipc, idx) => (
                                <div key={idx} className="bg-red-900/20 text-red-200 text-xs px-2 py-1 rounded border border-red-500/20 flex items-center">
                                    <span className="font-bold mr-2">{ipc.section}</span>
                                    {ipc.description}
                                </div>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="p-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Complaint Draft</h4>
                            <div className="bg-black/40 p-3 rounded text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed border border-slate-700">
                                {c.generatedComplaintText}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-slate-800/30 flex justify-end space-x-3">
                            <button className="text-xs text-slate-400 hover:text-white flex items-center">
                                <Search size={14} className="mr-1" /> View Original RTI
                            </button>
                            <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center transition-colors">
                                <CheckCircle size={14} className="mr-1" /> Mark as Processed
                            </button>
                        </div>
                    </motion.div>
                ))}

                {complaints.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500/50 mb-4" />
                        <h3 className="text-xl font-medium text-white">All Clear</h3>
                        <p className="text-slate-400 mt-2">No pending complaints found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
