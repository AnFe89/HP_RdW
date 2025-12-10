import { memo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface TacticalMapProps {
    onSelectSector: (id: number) => void;
    currentMode: '40k' | 'killteam';
    selectedSector: number | null;
    occupied: Record<number, number>;
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
                     backgroundImage: 'url("/rectangular-hall.png")', 
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                 }} 
            />
            
            {/* Ambient Shadow/Lighting Overlay */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* Tables Container */}
            <div className="relative z-10 w-full h-full">
                {tables.map((table) => {
                    const count = occupied[table.id] || 0;
                    const capacity = currentMode === '40k' ? 2 : 4;
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
                                    "w-32 h-16 md:w-48 md:h-24", // Rectangular tables
                                    isSelected ? "scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" : "hover:scale-105"
                                )}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Table Surface (Wood) */}
                                <div className={clsx(
                                    "absolute inset-0 rounded-sm border-2",
                                    isSelected ? "border-gold bg-[#3d2316]" : "border-[#1a120b] bg-[#2c1810]"
                                )}>
                                    {/* Wood Grain Texture opacity */}
                                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                                </div>
                                
                                {/* Table Cloth / Runner (Color coded by status?) - Optional, keeping simple wood for now */}
                                <div className={clsx(
                                    "absolute inset-x-8 inset-y-0 opacity-80",
                                    isFull ? "bg-crimson/20" : count > 0 ? "bg-gold/10" : "bg-transparent"
                                )} />

                                {/* Chairs / Capacity Indicators */}
                                <div className={clsx(
                                    "absolute flex gap-4 w-full justify-center",
                                    "-top-4" // Chairs above
                                )}>
                                     {[...Array(Math.ceil(capacity/2))].map((_, i) => (
                                        <div key={`top-${i}`} className={clsx(
                                            "w-6 h-6 rounded-full border border-black/30 shadow-sm transition-colors",
                                            i < count ? (isFull ? "bg-crimson" : "bg-gold") : "bg-[#1a120b]"
                                        )} />
                                    ))}
                                </div>
                                <div className={clsx(
                                    "absolute flex gap-4 w-full justify-center",
                                    "-bottom-4" // Chairs below
                                )}>
                                     {[...Array(Math.floor(capacity/2))].map((_, i) => (
                                        <div key={`bot-${i}`} className={clsx(
                                            "w-6 h-6 rounded-full border border-black/30 shadow-sm transition-colors",
                                            // logic to fill bottom row after top row
                                            (i + Math.ceil(capacity/2)) < count ? (isFull ? "bg-crimson" : "bg-gold") : "bg-[#1a120b]"
                                        )} />
                                    ))}
                                </div>

                                {/* Label on Table */}
                                <span className={clsx(
                                    "relative z-10 font-medieval font-bold tracking-widest text-xs md:text-sm shadow-black drop-shadow-md",
                                    isSelected ? "text-gold" : "text-parchment/70"
                                )}>
                                    {table.label}
                                </span>
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
