import Navbar from './Navbar';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                
                <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-auto">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div className="col-span-1 md:col-span-2">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">RTI & IPC AI</span>
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                                    Empowering citizens with AI-driven transparency. We automate the fight for accountability, making the Right to Information accessible to everyone.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github size={20} /></a>
                                    <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                                </div>
                            </div>

                            {/* Links */}
                            <div>
                                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><a href="/" className="hover:text-purple-400 transition-colors">Home</a></li>
                                    <li><a href="/login" className="hover:text-purple-400 transition-colors">Login</a></li>
                                    <li><a href="/signup" className="hover:text-purple-400 transition-colors">Sign Up</a></li>
                                    <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                                </ul>
                            </div>

                            {/* Contact/Legal */}
                            <div>
                                <h4 className="text-white font-semibold mb-4">Contact & Legal</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-center"><Mail size={14} className="mr-2"/> support@rtiai.gov.in</li>
                                    <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-white/5 mt-12 pt-8 text-center text-slate-500 text-sm">
                            <p>&copy; {new Date().getFullYear()} AI RTI Automation System. Built for the Public Interest.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
