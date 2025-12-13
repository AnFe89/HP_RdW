import { motion } from 'framer-motion';

export const About = () => {
    return (
        <section className="relative w-full py-20 bg-parchment overflow-hidden border-y-8 border-wood">
             {/* Background Texture Overlay */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />
             
             <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-5xl font-medieval text-[#2c1810] mb-8 drop-shadow-md border-b-2 border-[#8b4513]/20 pb-4 inline-block">
                        WIR ÜBER UNS
                    </h2>

                    <div className="space-y-6 text-lg md:text-xl font-sans text-[#2c1810]/80 leading-relaxed max-w-3xl">
                        <p>
                            Sei gegrüßt, Wanderer! Wir sind die <span className="font-bold text-[#8b4513]">Ritter der Würfelrunde</span>, ein Verein für leidenschaftliche Tabletop-Strategen.
                        </p>
                        
                        <p>
                            Unsere Tore öffnen sich jeden <span className="font-bold text-[#8b4513]">Donnerstag um 18:00 Uhr</span> im 
                            <br/>
                            <span className="font-medieval text-2xl text-[#8b4513] block mt-2 mb-1">PHANTASOS STUDIO</span>
                            <span className="italic text-base">Schoßbergstraße 11, 65201 Wiesbaden</span>
                        </p>

                        <p>
                            Ob du nun Veteran der <span className="font-bold">Warhammer 40.000</span> Schlachtfelder bist, 
                            deine Spezialisten in <span className="font-bold">Kill Team</span> kommandierst oder ganz neue Welten entdecken willst – 
                            wir sind offen für alle Spielsysteme und empfangen jeden neuen Mitstreiter mit offenen Armen.
                        </p>

                        <p className="font-italic text-[#8b4513]">
                            Komm einfach vorbei, lern die Gemeinschaft kennen und wirf ein paar Würfel mit uns!
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
                        <a 
                            href="https://discord.gg/UKXHTTBnxX" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-6 py-3 bg-[#5865F2]/10 hover:bg-[#5865F2] border-2 border-[#5865F2] rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                        >
                            <img src="/discord-logo-3d.jpg" alt="Discord" className="w-12 h-12 object-contain group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all rounded-full" />
                            <span className="font-medieval text-[#5865F2] group-hover:text-white font-bold tracking-wider">Discord Server</span>
                        </a>

                        <a 
                            href="https://www.instagram.com/rdw_ev?igsh=MXdueHI0eHl3eXlsbQ==" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-6 py-3 bg-[#E4405F]/10 hover:bg-[#E4405F] border-2 border-[#E4405F] rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                        >
                            <img src="/instagram-logo.jpg" alt="Instagram" className="w-12 h-12 object-contain group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all rounded-xl" />
                            <span className="font-medieval text-[#E4405F] group-hover:text-white font-bold tracking-wider">@rdw_ev</span>
                        </a>
                    </div>
                    <div className="w-24 h-1 bg-[#8b4513]/20 mx-auto mt-10 rounded-full" />
                </motion.div>

             </div>
        </section>
    );
};
