import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DatenschutzModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DatenschutzModal = ({ isOpen, onClose }: DatenschutzModalProps) => {
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
                            <h1 className="text-3xl font-medieval mb-6 border-b-2 border-[#2c1810]/20 pb-4">Datenschutzerklärung</h1>

                            <div className="space-y-6 text-sm md:text-base leading-relaxed datenschutz-content">
                                
                                <section>
                                    <h2 className="text-2xl font-medieval text-[#8b4513] mb-4 mt-8">1. Datenschutz auf einen Blick</h2>
                                    
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Allgemeine Hinweise</h3>
                                    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
                                    
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Datenerfassung auf dieser Website</h3>
                                    
                                    <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br/>
                                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.</p>

                                    <p className="mt-2"><strong>Wie erfassen wir Ihre Daten?</strong><br/>
                                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>

                                    <p className="mt-2">Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>

                                    <p className="mt-2"><strong>Wofür nutzen wir Ihre Daten?</strong><br/>
                                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über die Website Verträge geschlossen oder angebahnt werden können, werden die übermittelten Daten auch für Vertragsangebote, Bestellungen oder sonstige Auftragsanfragen verarbeitet.</p>

                                    <p className="mt-2"><strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br/>
                                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.</p>
                                    
                                    <p className="mt-2">Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.</p>
                                </section>

                                <hr className="border-[#2c1810]/20 my-6" />

                                <section>
                                    <h2 className="text-2xl font-medieval text-[#8b4513] mb-4">2. Hosting</h2>
                                    <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Externes Hosting (Vercel)</h3>
                                    <p>Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.</p>
                                    <p className="mt-2">Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).</p>
                                    <p className="mt-2">Unser Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies zur Erfüllung seiner Leistungspflichten erforderlich ist und unsere Weisungen in Bezug auf diese Daten befolgen.</p>
                                    
                                    <p className="mt-4">Wir setzen folgenden Hoster ein:<br/>
                                    <strong>Vercel Inc.</strong><br/>
                                    440 N Barranca Ave #4133<br/>
                                    Covina, CA 91723<br/>
                                    USA</p>

                                    <h4 className="font-bold mt-4">Auftragsverarbeitung</h4>
                                    <p>Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-6">Datenbank und Authentifizierung (Supabase)</h3>
                                    <p>Wir nutzen für die Speicherung Ihrer Daten und für die Verwaltung der Logins den Dienst Supabase. Anbieter ist die Supabase Inc., 970 Toa Payoh North #07-04, Singapur 318992 (bzw. US-Niederlassungen).</p>
                                    
                                    <h4 className="font-bold mt-4">Verarbeitung in der EU</h4>
                                    <p>Wir haben Supabase so konfiguriert, dass Ihre Daten (E-Mail, Nickname, Reservierungen) ausschließlich auf Servern innerhalb der Europäischen Union (Region: Irland/EU-West) gespeichert werden.</p>
                                    
                                    <h4 className="font-bold mt-4">Rechtsgrundlage und Sicherheit</h4>
                                    <p>Die Nutzung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (technisch fehlerfreier und sicherer Betrieb unserer Dienste) sowie Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung zur Bereitstellung Ihres Nutzerkontos). Wir haben mit dem Anbieter einen Vertrag über Auftragsverarbeitung (AVV) geschlossen, der die Sicherheit Ihrer Daten gewährleistet.</p>
                                </section>

                                <hr className="border-[#2c1810]/20 my-6" />

                                <section>
                                    <h2 className="text-2xl font-medieval text-[#8b4513] mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
                                    
                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Datenschutz</h3>
                                    <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
                                    <p className="mt-2">Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.</p>
                                    <p className="mt-2">Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Hinweis zur verantwortlichen Stelle</h3>
                                    <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                                    <p className="mt-2">
                                        Ritter der Würfelrunde e. V.<br/>
                                        Mainzer Allee 35a<br/>
                                        65232 Taunusstein
                                    </p>
                                    <p className="mt-2">
                                        Telefon: 01703278981<br/>
                                        E-Mail: info@rdw-ev.de
                                    </p>
                                    <p className="mt-2">Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Speicherdauer</h3>
                                    <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                                    <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Widerspruchsrecht gegen die Datenerhebung in besonderen Fällen sowie gegen Direktwerbung (Art. 21 DSGVO)</h3>
                                    <p className="uppercase text-xs font-bold bg-[#2c1810]/5 p-2 rounded">WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN; DIES GILT AUCH FÜR EIN AUF DIESE BESTIMMUNGEN GESTÜTZTES PROFILING. DIE JEWEILIGE RECHTSGRUNDLAGE, AUF DENEN EINE VERARBEITUNG BERUHT, ENTNEHMEN SIE DIESER DATENSCHUTZERKLÄRUNG. WENN SIE WIDERSPRUCH EINLEGEN, WERDEN WIR IHRE BETROFFENEN PERSONENBEZOGENEN DATEN NICHT MEHR VERARBEITEN, ES SEI DENN, WIR KÖNNEN ZWINGENDE SCHUTZWÜRDIGE GRÜNDE FÜR DIE VERARBEITUNG NACHWEISEN, DIE IHRE INTERESSEN, RECHTE UND FREIHEITEN ÜBERWIEGEN ODER DIE VERARBEITUNG DIENT DER GELTENDMACHUNG, AUSÜBUNG ODER VERTEIDIGUNG VON RECHTSANSPRÜCHEN (WIDERSPRUCH NACH ART. 21 ABS. 1 DSGVO).</p>
                                    <p className="uppercase text-xs font-bold bg-[#2c1810]/5 p-2 rounded mt-2">WERDEN IHRE PERSONENBEZOGENEN DATEN VERARBEITET, UM DIREKTWERBUNG ZU BETREIBEN, SO HABEN SIE DAS RECHT, JEDERZEIT WIDERSPRUCH GEGEN DIE VERARBEITUNG SIE BETREFFENDER PERSONENBEZOGENER DATEN ZUM ZWECKE DERARTIGER WERBUNG EINZULEGEN; DIES GILT AUCH FÜR DAS PROFILING, SOWEIT ES MIT SOLCHER DIREKTWERBUNG IN VERBINDUNG STEHT. WENN SIE WIDERSPRECHEN, WERDEN IHRE PERSONENBEZOGENEN DATEN ANSCHLIESSEND NICHT MEHR ZUM ZWECKE DER DIREKTWERBUNG VERWENDET (WIDERSPRUCH NACH ART. 21 ABS. 2 DSGVO).</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
                                    <p>Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Recht auf Datenübertragbarkeit</h3>
                                    <p>Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Auskunft, Berichtigung und Löschung</h3>
                                    <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Recht auf Einschränkung der Verarbeitung</h3>
                                    <p>Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Hierzu können Sie sich jederzeit an uns wenden.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">SSL- bzw. TLS-Verschlüsselung</h3>
                                    <p>Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.</p>
                                </section>

                                <hr className="border-[#2c1810]/20 my-6" />

                                <section>
                                    <h2 className="text-2xl font-medieval text-[#8b4513] mb-4">4. Datenerfassung auf dieser Website</h2>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Cookies</h3>
                                    <p>Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.</p>
                                    <p className="mt-2">Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z. B. für die Warenkorbfunktion) oder zur Optimierung der Website (z. B. Cookies zur Messung des Webpublikums) erforderlich sind (notwendige Cookies), werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert, sofern keine andere Rechtsgrundlage angegeben wird. Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von notwendigen Cookies zur technisch fehlerfreien und optimierten Bereitstellung seiner Dienste.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Server-Log-Dateien</h3>
                                    <p>Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Browsertyp und Browserversion</li>
                                        <li>verwendetes Betriebssystem</li>
                                        <li>Referrer URL</li>
                                        <li>Hostname des zugreifenden Rechners</li>
                                        <li>Uhrzeit der Serveranfrage</li>
                                        <li>IP-Adresse</li>
                                    </ul>
                                    <p className="mt-2">Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Anfrage per E-Mail, Telefon oder Telefax</h3>
                                    <p>Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Registrierung auf dieser Website</h3>
                                    <p>Sie können sich auf unserer Website registrieren, um zusätzliche Funktionen zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben. Die bei der Registrierung abgefragten Pflichtangaben müssen vollständig angegeben werden. Anderenfalls werden wir die Registrierung ablehnen.</p>
                                    <p className="mt-2">Für wichtige Änderungen etwa beim Angebotsumfang oder bei technisch notwendigen Änderungen nutzen wir die bei der Registrierung angegebene E-Mail-Adresse, um Sie auf diesem Wege zu informieren.</p>
                                    <p className="mt-2">Die Verarbeitung der bei der Registrierung eingegebenen Daten erfolgt zum Zwecke der Durchführung des durch die Registrierung begründeten Nutzungsverhältnisses und ggf. zur Anbahnung weiterer Verträge (Art. 6 Abs. 1 lit. b DSGVO).</p>
                                    <p className="mt-2">Die bei der Registrierung erfassten Daten werden von uns gespeichert, solange Sie auf unserer Website registriert sind und werden anschließend gelöscht. Gesetzliche Aufbewahrungsfristen bleiben unberührt.</p>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513] mt-4">Verarbeitung von Daten (Kunden- und Vertragsdaten)</h3>
                                    <p>Wir erheben, verarbeiten und nutzen personenbezogene Daten nur, soweit sie für die Begründung, inhaltliche Ausgestaltung oder Änderung des Rechtsverhältnisses erforderlich sind (Bestandsdaten). Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet. Personenbezogene Daten über die Inanspruchnahme unserer Internetseiten (Nutzungsdaten) erheben, verarbeiten und nutzen wir nur, soweit dies erforderlich ist, um dem Nutzer die Inanspruchnahme des Dienstes zu ermöglichen oder abzurechnen.</p>
                                </section>

                                <hr className="border-[#2c1810]/20 my-6" />

                                <section>
                                    <h2 className="text-2xl font-medieval text-[#8b4513] mb-4">5. Plugins und Tools</h2>

                                    <h3 className="font-bold text-lg mb-2 text-[#8b4513]">Google Fonts</h3>
                                    <p>Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Fonts in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen.</p>
                                    <p className="mt-2">Zu diesem Zweck muss der von Ihnen verwendete Browser Verbindung zu den Servern von Google aufnehmen. Hierdurch erlangt Google Kenntnis darüber, dass über Ihre IP-Adresse diese Website aufgerufen wurde. Die Nutzung von Google Fonts erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der einheitlichen Darstellung des Schriftbildes auf seiner Website. Sofern eine entsprechende Einwilligung abgefragt wurde, erfolgt die Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.</p>
                                    <p className="mt-2">Weitere Informationen zu Google Fonts finden Sie unter <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b4513] underline">https://developers.google.com/fonts/faq</a> und in der Datenschutzerklärung von Google: <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b4513] underline">https://policies.google.com/privacy?hl=de</a>.</p>
                                </section>

                                <div className="text-xs text-gray-500 mt-8 border-t border-[#2c1810]/10 pt-4">
                                    <p>Quelle Basis-Text: <a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="hover:text-[#8b4513]">eRecht24</a></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
