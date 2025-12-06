import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TacticalMap } from '../components/tactical/TacticalMap';
import { AuthModal } from '../components/auth/AuthModal';
import { GlitchText } from '../components/ui/GlitchText';
import { supabase } from '../lib/supabase';

export const Services = () => {
  const [mode, setMode] = useState<'40k' | 'killteam'>('40k');
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);


  // Helper: Find next Thursday 18:00
  const getNextGameNight = () => {
    const d = new Date();
    const day = d.getDay();
    let daysUntil = (4 - day + 7) % 7;
    
    // If today is Thursday and after 23:59, move to next.
    if (daysUntil === 0 && d.getHours() >= 23) {
        daysUntil = 7;
    }
    
    const nextThursday = new Date(d);
    nextThursday.setDate(d.getDate() + daysUntil);
    nextThursday.setHours(18, 0, 0, 0);
    return nextThursday;
  };

  // Map of table_id -> { count, mode, names: string[] }
  const [occupiedData, setOccupiedData] = useState<Record<number, { count: number, mode: string, names: string[] }>>({});
  const [userReservations, setUserReservations] = useState<number[]>([]); // Track ALL user's tables, though limited to 1 per table logic
  const [userRole, setUserRole] = useState<string>('guest');
  const [gameDate] = useState<Date>(getNextGameNight()); // Initialize directly

  const isBookingWindowOpen = () => {
      const now = new Date();
      // Window opens: Friday of PREVIOUS week.
      const windowOpen = new Date(gameDate);
      windowOpen.setDate(gameDate.getDate() - 6); // Friday before Thursday
      windowOpen.setHours(0, 0, 0, 0);

      return now >= windowOpen && now < gameDate;
  };

  // Fetch status & profile on load
  // Wrapped in useCallback to satisfy linter and ensure stability
  const initData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Check Role
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) setUserRole(profile.role);
        setIsLoggedIn(true);
    }

    // 2. Fetch Reservations for NEXT GAME NIGHT only
    // Join with profiles to get usernames
    const { data } = await supabase.from('reservations')
        .select('table_id, user_id, game_mode, profiles(username)')
        .gte('start_time', new Date(gameDate.getTime() - 1000).toISOString())
        .lte('start_time', new Date(gameDate.getTime() + 1000).toISOString());
    
    if (data) {
        // Count reservations per table and track mode
        const tableData: Record<number, { count: number, mode: string, names: string[] }> = {};
        data.forEach(r => {
            if (!tableData[r.table_id]) {
                tableData[r.table_id] = { count: 0, mode: r.game_mode || '40k', names: [] };
            }
            tableData[r.table_id].count += 1;
            // @ts-ignore - Supabase types join handling
            if (r.profiles?.username) tableData[r.table_id].names.push(r.profiles.username);
        });
        setOccupiedData(tableData);

        if (user) {
            const myRes = data.filter(r => r.user_id === user.id).map(r => r.table_id);
            setUserReservations(myRes);
        }
    }
  }, [gameDate]);

  useEffect(() => {
    initData();

    // Realtime currently just refreshes simplistic view
    const subscription = supabase.channel('reservations')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
            initData();
        })
        .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [initData]);

  const handleReservation = async () => {
      if (!isLoggedIn) {
          setIsAuthOpen(true);
          return;
      }

      if (userRole !== 'member') {
          alert("ACCESS DENIED. MEMBERSHIP REQUIRED.");
          return;
      }

      if (!isBookingWindowOpen()) {
          alert("TACTICAL WINDOW CLOSED. BOOKING OPENS FRIDAY 00:00.");
          return;
      }
      
      if (!selectedSector) return;

      // Rule: Max 2 Players per table (40k) or 4 (KillTeam)
      const tableInfo = occupiedData[selectedSector] || { count: 0, mode: mode, names: [] }; // Default to current mode if empty
      const currentCount = tableInfo.count;
      
      // Rule: Mixed Modes NOT allowed
      if (currentCount > 0 && tableInfo.mode !== mode) {
          alert(`INCOMPATIBLE COMBAT SYSTEM. SECTOR CONFIGURED FOR ${tableInfo.mode.toUpperCase()}.`);
          return;
      }

      const capacity = mode === '40k' ? 2 : 4; 

      if (currentCount >= capacity) {
          alert("SECTOR FULL. CAPACITY REACHED.");
          return;
      }

      // Rule: User can only book 1 slot per table
      if (userReservations.includes(selectedSector)) {
          alert("YOU ARE ALREADY DEPLOYED IN THIS SECTOR.");
          return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const gameNight = getNextGameNight();
      const endTime = new Date(gameNight);
      endTime.setHours(23, 59, 0, 0);

      const { error } = await supabase.from('reservations').insert({
          table_id: selectedSector,
          user_id: user.id,
          start_time: gameNight.toISOString(),
          end_time: endTime.toISOString(),
          game_mode: mode
      });

      if (error) {
          alert("ERROR: " + error.message);
      } else {
          alert(`SECTOR SECURED FOR ${gameNight.toLocaleDateString()}. GLORY TO THE EMPIRE.`);
          // Optimistic update
          setUserReservations([...userReservations, selectedSector]);
          
          setOccupiedData(prev => ({
              ...prev,
              [selectedSector]: {
                  count: (prev[selectedSector]?.count || 0) + 1,
                  mode: mode,
                  names: prev[selectedSector]?.names || [] // Ideally we'd add "YOU" or handle it, but initData syncs fast
              }
          }));

          initData(); // Sync with server
      }
  };

  const handleCancel = async () => {
      if (!selectedSector || !userReservations.includes(selectedSector)) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('reservations')
        .delete()
        .eq('table_id', selectedSector)
        .eq('user_id', user.id); 

      if (error) {
          alert("ERROR CANCELLING: " + error.message);
      } else {
          alert("SECTOR RELEASED.");
          setUserReservations(userReservations.filter(id => id !== selectedSector));
          
          // Optimistic Update for count
          setOccupiedData(prev => {
              const current = prev[selectedSector];
              if (!current) return prev;
              const newCount = current.count - 1;
              return {
                  ...prev,
                  [selectedSector]: {
                      count: newCount,
                      mode: newCount === 0 ? '40k' : current.mode, // Reset mode if empty (default to 40k or keep current)
                      names: current.names // We don't filter hypothetically here easily, we rely on initData
                  }
              };
          });
          
          initData(); // Sync with server
      }
  };

  const occupiedCounts = useMemo(() => 
    Object.fromEntries(Object.entries(occupiedData).map(([k, v]) => [k, v.count])), 
    [occupiedData]
  );

  return (
    <section className="relative w-full min-h-screen py-10 md:py-20 px-4 md:px-10 flex flex-col gap-6 md:gap-10 bg-[#0b0c10] z-20 border-y border-[#c5c6c7]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm">
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Header */}
      <h2 className="text-3xl md:text-6xl font-military text-white text-center tracking-widest drop-shadow-[0_0_15px_rgba(102,252,241,0.3)]">
        TISCHRESERVIERUNGEN
      </h2>

      <div className="flex flex-col md:flex-row gap-10 w-full">
        {/* 2D Tactical Viewport */}
        <div className="w-full md:w-2/3 h-[400px] md:h-[600px] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
        <div className="absolute top-4 left-4 z-10 font-tactical text-xs text-[#66fcf1] flex gap-4">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#66fcf1] rounded-full animate-pulse"/> 
                LIVE FEED
             </div>
             <div>
                SECTOR STATUS: <span className="text-[#c5c6c7]">ACTIVE</span>
             </div>
        </div>
        
        <TacticalMap 
            onSelectSector={setSelectedSector} 
            selectedSector={selectedSector}
            currentMode={mode}
            occupied={occupiedCounts}
        />
        
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] opacity-20" />
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 font-tactical">
        {/* Member Area Link */}
        <div 
          onClick={() => setIsAuthOpen(true)}
          className={`border p-6 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl backdrop-blur-md
            ${isLoggedIn 
                ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400 hover:bg-emerald-900/20" 
                : "border-white/10 bg-white/5 text-silver hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            }`}
        >
             <span className="flex items-center gap-3 font-bold tracking-wider">
                <span className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${isLoggedIn ? 'bg-[#66fcf1]' : 'bg-red-500'}`} />
                {isLoggedIn ? "ACCESS GRANTED: COMMANDER" : "RESTRICTED AREA: IDENTIFY"}
             </span>
             <span className={`text-sm font-bold transition-colors ${isLoggedIn ? "text-[#66fcf1]" : "group-hover:text-red-500"}`}>
                {isLoggedIn ? "ENTER DASHBOARD »" : "LOGIN SYSTEM »"}
             </span>
        </div>

        <div className="border border-white/10 p-8 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md relative group flex-1 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-l-2 border-t-2 border-[#66fcf1]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r-2 border-b-2 border-[#66fcf1]" />

            <h3 className="font-military text-2xl text-[#c5c6c7] mb-6">
                <GlitchText text="OPERATION: RESERVATION" />
            </h3>

            {/* Mode Toggle */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => setMode('40k')}
                    className={`flex-1 py-3 border transition-all duration-300 font-bold tracking-wider relative overflow-hidden group rounded-xl
                        ${mode === '40k' 
                            ? 'bg-white/10 text-[#66fcf1] border-white/20 shadow-[0_4px_16px_0_rgba(102,252,241,0.1)]' 
                            : 'border-white/5 text-silver/40 hover:border-white/20 hover:text-[#66fcf1]'
                        }`}
                >
                    <div className={`absolute inset-0 bg-[#66fcf1]/10 transform -translate-x-full transition-transform duration-300 ${mode !== '40k' && 'group-hover:translate-x-0'}`} />
                    WARHAMMER 40K
                </button>
                <button 
                    onClick={() => setMode('killteam')}
                    className={`flex-1 py-3 border transition-all duration-300 font-bold tracking-wider relative overflow-hidden group rounded-xl
                        ${mode === 'killteam' 
                            ? 'bg-white/10 text-[#66fcf1] border-white/20 shadow-[0_4px_16px_0_rgba(102,252,241,0.1)]' 
                            : 'border-white/5 text-silver/40 hover:border-white/20 hover:text-[#66fcf1]'
                        }`}
                >
                     <div className={`absolute inset-0 bg-[#66fcf1]/10 transform -translate-x-full transition-transform duration-300 ${mode !== 'killteam' && 'group-hover:translate-x-0'}`} />
                    KILL TEAM
                </button>
            </div>

            {/* Sector Info */}
            <div className="space-y-4 min-h-[150px]">
                {/* Global Status Info */}
                <div className="text-xs font-bold text-[#c5c6c7] border-b border-[#c5c6c7]/30 pb-3 mb-4 tracking-wide flex justify-between">
                    <div>NEXT DEP: <span className="text-[#66fcf1]">{gameDate?.toLocaleDateString()} @ 18:00</span></div>
                    <div>ID: <span className={isLoggedIn && userRole === 'member' ? "text-[#66fcf1]" : "text-red-500"}>{isLoggedIn ? (userRole === 'member' ? 'MEMBER' : 'GUEST') : "UNKNOWN"}</span></div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedSector ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key={selectedSector}
                        >
                            <div className="text-xl text-[#66fcf1] mb-2">SECTOR {selectedSector} SELECTED</div>
                            <div className="text-sm text-[#c5c6c7]/60">
                                STATUS: <span className={
                                    (occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4)
                                        ? 'text-red-500' 
                                        : 'text-green-500'
                                }>
                                    {(occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4) ? 'MAX CAPACITY' : 'AVAILABLE'}
                                </span>
                            </div>
                            <div className="text-sm text-[#c5c6c7]/60 mt-2">
                                DEPLOYMENT: {occupiedData[selectedSector]?.count || 0} / {(occupiedData[selectedSector]?.mode || mode) === '40k' ? '2' : '4'} COMMANDERS
                            </div>
                            {occupiedData[selectedSector]?.count > 0 && (
                                <div className="text-xs text-[#66fcf1] mt-1 border-t border-[#66fcf1]/20 pt-1">
                                    ACTIVE SYSTEM: {occupiedData[selectedSector]?.mode.toUpperCase()}
                                </div>
                            )}
                            
                            {/* Command Roster */}
                            {occupiedData[selectedSector]?.names && occupiedData[selectedSector]?.names.length > 0 && (
                                <div className="mt-2 bg-[#66fcf1]/5 p-2 border border-[#66fcf1]/10 rounded-lg">
                                    <div className="text-[10px] text-[#c5c6c7] mb-1">DEPLOYED COMMANDERS:</div>
                                    <div className="space-y-1">
                                        {occupiedData[selectedSector]?.names.map((name, i) => (
                                            <div key={i} className="text-xs text-[#66fcf1] font-mono tracking-wider">
                                                » {name.toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Logic Stack: 
                                1. Is it MY reservation? -> CANCEL (Even if not full, I can cancel my part)
                                2. Incompatible Mode? -> ERROR
                                3. Is it FULL? -> LOCKED
                                4. Am I a member? -> RESERVE
                                5. Not member? -> ACCESS DENIED
                            */}
                            {userReservations.includes(selectedSector) ? (
                                <button 
                                    onClick={handleCancel}
                                    className="mt-6 w-full py-4 bg-red-900/40 hover:bg-red-600/80 hover:text-white border border-red-500/50 transition-all uppercase tracking-widest text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded-xl backdrop-blur-sm"
                                >
                                    ABORT MISSION (CANCEL)
                                </button>
                            ) : (occupiedData[selectedSector]?.count > 0 && occupiedData[selectedSector]?.mode !== mode) ? (
                                <button disabled className="mt-6 w-full py-4 bg-black/20 text-red-500 border border-red-900/30 uppercase tracking-widest text-sm font-bold opacity-60 cursor-not-allowed rounded-xl">
                                    SYSTEM MISMATCH ({occupiedData[selectedSector]?.mode.toUpperCase()})
                                </button>
                            ) : (occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4) ? (
                                <button disabled className="mt-6 w-full py-4 bg-black/20 text-[#c5c6c7]/30 border border-[#1f2833] uppercase tracking-widest text-sm font-bold cursor-not-allowed rounded-xl">
                                    SECTOR FULL
                                </button>
                            ) : (
                                <button 
                                    onClick={handleReservation}
                                    className={`mt-6 w-full py-4 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 group/btn transition-all duration-300 border shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-xl backdrop-blur-sm
                                        ${(!isLoggedIn || userRole !== 'member') 
                                            ? 'bg-white/5 text-[#c5c6c7] border-[#c5c6c7]/20 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-500' 
                                            : 'bg-[#66fcf1]/10 border-[#66fcf1]/50 text-[#66fcf1] hover:bg-[#66fcf1]/20 hover:text-white hover:shadow-[0_0_25px_rgba(102,252,241,0.5)]'}
                                    `}
                                >
                                    {!isLoggedIn && <span className="w-2 h-2 bg-red-500 rounded-full group-hover/btn:bg-red-500 group-hover/btn:shadow-[0_0_10px_red]" />}
                                    {!isLoggedIn ? "LOGIN TO RESERVE" : userRole !== 'member' ? "MEMBERSHIP REQUIRED" : "INITIATE DEPLOYMENT SEQUENCE"}
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <div className="text-[#66fcf1] flex items-center justify-center h-full animate-pulse flex-col text-center drop-shadow-[0_0_5px_rgba(102,252,241,0.5)]">
                            <div className="font-military tracking-widest text-lg">&lt; SELECT SECTOR &gt;</div>
                            <div className="text-xs mt-2 text-[#c5c6c7]">CLICK MAP TO TARGET</div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      </div>{/* End Flex Wrapper */}
    </section>
  );
};

