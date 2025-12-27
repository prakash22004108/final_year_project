import { ArrowRight, Shield, FileText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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

const LandingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20">

            {/* Hero Section */}
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

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl px-4">
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
    );
};

export default LandingPage;
