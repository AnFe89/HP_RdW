import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvitationService } from '../../lib/invitationService';
import type { Profile } from '../../lib/invitationService';
import { supabase } from '../../lib/supabase';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    tableId: number;
    gameDate: Date;
    currentMode: string;
}

export const InviteModal = ({ isOpen, onClose, tableId, gameDate, currentMode }: InviteModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [linkToCopy, setLinkToCopy] = useState<string | null>(null);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setResults([]);
            setLinkToCopy(null);
        }
    }, [isOpen]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setLoading(true);
                const users = await InvitationService.searchUsers(searchTerm);
                // Filter out self
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                const filtered = users.filter(u => u.id !== currentUser?.id);
                setResults(filtered);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleInvite = async (userToInvite: Profile) => {
        setSending(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) return;

        const { data: invitation, error } = await InvitationService.createInvitation(
            currentUser.id,
            userToInvite.id,
            tableId,
            gameDate
        );

        if (error) {
            alert('Fehler beim Erstellen der Einladung: ' + error.message);
            setSending(false);
            return;
        }

        if (invitation) {
            // Generate Link
            const link = `${window.location.origin}/invite?token=${invitation.token}`;
            setLinkToCopy(link);
        }
        setSending(false);
    };

    const copyToClipboard = () => {
        if (linkToCopy) {
            navigator.clipboard.writeText(linkToCopy);
            alert("Link in Zwischenablage kopiert! Sende ihn an deinen Mitspieler.");
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#1a120b] border-2 border-gold p-6 shadow-[0_0_50px_rgba(197,160,89,0.2)] rounded-sm"
                    >
                         {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gold/50 hover:text-gold transition-colors text-xl"
                        >
                            ✕
                        </button>

                        <h3 className="font-medieval text-2xl text-gold mb-2 text-center pb-4 border-b border-gold/20">
                            {linkToCopy ? 'EINLADUNG BEREIT' : 'GEFÄHRTEN RUFEN'}
                        </h3>
                        
                        {!linkToCopy ? (
                            <>
                                <p className="text-sm text-parchment/60 font-sans text-center mb-6 italic">
                                    Suche nach einem registrierten Mitglied, um es an Tisch {tableId} (Sektor {tableId}) einzuladen.
                                </p>

                                {/* Search Input */}
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Benutzernamen eingeben..."
                                        className="w-full bg-[#0a0500] border border-gold/30 text-gold p-3 rounded focus:outline-none focus:border-gold placeholder:text-parchment/20 font-sans"
                                        autoFocus
                                    />
                                    {loading && (
                                        <div className="absolute right-3 top-3 text-gold/50 text-xs animate-pulse">
                                            SUCHE...
                                        </div>
                                    )}
                                </div>

                                {/* Results List */}
                                <div className="max-h-[200px] overflow-y-auto space-y-2 mb-4 custom-scrollbar">
                                    {results.length === 0 && searchTerm.length >= 2 && !loading && (
                                        <div className="text-center text-parchment/30 text-xs py-4">
                                            Keine Krieger gefunden.
                                        </div>
                                    )}
                                    
                                    {results.map(user => (
                                        <div 
                                            key={user.id} 
                                            className="flex justify-between items-center bg-[#2c1810] p-3 rounded border border-transparent hover:border-gold/30 transition-all group"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-gold font-bold font-sans">{user.username}</span>
                                            </div>
                                            <button
                                                onClick={() => handleInvite(user)}
                                                disabled={sending}
                                                className="px-3 py-1 bg-gold/10 hover:bg-gold hover:text-wood border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider transition-colors rounded"
                                            >
                                                {sending ? '...' : 'ERSTELLEN'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4 text-center">
                                <p className="text-parchment/80 font-sans">
                                    Einladung erstellt! Sende diesen Link an deinen Mitspieler:
                                </p>
                                <div className="p-3 bg-black/30 border border-gold/20 rounded font-mono text-xs text-gold break-all select-all">
                                    {linkToCopy}
                                </div>
                                <button 
                                    onClick={copyToClipboard}
                                    className="w-full py-3 bg-gold text-wood font-bold rounded shadow-lg hover:bg-white transition-colors uppercase tracking-widest font-medieval"
                                >
                                    LINK KOPIEREN
                                </button>
                                <p className="text-xs text-parchment/40 italic">
                                    Der Link ist 24 Stunden gültig.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
