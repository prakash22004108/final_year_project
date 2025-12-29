import { useEffect, useState } from 'react';
import api from '../helpers/api';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Search, AlertTriangle, Book, Gavel, CheckCircle, RefreshCcw, ArrowRight, Clock, Eye, Database, Activity, XCircle, Send, Mail } from 'lucide-react';

const ViewRTI = () => {
    const { id } = useParams();
    const [rti, setRti] = useState(null);
    const [complaines, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [grievance, setGrievance] = useState(""); // User input for complaint

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
            await api.post(`/complaints/generate`, { 
                rtiId: id,
                grievance: grievance || "General dissatisfaction with the response."
            });
            await fetchComplaints();
            setShowComplaintModal(false);
        } catch (err) {
            console.error(err);
        }
        setProcessing(false);
    };

    const handleOpenDraft = () => {
        if (!rti?.dataAvailability?.emailDraft || !rti?.dataAvailability?.targetEmail) return;
        
        const recipient = rti.dataAvailability.targetEmail;
        const subject = encodeURIComponent(`URGENT: Issue regarding ${rti.subject}`);
        const body = encodeURIComponent(rti.dataAvailability.emailDraft);
        
        // Fallback to Gmail Web Interface - stronger reliability for web users
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
    };

    const submitRTI = async () => {
        setProcessing(true);
        try {
            await api.put(`/rti/${id}/submit`);
            await fetchRTI();
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
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${rti.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'}`}>{rti.status}</span>
                    </div>
                    <p className="text-slate-400 text-lg">{rti.subject}</p>
                </div>
            </div>

            {/* 0. REJECTED STATUS */}
            {rti.status === 'Rejected' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm mb-6 flex items-start">
                    <XCircle className="text-red-500 mr-4 shrink-0" size={32} />
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Application Rejected</h2>
                        <p className="text-red-200 mb-2">This request has been flagged as invalid by the AI system.</p>
                        <div className="bg-black/20 p-3 rounded text-sm text-red-300 font-mono">
                            REASON: Request does not fall under the purview of the Right to Information Act (e.g., Aliens, Private Disputes, Non-Governmental issues).
                        </div>
                    </div>
                </div>
            )}

            {/* 0. MILESTONE TRACKER (Horizontal) */}
            <div className="bg-slate-800/40 border border-white/5 rounded-xl p-6 backdrop-blur-sm overflow-x-auto">
                <div className="flex items-center justify-between min-w-[600px]">
                    {['Drafted', 'Submitted', 'Response Received', 'Analyzed'].map((step, idx) => {
                        const currentIdx = ['Drafted', 'Submitted', 'Response Received', 'Analyzed'].indexOf(rti.status) === -1 
                            ? (rti.status === 'Rejected' ? -1 : 0) // Handle rejected or unknown
                            : ['Drafted', 'Submitted', 'Response Received', 'Analyzed'].indexOf(rti.status);
                        
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                            <div key={step} className="flex flex-col items-center relative flex-1 text-center group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 z-10 
                                    ${isCompleted ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-700 text-slate-400'}`}>
                                    {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                                </div>
                                <span className={`text-xs font-medium ${isCompleted ? 'text-blue-300' : 'text-slate-500'}`}>{step}</span>
                                
                                {/* Connector Line */}
                                {idx < 3 && (
                                    <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${idx < currentIdx ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
                                )}
                            </div>
                        );
                    })}
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

            {/* AI Request Analysis & Data Availability Grid */}
            {rti.aiAnalysis && (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Col: Analysis */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
                    >
                         <div className="flex items-center mb-6 text-purple-300 border-b border-purple-500/20 pb-4">
                            <Activity className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">AI Request Analysis</h2>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-8">
                            {/* Classification */}
                            <div className="space-y-4">
                                <h3 className="text-xs text-purple-400 font-bold uppercase tracking-wider">Classification</h3>
                                <div className="space-y-3">
                                    <div className="bg-black/20 p-3 rounded-lg flex justify-between items-center border border-purple-500/10">
                                        <span className="text-slate-400 text-sm">Category</span>
                                        <span className="text-white font-medium">{rti.aiAnalysis.intent?.category}</span>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg flex justify-between items-center border border-purple-500/10">
                                        <span className="text-slate-400 text-sm">Urgency</span>
                                        <span className={`font-medium ${rti.aiAnalysis.intent?.urgency === 'Scam Alert' ? 'text-red-400' : 'text-blue-300'}`}>
                                            {rti.aiAnalysis.intent?.urgency}
                                        </span>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg flex justify-between items-center border border-purple-500/10">
                                        <span className="text-slate-400 text-sm">Confidence</span>
                                        <div className="flex items-center text-green-400 font-bold">
                                            <span>{(rti.aiAnalysis.intent?.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Entities */}
                            <div>
                                <h3 className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-4">Detected Entities</h3>
                                <div className="flex flex-wrap gap-2 content-start">
                                    {rti.aiAnalysis.ner?.locations?.map(l => <span key={l} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">{l}</span>)}
                                    {rti.aiAnalysis.ner?.organizations?.map(o => <span key={o} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs border border-yellow-500/30">{o}</span>)}
                                    {rti.aiAnalysis.ner?.money?.map(m => <span key={m} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/30">{m}</span>)}
                                    {rti.aiAnalysis.ner?.dates?.map(d => <span key={d} className="px-2 py-1 bg-slate-500/20 text-slate-300 rounded text-xs border border-slate-500/30">{d}</span>)}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Col: Data Availability & Logs */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm flex flex-col h-full"
                    >
                        <div className="flex items-center mb-6 text-blue-400 border-b border-white/5 pb-4">
                            <Database className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">Data Availability</h2>
                        </div>

                        {/* Status Card */}
                        <div className="mb-4">
                             {(rti.dataAvailability?.status === 'Available' || rti.dataAvailability?.status?.includes('Available')) ? (
                                <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/30 text-green-400 flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold">{rti.dataAvailability.status}</span>
                                    <CheckCircle size={16} />
                                </div>
                            ) : (
                                <div className="p-3 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400 mb-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">Data Not Available</span>
                                        <AlertTriangle size={16} />
                                    </div>
                                    <p className="text-xs bg-red-500/20 p-2 rounded text-center mt-2">
                                        DATA IS NOT AVAILABLE AND WILL BE ADDED SOON
                                    </p>
                                </div>
                            )}
                             <p className="text-xs text-slate-500 px-1">Source: <span className="text-slate-300">{rti.dataAvailability?.source || 'N/A'}</span></p>
                        </div>

                        {/* Data Check Processing Steps (User Friendly) */}
                        {rti.dataAvailability?.log && rti.dataAvailability.log.length > 0 && (
                            <div className="flex-1 overflow-y-auto max-h-[200px] mt-4">
                                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Processing Steps</h3>
                                <div className="space-y-4 relative pl-2 border-l border-slate-700/50 ml-2">
                                    {rti.dataAvailability.log.map((log, idx) => (
                                        <div key={idx} className="relative pl-4">
                                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 
                                                ${log.includes('Found') ? 'bg-green-500' : log.includes('Missing') ? 'bg-red-500' : 'bg-slate-600'}`}>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{log}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* AI AUTO-DRAFT EMAIL (If Missing) */}
                        {rti.dataAvailability?.emailDraft && (
                             <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
                                    <div className="flex items-center text-blue-400 mb-2">
                                        <Mail size={14} className="mr-2" />
                                        <span className="text-xs font-bold uppercase">Suggested Action</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">Send email to <b>{rti.dataAvailability.targetEmail}</b></p>
                                    <button 
                                        onClick={handleOpenDraft}
                                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium flex items-center justify-center transition-colors"
                                    >
                                        <Send size={12} className="mr-2" /> Open Draft
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
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
                    {/* Visual Response Parser */}
                    {(() => {
                        // Simple parser for the simulated response format
                        // "Project Name. Allocated: 1Cr. Spent: 1Cr. Status: Complete. (Audit Note: ...)"
                        const text = rti.responseDetails || "";
                        const allocatedMatch = text.match(/Allocated:\s*([^.]+)/);
                        const spentMatch = text.match(/Spent:\s*([^.]+)/);
                        const statusMatch = text.match(/Status:\s*([^.]+)/);
                        const auditMatch = text.match(/\((Audit Note:[^)]+)\)/);
                        const pureText = text.replace(/\(Audit Note:[^)]+\)/, "").split('.').slice(0, 1).join('.'); // Get title part approx

                        return (
                            <div className="space-y-4">
                                {/* Header / Title */}
                                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{pureText || "Response Information"}</h3>
                                        <p className="text-slate-400 text-sm mt-1">Received from Department on {new Date().toLocaleDateString()}</p>
                                    </div>
                                    {statusMatch && (
                                        <span className={`px-3 py-1 rounded text-sm font-bold border ${statusMatch[1].includes('Complete') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                                            {statusMatch[1]}
                                        </span>
                                    )}
                                </div>

                                {/* Metrics Cards */}
                                {(allocatedMatch || spentMatch) && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Activity size={40} />
                                            </div>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Total Allocated</p>
                                            <p className="text-2xl font-mono text-white font-bold">{allocatedMatch ? allocatedMatch[1] : "N/A"}</p>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Database size={40} />
                                            </div>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Amount Spent</p>
                                            <p className={`text-2xl font-mono font-bold ${allocatedMatch && spentMatch && allocatedMatch[1] === spentMatch[1] ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {spentMatch ? spentMatch[1] : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Audit Warning */}
                                {auditMatch && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-500/10 border border-red-500/40 p-4 rounded-lg flex items-start"
                                    >
                                        <AlertTriangle className="text-red-500 shrink-0 mr-3 mt-0.5" size={20} />
                                        <div>
                                            <h4 className="text-red-400 font-bold text-sm uppercase mb-1">Auditor Flag Raised</h4>
                                            <p className="text-slate-300 text-sm font-medium">{auditMatch[1]}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Full Text Fallback */}
                                {!allocatedMatch && !auditMatch && (
                                    <div className="bg-slate-800/30 p-4 rounded text-slate-300 italic text-sm">
                                        "{text}"
                                    </div>
                                )}
                            </div>
                        );
                    })()}

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
                                        onClick={() => setShowComplaintModal(true)} // Open Modal
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
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-green-400">
                            <Gavel className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">Legal Complaint Draft</h2>
                        </div>
                        {rti.officerViewed && (
                            <div className="flex items-center text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                <Eye size={14} className="mr-2" />
                                <span className="text-xs font-bold uppercase">Officer Viewed RTI</span>
                            </div>
                        )}
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

                    <div className="bg-black/20 p-4 rounded-lg text-slate-300 whitespace-pre-line font-mono text-sm leading-relaxed border border-white/5 mb-6">
                        {complaines[0].generatedComplaintText}
                    </div>

                    {/* Context: Officer Status & Original Response */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Context: Original RTI Handling</h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* 1. View Status */}
                            <div className={`p-3 rounded border ${rti.officerViewed ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                                <div className="flex items-center mb-1">
                                    <Eye size={16} className="mr-2" />
                                    <span className="font-bold text-sm">{rti.officerViewed ? 'Officer Viewed Application' : 'Not Yet Viewed'}</span>
                                </div>
                                <p className="text-xs opacity-70">
                                    {rti.officerViewed 
                                        ? "The responsible officer has opened and viewed your RTI application." 
                                        : "The officer has not yet opened your application (Ground for 'Inaction' complaint)."}
                                </p>
                            </div>

                            {/* 2. Response Status */}
                            <div className="p-3 rounded border bg-slate-700/30 border-slate-600 text-slate-300">
                                <div className="flex items-center mb-1">
                                    <Book size={16} className="mr-2" />
                                    <span className="font-bold text-sm">Government Response</span>
                                </div>
                                {rti.responseDetails ? (
                                    <p className="text-xs line-clamp-3 italic">"{rti.responseDetails}"</p>
                                ) : (
                                    <p className="text-xs text-red-400 italic">No response provided yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center">
                            <CheckCircle size={16} className="mr-1" /> Ready to Print / File
                        </button>
                    </div>
                </motion.div>
            )}


            {/* 4. Detailed Data Availability Card (Verified Record) */}
            {rti.dataAvailability?.fetchedData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-0 overflow-hidden backdrop-blur-sm"
                >
                    <div className="bg-blue-500/10 p-5 border-b border-blue-500/20 flex justify-between items-center">
                        <div className="flex items-center text-blue-400">
                            <CheckCircle className="mr-2" size={20} />
                            <h2 className="text-lg font-semibold">Verified Data Record</h2>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => { setGrievance("The data found is incorrect or irrelevant."); setShowComplaintModal(true); }} 
                                className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded border border-red-500/20 flex items-center transition-colors"
                            >
                                <AlertTriangle size={12} className="mr-1.5" /> Report Issue
                            </button>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/20 uppercase tracking-widest font-bold">
                                {rti.dataAvailability.source}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{rti.dataAvailability.fetchedData.title}</h3>
                                <p className="text-slate-400 text-sm max-w-2xl">{rti.dataAvailability.fetchedData.description || "No detailed description available."}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                <span className={`px-3 py-1 rounded text-sm font-medium ${rti.dataAvailability.fetchedData.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {rti.dataAvailability.fetchedData.status}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Project Progress</span>
                                <span className="text-white font-bold">{rti.dataAvailability.fetchedData.progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${rti.dataAvailability.fetchedData.progress}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                />
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-500 uppercase mb-1">Budget Allocated</p>
                                <p className="text-lg font-mono text-white">₹{(rti.dataAvailability.fetchedData.budget || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-500 uppercase mb-1">Amount Spent</p>
                                <p className={`text-lg font-mono ${rti.dataAvailability.fetchedData.spent > rti.dataAvailability.fetchedData.budget ? 'text-red-400' : 'text-green-400'}`}>
                                    ₹{(rti.dataAvailability.fetchedData.spent || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-500 uppercase mb-1">Start Date</p>
                                <p className="text-white flex items-center">
                                    <Clock size={14} className="mr-2 text-slate-500" />
                                    {rti.dataAvailability.fetchedData.startDate ? new Date(rti.dataAvailability.fetchedData.startDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                                <p className="text-xs text-slate-500 uppercase mb-1">Deadline</p>
                                <p className="text-white flex items-center">
                                    <Clock size={14} className="mr-2 text-slate-500" />
                                    {rti.dataAvailability.fetchedData.deadline ? new Date(rti.dataAvailability.fetchedData.deadline).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Contractor Info */}
                        {rti.dataAvailability.fetchedData.contractor && (
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-sm text-slate-400">
                                <span className="mr-2">Contractor:</span>
                                <span className="text-white font-medium">{rti.dataAvailability.fetchedData.contractor}</span>
                            </div>
                        )}
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
            {/* 5. Generate Complaint Modal */}
            {showComplaintModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Gavel className="mr-2 text-red-500" /> Generate Legal Complaint
                        </h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Details about the issue (e.g., "They asked for a bribe", "Incomplete information provided"). 
                            Our AI will map this to relevant IPC sections.
                        </p>
                        <textarea
                            value={grievance}
                            onChange={(e) => setGrievance(e.target.value)}
                            className="w-full bg-black/30 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-red-500 h-32 mb-4"
                            placeholder="Describe your grievance here..."
                        />
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowComplaintModal(false)}
                                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={generateComplaint}
                                disabled={processing || !grievance.trim()}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center disabled:opacity-50"
                            >
                                {processing ? <RefreshCcw className="animate-spin mr-2" size={16} /> : 'Generate Draft'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}


        </div>
    );
};

export default ViewRTI;
