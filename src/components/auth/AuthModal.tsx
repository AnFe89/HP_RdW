import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

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
                if (!userEmail) throw new Error("IDENTITÄT UNBEKANNT.");
                
                loginEmail = userEmail;
            }

            const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
            if (error) throw error;
            onClose();
        } catch (error: any) {
            setMessage("FEHLER: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            // 1. Sign up user with metadata
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

            if (data.session) {
                alert("ZUTRITT GEWÄHRT. SEID GEGRÜSST.");
                onClose();
            } else {
                setMessage("REGISTRIERUNG ERFOLGREICH. PRÜFT EURE POST (EMAIL) FÜR DIE BESTÄTIGUNG.");
            }
        } catch (error: any) {
            setMessage("FEHLER: " + error.message);
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
            setMessage("BOTE WURDE ENTSANDT (LINK GESENDET).");
        } catch (error: any) {
            setMessage("FEHLER: " + error.message);
        } finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!confirm("WARNUNG: DIESE HANDLUNG KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN. WOLLT IHR EUREN SCHWUR WIRKLICH BRECHEN?")) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.rpc('delete_own_account');
            if (error) throw error;
            await supabase.auth.signOut();
            alert("EURE TATEN WURDEN AUS DEN ANNALEN GETILGT.");
            onClose();
        } catch (error: any) {
            setMessage("LÖSCHUNG FEHLGESCHLAGEN: " + error.message);
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
                            className="w-full max-w-md bg-[#f5e6d3] border-4 border-[#2c1810] p-8 shadow-2xl relative rounded-sm"
                        >
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />

                            <h2 className="text-2xl md:text-3xl font-medieval text-[#2c1810] mb-6 text-center border-b-2 border-[#2c1810]/20 pb-4 relative z-10">
                                {view === 'login' ? "WER KLOPFT AN?" : 
                                 view === 'register' ? "NEUEN SCHWUR LEISTEN" : 
                                 view === 'forgot' ? "SIEBART WIEDERHERSTELLEN" : 
                                 "RITTERLICHES PROFIL"}
                            </h2>

                            {message && (
                                <div className="bg-[#2c1810] text-parchment p-3 mb-4 text-xs font-sans text-center border border-gold relative z-10">
                                    {message}
                                </div>
                            )}

                            <div className="relative z-10">
                                {view === 'profile' ? (
                                    <div className="space-y-4">
                                         <button onClick={handleLogout} className="w-full border-2 border-[#2c1810] text-[#2c1810] font-bold font-medieval py-3 hover:bg-[#2c1810] hover:text-parchment transition-colors uppercase tracking-widest">
                                            ABREISEN (LOGOUT)
                                         </button>
                                         <button onClick={handleDelete} className="w-full border-2 border-crimson text-crimson font-bold font-medieval py-3 hover:bg-crimson hover:text-white transition-colors uppercase tracking-widest">
                                            ENDEHREN (LÖSCHEN)
                                         </button>
                                    </div>
                                ) : (
                                    <form onSubmit={view === 'login' ? handleLogin : view === 'register' ? handleRegister : handleReset} className="space-y-6">
                                        {view === 'register' && (
                                            <div>
                                                <label className="block text-xs font-bold text-[#2c1810]/70 mb-2 font-sans uppercase">EUER NAME</label>
                                                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                                                    className="w-full bg-[#faebd7] border-2 border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] p-3 outline-none transition-colors font-sans placeholder-[#2c1810]/30"
                                                    placeholder="Sir Galahad" minLength={3} />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-bold text-[#2c1810]/70 mb-2 font-sans uppercase">
                                                {view === 'login' ? "EMAIL ODER NAME" : "EMAIL ADRESSE"}
                                            </label>
                                            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-[#faebd7] border-2 border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] p-3 outline-none transition-colors font-sans placeholder-[#2c1810]/30"
                                                placeholder={view === 'login' ? "ritter@tafelrunde.com" : "ritter@tafelrunde.com"} />
                                        </div>

                                        {view !== 'forgot' && (
                                            <div>
                                                <label className="block text-xs font-bold text-[#2c1810]/70 mb-2 font-sans uppercase">LOSUNGSWORT</label>
                                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-[#faebd7] border-2 border-[#8b4513]/30 focus:border-[#8b4513] text-[#2c1810] p-3 outline-none transition-colors font-sans placeholder-[#2c1810]/30"
                                                    placeholder="••••••••" minLength={6} />
                                            </div>
                                        )}
                                        
                                        <button type="submit" disabled={isLoading}
                                            className="w-full bg-[#2c1810] text-gold border-2 border-gold font-bold font-medieval py-3 hover:bg-gold hover:text-[#2c1810] transition-colors disabled:opacity-50 shadow-lg tracking-widest mt-4"
                                        >
                                            {isLoading ? "VERARBEITE..." : view === 'login' ? "EINLASS BEGEHREN" : view === 'register' ? "SCHWUR LEISTEN" : "NEUES SIEGEL ANFORDERN"}
                                        </button>
                                    </form>
                                )}

                                {/* Footer Links */}
                                <div className="mt-6 text-center space-y-2">
                                    {view === 'login' && (
                                        <>
                                            <button onClick={() => setView('forgot')} className="block w-full text-xs text-[#2c1810]/60 hover:text-[#8b4513] font-sans underline italic">Losungswort vergessen?</button>
                                            <button onClick={() => setView('register')} className="block w-full text-xs text-[#2c1810]/60 hover:text-[#8b4513] font-sans underline italic">Noch kein Ritter? Hier entlang.</button>
                                        </>
                                    )}
                                    {view === 'register' && (
                                        <button onClick={() => setView('login')} className="block w-full text-xs text-[#2c1810]/60 hover:text-[#8b4513] font-sans underline italic">Bereits geschworen? Zum Tor.</button>
                                    )}
                                    {view === 'forgot' && (
                                         <button onClick={() => setView('login')} className="block w-full text-xs text-[#2c1810]/60 hover:text-[#8b4513] font-sans underline italic">Zurück zum Tor</button>
                                    )}
                                </div>
                            </div>

                             <button onClick={onClose} className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 text-[#2c1810]/50 hover:text-crimson font-medieval text-xl z-20">✕</button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
