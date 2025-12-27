import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../helpers/api';
import { Upload, CheckCircle } from 'lucide-react';

const RespondRTI = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rti, setRti] = useState(null);
    const [response, setResponse] = useState('');
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchRTI = async () => {
            try {
                // Officials might use a different endpoint to view details, 
                // but the standard GET /rti/:id works if we allow them access.
                // For now, let's assume the GET /rti/:id works for officials too (needs checking permissions).
                // Or create a specific official get. User-side GET checks req.user.id match. 
                // Officials need a separate GET or update existing one.
                // Let's use the USER endpoint but we should update controller to allow Officials.
                // Assuming we updated controller or will update it.
                // Actually `rtiController.getRTI` only allows owner. 
                // We haven't updated GET /:id. We should probably do that or use the official list.
                // Let's rely on the list data? No, list is summary.

                // Workaround: Add `getOfficialRTI` to backend.
                // Let's stick to simple text for now or just fetch details via dedicated route?
                // Let's try fetching and see. If 404/403, we need to fix backend.
                // Let's assume we fix backend.
                const res = await api.get(`/official/rtis`); // HACK: filter locally for now if we lack ID endpoint
                const found = res.data.find(r => r._id === id);
                if (found) setRti(found);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRTI();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('responseText', response);
        if (file) formData.append('document', file);

        try {
            await api.post(`/official/respond/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Response Submitted!');
            navigate('/official/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to submit response');
        } finally {
            setSubmitting(false);
        }
    };

    if (!rti) return <div className="text-white text-center mt-10">Loading RTI Details...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Respond to RTI Request</h1>

            <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h2 className="text-lg font-semibold text-purple-300">{rti.subject}</h2>
                <p className="text-slate-300 mt-2">{rti.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-300 mb-2">Official Response</label>
                    <textarea
                        rows="6"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Enter the official response here..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-slate-300 mb-2">Attach Document (PDF/Image)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".pdf,image/*"
                        />
                        <Upload className="mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-300">{file ? file.name : "Click to upload file"}</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all flex justify-center items-center"
                >
                    {submitting ? 'Submitting...' : <><CheckCircle className="mr-2" size={18} /> Submit Response</>}
                </button>
            </form>
        </div>
    );
};

export default RespondRTI;
