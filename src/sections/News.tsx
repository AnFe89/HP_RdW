import { DataSlate } from '../components/ui/DataSlate';
import { GlitchText } from '../components/ui/GlitchText';

const NEWS_ITEMS = [
  {
    title: "PLASTIC MOSHPIT 2027 REGISTRATION",
    date: "40.999.M42",
    category: "TOURNAMENT",
    summary: "Registration for the annual Plastic MoshPit tournament is now open. Prepare your lists. 2000pts. Matched Play. Nephilim ruleset in effect."
  },
  {
    title: "SECTOR 4 MAINTENANCE COMPLETE",
    date: "40.992.M42",
    category: "LOGISTICS",
    summary: "Terrain density in Sector 4 has been increased by 15%. Line of sight blockers added to quadrant Delta. Engage with caution."
  },
  {
    title: "NEW KILL TEAM SEASON",
    date: "40.985.M42",
    category: "EVENT",
    summary: "Into the Dark season begins next week. Close quarters combat rules apply. Check the discord for matchmaking."
  },
  {
    title: "CHAPTER COMMAND PROTOCOLS",
    date: "40.980.M42",
    category: "ANNOUNCEMENT",
    summary: "Board meeting minutes have been uploaded to the Member Area. Review changes to club access hours."
  }
];

export const News = () => {
  return (
    <section className="relative w-full py-12 md:py-24 px-4 bg-void">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Sticky Header */}
        <div className="md:w-1/3">
           <div className="sticky top-24">
              <h2 className="text-3xl md:text-5xl font-military text-white mb-8 leading-none">
                 <GlitchText text="INCOMING" /> <br />
                 <span className="text-neon/80">TRANSMISSION</span>
              </h2>
               <p className="text-silver/90 font-tactical text-base max-w-xs border-l border-neon/50 pl-4 py-2 mt-4 tracking-wide shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-black/20">
                  DECODING ASTRO-TELEPATHIC DATA STREAM... <br/>
                  <span className="text-neon drop-shadow-[0_0_5px_rgba(102,252,241,0.8)]">PRIORITY LEVEL: VERMILLION</span>
               </p>
           </div>
        </div>

        {/* Feed */}
        <div className="md:w-2/3 flex flex-col gap-8">
            {NEWS_ITEMS.map((item, i) => (
                <DataSlate key={i} index={i} {...item} />
            ))}
            
            {/* Infinite Scroll Loader Mock */}
            <div className="flex items-center gap-2 text-silver/30 text-xs font-mono justify-center py-10">
                <span className="animate-spin">/</span> CHARGING DATA BUFFERS...
            </div>
        </div>
      </div>
    </section>
  );
};
