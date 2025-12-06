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

    // ... (warpLanes unchanged) ...

                            {/* Label */}
                            <div className={clsx(
                                "absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap font-military tracking-widest text-xs transition-colors px-2 py-0.5 rounded bg-black/40 backdrop-blur-[1px]", 
                                isSelected ? "text-[#66fcf1] drop-shadow-[0_0_5px_#66fcf1]" : "text-[#c5c6c7] opacity-80 group-hover:opacity-100"
                            )}>
                                {system.label}
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* HUD Overlay */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-[9px] md:text-[10px] font-mono text-[#66fcf1]/80 border-l border-t border-[#66fcf1]/40 p-2 bg-black/20 backdrop-blur-sm">
                <div>GALACTIC COORDS: 40.999 // 12.451</div>
                <div>SECTOR THREAT LEVEL: VERMILLION</div>
            </div>
        </div>
    );
});

