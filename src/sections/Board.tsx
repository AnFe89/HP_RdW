

const BOARD_MEMBERS = [
  {
    name: "GROSSMEISTER JAN",
    role: "VORSITZENDER",
    description: "Führt den Orden mit eiserner Hand und strategischem Weitblick. Seine Erfahrung in Logistik und Führung sichert das Überleben des Clubs in turbulenten Zeiten.",
    image: "/medieval-board-jan.png",
  },
  {
    name: "MEISTER SASCHA",
    role: "SCHATZMEISTER",
    description: "Hüter der Ressourcen und Meister der Münze. Seine wachsamen Augen stellen sicher, dass die Schatzkammer gefüllt und die Ausgaben weise getätigt sind.",
    image: "/medieval-board-sascha.png",
  },
  {
    name: "KANZLER RAPHAEL",
    role: "SCHRIFTFÜHRER",
    description: "Dokumentiert jeden Sieg und unterzeichnet jedes Dekret. Seine Protokolle sind Gesetz und dienen als Fundament für die Ordnung im Reich.",
    image: "/medieval-board-raphael.png",
  }
];

export const Board = () => {
  return (
    <section className="relative w-full py-20 px-4 bg-[#1a120b] border-t-4 border-[#2c1810]">
       {/* Background Patterns */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-scales.png')" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-medieval text-parchment mb-20 text-center drop-shadow-lg">
            DER HOHE RAT
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
                <div className="absolute inset-0 bg-gold/20 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] overflow-hidden border-8 border-[#2c1810] rounded-sm shadow-2xl">
                   <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover sepia-[.3] group-hover:sepia-0 transition-all duration-500"
                   />
                   
                   {/* Frame Corners */}
                   <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gold" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gold" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gold" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gold" />
                </div>
              </div>

              {/* Text Container */}
              <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                    <span className="w-2 h-2 bg-gold rotate-45" />
                    <span className="text-gold/80 font-medieval text-sm tracking-widest uppercase">{member.role}</span>
                    <span className="w-2 h-2 bg-gold rotate-45" />
                </div>
                
                <h3 className="text-3xl font-medieval text-parchment border-b border-gold/30 pb-2 inline-block">
                    {member.name}
                </h3>
                
                <p className="text-parchment/70 font-sans text-lg leading-relaxed max-w-2xl italic">
                    "{member.description}"
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
