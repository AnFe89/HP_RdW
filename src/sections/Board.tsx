import { GlitchText } from '../components/ui/GlitchText';

const BOARD_MEMBERS = [
  {
    name: "CHAPTER MASTER JAN",
    role: "VORSITZENDER",
    description: "Führt den Orden mit eiserner Hand und strategischem Weitblick. Seine Erfahrung in Logistik und Führung sichert das Überleben des Clubs in den finsteren Zeiten des 3. Jahrtausends.",
    image: "/board-member-1.png",
    id: "ALPHA-01"
  },
  {
    name: "TECH-ADEPT SASCHA",
    role: "SCHATZMEISTER",
    description: "Hüter der Ressourcen und Meister der Buchhaltung. Seine binären Gebete stellen sicher, dass die Kassen gefüllt und die Ausgaben effizient alloziert sind.",
    image: "/board-member-2.png",
    id: "BETA-02"
  },
  {
    name: "COMMISSAR RAPHAEL",
    role: "SCHRIFTFÜHRER",
    description: "Dokumentiert jeden Sieg und jede Niederlage. Seine Protokolle sind legendär und dienen als moralisches Fundament für alle Mitglieder. Abweichungen werden nicht geduldet.",
    image: "/board-member-3.png",
    id: "GAMMA-03"
  }
];

export const Board = () => {
  return (
    <section className="relative w-full py-20 px-4 bg-void/95 border-t border-silver/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-military text-white mb-20 text-center">
            <GlitchText text="DER VORSTAND" />
        </h2>

        <div className="flex flex-col gap-24">
          {BOARD_MEMBERS.map((member, index) => (
            <div 
              key={index}
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Container */}
              <div className="w-full md:w-1/3 relative group">
                <div className="absolute inset-0 bg-neon/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] overflow-hidden border-2 border-silver/20 bg-black">
                   <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                   />
                   <div className="absolute inset-0 ring-1 ring-inset ring-neon/20 pointer-events-none" />
                   
                   {/* Tactical Corners */}
                   <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-neon" />
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-neon" />
                </div>
              </div>

              {/* Text Container */}
              <div className="w-full md:w-2/3 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 bg-neon rounded-full animate-pulse" />
                    <span className="text-neon/80 font-mono text-sm tracking-widest">{member.role}</span>
                </div>
                
                <h3 className="text-3xl font-military text-silver">
                    {member.name}
                </h3>
                
                <p className="text-silver/70 font-tactical text-lg leading-relaxed max-w-2xl border-l-2 border-neon/30 pl-6 py-2 bg-gradient-to-r from-neon/5 to-transparent">
                    {member.description}
                </p>
                
                <div className="flex gap-2 text-xs text-silver/30 font-mono pt-4">
                    <span>ID: {member.id}</span>
                    <span>//</span>
                    <span>AUTHORIZATION: ALPHA</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
