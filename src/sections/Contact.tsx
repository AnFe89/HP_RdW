import { useState } from "react";
import { motion } from "framer-motion";


export const Contact = () => {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });


  // ---------------------------------------------------------------------------
  // WICHTIG: Erstelle ein Formular auf https://formspree.io/
  // und ersetze "DEIN_FORMSPREE_ID" durch deine eigene ID.
  // ---------------------------------------------------------------------------
  const FORMSPREE_ID = "mpqazajb"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        console.log("Nachricht gesendet!");
      } else {
         const errorData = await response.json();
         console.error("Formspree Fehler:", errorData);
         throw new Error("Fehler beim Senden");
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      setStatus("error");
      alert(
        err instanceof Error && err.message.includes("Formspree-ID")
         ? err.message
         : "Es gab einen Fehler beim Senden des Raben. Bitte versuche es später erneut."
      );
    }
  };

  return (
    <section className="relative w-full py-20 bg-[#1a120b] border-t-8 border-wood overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
         <img src="/bg/contact-bg.png" alt="Contact Background" className="w-full h-full object-cover opacity-40" />
         <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      </div>

      {/* Background Texture Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medieval text-parchment mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] inline-block border-b-2 border-gold/30 pb-4"
          >
            KONTAKT
          </motion.h2>
          <p className="font-sans text-parchment/80 text-lg max-w-2xl mx-auto drop-shadow-md">
            Habt ihr Fragen zur Mitgliedschaft, zum Spielbetrieb oder wollt ihr
            einfach nur 'Hallo' sagen? Sendet uns einen Raben!
          </p>
        </div>

        <div className="bg-[#f5e6d3] p-8 md:p-12 rounded-lg shadow-[0_0_20px_rgba(44,24,16,0.1)] border-2 border-[#2c1810]/10 max-w-2xl mx-auto relative">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#2c1810]/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#2c1810]/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#2c1810]/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#2c1810]/20 rounded-br-lg" />

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">🦅</div>
              <h3 className="font-medieval text-2xl text-[#2c1810] mb-2">
                DER RABE IST UNTERWEGS
              </h3>
              <p className="font-sans text-[#2c1810]/70">
                Wir haben eure Nachricht erhalten und werden uns bald melden.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm text-[#8b4513] font-bold underline hover:text-[#2c1810] transition-colors"
              >
                Eine weitere Nachricht senden
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-medieval text-[#2c1810] mb-2 tracking-wide"
                >
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-[#fffcf5] border-2 border-[#2c1810]/20 focus:border-[#c5a059] p-3 font-sans text-[#2c1810] placeholder-[#2c1810]/30 outline-none transition-all rounded shadow-inner"
                  placeholder="Wie sollen wir euch nennen?"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-medieval text-[#2c1810] mb-2 tracking-wide"
                >
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full bg-[#fffcf5] border-2 border-[#2c1810]/20 focus:border-[#c5a059] p-3 font-sans text-[#2c1810] placeholder-[#2c1810]/30 outline-none transition-all rounded shadow-inner"
                  placeholder="Für die Antwort des Raben..."
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-medieval text-[#2c1810] mb-2 tracking-wide"
                >
                  NACHRICHT
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  className="w-full bg-[#fffcf5] border-2 border-[#2c1810]/20 focus:border-[#c5a059] p-3 font-sans text-[#2c1810] placeholder-[#2c1810]/30 outline-none transition-all rounded shadow-inner resize-none"
                  placeholder="Was liegt euch auf dem Herzen?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-[#2c1810] text-[#f8f4e3] font-medieval text-xl tracking-widest hover:bg-[#4a3022] transition-colors shadow-lg border-2 border-[#c5a059]/50 disabled:opacity-70 disabled:cursor-wait group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "sending" ? (
                    "WIRD GESENDET..."
                  ) : (
                    <>
                      <span>RABEN SENDEN</span> <span>✉</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
