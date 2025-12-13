import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImpressumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImpressumModal = ({ isOpen, onClose }: ImpressumModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#f5e6d3] rounded-sm border-4 border-[#2c1810] shadow-2xl"
                    >
                        {/* Texture Overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')" }} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-[#2c1810] hover:text-[#8b4513] transition-colors z-20"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative z-10 p-8 md:p-12 text-[#2c1810] font-sans">
                            <h1 className="text-3xl font-medieval mb-6 border-b-2 border-[#2c1810]/20 pb-4">Impressum</h1>

                            <div className="space-y-6 text-sm md:text-base leading-relaxed">
                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Allgemeine Angaben</h3>
                                    <p>
                                        <b>Internet:</b> <a href="https://www.rdw-ev.de" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b4513] underline decoration-dotted">https://www.rdw-ev.de</a>
                                    </p>
                                    <p className="mt-2">
                                        <b>Name des Diensteanbieters:</b><br />
                                        Ritter der Würfelrunde e.V.
                                    </p>
                                    <p className="mt-2">
                                        <b>Vertreten durch:</b><br />
                                        Jan Rathlev, Sascha Gramotke, Raphael Köck
                                    </p>
                                </section>
                                
                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Anschrift und Kontakt</h3>
                                    <p>
                                        Mainzer Allee 35a<br />
                                        65232 Taunusstein
                                    </p>
                                    <p className="mt-2">
                                        <b>Telefon:</b> <a href="tel:01703278981" className="hover:text-[#8b4513]">01703278981</a><br />
                                        <b>E-Mail:</b> <a href="mailto:info@rdw-ev.de" className="hover:text-[#8b4513]">info@rdw-ev.de</a>
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Registereintrag</h3>
                                    <p>
                                        <b>Vereinsregister:</b> Amtsgericht Wiesbaden<br />
                                        <b>Registernummer:</b> VR 7548
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">EU-Streitbeilegungsplattform</h3>
                                    <p>Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht verpflichtet und nicht bereit.</p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Redaktionelle Verantwortung</h3>
                                    <p>
                                        <b>Verantwortlich für journalistisch-redaktionelle Inhalte (gem. § 18 Abs. 2 MStV):</b><br />
                                        Jan Rathlev<br />
                                        Mainzer Allee 35a<br />
                                        65232 Taunusstein
                                    </p>
                                </section>

                                <hr className="border-[#2c1810]/20 my-6" />

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Haftung für Links</h3>
                                    <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Haftung für Inhalte</h3>
                                    <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Wir sind als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
                                </section>

                                <section>
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Urheberrecht</h3>
                                    <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
                                </section>

                                <p className="text-xs text-gray-500 mt-8">
                                    Quelle: <a href="https://impressum-generator.info/" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b4513]">impressum-generator.info</a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
