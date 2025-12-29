import { ArrowRight, Shield, FileText, Lock, Database, Server, Cpu, Search, GitMerge, FileCheck, AlertOctagon, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all"
    >
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </motion.div>
);

const WorkflowStep = ({ number, title, desc }) => (
    <div className="relative flex flex-col items-center text-center p-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-purple-500 text-purple-400 flex items-center justify-center font-bold mb-3 z-10">
            {number}
        </div>
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-slate-400 text-sm">{desc}</p>
        
        {/* Connector Line (Desktop) */}
        {number !== 4 && (
            <div className="hidden md:block absolute top-9 left-1/2 w-full h-[2px] bg-slate-800 -z-0"></div>
        )}
    </div>
);

const TestimonialCard = ({ quote, author, role, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl relative"
    >
        <div className="absolute -top-4 -left-2 text-6xl text-purple-500/20 font-serif">"</div>
        <p className="text-slate-300 mb-4 relative z-10 italic leading-relaxed">{quote}</p>
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {author.charAt(0)}
            </div>
            <div className="ml-3">
                <h4 className="text-white font-semibold text-sm">{author}</h4>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    </motion.div>
);

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 overflow-hidden">

            {/* 1. Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl px-4"
            >
                <span className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 mb-6 inline-block">
                    AI-Powered Justice System
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-slate-400 bg-clip-text text-transparent leading-tight">
                    Transparency meets <br /> Accountability.
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                    File RTI applications, detect anomalies in government responses, and generate valid legal complaints automatically using our advanced AI engine.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/signup" className="group bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-200 transition-all flex items-center">
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="px-8 py-3 rounded-full font-medium text-white border border-white/20 hover:bg-white/10 transition-all">
                        Sign In
                    </Link>
                </div>
            </motion.div>

            {/* 2. Project Overview */}
            <div className="mt-32 max-w-5xl px-4 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Why This Exists</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Navigating government transparency is complex. We bridge the gap between citizens and data using cutting-edge automation.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={FileText}
                        title="Automated RTI Drafting"
                        description="AI helps you draft precise and formal RTI queries to get the information you need."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Fraud Detection"
                        description="Our NLP engine analyzes responses to detect inconsistencies and potential scams."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={Lock}
                        title="IPC Mapping"
                        description="Automatically map findings to relevant Indian Penal Code sections for legal action."
                        delay={0.6}
                    />
                </div>
            </div>

            {/* 3. The Core Workflow */}
            <div className="mt-32 w-full bg-slate-900/50 py-20 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-slate-400">From voice input to legal action in four steps.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <WorkflowStep 
                            number={1} 
                            title="Input & Intent" 
                            desc="User provides raw voice/text. AI classifies intent (Road, Water, etc) & extracts entities." 
                        />
                        <WorkflowStep 
                            number={2} 
                            title="Smart Data Check" 
                            desc="System checks internal Vector DB & External APIs before drafting new RTI." 
                        />
                         <WorkflowStep 
                            number={3} 
                            title="Application Filing" 
                            desc="Formal RTI is generated and sent to the correct Department automatically." 
                        />
                        <WorkflowStep 
                            number={4} 
                            title="Response Analysis" 
                            desc="AI parses the reply. If anomalies found, it drafts a legal complaint." 
                        />
                    </div>
                </div>
            </div>

            {/* 4. Data Retention & Vector Search */}
            <div className="mt-32 max-w-6xl px-4 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center space-x-2 text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        <Database size={16} />
                        <span>Data Retention & Indexing</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Semantic Vector Search</h2>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        We don't just store text; we store <strong>meaning</strong>. Every Public Work record is converted into a high-dimensional vector embedding.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <Search className="text-blue-400 mr-3 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-medium">Contextual Understanding</h4>
                                <p className="text-slate-400 text-sm">"Broken road near school" matches "Pothole repair in Education district" automatically.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <Server className="text-green-400 mr-3 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-white font-medium">Efficient Retrieval</h4>
                                <p className="text-slate-400 text-sm">Vector-based lookup ensures instant verification of existing government projects.</p>
                            </div>
                        </li>
                    </ul>
                </motion.div>
                
                {/* Visual Representation of Vector Logic */}
                <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="bg-black/40 border border-slate-700/50 rounded-xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-purple-600/20 blur-[80px]"></div>
                    <div className="relative z-10 space-y-6 font-mono text-sm max-w-sm mx-auto">
                        <div className="bg-slate-800 p-3 rounded border border-slate-700">
                             <p className="text-slate-400">// User Query</p>
                             <p className="text-white">"Highway construction in Pune"</p>
                        </div>
                        <div className="flex justify-center text-purple-400"><ArrowRight className="rotate-90" /></div>
                        <div className="bg-slate-800 p-3 rounded border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                             <p className="text-slate-400">// Vector Embedding</p>
                             <p className="text-purple-300 break-all">[0.024, -0.41, 0.88, ...]</p>
                        </div>
                        <div className="flex justify-center text-green-400"><ArrowRight className="rotate-90" /></div>
                        <div className="bg-slate-800 p-3 rounded border border-green-500/30">
                             <p className="text-slate-400">// Matched Record</p>
                             <p className="text-green-300">"Pune-Mumbai Expressway Expansion"</p>
                             <p className="text-xs text-slate-500 mt-1">Similarity Score: 0.92</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 5. API Workflow Logic */}
            <div className="mt-32 mb-20 max-w-5xl px-4 w-full">
                <div className="text-center mb-12">
                     <div className="inline-flex items-center space-x-2 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                        <Network size={16} />
                        <span>Data Sourcing Logic</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Intelligent Data Routing</h2>
                    <p className="text-slate-400">How we decide where to get the answer from (Internal vs External).</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl">
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Database size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">1. Internal Vector DB</h4>
                        <p className="text-slate-400 text-sm">First, we check our own indexed records of completed public works for immediate answers.</p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                         <div className="h-1 w-full bg-slate-700 my-4 hidden md:block"></div>
                         <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 relative -top-6 hidden md:block">IF NOT FOUND</span>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-xl">
                        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Server size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">2. External Gov APIs</h4>
                        <p className="text-slate-400 text-sm">We query live Government APIs (NHAI, Jal Jeevan, etc.) matching the intent category.</p>
                    </div>

                     <div className="md:col-span-3 flex justify-center mt-6">
                         <div className="bg-slate-800/40 border border-purple-500/30 p-6 rounded-xl max-w-md w-full relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-xs text-slate-500 font-mono">
                                FINAL FALLBACK
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileCheck size={24} />
                            </div>
                            <h4 className="text-white font-bold mb-2">3. Draft New RTI</h4>
                            <p className="text-slate-400 text-sm">If no data exists, AI drafts a formal RTI application for the user to submit.</p>
                         </div>
                    </div>
                </div>
            </div>

            {/* 6. Testimonials */}
             <div className="mt-32 max-w-6xl px-4 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Voices of Trust</h2>
                    <p className="text-slate-400">Real impact from real citizens using our platform.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <TestimonialCard 
                        quote="This tool saved me months of running around government offices. The AI drafted a perfect RTI application that got an immediate response."
                        author="Rajesh Kumar"
                        role="Civil Engineer, Pune"
                        delay={0.2}
                    />
                    <TestimonialCard 
                        quote="The fraud detection alert was a game changer. It flagged a discrepancy in the road budget that we would have completely missed."
                        author="Priya Menon"
                        role="NGO Activist, Mumbai"
                        delay={0.4}
                    />
                    <TestimonialCard 
                        quote="Finally, a system that empowers common citizens with legal knowledge. The IPC mapping feature is incredibly accurate."
                        author="Adv. Sharma"
                        role="Legal Consultant"
                        delay={0.6}
                    />
                </div>
            </div>

            {/* Call to Action Footer */}
            {/* Call to Action Footer */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-32 mb-10 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 p-12 rounded-3xl max-w-4xl mx-4"
            >
                <h2 className="text-3xl font-bold text-white mb-4">Start your First Application</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                    Experience the power of AI-driven transparency. File an RTI in seconds, not hours. Join a growing community of proactive citizens holding institutions accountable and making a real difference.
                </p>
                <Link to="/signup" className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors inline-flex items-center">
                    Get Started <ArrowRight className="ml-2" size={18} />
                </Link>
            </motion.div>
        </div>
    );
};

export default LandingPage;
