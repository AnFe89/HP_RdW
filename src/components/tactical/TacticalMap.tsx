import { memo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface TacticalMapProps {
    onSelectSector: (id: number) => void;
    currentMode: '40k' | 'killteam' | 'aos_spearhead';
    selectedSector: number | null;
    occupied: Record<number, { count: number, mode: string, modes?: string[] }>;
}



export const TacticalMap = memo(({ onSelectSector, currentMode, selectedSector, occupied }: TacticalMapProps) => {
    
    // Circular Layout for "Round Table" Theme
    // Grid Layout: 2 Rows of 3 Tables
    const tables = [
        // Row 1
        { id: 1, label: "Tisch 1", x: "20%", y: "30%", rotation: 0 },
        { id: 2, label: "Tisch 2", x: "50%", y: "30%", rotation: 0 },
        { id: 3, label: "Tisch 3", x: "80%", y: "30%", rotation: 0 },
        
        // Row 2
        { id: 4, label: "Tisch 4", x: "20%", y: "70%", rotation: 0 },
        { id: 5, label: "Tisch 5", x: "50%", y: "70%", rotation: 0 },
        { id: 6, label: "Tisch 6", x: "80%", y: "70%", rotation: 0 },
    ];

    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[600px] bg-parchment-dark relative overflow-hidden border-8 border-wood rounded-sm shadow-2xl">
            {/* Floor Plan Background */}
            <div className="absolute inset-0 z-0 opacity-90" 
                 style={{ 
                     backgroundImage: 'url("/realistic-hall.png")', 
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                 }} 
            />
            
            {/* Ambient Shadow/Lighting Overlay */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Tables Container */}
            <div className="relative z-10 w-full h-full">
                {tables.map((table) => {
                    const data = occupied[table.id] || { count: 0, mode: '40k', modes: [] };
                    const count = data.count;
                    const mode = data.mode || '40k';
                    const modes = data.modes || [];
                    
                    // Logic: If table is occupied, show ITS capacity. If empty, show selected mode's capacity (preview).
                    const isSkirmish = (m: string) => m === 'killteam' || m === 'aos_spearhead';
                    const effectiveMode = count > 0 ? mode : currentMode;
                    const isEffectiveSkirmish = isSkirmish(effectiveMode);
                    
                    const capacity = !isEffectiveSkirmish ? 2 : 4;
                    
                    const isFull = count >= capacity;
                    const isSelected = selectedSector === table.id;
                    
                    return (
                        <div
                            key={table.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ left: table.x, top: table.y }}
                            onClick={() => onSelectSector(table.id)}
                        >
                                {/* Table Visual */}
                            <motion.div
                                className={clsx(
                                    "relative flex items-center justify-center transition-all duration-300 shadow-2xl skew-x-1",
                                    "w-24 h-12 sm:w-32 sm:h-16 md:w-48 md:h-24", // Responsive sizing
                                    // Glow Logic: Selected -> Gold, Full -> Green, Default -> None/Hover
                                    isSelected 
                                        ? "scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" 
                                        : isFull 
                                            ? "drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]" // Green glow if full
                                            : "hover:scale-105"
                                )}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Table Surface (Wood) */}
                                <div className={clsx(
                                    "absolute inset-0 rounded-sm border-2 overflow-hidden",
                                    // Border Color: Selected -> Gold, Full -> Dark Green/Wood, Default -> Dark Wood
                                    isSelected 
                                        ? "border-gold bg-[#3d2316]" 
                                        : isFull
                                            ? "border-[#1a120b] bg-[#2c1810]" 
                                            : "border-[#1a120b] bg-[#2c1810]"
                                )}>
                                    {/* Wood Grain Texture opacity */}
                                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                                     
                                     {/* DECORATION: Table Map / Game Mat */}
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-parchment/10 rounded-sm border border-white/5 rotate-1">
                                          {/* Simulate grid lines */}
                                          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                                     </div>

                                     {/* GAME MODE ICON (If Occupied) */}
                                     {/* Handled in shared container below */}

                                     {/* DECORATION: Clutter only if NOT occupied by icon to avoid noise */}
                                     {count === 0 && ( 
                                        <>
                                            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8b4513] shadow-sm border border-black/20" /> 
                                            <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-white shadow-sm rotate-12 opacity-80" /> 
                                            <div className="absolute top-3 right-3 w-4 h-5 bg-parchment/60 shadow-sm -rotate-6 rounded-[1px]" />
                                        </>
                                     )}

                                </div>
                                
                                {/* Table Cloth / Runner - REMOVED per user request */}
                                {/* <div className={clsx(
                                    "absolute inset-x-8 inset-y-0 opacity-80",
                                    isFull ? "bg-crimson/20" : count > 0 ? "bg-gold/10" : "bg-transparent"
                                )} /> */}

                                {/* Chairs */}
                                <div className={clsx(
                                    "absolute flex w-full",
                                    isEffectiveSkirmish ? "justify-between px-4 md:px-8" : "justify-center gap-4",
                                    "-top-4" // Chairs above
                                )}>
                                     {[...Array(Math.ceil(capacity/2))].map((_, i) => {
                                         // Logic: 
                                         // i=0 -> Pair 1 (Left). Occupied if count >= 1. Green if Pair Full (count >= 2).
                                         // i=1 -> Pair 2 (Right). Occupied if count >= 3. Green if Pair Full (count >= 4).
                                         const pairIndex = i;
                                         // For 40k: Simple count check (no pairs concept visualized)
                                         // For KT: Pair logic
                                         
                                         // Unified logic works for both if we treat 40k as 1 pair per row effectively?
                                         // Actually 40k is 1vs1, so 2 players total.
                                         // If 40k: capacity=2. i goes 0..0 (ceil(1)). pairIndex=0.
                                         // isPairFull = count >= 2. isOccupied = count >= 1.
                                         // This logic is compatible with 40k (Green if full, Gold if 1).
                                         
                                         const isPairFull = count >= (pairIndex + 1) * 2;
                                         const isOccupied = count >= (pairIndex * 2) + 1;

                                         return (
                                            <div key={`top-${i}`} className={clsx(
                                                "w-6 h-6 rounded-full border border-black/30 shadow-sm transition-colors",
                                                isOccupied 
                                                    ? (isPairFull 
                                                        ? "bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.8)] border-green-400" // Green if pair/table is ready
                                                        : "bg-gold shadow-[0_0_5px_rgba(255,215,0,0.4)]") // Gold if waiting for partner
                                                    : "bg-[#1a120b]" // Empty
                                            )} />
                                         );
                                     })}
                                </div>
                                <div className={clsx(
                                    "absolute flex w-full",
                                    isEffectiveSkirmish ? "justify-between px-4 md:px-8" : "justify-center gap-4",
                                    "-bottom-4" // Chairs below
                                )}>
                                     {[...Array(Math.floor(capacity/2))].map((_, i) => {
                                         const pairIndex = i;
                                         const isPairFull = count >= (pairIndex + 1) * 2;
                                         const isOccupied = count >= (pairIndex * 2) + 2;

                                         return (
                                            <div key={`bot-${i}`} className={clsx(
                                                "w-6 h-6 rounded-full border border-black/30 shadow-sm transition-colors",
                                                isOccupied 
                                                    ? (isPairFull 
                                                        ? "bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.8)] border-green-400" 
                                                        : "bg-gold shadow-[0_0_5px_rgba(255,215,0,0.4)]") 
                                                    : "bg-[#1a120b]"
                                            )} />
                                         );
                                     })}
                                </div>

                                {/* CONTENT CONTAINER: Label + Icon */}
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-0.5">
                                    {/* Label */}
                                    <span className={clsx(
                                        "font-medieval font-bold tracking-widest text-[10px] md:text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] leading-none mb-0.5 md:mb-1",
                                        isSelected ? "text-gold" : "text-parchment"
                                    )}>
                                        {table.label}
                                    </span>

                                    {/* Icon */}
                                    {count > 0 && (
                                        <div className="flex gap-1 justify-center mt-0.5 md:mt-1">
                                            {(modes.includes('killteam') || (modes.length === 0 && mode === 'killteam')) && (
                                                <img 
                                                    src="/marker-kt-new.jpg"
                                                    alt="Kill Team"
                                                    className="w-4 h-4 md:w-8 md:h-8 object-contain opacity-80 drop-shadow-md mix-blend-overlay rounded-full"
                                                />
                                            )}
                                            {(modes.includes('aos_spearhead') || (modes.length === 0 && mode === 'aos_spearhead')) && (
                                                <img 
                                                    src="/marker-aos.png"
                                                    alt="AoS"
                                                    className="w-4 h-4 md:w-8 md:h-8 object-contain opacity-80 drop-shadow-md mix-blend-overlay rounded-full"
                                                />
                                            )}
                                            {/* Fallback/Legacy logic if modes array is empty but mode is set */}
                                            {/* Note: In regular use modes array should be populated. Only purely legacy cases might miss it. */}
                                            
                                            {(modes.length === 0 && mode === '40k') && (
                                                  <img 
                                                    src="/marker-40k.png"
                                                    alt="40k"
                                                    className="w-4 h-4 md:w-10 md:h-10 object-contain opacity-80 drop-shadow-md mix-blend-overlay rounded-full"
                                                />
                                            )}
                                             {/* If modes includes 40k explicitly */}
                                             {modes.includes('40k') && (
                                                  <img 
                                                    src="/marker-40k.png"
                                                    alt="40k"
                                                    className="w-4 h-4 md:w-10 md:h-10 object-contain opacity-80 drop-shadow-md mix-blend-overlay rounded-full"
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-[#1a120b]/90 p-3 rounded-sm border border-gold/20 backdrop-blur-sm z-20">
                <div className="flex flex-col gap-2 text-[10px] font-medieval text-parchment/80">
                   <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#1a120b] border border-white/20" />
                        <span>FREIER PLATZ</span>
                   </div>
                   <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gold" />
                        <span>BELEGT</span>
                   </div>
                </div>
            </div>
        </div>
    );
});
