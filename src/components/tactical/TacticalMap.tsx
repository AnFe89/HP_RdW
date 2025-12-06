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
    
    // Grid layout for 6 tables
    const tables = [
        { id: 1, label: "SECTOR A1", x: "10%", y: "10%" },
        { id: 2, label: "SECTOR A2", x: "40%", y: "10%" },
        { id: 3, label: "SECTOR A3", x: "70%", y: "10%" },
        { id: 4, label: "SECTOR B1", x: "10%", y: "55%" },
        { id: 5, label: "SECTOR B2", x: "40%", y: "55%" },
        { id: 6, label: "SECTOR B3", x: "70%", y: "55%" },
    ];

    return (
        <div className="w-full h-full min-h-[350px] md:min-h-[500px] bg-[#0b0c10] relative overflow-hidden p-8 border border-[#1f2833]">
            {/* Grid Lines */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#1f2833 1px, transparent 1px), linear-gradient(90deg, #1f2833 1px, transparent 1px)', 
                     backgroundSize: '40px 40px' 
                 }} 
            />

            {/* Map Container */}
            <div className="relative z-10 w-full h-full max-w-4xl mx-auto border-2 border-[#1f2833] rounded-sm bg-[#0b0c10]/90">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0b0c10] px-4 py-1 text-sm font-military tracking-widest text-[#66fcf1] border border-[#1f2833] shadow-[0_0_10px_rgba(102,252,241,0.2)]">
                    TACTICAL OVERVIEW
                </div>

                {tables.map((table) => {
                    const count = occupied[table.id] || 0;
                    const capacity = currentMode === '40k' ? 2 : 4;
                    const isFull = count >= capacity;
                    const isSelected = selectedSector === table.id;

                    return (
                        <motion.div
                            key={table.id}
                            className={clsx(
                                "absolute w-[25%] h-[35%] border-2 transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center p-2 group",
                                isSelected ? "border-[#66fcf1] bg-[#66fcf1]/20" : 
                                isFull ? "border-red-500/50 bg-red-900/30" : 
                                count > 0 ? "border-yellow-500/50 bg-yellow-900/20" : // Partial State
                                "border-[#c5c6c7]/30 bg-[#1f2833]/40 hover:border-[#66fcf1] hover:bg-[#1f2833]/80"
                            )}
                            style={{ left: table.x, top: table.y }}
                            onClick={() => onSelectSector(table.id)}
                        >
                            {/* Table Graphic */}
                            <div className={clsx(
                                "w-full h-full border border-dashed flex flex-col items-center justify-center relative transition-all duration-300",
                                isFull ? "border-red-500/50" : count > 0 ? "border-yellow-500/50" : "border-[#66fcf1]/40"
                            )}>
                                {/* Visual Pips for Capacity */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {[...Array(capacity)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className={clsx(
                                                "w-1.5 h-1.5 rounded-full border",
                                                i < count 
                                                    ? (isFull ? "bg-red-500 border-red-500" : "bg-yellow-500 border-yellow-500")
                                                    : "border-[#c5c6c7]/30 bg-transparent"
                                            )}
                                        />
                                    ))}
                                </div>

                                {currentMode === 'killteam' && (
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-current opacity-40" />
                                )}
                                
                                {/* Corner markers */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-80" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-80" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-80" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-80" />
                                
                                <div className="m-auto text-xs font-military tracking-widest text-center">
                                    <span className={clsx(
                                        "block text-lg mb-1 font-bold",
                                        isFull ? "text-red-500" : count > 0 ? "text-yellow-500" : isSelected ? "text-[#66fcf1]" : "text-white"
                                    )}>{table.id}</span>
                                    <span className="text-[10px] opacity-80 text-[#c5c6c7]">{table.label}</span>
                                </div>
                            </div>
                            
                            {/* Status Indicator */}
                            <div className={clsx(
                                "absolute -bottom-6 text-[10px] font-mono font-bold w-full text-center tracking-tighter",
                                isFull ? "text-red-500" : count > 0 ? "text-yellow-500" : "text-green-500"
                            )}>
                                {isFull ? "[FULL]" : `[${count}/${capacity}]`}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
});
