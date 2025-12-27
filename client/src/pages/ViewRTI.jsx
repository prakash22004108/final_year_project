import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, AlertTriangle, Book, Gavel, CheckCircle, RefreshCcw, ArrowRight } from 'lucide-react';

const ViewRTI = () => {
    const { id } = useParams();
    const [rti, setRti] = useState(null);
    const [complaines, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        fetchRTI();
        fetchComplaints();
    }, [id]);

    const fetchRTI = async () => {
        try {
            const res = await api.get('/rti'); // Ideally should have getById, but filtering client side for now or fix backend
            // Wait, I didn't make a specific getById route implementation in controller, I only made getUserRTIs. 
            // Let's implement fuzzy finding from the list efficiently or add the route? 
            // I added getUserRTIs. I'll just find it from there for simplicity or I should have added getById.
            // Actually getUserRTIs returns all. I'll filter.
            const found = res.data.find(r => r._id === id);
            setRti(found);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComplaints = async () => {
        // Similarly fetching all currently as I didn't strictly implement getByRTIId
        try {
            const res = await api.get('/complaints');
            // Filter client side
            const found = res.data.filter(c => c.rtiRequest._id === id || c.rtiRequest === id);
            setComplaints(found);
        } catch (err) {
            console.error(err);
        }
    };

    const simulateResponse = async () => {
        setProcessing(true);
        try {
            await api.put(`/rti/${id}/simulate-response`);
            await fetchRTI();
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const analyzeResponse = async () => {
        setProcessing(true);
        try {
            const res = await api.put(`/rti/${id}/analyze`);
            setAnalysisResult(res.data);
            await fetchRTI();
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const generateComplaint = async () => {
        setProcessing(true);
        try {
            await api.post(`/complaints/generate`, { rtiId: id });
            await fetchComplaints();
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    if (loading) return <div className="text-center py-20 text-slate-400">Loading Application Details...</div>;
    if (!rti) return <div className="text-center py-20 text-red-400">Application not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold text-white">RTI Application #{id.slice(-6)}</h1>
                        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">{rti.status}</span>
                    </div>
                    <p className="text-slate-400 text-lg">{rti.subject}</p>
                </div>
            </div>

            {/* 1. Application Details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4 text-purple-400">
                    <FileText className="mr-2" size={20} />
                    <h2 className="text-lg font-semibold">Application Content</h2>
                </div>
                <div className="bg-black/20 p-4 rounded-lg text-slate-300 whitespace-pre-line font-mono text-sm leading-relaxed border border-white/5">
                    {rti.description}
                </div>
            </div>

            {/* AI Transparency Section */}
            {rti.aiAnalysis && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center mb-4 text-purple-300">
                        <Search className="mr-2" size={20} />
                        <h2 className="text-lg font-semibold">AI Request Analysis</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm text-purple-400 font-medium uppercase tracking-wider mb-2">Classification</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Category</span>
                                    <span className="text-white">{rti.aiAnalysis.intent?.category}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Urgency</span>
                                    <span className={`font-medium ${rti.aiAnalysis.intent?.urgency === 'Scam Alert' ? 'text-red-400' : 'text-white'}`}>
                                        {rti.aiAnalysis.intent?.urgency}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-1">
                                    <span className="text-slate-400">Confidence</span>
                                    <span className="text-white">{(rti.aiAnalysis.intent?.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm text-purple-400 font-medium uppercase tracking-wider mb-2">Detected Entities</h3>
                            <div className="flex flex-wrap gap-2">
                                {rti.aiAnalysis.ner?.locations?.map(l => <span key={l} className="px-2 py-1 bg-white/10 rounded text-xs text-blue-200">{l}</span>)}
                                {rti.aiAnalysis.ner?.organizations?.map(o => <span key={o} className="px-2 py-1 bg-white/10 rounded text-xs text-yellow-200">{o}</span>)}
                                {rti.aiAnalysis.ner?.money?.map(m => <span key={m} className="px-2 py-1 bg-white/10 rounded text-xs text-green-200">{m}</span>)}
                                {rti.aiAnalysis.ner?.dates?.map(d => <span key={d} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-200">{d}</span>)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 2. Response Section */}
            {rti.status !== 'Drafted' && rti.status !== 'Submitted' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-blue-400">
                            <Book className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">Government Response</h2>
                        </div>
                        {rti.status === 'Response Received' && (
                            <button
                                onClick={analyzeResponse}
                                disabled={processing}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 flex items-center"
                            >
                                {processing ? <RefreshCcw className="animate-spin mr-2" size={16} /> : <Search className="mr-2" size={16} />}
                                Analyze with AI
                            </button>
                        )}
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg text-slate-200 border-l-4 border-blue-500">
                        <p>{rti.responseDetails}</p>
                    </div>

                    {/* Analysis Result */}
                    {(rti.status === 'Analyzed' || analysisResult) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 bg-red-500/10 border border-red-500/20 p-4 rounded-lg"
                        >
                            <h3 className="text-red-400 font-semibold flex items-center mb-2">
                                <AlertTriangle className="mr-2" size={18} /> AI Anomaly Detection
                            </h3>
                            <p className="text-slate-300">
                                {analysisResult?.analysisResult || (rti.responseDetails.toLowerCase().includes('discrepancy') ? "ALERT: Detected potential fraud indicator. Discrepancy in financial records suspected." : "No significant anomalies found.")}
                            </p>

                            {complaines.length === 0 && (
                                <div className="mt-4">
                                    <button
                                        onClick={generateComplaint}
                                        disabled={processing}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center"
                                    >
                                        {processing ? <RefreshCcw className="animate-spin mr-2" size={16} /> : <Gavel className="mr-2" size={16} />}
                                        Generate Legal Complaint
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* 3. Generated Complaint */}
            {complaines.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/5 border border-green-500/10 rounded-xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center mb-4 text-green-400">
                        <Gavel className="mr-2" size={20} />
                        <h2 className="text-lg font-semibold">Legal Complaint Draft</h2>
                    </div>

                    {/* IPC Sections */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {complaines[0].suggestedIPCSections.map((ipc, idx) => (
                            <div key={idx} className="bg-slate-800 text-slate-200 text-xs px-3 py-1 rounded border border-slate-700 flex items-center">
                                <span className="font-bold text-yellow-500 mr-2">{ipc.section}</span>
                                {ipc.description}
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg text-slate-300 whitespace-pre-line font-mono text-sm leading-relaxed border border-white/5">
                        {complaines[0].generatedComplaintText}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center">
                            <CheckCircle size={16} className="mr-1" /> Ready to Print / File
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Action: Simulate Receipt if waiting */}
            {rti.status === 'Submitted' && (
                <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">Waiting for response from department...</p>
                    <button
                        onClick={simulateResponse}
                        disabled={processing}
                        className="text-slate-400 hover:text-white border border-slate-600 hover:border-white px-4 py-2 rounded-full text-sm transition-colors"
                    >
                        {processing ? 'Processing...' : 'Simulate Receiving Response (Demo Only)'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewRTI;
