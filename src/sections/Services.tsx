import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TacticalMap } from '../components/tactical/TacticalMap';
import { AuthModal } from '../components/auth/AuthModal';
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
    const daysUntil = (4 - day + 7) % 7;
    
    // Standard Reset: 23:59 Thursday.
    const nextThursday = new Date(d);
    nextThursday.setDate(d.getDate() + daysUntil);
    nextThursday.setHours(18, 0, 0, 0);
    return nextThursday;
  };

  // Map of table_id -> { count, mode, names: string[] }
  const [occupiedData, setOccupiedData] = useState<Record<number, { count: number, mode: string, names: string[] }>>({});
  const [userReservations, setUserReservations] = useState<number[]>([]); 
  const [userRole, setUserRole] = useState<string>('guest');
  const [username, setUsername] = useState<string>('');
  const [gameDate] = useState<Date>(getNextGameNight());

  const isBookingWindowOpen = () => {
      const now = new Date();
      // Window opens: Friday of PREVIOUS week.
      const windowOpen = new Date(gameDate);
      windowOpen.setDate(gameDate.getDate() - 6); 
      windowOpen.setHours(0, 0, 0, 0);

      return now >= windowOpen && now < gameDate;
  };

  const initData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Check Role
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, username').eq('id', user.id).single();
        if (profile) {
            setUserRole(profile.role);
            setUsername(profile.username);
        }
        setIsLoggedIn(true);
    }

    // 2. Fetch Reservations for NEXT GAME NIGHT only
    const { data } = await supabase.from('reservations')
        .select('table_id, user_id, game_mode, profiles(username)')
        .gte('start_time', new Date(gameDate.getTime() - 1000).toISOString())
        .lte('start_time', new Date(gameDate.getTime() + 1000).toISOString());
    
    if (data) {
        const tableData: Record<number, { count: number, mode: string, names: string[] }> = {};
        data.forEach(r => {
            if (!tableData[r.table_id]) {
                tableData[r.table_id] = { count: 0, mode: r.game_mode || '40k', names: [] };
            }
            tableData[r.table_id].count += 1;
            // @ts-expect-error - Supabase types join handling
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

    // Realtime Subscription
    const channel = supabase.channel('public:reservations')
        .on(
            'postgres_changes', 
            { event: '*', schema: 'public', table: 'reservations' }, 
            () => {
                initData();
            }
        )
        .subscribe();

    // Refetch on window focus (tab switch)
    const handleFocus = () => {
        initData();
    };

    window.addEventListener('focus', handleFocus);

    return () => { 
        supabase.removeChannel(channel);
        window.removeEventListener('focus', handleFocus);
    };
  }, [initData, isLoggedIn]);

  const handleReservation = async () => {
      if (!isLoggedIn) {
          setIsAuthOpen(true);
          return;
      }

      if (userRole !== 'member' && userRole !== 'admin') {
          alert("NUR FÜR MITGLIEDER.");
          return;
      }

      if (!isBookingWindowOpen()) {
          alert("BUCHUNG ERST AB FREITAG MÖGLICH.");
          return;
      }
      
      if (!selectedSector) return;

      const tableInfo = occupiedData[selectedSector] || { count: 0, mode: mode, names: [] };
      const currentCount = tableInfo.count;
      
      if (currentCount > 0 && tableInfo.mode !== mode) {
          alert(`INKOMPATIBLER MODUS. TISCH IST FÜR ${tableInfo.mode.toUpperCase()} KONFIGURIERT.`);
          return;
      }

      const capacity = mode === '40k' ? 2 : 4; 

      if (userReservations.length > 0) {
          alert("DU HAST BEREITS EINEN TISCH RESERVIERT.");
          return;
      }

      if (currentCount >= capacity) {
          alert("DIESER TISCH IST BEREITS VOLL BESETZT.");
          return;
      }

      if (userReservations.includes(selectedSector)) {
          alert("IHR HABT DIESEN PLATZ BEREITS RESERVIERT.");
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
          alert("FEHLER BEI DER RESERVIERUNG: " + error.message);
      } else {
          alert(`PLATZ GESICHERT FÜR ${gameNight.toLocaleDateString()}. VIEL ERFOLG!`);
          setUserReservations([...userReservations, selectedSector]);
          
          setOccupiedData(prev => ({
              ...prev,
              [selectedSector]: {
                  count: (prev[selectedSector]?.count || 0) + 1,
                  mode: mode,
                  names: [...(prev[selectedSector]?.names || []), "Du (wird geladen...)"] 
              }
          }));
          initData(); 
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
          alert("FEHLER: " + error.message);
      } else {
          alert("RESERVIERUNG AUFGEHOBEN.");
          setUserReservations(userReservations.filter(id => id !== selectedSector));
          
          setOccupiedData(prev => {
              const current = prev[selectedSector];
              if (!current) return prev;
              const newCount = current.count - 1;
              return {
                  ...prev,
                  [selectedSector]: {
                      count: newCount,
                      mode: newCount === 0 ? '40k' : current.mode, 
                      names: current.names?.filter(n => n !== 'Du (wird geladen...)') || []
                  }
              };
          });
          initData(); 
      }
  };

  return (
    <section className="relative w-full min-h-screen py-10 md:py-20 px-4 md:px-10 flex flex-col gap-6 md:gap-10 bg-wood border-y-4 border-wood-light shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Header */}
      <h2 className="text-3xl md:text-6xl font-medieval text-parchment text-center tracking-widest drop-shadow-md border-b-2 border-gold/30 pb-6 w-full max-w-4xl mx-auto">
        TISCHRESERVIERUNG
      </h2>

      {/* ACCESS CONTROL */}
      {isLoggedIn && (userRole === 'member' || userRole === 'admin') ? (
          <div className="flex flex-col md:flex-row gap-10 w-full max-w-7xl mx-auto">
            
            {/* Map Container */}
            <div className="w-full md:w-2/3 h-[500px] md:h-[600px] relative">
                 <TacticalMap 
                    onSelectSector={setSelectedSector} 
                    selectedSector={selectedSector}
                    currentMode={mode}
                    occupied={occupiedData}
                 />
            </div>

          {/* Control Panel (Scroll) */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            
            {/* Status Card (User) */}
            <div 
              onClick={() => setIsAuthOpen(true)}
              className={`border-2 p-6 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 shadow-lg rounded-sm bg-[#f5e6d3] text-[#2c1810]
                    ${isLoggedIn 
                    ? "border-gold/50" 
                    : "border-crimson/50"
                }`}
            >
                 <span className="flex items-center gap-3 font-bold tracking-wider font-medieval">
                    <span className={`w-3 h-3 rotate-45 border border-black/20 ${isLoggedIn ? 'bg-gold' : 'bg-crimson'}`} />
                    {isLoggedIn ? `WILLKOMMEN, ${username.toUpperCase()}` : "GAST"}
                 </span>
                 <span className="text-xs font-bold font-sans opacity-80 underline">
                    {isLoggedIn ? "PROFIL ANSEHEN" : "ANMELDEN"}
                 </span>
            </div>

            {/* Panel Content */}
            <div className="border-4 border-[#2c1810] p-8 bg-[#1a120b] relative flex-1 shadow-2xl rounded-sm">
                
                {/* Decorative Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gold" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gold" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-gold" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-gold" />

                <h3 className="font-medieval text-xl text-gold mb-6 border-b border-gold/20 pb-2 text-center">
                    DETAILS
                </h3>

                {/* Mode Toggle */}
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setMode('40k')}
                        className={`flex-1 py-3 border-2 transition-all duration-300 font-bold tracking-widest relative font-sans text-xs md:text-sm
                            ${mode === '40k' 
                                ? 'bg-gold text-wood border-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' 
                                : 'border-[#2c1810] bg-[#2c1810] text-parchment/60 hover:text-gold hover:border-gold/50'
                            }`}
                    >
                        WARHAMMER 40K
                    </button>
                    <button 
                        onClick={() => setMode('killteam')}
                        className={`flex-1 py-3 border-2 transition-all duration-300 font-bold tracking-widest relative font-sans text-xs md:text-sm
                            ${mode === 'killteam' 
                                ? 'bg-gold text-wood border-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' 
                                : 'border-[#2c1810] bg-[#2c1810] text-parchment/60 hover:text-gold hover:border-gold/50'
                            }`}
                    >
                        KILL TEAM
                    </button>
                </div>

                {/* Sector Info */}
                <div className="space-y-4 min-h-[150px]">
                    <div className="text-sm font-bold text-parchment/60 border-b border-gold/10 pb-3 mb-4 tracking-wide flex justify-between font-sans">
                        <div>TERMIN: <span className="text-gold">{gameDate?.toLocaleDateString()}</span></div>
                        <div>RANG: <span className={isLoggedIn && (userRole === 'member' || userRole === 'admin') ? "text-gold" : "text-crimson"}>{isLoggedIn ? (userRole === 'member' ? 'MITGLIED' : userRole === 'admin' ? 'ADMIN' : 'GAST') : "UNBEKANNT"}</span></div>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedSector ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key={selectedSector}
                            >
                                <div className="text-xl text-gold mb-2 font-medieval">TISCH {selectedSector} AUSGEWÄHLT</div>
                                <div className="text-sm text-parchment/70 font-sans">
                                    STATUS: <span className={
                                        (occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4)
                                            ? 'text-crimson font-bold' 
                                            : 'text-emerald-500 font-bold'
                                    }>
                                        {(occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4) ? 'VOLL BESETZT' : 'VERFÜGBAR'}
                                    </span>
                                </div>
                                <div className="text-sm text-parchment/50 mt-2 font-sans italic">
                                    {occupiedData[selectedSector]?.count || 0} / {(occupiedData[selectedSector]?.mode || mode) === '40k' ? '2' : '4'} SPIELER
                                </div>
                                {occupiedData[selectedSector]?.count > 0 && (
                                    <div className="text-xs text-gold mt-1 border-t border-gold/20 pt-1 font-sans">
                                        AKTIVES SZENARIO: {occupiedData[selectedSector]?.mode.toUpperCase()}
                                    </div>
                                )}
                                
                                {/* Roster */}
                                {occupiedData[selectedSector]?.names && occupiedData[selectedSector]?.names.length > 0 && (
                                    <div className="mt-3 bg-[#2c1810]/50 p-3 border border-gold/20 rounded">
                                        <div className="text-[10px] text-parchment/60 mb-1 uppercase tracking-wider">Angemeldete Spieler:</div>
                                        <div className="space-y-1">
                                            {occupiedData[selectedSector]?.names.map((name, i) => (
                                                <div key={i} className="text-xs text-gold font-sans tracking-wide">
                                                    ⚔ {name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {userReservations.includes(selectedSector) ? (
                                    <button 
                                        onClick={handleCancel}
                                        className="mt-6 w-full py-3 bg-crimson/20 hover:bg-crimson text-white/70 hover:text-white border border-crimson/50 transition-all uppercase tracking-widest text-xs md:text-sm font-bold shadow-lg rounded font-medieval"
                                    >
                                        RESERVIERUNG STORNIEREN
                                    </button>
                                ) : (occupiedData[selectedSector]?.count > 0 && occupiedData[selectedSector]?.mode !== mode) ? (
                                    <button disabled className="mt-6 w-full py-3 bg-black/20 text-crimson border border-crimson/30 uppercase tracking-widest text-sm font-bold opacity-60 cursor-not-allowed rounded font-medieval">
                                        FALSCHER MODUS
                                    </button>
                                ) : (occupiedData[selectedSector]?.count || 0) >= ((occupiedData[selectedSector]?.mode || mode) === '40k' ? 2 : 4) ? (
                                    <button disabled className="mt-6 w-full py-3 bg-black/20 text-parchment/30 border border-wood-light uppercase tracking-widest text-sm font-bold cursor-not-allowed rounded font-medieval">
                                        VOLL BESETZT
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleReservation}
                                        className={`mt-6 w-full py-3 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 border shadow-lg rounded font-medieval
                                            ${(!isLoggedIn || (userRole !== 'member' && userRole !== 'admin')) 
                                                ? 'bg-wood-light text-parchment/40 border-wood-light cursor-not-allowed' 
                                                : 'bg-gold/10 border-gold/60 text-gold hover:bg-gold hover:text-wood hover:shadow-[0_0_20px_rgba(197,160,89,0.4)]'}
                                        `}
                                    >
                                        {!isLoggedIn ? "BITTE ANMELDEN" : (userRole !== 'member' && userRole !== 'admin') ? "NUR FÜR MITGLIEDER" : "RESERVIEREN"}
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <div className="text-gold/50 flex items-center justify-center h-full flex-col text-center min-h-[200px]">
                                <div className="font-medieval tracking-widest text-lg opacity-60">WÄHLT EINEN TISCH</div>
                                <div className="text-xs mt-2 text-parchment/40 font-sans">KLICKT AUF DIE KARTE</div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
          </div>
          </div>
      ) : (
          /* RESTRICTED ACCESS VIEW */
          <div className="relative w-full max-w-4xl mx-auto min-h-[300px] border-4 border-[#2c1810] bg-[#1a120b] rounded-lg flex flex-col items-center justify-center text-center p-8 shadow-2xl">
              
              <div className="z-10 flex flex-col items-center gap-6">
                  <div className="space-y-2">
                    <p className="font-sans text-parchment/60 tracking-wider text-sm md:text-base uppercase">
                        MITGLIEDERBEREICH
                    </p>
                  </div>

                  <p className="max-w-md text-parchment/50 text-sm font-sans italic">
                      Bitte melde dich an, um einen Platz zu reservieren.
                  </p>

                  <button 
                      onClick={() => setIsAuthOpen(true)}
                      className="mt-2 px-10 py-3 bg-[#2c1810] border-2 border-gold text-gold hover:bg-gold hover:text-[#2c1810] font-medieval font-bold tracking-widest transition-all shadow-lg rounded"
                  >
                      ANMELDEN / REGISTRIEREN
                  </button>
              </div>
          </div>
      )}
    </section>
  );
};

