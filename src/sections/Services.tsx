import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TacticalMap } from "../components/tactical/TacticalMap";
import { AuthModal } from "../components/auth/AuthModal";
import { InviteModal } from "../components/invitation/InviteModal";
import { PartnerSelectionModal } from "../components/reservations/PartnerSelectionModal";
import { supabase } from "../lib/supabase";

export const Services = () => {
  const [mode, setMode] = useState<"40k" | "killteam">("40k");
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPartnerSelectionOpen, setIsPartnerSelectionOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleUpdateUsername = async () => {
    if(!newUsername || newUsername.length < 3) {
        alert("Name muss mindestens 3 Zeichen lang sein.");
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', user.id);

        if (error) throw error;
        
        setUsername(newUsername);
        setIsEditingName(false);
        // Refresh to sync invites etc if needed
        initData();
    } catch (err: any) {
        alert("Fehler beim Aktualisieren: " + (err.message || "Unbekannter Fehler. Name evtl. schon vergeben?"));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
  const [occupiedData, setOccupiedData] = useState<
    Record<number, { count: number; mode: string; names: string[] }>
  >({});
  const [bookedUsersMap, setBookedUsersMap] = useState<Record<string, number>>(
    {}
  );
  const [userReservations, setUserReservations] = useState<number[]>([]);
  const [userRole, setUserRole] = useState<string>("guest");
  const [username, setUsername] = useState<string>("");
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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) setCurrentUserId(user.id);

    // 1. Check Role
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("id", user.id)
        .single();
      if (profile) {
        setUserRole(profile.role);
        setUsername(profile.username);
      }
      setIsLoggedIn(true);
    }

    // 2. Fetch Reservations for NEXT GAME NIGHT only
    const { data } = await supabase
      .from("reservations")
      .select("table_id, user_id, game_mode, profiles(username)")
      // Widen the search window to the whole evening (e.g. +/- 6 hours around 18:00)
      // This prevents issues with slight timezone offsets or precision differences
      .gte(
        "start_time",
        new Date(gameDate.getTime() - 12 * 60 * 60 * 1000).toISOString()
      )
      .lte(
        "start_time",
        new Date(gameDate.getTime() + 12 * 60 * 60 * 1000).toISOString()
      );

    if (data) {
      const tableData: Record<
        number,
        { count: number; mode: string; names: string[] }
      > = {};
      data.forEach((r) => {
        if (!tableData[r.table_id]) {
          tableData[r.table_id] = {
            count: 0,
            mode: r.game_mode || "40k",
            names: [],
          };
        }
        tableData[r.table_id].count += 1;

        const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
        if (profile?.username)
          tableData[r.table_id].names.push(profile.username);
      });
      setOccupiedData(tableData);

      // Create map of UserID -> TableID
      const userMap: Record<string, number> = {};
      data.forEach((r) => {
        if (r.user_id) userMap[r.user_id] = r.table_id;
      });
      setBookedUsersMap(userMap);

      if (user) {
        const myRes = data
          .filter((r) => r.user_id === user.id)
          .map((r) => r.table_id);
        setUserReservations(myRes);
      }
    }
  }, [gameDate]);

  useEffect(() => {
    initData();

    // Realtime Subscription
    const channel = supabase
      .channel("public:reservations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => {
          initData();
        }
      )
      .subscribe();

    // Refetch on window focus (tab switch)
    const handleFocus = () => {
      initData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", handleFocus);
    };
  }, [initData, isLoggedIn]);

  const handleReservation = async () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    if (userRole !== "member" && userRole !== "admin") {
      alert("NUR FÜR MITGLIEDER.");
      return;
    }

    if (!isBookingWindowOpen()) {
      alert("BUCHUNG ERST AB FREITAG MÖGLICH.");
      return;
    }

    if (!selectedSector) return;

    const tableInfo = occupiedData[selectedSector] || {
      count: 0,
      mode: mode,
      names: [],
    };
    const currentCount = tableInfo.count;

    if (currentCount > 0 && tableInfo.mode !== mode) {
      alert(
        `INKOMPATIBLER MODUS. TISCH IST FÜR ${tableInfo.mode.toUpperCase()} KONFIGURIERT.`
      );
      return;
    }

    const capacity = mode === "40k" ? 2 : 4;

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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Open Partner Selection instead of booking directly
    setIsPartnerSelectionOpen(true);
  };

  const finalizeReservation = async (partnerId: string | null) => {
    setIsPartnerSelectionOpen(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !selectedSector) return;

    const gameNight = getNextGameNight();
    const endTime = new Date(gameNight);
    endTime.setHours(23, 59, 0, 0);

    // Capacity Check
    const tableInfo = occupiedData[selectedSector] || { count: 0, mode: mode };
    // Use existing mode if table has players, otherwise use selected mode
    const effectiveMode = tableInfo.count > 0 ? tableInfo.mode : mode;
    const capacity = effectiveMode === "40k" ? 2 : 4;
    const slotsNeeded = partnerId ? 2 : 1;

    if (tableInfo.count + slotsNeeded > capacity) {
      alert(
        slotsNeeded === 2
          ? "NICHT GENUG PLATZ: Der Tisch hat nicht genügend freie Plätze für euch beide."
          : "DER TISCH IST LEIDER SCHON VOLL."
      );
      return;
    }

    // Book for Self
    const { error } = await supabase.from("reservations").insert({
      table_id: selectedSector,
      user_id: user.id,
      start_time: gameNight.toISOString(),
      end_time: endTime.toISOString(),
      game_mode: mode,
    });

    if (error) {
      alert("FEHLER BEI DER RESERVIERUNG: " + error.message);
      return;
    }

    // Book for Partner (if selected)
    if (partnerId) {
      const { error: partnerError } = await supabase
        .from("reservations")
        .insert({
          table_id: selectedSector,
          user_id: partnerId,
          start_time: gameNight.toISOString(),
          end_time: endTime.toISOString(),
          game_mode: mode,
        });

      if (partnerError) {
        alert(
          "WARNUNG: DU WURDEST GEBUCHT, ABER DEIN PARTNER KONNTE NICHT GEBUCHT WERDEN (Evtl. schon belegt?): " +
            partnerError.message
        );
      }
    }

    alert(
      `PLATZ GESICHERT FÜR ${gameNight.toLocaleDateString()}. VIEL ERFOLG!`
    );

    // Optimistic Update (Full Refresh better to see partner)
    initData();
  };

  const handleCancel = async () => {
    if (!selectedSector || !userReservations.includes(selectedSector)) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("table_id", selectedSector)
      .eq("user_id", user.id);

    if (error) {
      alert("FEHLER: " + error.message);
    } else {
      alert("RESERVIERUNG AUFGEHOBEN.");
      setUserReservations(
        userReservations.filter((id) => id !== selectedSector)
      );

      setOccupiedData((prev) => {
        const current = prev[selectedSector];
        if (!current) return prev;
        const newCount = current.count - 1;
        return {
          ...prev,
          [selectedSector]: {
            count: newCount,
            mode: newCount === 0 ? "40k" : current.mode,
            names:
              current.names?.filter((n) => n !== "Du (wird geladen...)") || [],
          },
        };
      });
      initData();
    }
  };

  return (
    <section className="relative w-full min-h-screen py-10 md:py-20 px-4 md:px-10 flex flex-col gap-6 md:gap-10 bg-wood border-y-4 border-wood-light shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Profile / Reservations Modal */}
      {/* Simple inline modal for now or extract to component */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          >
            <div
              className="bg-[#1a120b] border-2 border-gold p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(197,160,89,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-2 right-4 text-gold hover:text-white text-2xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-medieval text-gold mb-6 text-center tracking-widest">
                DEINE GEFÄHRTEN
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col border-b border-gold/20 pb-2 gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-parchment/60 font-sans">Name:</span>
                    {!isEditingName ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gold font-bold font-sans">
                          {username}
                        </span>
                        <button
                          onClick={() => {
                            setNewUsername(username);
                            setIsEditingName(true);
                          }}
                          className="text-xs text-parchment/40 hover:text-gold underline"
                        >
                          Bearbeiten
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="bg-[#2c1810] border border-gold/40 text-gold px-2 py-1 text-sm rounded w-32 focus:outline-none focus:border-gold"
                        />
                        <button
                          onClick={handleUpdateUsername}
                          className="text-emerald-500 hover:text-emerald-400 font-bold"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="text-crimson hover:text-crimson/80 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditingName && (
                    <p className="text-[10px] text-parchment/40 italic">
                      Hinweis: Dein neuer Name wird sofort auf Reservationen
                      übertragen.
                    </p>
                  )}
                </div>
                <div className="flex justify-between border-b border-gold/20 pb-2">
                  <span className="text-parchment/60 font-sans">Rang:</span>
                  <span className="text-gold font-bold font-sans uppercase">
                    {userRole}
                  </span>
                </div>
                <div className="pt-4">
                  <h3 className="text-gold font-medieval mb-3 uppercase tracking-wide text-sm">
                    Deine Reservierungen für {gameDate.toLocaleDateString()}:
                  </h3>

                  {userReservations.length > 0 ? (
                    <div className="space-y-3">
                      {userReservations.map((tableId) => (
                        <div
                          key={tableId}
                          className="bg-[#2c1810] p-4 border border-gold/30 rounded flex justify-between items-center"
                        >
                          <div>
                            <div className="text-gold font-bold font-medieval tracking-widest">
                              TISCH {tableId}
                            </div>
                            <div className="text-xs text-parchment/50 font-sans mt-1">
                              Modus:{" "}
                              {occupiedData[tableId]?.mode === "40k"
                                ? "WARHAMMER 40K"
                                : "KILL TEAM"}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-500 font-bold text-sm">
                              BESTÄTIGT
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-parchment/40 italic text-center py-4">
                      Keine aktiven Reservierungen für diesen Termin.
                    </p>
                  )}
                </div>
              </div>

              {userRole === "admin" && (
                <button
                  onClick={() => (window.location.href = "/admin")}
                  className="w-full mt-8 mb-4 py-3 bg-wood-light border border-gold/50 text-gold hover:bg-gold hover:text-wood transition-colors uppercase tracking-widest text-sm font-bold font-medieval"
                >
                  Admin-Dashboard
                </button>
              )}

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.reload();
                }}
                className="w-full py-2 border border-crimson/50 text-crimson hover:bg-crimson hover:text-white transition-colors uppercase tracking-widest text-xs font-bold font-sans"
              >
                ABMELDEN
              </button>

              <div className="pt-4 border-t border-gold/10 mt-4 flex justify-center">
                <button
                  onClick={async () => {
                    if (
                      !confirm(
                        "ACHTUNG: Möchtest du dein Konto wirklich unwiderruflich löschen? Alle deine Daten gehen verloren."
                      )
                    )
                      return;

                    const { error } = await supabase.rpc("delete_own_account");
                    if (error) {
                      alert("FEHLER BEI LÖSCHUNG: " + error.message);
                    } else {
                      await supabase.auth.signOut();
                      window.location.reload();
                    }
                  }}
                  className="text-[10px] py-1 px-3 text-crimson/60 hover:text-crimson font-bold font-sans transition-colors uppercase tracking-widest hover:bg-crimson/5 rounded-sm flex items-center gap-1"
                >
                  <span>🗑️</span> Account endgültig löschen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        tableId={selectedSector || 0}
        gameDate={gameDate}
      />

      <PartnerSelectionModal
        isOpen={isPartnerSelectionOpen}
        onClose={() => setIsPartnerSelectionOpen(false)}
        onConfirm={finalizeReservation}
        currentUserId={currentUserId || ""}
        bookedUsers={bookedUsersMap}
      />

      {/* Header */}
      <h2 className="text-3xl md:text-6xl font-medieval text-parchment text-center tracking-widest drop-shadow-md border-b-2 border-gold/30 pb-6 w-full max-w-4xl mx-auto">
        TISCHRESERVIERUNG
      </h2>

      {/* ACCESS CONTROL */}
      {isLoggedIn &&
      (userRole === "member" ||
        userRole === "admin" ||
        userRole === "guest") ? (
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-7xl mx-auto">
          {/* Map Container */}
          <div className="w-full md:w-2/3 h-[500px] md:h-[600px] relative">
            {userRole === "member" || userRole === "admin" ? (
              <TacticalMap
                onSelectSector={setSelectedSector}
                selectedSector={selectedSector}
                currentMode={mode}
                occupied={occupiedData}
              />
            ) : (
              <div className="w-full h-full border-4 border-[#2c1810] bg-[#1a120b] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Restricted Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635321593217-40050ad13c74?q=80&w=1920')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

                <div className="z-10 text-center border-2 border-crimson/50 p-8 bg-black/80 backdrop-blur-sm max-w-sm mx-auto shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                  <div className="text-crimson text-6xl mb-4 opacity-80">
                    🛡️
                  </div>
                  <h3 className="text-2xl font-medieval text-crimson tracking-widest mb-4 border-b border-crimson/30 pb-2">
                    EINBLICK VERWEHRT
                  </h3>
                  <p className="text-parchment/80 font-medieval text-lg mb-6 leading-relaxed">
                    "Halt, Wanderer! Die strategischen Karten sind nur den
                    Rittern der Tafelrunde vorbehalten."
                  </p>
                  <div className="text-gold/60 text-xs font-sans uppercase tracking-widest border-t border-gold/10 pt-4">
                    STATUS: GAST
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Panel (Scroll) */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            {/* Status Card (User) */}
            <div
              onClick={() => {
                if (isLoggedIn) setIsProfileOpen(true);
                else setIsAuthOpen(true);
              }}
              className={`border-2 p-6 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 shadow-lg rounded-sm bg-[#f5e6d3] text-[#2c1810]
                    ${
                      isLoggedIn
                        ? "border-gold/50 hover:border-gold hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                        : "border-crimson/50"
                    }`}
            >
              <span className="flex items-center gap-3 font-bold tracking-wider font-medieval">
                <span
                  className={`w-3 h-3 rotate-45 border border-black/20 ${
                    isLoggedIn ? "bg-gold" : "bg-crimson"
                  }`}
                />
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
                  onClick={() => setMode("40k")}
                  className={`flex-1 py-3 border-2 transition-all duration-300 font-bold tracking-widest relative font-sans text-xs md:text-sm
                            ${
                              mode === "40k"
                                ? "bg-gold text-wood border-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                                : "border-[#2c1810] bg-[#2c1810] text-parchment/60 hover:text-gold hover:border-gold/50"
                            }`}
                >
                  WARHAMMER 40K
                </button>
                <button
                  onClick={() => setMode("killteam")}
                  className={`flex-1 py-3 border-2 transition-all duration-300 font-bold tracking-widest relative font-sans text-xs md:text-sm
                            ${
                              mode === "killteam"
                                ? "bg-gold text-wood border-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                                : "border-[#2c1810] bg-[#2c1810] text-parchment/60 hover:text-gold hover:border-gold/50"
                            }`}
                >
                  KILL TEAM
                </button>
              </div>

              {/* Sector Info */}
              <div className="space-y-4 min-h-[150px]">
                <div className="text-sm font-bold text-parchment/60 border-b border-gold/10 pb-3 mb-4 tracking-wide flex justify-between font-sans">
                  <div>
                    TERMIN:{" "}
                    <span className="text-gold">
                      {gameDate?.toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    RANG:{" "}
                    <span
                      className={
                        isLoggedIn &&
                        (userRole === "member" || userRole === "admin")
                          ? "text-gold"
                          : "text-crimson"
                      }
                    >
                      {isLoggedIn
                        ? userRole === "member"
                          ? "MITGLIED"
                          : userRole === "admin"
                          ? "ADMIN"
                          : "GAST"
                        : "UNBEKANNT"}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {selectedSector ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={selectedSector}
                    >
                      <div className="text-xl text-gold mb-2 font-medieval">
                        TISCH {selectedSector} AUSGEWÄHLT
                      </div>
                      <div className="text-sm text-parchment/70 font-sans">
                        STATUS:{" "}
                        <span
                          className={
                            (occupiedData[selectedSector]?.count || 0) >=
                            ((occupiedData[selectedSector]?.mode || mode) ===
                            "40k"
                              ? 2
                              : 4)
                              ? "text-crimson font-bold"
                              : "text-emerald-500 font-bold"
                          }
                        >
                          {(occupiedData[selectedSector]?.count || 0) >=
                          ((occupiedData[selectedSector]?.mode || mode) ===
                          "40k"
                            ? 2
                            : 4)
                            ? "VOLL BESETZT"
                            : "VERFÜGBAR"}
                        </span>
                      </div>
                      <div className="text-sm text-parchment/50 mt-2 font-sans italic">
                        {occupiedData[selectedSector]?.count || 0} /{" "}
                        {(occupiedData[selectedSector]?.mode || mode) === "40k"
                          ? "2"
                          : "4"}{" "}
                        SPIELER
                      </div>
                      {occupiedData[selectedSector]?.count > 0 && (
                        <div className="text-xs text-gold mt-1 border-t border-gold/20 pt-1 font-sans">
                          AKTIVES SZENARIO:{" "}
                          {occupiedData[selectedSector]?.mode.toUpperCase()}
                        </div>
                      )}

                      {/* Roster */}
                      {occupiedData[selectedSector]?.names &&
                        occupiedData[selectedSector]?.names.length > 0 && (
                          <div className="mt-3 bg-[#2c1810]/50 p-3 border border-gold/20 rounded">
                            <div className="text-[10px] text-parchment/60 mb-1 uppercase tracking-wider">
                              Angemeldete Spieler:
                            </div>
                            <div className="space-y-1">
                              {occupiedData[selectedSector]?.names.map(
                                (name, i) => (
                                  <div
                                    key={i}
                                    className="text-xs text-gold font-sans tracking-wide"
                                  >
                                    ⚔ {name}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {userReservations.includes(selectedSector) ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="mt-6 w-full py-3 bg-crimson/20 hover:bg-crimson text-white/70 hover:text-white border border-crimson/50 transition-all uppercase tracking-widest text-xs md:text-sm font-bold shadow-lg rounded font-medieval"
                          >
                            RESERVIERUNG STORNIEREN
                          </button>
                          {/* Invitation Button - DISABLED per user request
                          <button
                            onClick={() => {
                              setIsInviteOpen(true);
                            }}
                            className="mt-4 w-full py-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-400 rounded uppercase tracking-wider text-sm font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                          >
                            <span>⚔</span> Einladungslink generieren{" "}
                            <span>⚔</span>
                          </button>
                          */}
                        </>
                      ) : occupiedData[selectedSector]?.count > 0 &&
                        occupiedData[selectedSector]?.mode !== mode ? (
                        <button
                          disabled
                          className="mt-6 w-full py-3 bg-black/20 text-crimson border border-crimson/30 uppercase tracking-widest text-sm font-bold opacity-60 cursor-not-allowed rounded font-medieval"
                        >
                          FALSCHER MODUS
                        </button>
                      ) : (occupiedData[selectedSector]?.count || 0) >=
                        ((occupiedData[selectedSector]?.mode || mode) === "40k"
                          ? 2
                          : 4) ? (
                        <button
                          disabled
                          className="mt-6 w-full py-3 bg-black/20 text-parchment/30 border border-wood-light uppercase tracking-widest text-sm font-bold cursor-not-allowed rounded font-medieval"
                        >
                          VOLL BESETZT
                        </button>
                      ) : (
                        <button
                          onClick={handleReservation}
                          className={`mt-6 w-full py-3 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 border shadow-lg rounded font-medieval
                                            ${
                                              !isLoggedIn ||
                                              (userRole !== "member" &&
                                                userRole !== "admin")
                                                ? "bg-wood-light text-parchment/40 border-wood-light cursor-not-allowed"
                                                : "bg-gold/10 border-gold/60 text-gold hover:bg-gold hover:text-wood hover:shadow-[0_0_20px_rgba(197,160,89,0.4)]"
                                            }
                                        `}
                        >
                          {!isLoggedIn
                            ? "BITTE ANMELDEN"
                            : userRole !== "member" && userRole !== "admin"
                            ? "NUR FÜR MITGLIEDER"
                            : "RESERVIEREN"}
                        </button>
                      )}

                      {/* Invitation Button - Only if user has reservation here */}
                    </motion.div>
                  ) : (
                    <div className="text-gold/50 flex items-center justify-center h-full flex-col text-center min-h-[200px]">
                      <div className="font-medieval tracking-widest text-lg opacity-60">
                        WÄHLT EINEN TISCH
                      </div>
                      <div className="text-xs mt-2 text-parchment/40 font-sans">
                        KLICKT AUF DIE KARTE
                      </div>
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
