import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Profile {
    id: string;
    username: string;
    role: string;
}

interface PartnerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (partnerId: string | null) => void;
    currentUserId: string;
    bookedUsers: Record<string, number>; // UserID -> TableID
}

export const PartnerSelectionModal = ({ isOpen, onClose, onConfirm, currentUserId, bookedUsers }: PartnerSelectionModalProps) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchProfiles = async () => {
                setLoading(true);
                // Fetch all members. In a real large app, you'd want server-side search.
                const { data } = await supabase
                    .from('profiles')
                    .select('id, username, role')
                    .neq('id', currentUserId) // Exclude self
                    .order('username');
                
                if (data) setProfiles(data);
                setLoading(false);
            };
            fetchProfiles();
        }
    }, [isOpen, currentUserId]);

    const filteredProfiles = profiles.filter(p => 
        p.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#1a120b] border-2 border-gold p-6 max-w-lg w-full relative shadow-[0_0_50px_rgba(197,160,89,0.2)] flex flex-col max-h-[80vh]" 
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-2 right-4 text-gold hover:text-white text-2xl">×</button>
                        
                        <h2 className="text-xl font-medieval text-gold mb-2 text-center tracking-widest">
                            SPIELPARTNER AUSWÄHLEN
                        </h2>
                        <p className="text-parchment/60 text-center text-sm mb-6 font-sans">
                            Wähle einen Spielpartner oder füge einen externen Gast hinzu. Nutze die Einzelreservierung, um freigewordene Plätze (z.B. nach Absage) aufzufüllen.
                        </p>

                        <button 
                            onClick={async () => {
                                setLoading(true);
                                const { data } = await supabase
                                    .from('profiles')
                                    .select('id')
                                    .eq('username', 'Gastspieler') // Must match exact name from SQL
                                    .single();
                                
                                if (data) {
                                    onConfirm(data.id);
                                } else {
                                    alert("FEHLER: Der Benutzer 'Gastspieler' wurde in der Datenbank nicht gefunden.");
                                    setLoading(false);
                                }
                            }}
                            className="w-full py-2 mb-4 bg-wood-light border-2 border-gold/30 hover:border-gold text-gold font-bold font-medieval tracking-widest uppercase transition-all shadow-lg hover:bg-gold/10 text-sm"
                        >
                            Externen Gast hinzufügen
                        </button>

                        <button 
                            onClick={() => onConfirm(null)}
                            className="w-full py-2 mb-4 bg-wood-light border-2 border-gold/30 hover:border-gold text-gold font-bold font-medieval tracking-widest uppercase transition-all shadow-lg hover:bg-gold/10 text-sm"
                        >
                            Einzelreservierung
                        </button>

                        <div className="relative mb-4">
                            <input 
                                type="text" 
                                placeholder="Suche nach Name..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#2c1810] border border-gold/30 p-3 text-parchment placeholder-parchment/30 font-sans outline-none focus:border-gold transition-colors"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {loading ? (
                                <div className="text-center text-parchment/40 py-4">Lade Profile...</div>
                            ) : filteredProfiles.length > 0 ? (
                                filteredProfiles.map(profile => {
                                    const bookedTable = bookedUsers[profile.id];
                                    const isBooked = bookedTable !== undefined;

                                    return (
                                    <div 
                                        key={profile.id}
                                        onClick={() => !isBooked && onConfirm(profile.id)}
                                        className={`p-3 border transition-all flex justify-between items-center group
                                            ${isBooked 
                                                ? 'bg-black/40 border-gold/5 cursor-not-allowed opacity-50' 
                                                : 'border-gold/10 hover:border-gold/50 bg-[#2c1810]/50 hover:bg-[#2c1810] cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-bold font-sans transition-colors ${isBooked ? 'text-parchment/30' : 'text-gold group-hover:text-white'}`}>
                                                {profile.username}
                                            </span>
                                            <span className="text-xs text-parchment/40 uppercase">
                                                {isBooked ? `Bereits an Tisch ${bookedTable}` : profile.role}
                                            </span>
                                        </div>
                                        <div className={`text-xl font-medieval ${isBooked ? 'text-parchment/10' : 'text-gold/20 group-hover:text-gold'}`}>
                                            {isBooked ? '🔒' : '+'}
                                        </div>
                                    </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-parchment/40 py-4">Keine Gefährten gefunden.</div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
