import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, AlertTriangle, CheckCircle, Search, ChevronDown, ChevronUp, Filter, Calendar, Eye } from 'lucide-react';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter & Sort States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const [resolutionData, setResolutionData] = useState({ id: null, response: '' });
    const [showResolveModal, setShowResolveModal] = useState(false);

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

    const handleStatusUpdate = async (id, newStatus, response = '') => {
        try {
            const res = await api.put(`/complaints/${id}/status`, { status: newStatus, adminResponse: response });
            setComplaints(complaints.map(c => c._id === id ? res.data : c));
            setShowResolveModal(false);
            setResolutionData({ id: null, response: '' });
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const initiateResolution = (id) => {
        setResolutionData({ id, response: '' });
        setShowResolveModal(true);
    };

    // Derived values for filters
    const departments = ['All', ...new Set(complaints.map(c => c.rtiRequest?.department).filter(Boolean))];
    const statuses = ['All', 'Received', 'Viewed', 'Resolved']; 

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = 
            c.rtiRequest?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchesDept = departmentFilter === 'All' || c.rtiRequest?.department === departmentFilter;
        
        return matchesSearch && matchesStatus && matchesDept;
    });

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading Admin Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
                <Gavel className="mr-3 text-red-500" /> Admin Complaint Dashboard
            </h1>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search subject or email..." 
                        className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-red-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="relative">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <Gavel size={16} />
                     </div>
                    <select 
                        className="w-full bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                    </select>
                </div>

                <div className="flex items-center justify-end text-sm text-slate-400">
                    Showing {filteredComplaints.length} results
                </div>
            </div>

            <div className="grid gap-4">
                {filteredComplaints.map((c) => (
                    <motion.div 
                        key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-slate-900 border transition-colors duration-200 rounded-xl overflow-hidden ${expandedId === c._id ? 'border-red-500/50' : 'border-slate-700/50 hover:border-slate-600'}`}
                    >
                        {/* Header (Clickable) */}
                        <div 
                            onClick={() => toggleExpand(c._id)}
                            className="bg-slate-800/50 p-4 flex justify-between items-center cursor-pointer select-none"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${expandedId === c._id ? 'bg-red-500/20 text-red-500' : 'bg-slate-700/50 text-slate-400'}`}>
                                    {expandedId === c._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center text-red-400 mb-1">
                                        <h3 className="font-semibold text-lg">{c.rtiRequest?.subject || "Unknown RTI"}</h3>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                                        <span>{c.user?.email}</span>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                        <span className="flex items-center"><Calendar size={12} className="mr-1"/> {new Date(c.createdAt).toLocaleDateString()}</span>
                                        {c.rtiRequest?.department && (
                                            <>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">{c.rtiRequest.department}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded uppercase font-bold border ${
                                c.status === 'Resolved' ? 'bg-green-500/20 text-green-500 border-green-500/20' : 
                                c.status === 'Viewed' ? 'bg-blue-500/20 text-blue-500 border-blue-500/20' :
                                'bg-yellow-500/20 text-yellow-500 border-yellow-500/20'
                            }`}>
                                {c.status}
                            </span>
                        </div>

                        {/* Collapsible Body */}
                        <AnimatePresence>
                            {expandedId === c._id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    {/* IPC Sections */}
                                    <div className="p-4 bg-black/20 border-y border-white/5 flex flex-wrap gap-2">
                                        {c.suggestedIPCSections && c.suggestedIPCSections.length > 0 ? c.suggestedIPCSections.map((ipc, idx) => (
                                            <div key={idx} className="bg-red-900/20 text-red-200 text-xs px-2 py-1 rounded border border-red-500/20 flex items-center">
                                                <span className="font-bold mr-2">{ipc.section}</span>
                                                {ipc.description}
                                            </div>
                                        )) : <span className="text-slate-500 text-sm italic">No IPC sections suggested</span>}
                                    </div>

                                    {/* Body */}
                                    <div className="p-4">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Complaint Draft</h4>
                                        <div className="bg-black/40 p-4 rounded-lg text-slate-300 text-sm font-mono whitespace-pre-wrap leading-relaxed border border-slate-700 shadow-inner">
                                            {c.generatedComplaintText}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-3 bg-slate-800/30 flex justify-end space-x-3 border-t border-white/5">
                                        <button className="text-xs text-slate-400 hover:text-white flex items-center px-3 py-2 rounded hover:bg-white/5 transition-colors">
                                            <Search size={14} className="mr-1" /> View Original RTI
                                        </button>

                                        {c.status === 'Received' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(c._id, 'Viewed')}
                                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors shadow-lg shadow-blue-900/20"
                                            >
                                                <Eye size={14} className="mr-1" /> Mark as Viewed
                                            </button>
                                        )}

                                        {c.status !== 'Resolved' && (
                                            <button 
                                                onClick={() => initiateResolution(c._id)}
                                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center transition-colors shadow-lg shadow-green-900/20"
                                            >
                                                <CheckCircle size={14} className="mr-1" /> Resolve with Response
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {filteredComplaints.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
                        <CheckCircle className="mx-auto h-12 w-12 text-slate-500/50 mb-4" />
                        <h3 className="text-xl font-medium text-white">No complaints found</h3>
                        <p className="text-slate-400 mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>

            {/* Resolution Modal */}
            {showResolveModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <CheckCircle className="mr-2 text-green-500" /> Resolve Complaint
                        </h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Provide a final response or resolution note for this complaint. This will be visible to the citizen.
                        </p>
                        <textarea
                            value={resolutionData.response}
                            onChange={(e) => setResolutionData({ ...resolutionData, response: e.target.value })}
                            className="w-full bg-black/30 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-green-500 h-32 mb-4"
                            placeholder="Enter resolution details..."
                        />
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowResolveModal(false)}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(resolutionData.id, 'Resolved', resolutionData.response)}
                                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-900/20"
                            >
                                Confirm Resolution
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
