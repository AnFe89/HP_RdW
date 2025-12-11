import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { InvitationService } from '../../lib/invitationService';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export const InviteConfirmation = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'unauthorized'>('loading');
    const [message, setMessage] = useState('Verifiziere Einladung...');
    const processedRef = useRef(false);

    const validateAndAccept = async () => {
        if (processedRef.current) return;
        processedRef.current = true;

        if (!token) {
            setStatus('error');
            setMessage('Ungültiger Link.');
            return;
        }

        // 1. Check Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            // Store token for post-login redirect? 
            // For now simple message
            setStatus('unauthorized');
            setMessage('Bitte melde dich an, um die Einladung anzunehmen.');
            return;
        }

        // 2. Fetch Invitation
        const { data: invitation, error } = await InvitationService.getInvitationByToken(token);

        if (error || !invitation) {
            setStatus('error');
            setMessage('Einladung nicht gefunden oder abgelaufen.');
            return;
        }

        // Check 24h Expiration
        const now = new Date();
        const created = new Date(invitation.created_at);
        const expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000); // +24 hours

        if (now > expiresAt) {
             setStatus('error');
             setMessage('Diese Einladung ist abgelaufen (älter als 24 Stunden).');
             return;
        }

        // Check if Game Date is in the past
        // Allow same day until 18:00
        const gameDate = new Date(invitation.game_date);
        
        // Setup Cutoff for Game Day at 18:00
        const cutoffTime = new Date(gameDate);
        cutoffTime.setHours(18, 0, 0, 0);

        // If today is AFTER game day entirely (e.g. next day) -> Block
        // If today IS game day but AFTER 18:00 -> Block
        
        if (now > cutoffTime) {
             setStatus('error');
             setMessage('Der Termin liegt in der Vergangenheit oder die Anmeldefrist (18:00 Uhr) ist verstrichen.');
             return;
        }

        if (invitation.status !== 'pending') {
            setStatus('error');
            setMessage(`Diese Einladung ist bereits ${invitation.status === 'accepted' ? 'angenommen' : 'ungültig'}.`);
            return;
        }

        // FETCH INVITER NAME
        const { data: inviterProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', invitation.inviter_id)
            .single();

        const inviterName = inviterProfile?.username || 'einem Mitspieler';

        // 3. Check if user matches invitee
        if (invitation.invitee_id !== user.id) {
            setStatus('error');
            setMessage('Diese Einladung ist für einen anderen Benutzer bestimmt.');
            return;
        }

        // 4. Accept & Reserve
        // Fetch Inviter's reservation on that table to match Mode!
        const { data: inviterRes } = await supabase.from('reservations')
             .select('game_mode')
             .eq('table_id', invitation.table_id)
             .eq('user_id', invitation.inviter_id)
             .single();
        
        const modeToUse = inviterRes?.game_mode || '40k';

        // 4a. Check if User ALREADY has a reservation on this day (ANY table)
        // We assume start_time represents the day.
        const dayStart = new Date(invitation.game_date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(invitation.game_date);
        dayEnd.setHours(23, 59, 59, 999);

        const { data: existingReservations } = await supabase
            .from('reservations')
            .select('id')
            .eq('user_id', user.id)
            .gte('start_time', dayStart.toISOString())
            .lte('start_time', dayEnd.toISOString());

        if (existingReservations && existingReservations.length > 0) {
            setStatus('error');
            setMessage('Du hast an diesem Datum bereits eine Reservierung!');
            return;
        }

        // 4b. Check Table Capacity
        // 40k = 2 players, Kill Team = 4 players
        const maxPlayers = modeToUse === '40k' ? 2 : 4;

        const { count } = await supabase
            .from('reservations')
            .select('*', { count: 'exact', head: true })
            .eq('table_id', invitation.table_id)
            .gte('start_time', new Date(invitation.game_date).toISOString()); // Simple date match

        if (count !== null && count >= maxPlayers) {
            setStatus('error');
            setMessage('Der Tisch ist leider mittlerweile voll besetzt.');
            return;
        }

        setMessage(`Du nimmst die Einladung von ${inviterName} an...`);
        
        const { success, error: acceptError } = await InvitationService.acceptInvitation(
            invitation.id,
            user.id,
            invitation.table_id,
            invitation.game_date,
            modeToUse
        );

        if (success) {
            setStatus('success');
            setMessage(`Einladung von ${inviterName} angenommen! Dein Platz ist reserviert.`);
            // Redirect after delay
            setTimeout(() => navigate('/'), 3000);
        } else {
            console.error(acceptError);
            setStatus('error');
            setMessage('Fehler bei der Reservierung: ' + (acceptError?.message || 'Unbekannt'));
        }
    };

    useEffect(() => {
        validateAndAccept();
    }, [token]);

    return (
        <div className="min-h-screen bg-wood flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-[#1a120b] border-2 border-gold p-8 shadow-2xl text-center rounded-sm relative overflow-hidden"
             >
                {/* Decor */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gold/50" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gold/50" />

                <h1 className="text-3xl font-medieval text-gold mb-6 tracking-widest">
                    EINLADUNGSSTATUS
                </h1>

                <div className="min-h-[100px] flex flex-col items-center justify-center gap-4">
                    {status === 'loading' && (
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    )}
                    
                    {status === 'success' && (
                        <div className="text-emerald-500 text-5xl">✓</div>
                    )}

                    {status === 'error' && (
                        <div className="text-crimson text-5xl">⚠</div>
                    )}

                    <p className={`font-sans text-lg ${status === 'error' ? 'text-crimson' : 'text-parchment'}`}>
                        {message}
                    </p>

                    {status === 'unauthorized' && (
                        <button 
                            onClick={() => navigate('/')} // Ideally open login, but keeping simple
                            className="mt-4 px-6 py-2 bg-gold text-wood font-bold rounded uppercase tracking-wider"
                        >
                            Zur Startseite (Login)
                        </button>
                    )}

                    {status === 'success' && (
                        <p className="text-sm text-parchment/50 animate-pulse mt-4">
                            Weiterleitung zur Tafelrunde...
                        </p>
                    )}

                    { status === 'error' && (
                         <button 
                         onClick={() => navigate('/')} 
                         className="mt-6 px-6 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-wood font-bold rounded uppercase tracking-wider transition-colors"
                     >
                         Zurück zur Basis
                     </button>
                    )}
                </div>
             </motion.div>
        </div>
    );
};
