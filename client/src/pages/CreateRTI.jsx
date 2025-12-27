import { useState } from 'react';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Send, Mic, MicOff } from 'lucide-react';

const CreateRTI = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ description: '' });
    const [isDrafting, setIsDrafting] = useState(false);
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser. Try Chrome/Edge.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN'; // Indian English
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setFormData(prev => ({ ...prev, description: prev.description + ' ' + transcript }));
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSimulateDraft = async () => {
        setIsDrafting(true);
        try {
            // We only send the raw description (simulating voice input)
            // Ideally we should have a separate endpoint for just "Drafting Preview" but createRTI does it all now.
            // Let's modify the UI to Submit the "Voice Input" directly to createRTI 
            // OR we add a proper "Preview" step.
            // For simplicity based on user request "form the draft", we will auto-fill the form using AI.

            // Wait, the controller now SAVES the RTI immediately. 
            // Let's assume the user enters text, clicks "Generate Draft", and we hit the API.

            // Actually, let's just make the "Submit" doing the AI magic.
            // Or better: A "Process Voice Input" button that fills the fields.
            // But backend createRTI does everything. 

            // Let's align: User inputs raw text -> System creates Drafted RTI -> Redirects to ViewRTI (where they see the draft).
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit clicked. Data:", formData);
        if (!formData.description.trim()) {
            setError("Description cannot be empty");
            return;
        }
        setIsDrafting(true);
        setError('');
        try {
            // The backend will generate Subject, Department, and Formal Body
            const res = await api.post('/rti', { description: formData.description });
            navigate(`/rti/${res.data.rti._id}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Failed to generate RTI. Check console for details.');
            setIsDrafting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">New RTI Application</h1>
            <p className="text-slate-400 mb-8">Speak or type your issue naturally. Our AI will draft the legal application for you.</p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="relative">
                        <label className="block text-slate-300 mb-2 flex justify-between">
                            <span>Your Grievance / Issue (Voice Input)</span>
                            <span>Your Grievance / Issue (Voice Input)</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className={`text-xs px-2 py-1 rounded flex items-center transition-colors ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}
                                >
                                    {isListening ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                                    {isListening ? 'Listening...' : 'Record Voice'}
                                </button>
                                <span className="text-xs text-purple-400 flex items-center">
                                    <Sparkles size={14} className="mr-1" /> AI Powered
                                </span>
                            </div>
                        </label>
                        <textarea
                            rows="6"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 font-sans text-lg"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g. 'I noticed a road construction project in Sector 4 is stopped for 6 months. I want to know the budget and timeline.'"
                            required
                        ></textarea>

                        {isDrafting && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-4 text-center">
                                <Sparkles size={32} className="text-purple-400 animate-spin mb-4" />
                                <p className="text-white font-semibold text-lg">AI is analyzing your issue...</p>
                                <p className="text-slate-400 text-sm mt-2">Classifying Intent • Extracting Entities • Drafting Legal Letter</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isDrafting} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 text-white px-8 py-3 rounded-lg font-semibold flex items-center transition-all shadow-lg shadow-purple-900/20">
                            <Send size={18} className="mr-2" />
                            {isDrafting ? 'Processing...' : 'Generate & File RTI'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRTI;
