import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GlitchText } from '../ui/GlitchText';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [view, setView] = useState<'login' | 'register' | 'forgot' | 'profile'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setMessage(null);
            supabase.auth.getSession().then(({ data }) => {
                if (data.session) {
                    setView('profile');
                } else {
                    setView('login');
                }
            });
        }
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            let loginEmail = email;

            // Check if input is NOT an email (simple check)
            if (!email.includes('@')) {
                const { data: userEmail, error: rpcError } = await supabase.rpc('get_email_by_username', { username_input: email });
                
                if (rpcError) throw rpcError;
                if (!userEmail) throw new Error("OPERATIVE IDENTITY NOT FOUND.");
                
                loginEmail = userEmail;
            }

            const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
            if (error) throw error;
            onClose();
        } catch (error: any) {
            setMessage("ERROR: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            // 1. Sign up user with metadata (Trigger handles profile creation)
            const { error: authError, data } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        username: username
                    }
                }
            });
            if (authError) throw authError;

            // Profile is created automatically by DB Trigger now.
            
            if (data.session) {
                alert("ACCESS GRANTED. WELCOME, COMMANDER.");
                onClose();
            } else {
                setMessage("REGISTRATION SUCCESSFUL. CHECK EMAIL (OR SPAM) FOR VERIFICATION LINK.");
            }
        } catch (error: any) {
            setMessage("ERROR: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
            setMessage("RESET LINK SENT TO COMMS FREQUENCY.");
        } catch (error: any) {
            setMessage("ERROR: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!confirm("WARNING: THIS ACTION IS PERMANENT. CONFIRM DELETION?")) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.rpc('delete_own_account');
            if (error) throw error;
            await supabase.auth.signOut();
            alert("IDENTITY PURGED.");
            onClose();
        } catch (error: any) {
            setMessage("PURGE FAILED: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0b0c10] border border-[#66fcf1]/30 p-8 shadow-[0_0_50px_rgba(102,252,241,0.1)] relative"
                        >
                            <h2 className="text-xl md:text-2xl font-military text-[#c5c6c7] mb-6 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                                <GlitchText text={
                                    view === 'login' ? "IDENTIFICATION REQUIRED" : 
                                    view === 'register' ? "NEW OPERATIVE REGISTRATION" : 
                                    view === 'forgot' ? "RESET CREDENTIALS" : 
                                    "OPERATIVE PROFILE"
                                } />
                            </h2>

                            {message && (
                                <div className="bg-[#1f2833] text-[#66fcf1] p-3 mb-4 text-xs font-mono text-center border border-[#66fcf1]/30">
                                    {message}
                                </div>
                            )}

                            {view === 'profile' ? (
                                <div className="space-y-4">
                                     <button onClick={handleLogout} className="w-full border-2 border-[#66fcf1] text-[#66fcf1] font-bold font-military py-3 hover:bg-[#66fcf1] hover:text-[#0b0c10] transition-colors">
                                        LOGOUT (TERMINATE SESSION)
                                     </button>
                                     <button onClick={handleDelete} className="w-full border-2 border-red-900/50 text-red-500 font-bold font-military py-3 hover:bg-red-900/20 hover:border-red-500 transition-colors">
                                        DELETE IDENTITY (PURGE)
                                     </button>
                                </div>
                            ) : (
                                <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleReset} className="space-y-6">
                                    {view === 'register' && (
                                        <div>
                                            <label className="block text-xs font-mono text-[#66fcf1] mb-2">OPERATOR NAME (CODENAME)</label>
                                            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                                                className="w-full bg-[#1f2833]/50 border border-[#1f2833] focus:border-[#66fcf1] text-[#c5c6c7] p-3 outline-none transition-colors font-mono"
                                                placeholder="COMMANDER X" minLength={3} />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-mono text-[#66fcf1] mb-2">
                                            {view === 'login' ? "OPERATOR EMAIL OR USERNAME" : "OPERATOR EMAIL"}
                                        </label>
                                        <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#1f2833]/50 border border-[#1f2833] focus:border-[#66fcf1] text-[#c5c6c7] p-3 outline-none transition-colors font-mono"
                                            placeholder={view === 'login' ? "name@chapter.com OR COMMANDER X" : "name@chapter.com"} />
                                    </div>

                                    {view !== 'forgot' && (
                                        <div>
                                            <label className="block text-xs font-mono text-[#66fcf1] mb-2">PASSCODE</label>
                                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-[#1f2833]/50 border border-[#1f2833] focus:border-[#66fcf1] text-[#c5c6c7] p-3 outline-none transition-colors font-mono"
                                                placeholder="••••••••" minLength={6} />
                                        </div>
                                    )}
                                    
                                    <button type="submit" disabled={isLoading}
                                        className="w-full bg-[#66fcf1] text-[#0b0c10] font-bold font-military py-3 hover:bg-[#66fcf1]/80 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? "PROCESSING..." : view === 'login' ? "AUTHENTICATE" : view === 'register' ? "REQUEST CLEARANCE" : "TRANSMIT RESET LINK"}
                                    </button>
                                </form>
                            )}

                            {/* Footer Links */}
                            <div className="mt-6 text-center space-y-2">
                                {view === 'login' && (
                                    <>
                                        <button onClick={() => setView('forgot')} className="block w-full text-xs text-[#c5c6c7]/50 hover:text-[#66fcf1] font-mono underline">LOST CREDENTIALS?</button>
                                        <button onClick={() => setView('register')} className="block w-full text-xs text-[#c5c6c7]/50 hover:text-[#66fcf1] font-mono underline">NO CREDENTIALS? APPLY HERE</button>
                                    </>
                                )}
                                {view === 'register' && (
                                    <button onClick={() => setView('login')} className="block w-full text-xs text-[#c5c6c7]/50 hover:text-[#66fcf1] font-mono underline">ALREADY OPERATIONAL? LOGIN</button>
                                )}
                                {view === 'forgot' && (
                                     <button onClick={() => setView('login')} className="block w-full text-xs text-[#c5c6c7]/50 hover:text-[#66fcf1] font-mono underline">RETURN TO LOGIN</button>
                                )}
                            </div>

                             <button onClick={onClose} className="absolute top-4 right-4 text-[#c5c6c7] hover:text-white">[X]</button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
