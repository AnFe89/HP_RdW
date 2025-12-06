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
    
    // Galaxy layout for 6 sectors (systems)
    const systems = [
        { id: 1, label: "NEPHILIM", x: "22%", y: "22%", size: "md", color: "#66fcf1" },     // Moved from 15/20 to avoid top-left overlap
        { id: 2, label: "NACHMUND", x: "50%", y: "15%", size: "lg", color: "#45a29e" },     // Top Center
        { id: 3, label: "CHALNATH", x: "85%", y: "25%", size: "md", color: "#c5c6c7" },     // Top Right
        { id: 4, label: "ULTRAMAR", x: "20%", y: "70%", size: "lg", color: "#1f2833" },     // Bottom Left
        { id: 5, label: "OCTARIUS", x: "50%", y: "80%", size: "sm", color: "#8b0000" },     // Bottom Center (Danger)
        { id: 6, label: "CALIXIS", x: "80%", y: "65%", size: "md", color: "#cb2d3e" },      // Bottom Right
    ];

    // Warp Lanes (Connections)
    const warpLanes = [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 6 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
    ];

    return (
        <div className="w-full h-full min-h-[400px] md:min-h-[500px] bg-[#0b0c10] relative overflow-hidden border border-[#1f2833] rounded-xl shadow-inner">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img src="/galaxy-bg.png" alt="Galaxy" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/80" />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(#66fcf1 1px, transparent 1px), linear-gradient(90deg, #66fcf1 1px, transparent 1px)', 
                     backgroundSize: '80px 80px' 
                 }} 
            />

            {/* Map Container */}
            <div className="relative z-10 w-full h-full">
                
                {/* SVG Layer for Warp Lanes */}
                {/* SVG Layer for Warp Lanes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {warpLanes.map((lane, i) => {
                        const start = systems.find(s => s.id === lane.from);
                        const end = systems.find(s => s.id === lane.to);
                        if (!start || !end) return null;
                        return (
                            <motion.line
                                key={i}
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke="#66fcf1"
                                strokeWidth="1"
                                strokeOpacity="0.2"
                                strokeDasharray="5 5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: i * 0.1 }}
                            />
                        );
                    })}
                </svg>

                {systems.map((system) => {
                    const count = occupied[system.id] || 0;
                    const capacity = currentMode === '40k' ? 2 : 4;
                    const isFull = count >= capacity;
                    const isSelected = selectedSector === system.id;
                    
                    // Size classes
                    const sizeClass = system.size === 'lg' ? 'w-16 h-16 md:w-24 md:h-24' : system.size === 'md' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-10 h-10 md:w-12 md:h-12';

                    return (
                        <div
                            key={system.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ left: system.x, top: system.y }}
                            onClick={() => onSelectSector(system.id)}
                        >
                            {/* Hover Hololith Effect - simplified */}
                            <motion.div 
                                className="absolute inset-0 -m-4 border border-[#66fcf1]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity will-change-transform"
                                initial={false}
                                animate={{ scale: isSelected ? 1.1 : 1 }}
                            />
                            
                            {/* Planet Visual - reduced shadow radius */}
                            <motion.div
                                className={clsx(
                                    sizeClass, "rounded-full relative flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.8)] border-2 transition-all duration-300",
                                    isSelected ? "border-[#66fcf1] shadow-[0_0_15px_#66fcf1]" : 
                                    isFull ? "border-red-500 shadow-[0_0_10px_red]" :
                                    count > 0 ? "border-yellow-500 shadow-[0_0_10px_yellow]" :
                                    "border-white/20 group-hover:border-[#66fcf1]/80"
                                )}
                                style={{ 
                                    background: `radial-gradient(circle at 30% 30%, ${system.color}, #000)`,
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Orbital Ring - simplified */}
                                <div className="absolute inset-[-4px] rounded-full border border-white/10 opacity-50 pointer-events-none" />

                                {/* Capacity Pips */}
                                <div className="absolute -bottom-6 flex gap-1 transform translate-y-1">
                                    {[...Array(capacity)].map((_, i) => (
                                        <div 
                                            key={i}
                                            className={clsx(
                                                "w-1.5 h-1.5 rounded-full",
                                                i < count 
                                                    ? (isFull ? "bg-red-500" : "bg-yellow-500")
                                                    : "bg-[#1f2833]"
                                            )}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Label - removed blur, simplified shadow */}
                            <div className={clsx(
                                "absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap font-military tracking-widest text-xs transition-colors px-2 py-0.5 rounded bg-black/60", 
                                isSelected ? "text-[#66fcf1]" : "text-[#c5c6c7] opacity-80 group-hover:opacity-100"
                            )}>
                                {system.label}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* HUD Overlay */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[9px] md:text-[10px] font-mono text-[#66fcf1]/80 border-l border-t border-[#66fcf1]/40 p-2 bg-black/80 backdrop-blur-md z-20">
                <div>GALACTIC COORDS: 40.999 // 12.451</div>
                <div>SECTOR THREAT LEVEL: VERMILLION</div>
            </div>
        </div>
    );
});
